import { useGradedResults } from '@/hooks/useGradedResults';
import { computeStats } from '@/lib/progress';
import { Period } from '@/lib/types';
import { useAssignments } from '@/store/AssignmentsContext';

export function useProgressStats(period: Period) {
  const { assignments, loading: assignmentsLoading } = useAssignments();
  const { results, loading: resultsLoading } = useGradedResults();

  const submittedCount = assignments.filter((a) => a.status === 'submitted' || a.status === 'graded').length;
  const onTimeCount = assignments.filter(
    (a) => (a.status === 'submitted' || a.status === 'graded') && a.onTime !== false
  ).length;

  const stats = computeStats(results, period, submittedCount, onTimeCount);

  return { stats, loading: assignmentsLoading || resultsLoading };
}
