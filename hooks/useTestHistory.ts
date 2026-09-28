import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { TestHistoryItem } from '@/lib/types';
import { useAuth } from '@/store/AuthContext';

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export function useTestHistory() {
  const { session } = useAuth();
  const [items, setItems] = useState<TestHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from('test_history')
      .select('*')
      .eq('student_id', session.user.id)
      .order('test_date', { ascending: false });
    setItems(
      (data ?? []).map((r) => ({
        id: r.id,
        score: r.score,
        title: r.title,
        date: formatShortDate(r.test_date),
        teacher: r.teacher_name,
        topic: r.topic,
        rawDate: r.test_date,
      }))
    );
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) fetchAll();
  }, [session, fetchAll]);

  return { items, loading, refresh: fetchAll };
}
