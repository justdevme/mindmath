import { useMemo } from 'react';
import { useTestHistory } from '@/hooks/useTestHistory';
import { GradedResult } from '@/lib/progress';
import { useAssignments } from '@/store/AssignmentsContext';

/** Kết hợp bài tập đã chấm (submissions) và điểm kiểm tra (test_history), sắp xếp mới nhất trước. */
export function useGradedResults() {
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { items: testHistory, loading: testHistoryLoading } = useTestHistory();

  const results = useMemo<GradedResult[]>(() => {
    const fromAssignments = assignments
      .filter((a) => a.status === 'graded' && a.score != null && a.gradedAt)
      .map<GradedResult>((a) => ({
        id: a.id,
        score: a.score!,
        title: a.title,
        teacher: a.teacher,
        topic: a.subject,
        dateIso: a.dueAt,
        onTime: a.onTime,
      }));
    const fromHistory = testHistory.map<GradedResult>((t) => ({
      id: t.id,
      score: t.score,
      title: t.title,
      teacher: t.teacher,
      topic: t.topic ?? t.title,
      dateIso: t.rawDate,
    }));
    return [...fromAssignments, ...fromHistory].sort(
      (a, b) => new Date(b.dateIso).getTime() - new Date(a.dateIso).getTime()
    );
  }, [assignments, testHistory]);

  return { results, loading: assignmentsLoading || testHistoryLoading };
}
