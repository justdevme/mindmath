export type AssignmentStatus = 'todo' | 'submitted' | 'graded';

export type Assignment = {
  id: string;
  subject: string;
  title: string;
  teacher: string;
  questionsCount: number;
  dueLabel: string;
  dueAt: string;
  assignedAt: string;
  status: AssignmentStatus;
  scoreCoefficient: number;
  submitMethod: string;
  requirement: string;
  requirementNotes: string[];
  attachment: { name: string; size: string; pages: number };
  group: 'today' | 'week' | 'upcoming';
  timeLeftLabel: string;
  score?: number;
  correctCount?: number;
  submittedAt?: string;
  submittedAtIso?: string;
  gradedAt?: string;
  onTime?: boolean;
  feedback?: {
    teacher: string;
    initials: string;
    text: string;
    at: string;
    tags: string[];
  };
  questionResults?: { number: number; correct: boolean }[];
  solutions?: Record<number, string>;
  submittedFiles?: { name: string; path: string; sizeLabel: string }[];
  submissionNote?: string;
};

export type NotificationItem = {
  id: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: 'document-text' | 'checkmark-circle' | 'calendar' | 'trophy';
};

export type TestHistoryItem = {
  id: string;
  score: number;
  title: string;
  date: string;
  teacher: string;
  topic: string | null;
  rawDate: string;
};

export type Period = 'Tháng này' | 'Học kỳ I' | 'Cả năm';
export const PERIODS: Period[] = ['Tháng này', 'Học kỳ I', 'Cả năm'];

export const SUBJECTS = ['Hình học', 'Đại số', 'Số học', 'Xác suất – Thống kê'];
