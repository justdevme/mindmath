import { useMemo } from 'react';
import { useAssignments } from '@/store/AssignmentsContext';

function startOfWeek(d: Date) {
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  const start = new Date(d);
  start.setDate(d.getDate() + diff);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function useWeeklyActivity() {
  const { assignments } = useAssignments();

  return useMemo(() => {
    const now = new Date();
    const start = startOfWeek(now);
    const counts = [0, 0, 0, 0, 0, 0, 0]; // T2..CN order
    let exercisesDone = 0;

    for (const a of assignments) {
      if (!a.submittedAtIso) continue;
      const d = new Date(a.submittedAtIso);
      if (d < start) continue;
      const dayIndex = d.getDay(); // 0=CN..6=T7
      const orderedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // T2=0 ... CN=6
      counts[orderedIndex] += 1;
      exercisesDone += 1;
    }

    const orderedLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const todayIndex = (() => {
      const d = now.getDay();
      return d === 0 ? 6 : d - 1;
    })();

    const data = orderedLabels.map((day, idx) => ({
      day,
      value: counts[idx],
      highlighted: idx === todayIndex,
    }));

    const daysPracticed = counts.filter((c) => c > 0).length;

    return { data, exercisesDone, daysPracticed, daysTotal: 7 };
  }, [assignments]);
}
