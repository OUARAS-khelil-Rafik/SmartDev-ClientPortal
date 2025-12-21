import React, { useEffect, useRef, useState } from 'react';
import { api } from '../services/mockApi';
import { User, ViewState } from '../types';
import { Bell, Check, X, Clock, Circle, Trash2 } from 'lucide-react';
import { useI18n } from '../i18n';

interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  body?: string;
  date: string;
  read: boolean;
  type?: string;
}

interface NotificationsProps {
  user: User | null;
  setView?: (view: ViewState) => void;
}

const timeAgo = (iso?: string) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h`;
  const day = Math.floor(hr / 24);
  return `${day}d`;
};

const Notifications: React.FC<NotificationsProps> = ({ user, setView }) => {
  const { t } = useI18n();

  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  const fetch = async () => {
    if (!user) return setItems([]);
    setLoading(true);
    try {
      // Admins should see all notifications; other users see their own
      let res;
      if (user.role === 'admin') {
        res = await api.getNotifications(undefined, 'admin');
      } else {
        res = await api.getNotifications(user.id);
      }
      setItems(res);
    } catch (e) {
      console.error('Failed to load notifications', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
    // click outside to close
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return;
      if (e.target instanceof Node && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', onDoc);

    // listen for external notification changes (created elsewhere in the app)
    const onNot = (ev: Event) => {
      try {
        const ce = ev as CustomEvent;
        const payload = ce?.detail?.notifications;
        if (payload && Array.isArray(payload)) {
          // If no user, ignore
          if (!user) return;
          // Admin should see all notifications
          if (user.role === 'admin') {
            const sorted = payload.slice().sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setItems(sorted);
          } else {
            const filtered = payload.filter((n: any) => n.userId === user.id).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setItems(filtered);
          }
          return;
        }
      } catch (e) {
        // fall through to fetch if event payload is unexpected
      }
      // fallback: refetch from API
      fetch();
    };
    window.addEventListener('nexus:notifications-changed', onNot as EventListener);

    return () => {
      document.removeEventListener('click', onDoc);
      window.removeEventListener('nexus:notifications-changed', onNot as EventListener);
    };
  }, [user]);

  const unreadCount = items.filter(i => !i.read).length;

  const markRead = async (id: string) => {
    await api.markNotificationRead(id, user?.id);
    fetch();
  };

  const toggleRead = async (id: string, currentlyRead: boolean) => {
    if (!user) return;
    try {
      if (user.role === 'admin') {
        // Admin may toggle read state for any notification by id
        await api.setNotificationRead(id, !currentlyRead);
      } else {
        await api.setNotificationRead(id, !currentlyRead, user.id);
      }
    } catch (e) {
      console.error('Failed to toggle read', e);
    }
    fetch();
  };

  const deleteOne = async (id: string) => {
    if (!user) return;
    try {
      if (user.role === 'admin') {
        await api.deleteNotification(id);
      } else {
        await api.deleteNotification(id, user.id);
      }
    } catch (e) {
      console.error('Failed to delete notification', e);
    }
    fetch();
  };

  const markAll = async () => {
    if (!user) return;
    try {
      if (user.role === 'admin') {
        // Admin: mark every notification as read
        const all = await api.getNotifications(undefined, 'admin');
        await Promise.all(all.map((n: any) => api.setNotificationRead(n.id, true)));
      } else {
        await api.markAllNotificationsRead(user.id);
      }
    } catch (e) {
      console.error('Failed to mark all read', e);
    }
    fetch();
  };

  const clearAll = async () => {
    if (!user) return;
    try {
      if (user.role === 'admin') {
        await api.clearNotifications();
      } else {
        await api.clearNotifications(user.id);
      }
    } catch (e) {
      console.error('Failed to clear notifications', e);
    }
    fetch();
  };

  // Fetch notifications when user changes
  useEffect(() => {
    if (user) {
      fetch();
    }
  }, [user]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative inline-flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={t('notifications.bell_label')}
        title={t('notifications.bell_title')}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center min-w-[18px] h-5 px-1 text-[11px] md:text-[10px] font-bold leading-none text-white bg-red-500 rounded-full ${unreadCount > 0 ? 'animate-pulse' : ''}`}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="font-semibold">{t('notifications.title')}</span>
              </div>
            <div className="flex items-center gap-2">
                  <button type="button" onClick={markAll} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-white">{t('notifications.mark_all')}</button>
                  <button type="button" onClick={clearAll} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-white">{t('notifications.clear')}</button>
                {setView && (
                    <button type="button" onClick={() => setView(ViewState.ALL_NOTIFICATIONS)} className="text-sm text-slate-500 hover:text-slate-700 dark:hover:text-white">{t('notifications.show_all')}</button>
                )}
                <button type="button" onClick={() => setOpen(false)} aria-label={t('notifications.close')} title={t('notifications.close')} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-white"><X size={16} /></button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {loading && <div className="p-4 text-sm text-slate-500">{t('notifications.loading')}</div>}
            {!loading && items.length === 0 && <div className="p-4 text-sm text-slate-500">{t('notifications.no_notifications')}</div>}
            {!loading && items.map(item => (
              <div key={item.id} className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-start gap-3 ${item.read ? 'bg-transparent' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-slate-800 dark:text-white">{item.title}</div>
                    <div className="text-xs text-slate-500">{timeAgo(item.date)}</div>
                  </div>
                  {item.body && <div className="text-sm text-slate-600 dark:text-slate-300 mt-1">{item.body}</div>}
                </div>
                <div className="flex flex-col items-center gap-1">
                  <button 
                    type="button" 
                    onClick={() => toggleRead(item.id, item.read)} 
                    aria-label={item.read ? t('notifications.mark_as_unread') : t('notifications.mark_as_read')} 
                    title={item.read ? t('notifications.mark_as_unread') : t('notifications.mark_as_read')} 
                    className="p-1.5 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30"
                  >
                    {item.read ? <Circle size={16} /> : <Check size={16} />}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => deleteOne(item.id)} 
                    aria-label={t('notifications.delete_notification')} 
                    title={t('notifications.delete_notification')} 
                    className="p-1.5 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-4 py-2 text-center text-xs text-slate-500">You will receive notifications about your bookings and project updates.</div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
