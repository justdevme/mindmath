import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Assignment, assignments as seedAssignments } from '@/data/mock';

type SubmitPayload = {
  files: { id: string; name: string; sizeLabel: string }[];
  note: string;
};

type AssignmentsContextValue = {
  assignments: Assignment[];
  getById: (id: string) => Assignment | undefined;
  submitAssignment: (id: string, payload: SubmitPayload) => void;
};

const AssignmentsContext = createContext<AssignmentsContextValue | null>(null);

function formatToday() {
  const d = new Date();
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function AssignmentsProvider({ children }: { children: ReactNode }) {
  const [assignments, setAssignments] = useState<Assignment[]>(seedAssignments);

  const submitAssignment = (id: string, payload: SubmitPayload) => {
    setAssignments((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              status: 'submitted',
              submittedAt: formatToday(),
              submittedFiles: payload.files,
              submissionNote: payload.note,
            }
          : a
      )
    );
  };

  const value = useMemo<AssignmentsContextValue>(
    () => ({
      assignments,
      getById: (id: string) => assignments.find((a) => a.id === id),
      submitAssignment,
    }),
    [assignments]
  );

  return <AssignmentsContext.Provider value={value}>{children}</AssignmentsContext.Provider>;
}

export function useAssignments() {
  const ctx = useContext(AssignmentsContext);
  if (!ctx) throw new Error('useAssignments must be used within AssignmentsProvider');
  return ctx;
}
