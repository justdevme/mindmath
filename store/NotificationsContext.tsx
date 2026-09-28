import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { NotificationItem } from '@/lib/types';
import { useAuth } from './AuthContext';

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Hôm qua';
  return `${days} ngày trước`;
}

const ICONS: NotificationItem['icon'][] = ['document-text', 'checkmark-circle', 'calendar', 'trophy'];

type NotificationsContextValue = {
  notifications: NotificationItem[];
  loading: boolean;
  hasUnread: boolean;
  refresh: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [rows, setRows] = useState<
    { id: string; title: string; body: string; icon: string; read: boolean; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!session) return;
    setLoading(true);
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('student_id', session.user.id)
      .order('created_at', { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  }, [session]);

  useEffect(() => {
    if (session) fetchAll();
  }, [session, fetchAll]);

  const notifications = useMemo<NotificationItem[]>(
    () =>
      rows.map((r) => ({
        id: r.id,
        title: r.title,
        body: r.body,
        time: timeAgo(r.created_at),
        read: r.read,
        icon: (ICONS as string[]).includes(r.icon) ? (r.icon as NotificationItem['icon']) : 'document-text',
      })),
    [rows]
  );

  const markAsRead = useCallback(
    async (id: string) => {
      setRows((prev) => prev.map((r) => (r.id === id ? { ...r, read: true } : r)));
      await supabase.from('notifications').update({ read: true }).eq('id', id);
    },
    []
  );

  const markAllAsRead = useCallback(async () => {
    if (!session) return;
    setRows((prev) => prev.map((r) => ({ ...r, read: true })));
    await supabase.from('notifications').update({ read: true }).eq('student_id', session.user.id).eq('read', false);
  }, [session]);

  const hasUnread = rows.some((r) => !r.read);

  return (
    <NotificationsContext.Provider
      value={{ notifications, loading, hasUnread, refresh: fetchAll, markAsRead, markAllAsRead }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}
