export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type SubmissionFile = { name: string; path: string; sizeLabel: string };
export type QuestionResult = { number: number; correct: boolean };

type Table<Row, Insert, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      profiles: Table<
        {
          id: string;
          full_name: string;
          class_name: string;
          course_name: string;
          avatar_initials: string;
          streak_days: number;
          total_points: number;
          created_at: string;
        },
        {
          id: string;
          full_name?: string;
          class_name?: string;
          course_name?: string;
          avatar_initials?: string;
          streak_days?: number;
          total_points?: number;
          created_at?: string;
        }
      >;
      assignments: Table<
        {
          id: string;
          subject: string;
          title: string;
          teacher_name: string;
          questions_count: number;
          due_at: string;
          assigned_at: string;
          score_coefficient: number;
          submit_method: string;
          requirement: string;
          requirement_notes: string[];
          attachment_name: string | null;
          attachment_size: string | null;
          attachment_pages: number | null;
          class_name: string;
          solutions: Record<string, string>;
          created_at: string;
        },
        Record<string, unknown>
      >;
      submissions: Table<
        {
          id: string;
          assignment_id: string;
          student_id: string;
          status: 'submitted' | 'graded';
          submitted_at: string;
          note: string | null;
          files: SubmissionFile[];
          score: number | null;
          correct_count: number | null;
          graded_at: string | null;
          feedback_text: string | null;
          feedback_tags: string[];
          question_results: QuestionResult[] | null;
        },
        {
          id?: string;
          assignment_id: string;
          student_id: string;
          status?: 'submitted' | 'graded';
          submitted_at?: string;
          note?: string | null;
          files?: SubmissionFile[];
          score?: number | null;
          correct_count?: number | null;
          graded_at?: string | null;
          feedback_text?: string | null;
          feedback_tags?: string[];
          question_results?: QuestionResult[] | null;
        }
      >;
      notifications: Table<
        {
          id: string;
          student_id: string;
          title: string;
          body: string;
          icon: string;
          read: boolean;
          created_at: string;
        },
        {
          id?: string;
          student_id: string;
          title: string;
          body: string;
          icon?: string;
          read?: boolean;
          created_at?: string;
        },
        {
          id?: string;
          student_id?: string;
          title?: string;
          body?: string;
          icon?: string;
          read?: boolean;
          created_at?: string;
        }
      >;
      test_history: Table<
        {
          id: string;
          student_id: string;
          score: number;
          title: string;
          test_date: string;
          teacher_name: string;
          topic: string | null;
          created_at: string;
        },
        Record<string, unknown>
      >;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};
