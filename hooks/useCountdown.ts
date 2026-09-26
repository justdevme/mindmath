import { useEffect, useState } from 'react';

function diffParts(target: number) {
  const diffMs = Math.max(0, target - Date.now());
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return { hours, minutes, expired: diffMs <= 0 };
}

export function useCountdown(targetIso: string) {
  const target = new Date(targetIso).getTime();
  const [parts, setParts] = useState(() => diffParts(target));

  useEffect(() => {
    const interval = setInterval(() => setParts(diffParts(target)), 30000);
    return () => clearInterval(interval);
  }, [target]);

  return parts;
}
