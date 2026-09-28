import { decode as decodeBase64 } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system/legacy';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Database } from '@/lib/database.types';
import { supabase } from '@/lib/supabase';
import { Assignment } from '@/lib/types';
import { useAuth } from './AuthContext';

type AssignmentRow = Database['public']['Tables']['assignments']['Row'];
type SubmissionRow = Database['public']['Tables']['submissions']['Row'];

type SubmitPayload = {
  files: { id: string; name: string; sizeLabel: string; uri: string }[];
  note: string;
};

type AssignmentsContextValue = {
  assignments: Assignment[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getById: (id: string) => Assignment | undefined;
  submitAssignment: (id: string, payload: SubmitPayload) => Promise<{ error: string | null }>;
};

const AssignmentsContext = createContext<AssignmentsContextValue | null>(null);

function timeLeftLabel(dueAt: string, status: Assignment['status']): string {
  if (status !== 'todo') return '';
  const diffMs = new Date(dueAt).getTime() - Date.now();
  if (diffMs <= 0) return 'Đã hết hạn';
  const hours = Math.floor(diffMs / 3600000);
  if (hours < 24) return `Còn ${Math.max(1, hours)} giờ`;
  return `Còn ${Math.ceil(hours / 24)} ngày`;
}

function dueLabel(dueAt: string, status: Assignment['status'], gradedAt?: string | null): string {
  const d = new Date(dueAt);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  if (status === 'graded' && gradedAt) {
    const g = new Date(gradedAt);
    return `Đã chấm ${String(g.getDate()).padStart(2, '0')}/${String(g.getMonth() + 1).padStart(2, '0')}`;
  }
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  if (isToday) {
    return `Hạn ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')} hôm nay`;
  }
  return `Hạn ${dd}/${mm}`;
}

function groupOf(dueAt: string): Assignment['group'] {
  const now = new Date();
  const due = new Date(dueAt);
  const diffDays = Math.floor((due.getTime() - now.getTime()) / 86400000);
  if (due.toDateString() === now.toDateString()) return 'today';
  if (diffDays <= 6) return 'week';
  return 'upcoming';
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function mapToAssignment(a: AssignmentRow, sub: SubmissionRow | undefined): Assignment {
  const status: Assignment['status'] = sub?.status ?? 'todo';
  return {
    id: a.id,
    subject: a.subject,
    title: a.title,
    teacher: a.teacher_name,
    questionsCount: a.questions_count,
    dueLabel: dueLabel(a.due_at, status, sub?.graded_at),
    dueAt: a.due_at,
    assignedAt: formatShortDate(a.assigned_at),
    status,
    scoreCoefficient: a.score_coefficient,
    submitMethod: a.submit_method,
    requirement: a.requirement,
    requirementNotes: a.requirement_notes,
    attachment: {
      name: a.attachment_name ?? 'de-bai.pdf',
      size: a.attachment_size ?? '—',
      pages: a.attachment_pages ?? 1,
    },
    group: groupOf(a.due_at),
    timeLeftLabel: timeLeftLabel(a.due_at, status),
    score: sub?.score ?? undefined,
    correctCount: sub?.correct_count ?? undefined,
    submittedAt: sub?.submitted_at ? formatShortDate(sub.submitted_at) : undefined,
    submittedAtIso: sub?.submitted_at ?? undefined,
    gradedAt: sub?.graded_at ? formatShortDate(sub.graded_at) : undefined,
    onTime: sub ? new Date(sub.submitted_at) <= new Date(a.due_at) : undefined,
    feedback: sub?.feedback_text
      ? {
          teacher: a.teacher_name,
          initials: a.teacher_name
            .split(' ')
            .slice(-2)
            .map((w) => w[0])
            .join('')
            .toUpperCase(),
          text: sub.feedback_text,
          at: sub.graded_at ? formatShortDate(sub.graded_at) : '',
          tags: sub.feedback_tags ?? [],
        }
      : undefined,
    questionResults: (sub?.question_results as { number: number; correct: boolean }[] | null) ?? undefined,
    solutions: (a.solutions as Record<number, string>) ?? undefined,
    submittedFiles: sub?.files ?? undefined,
    submissionNote: sub?.note ?? undefined,
  };
}

export function AssignmentsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [rows, setRows] = useState<{ assignments: AssignmentRow[]; submissions: SubmissionRow[] }>({
    assignments: [],
    submissions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    setError(null);
    const [assignmentsRes, submissionsRes] = await Promise.all([
      supabase.from('assignments').select('*').order('due_at', { ascending: true }),
      supabase.from('submissions').select('*').eq('student_id', session.user.id),
    ]);
    if (assignmentsRes.error) setError(assignmentsRes.error.message);
    else if (submissionsRes.error) setError(submissionsRes.error.message);
    else {
      setRows({
        assignments: assignmentsRes.data ?? [],
        submissions: submissionsRes.data ?? [],
      });
    }
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) fetchAll();
  }, [session, fetchAll]);

  const assignments = useMemo<Assignment[]>(() => {
    const submissionByAssignment = new Map(rows.submissions.map((s) => [s.assignment_id, s]));
    return rows.assignments.map((a) => mapToAssignment(a, submissionByAssignment.get(a.id)));
  }, [rows]);

  const submitAssignment = useCallback(
    async (id: string, payload: SubmitPayload) => {
      if (!session) return { error: 'Chưa đăng nhập' };
      try {
        const uploaded: { name: string; path: string; sizeLabel: string }[] = [];
        for (const file of payload.files) {
          const base64 = await FileSystem.readAsStringAsync(file.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });
          const ext = file.name.split('.').pop() ?? 'jpg';
          const path = `${session.user.id}/${id}/${Date.now()}-${uploaded.length}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from('submissions')
            .upload(path, decodeBase64(base64), {
              contentType: guessContentType(ext),
              upsert: true,
            });
          if (uploadError) return { error: uploadError.message };
          uploaded.push({ name: file.name, path, sizeLabel: file.sizeLabel });
        }

        const { error: upsertError } = await supabase.from('submissions').upsert(
          {
            assignment_id: id,
            student_id: session.user.id,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
            note: payload.note || null,
            files: uploaded,
            score: null,
            correct_count: null,
            graded_at: null,
            feedback_text: null,
            feedback_tags: [],
            question_results: null,
          },
          { onConflict: 'assignment_id,student_id' }
        );
        if (upsertError) return { error: upsertError.message };

        await fetchAll();
        return { error: null };
      } catch (e) {
        return { error: e instanceof Error ? e.message : 'Có lỗi xảy ra khi nộp bài.' };
      }
    },
    [session, fetchAll]
  );

  const getById = useCallback((id: string) => assignments.find((a) => a.id === id), [assignments]);

  return (
    <AssignmentsContext.Provider
      value={{ assignments, loading, error, refresh: fetchAll, getById, submitAssignment }}
    >
      {children}
    </AssignmentsContext.Provider>
  );
}

function guessContentType(ext: string) {
  const e = ext.toLowerCase();
  if (e === 'png') return 'image/png';
  if (e === 'pdf') return 'application/pdf';
  return 'image/jpeg';
}

export function useAssignments() {
  const ctx = useContext(AssignmentsContext);
  if (!ctx) throw new Error('useAssignments must be used within AssignmentsProvider');
  return ctx;
}
