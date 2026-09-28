import { Period } from './types';

export type GradedResult = {
  id: string;
  score: number;
  title: string;
  teacher: string;
  topic: string;
  dateIso: string;
  onTime?: boolean;
};

function periodStartDate(period: Period): Date {
  const now = new Date();
  if (period === 'Tháng này') return new Date(now.getFullYear(), now.getMonth(), 1);
  if (period === 'Học kỳ I') return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  return new Date(now.getFullYear(), 0, 1);
}

export function filterByPeriod(results: GradedResult[], period: Period): GradedResult[] {
  const start = periodStartDate(period);
  return results.filter((r) => new Date(r.dateIso) >= start);
}

function average(scores: number[]): number {
  if (scores.length === 0) return 0;
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function computeStats(all: GradedResult[], period: Period, submittedCount: number, onTimeCount: number) {
  const inPeriod = filterByPeriod(all, period).sort(
    (a, b) => new Date(a.dateIso).getTime() - new Date(b.dateIso).getTime()
  );

  const prevStart = new Date(periodStartDate(period));
  const spanMs = Date.now() - periodStartDate(period).getTime();
  prevStart.setTime(prevStart.getTime() - spanMs);
  const previousPeriodScores = all
    .filter((r) => {
      const t = new Date(r.dateIso).getTime();
      return t >= prevStart.getTime() && t < periodStartDate(period).getTime();
    })
    .map((r) => r.score);

  const avg = average(inPeriod.map((r) => r.score));
  const prevAvg = average(previousPeriodScores);

  const topicGroups = new Map<string, number[]>();
  for (const r of inPeriod) {
    const list = topicGroups.get(r.topic) ?? [];
    list.push(r.score);
    topicGroups.set(r.topic, list);
  }
  const topicMastery = Array.from(topicGroups.entries()).map(([topic, scores]) => {
    const percent = Math.round(average(scores) * 10);
    return { topic, percent, needsWork: percent < 60 };
  });

  const recentScores = inPeriod.slice(-6).map((r) => ({ date: formatShortDate(r.dateIso), score: r.score }));

  const highest = inPeriod.length > 0 ? Math.max(...inPeriod.map((r) => r.score)) : 0;

  return {
    average: avg,
    deltaFromLastMonth: avg - prevAvg,
    submitted: submittedCount,
    onTimeRate: submittedCount > 0 ? Math.round((onTimeCount / submittedCount) * 100) : 0,
    highest,
    recentScores,
    topicMastery,
  };
}
