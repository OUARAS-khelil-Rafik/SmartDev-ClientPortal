import React, { useEffect, useState } from 'react';
import { api } from '../services/mockApi';
import { User } from '../types';
import { Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import { useI18n } from '../i18n';

interface Props {
  user: User | null;
}

const AllNotifications: React.FC<Props> = ({ user }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    if (!user) return setItems([]);
    setLoading(true);
    try {
      let res: any[] = [];
      if (user.role === 'admin') {
        res = await api.getNotifications(undefined, 'admin');
      } else {
        res = await api.getNotifications(user.id, user.role as any);
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
    const onNot = () => fetch();
    window.addEventListener('nexus:notifications-changed', onNot as EventListener);
    return () => window.removeEventListener('nexus:notifications-changed', onNot as EventListener);
  }, [user]);

  const toggleRead = async (id: string, currentlyRead: boolean) => {
    if (!user) return;
    if (user.role === 'admin') {
      await api.setNotificationRead(id, !currentlyRead);
    } else {
      await api.setNotificationRead(id, !currentlyRead, user.id);
    }
    fetch();
  };

  const remove = async (id: string) => {
    if (!user) return;
    if (user.role === 'admin') {
      await api.deleteNotification(id);
    } else {
      await api.deleteNotification(id, user.id);
    }
    fetch();
  };

  const clearAll = async () => {
    if (!user) return;
    if (user.role === 'admin') {
      await api.clearNotifications();
    } else {
      await api.clearNotifications(user.id);
    }
    fetch();
  };

  const { t } = useI18n();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 pt-28 md:pt-24 pb-24 md:pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4">
        <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2"><Clock size={18} className="sm:w-5 sm:h-5" /> {t('notifications.title')}</h2>
        <div className="flex items-center gap-2">
          <button type="button" onClick={fetch} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-slate-100 dark:bg-slate-800 rounded-md text-xs sm:text-sm">{t('notifications.refresh')}</button>
          <button type="button" onClick={clearAll} className="px-2 sm:px-3 py-1.5 sm:py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-md text-xs sm:text-sm">{t('notifications.clear_all')}</button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        {loading && <div className="p-4 text-sm text-slate-500">{t('notifications.loading')}</div>}
        {!loading && items.length === 0 && <div className="p-4 text-sm text-slate-500">{t('notifications.no_notifications')}</div>}

        {!loading && items.map(n => (
          <div key={n.id} className={`p-3 sm:p-4 border-b last:border-b-0 flex justify-between items-start gap-3 sm:gap-4 ${n.read ? 'bg-transparent' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
                <div className="font-medium text-sm sm:text-base text-slate-800 dark:text-white truncate">{n.title}</div>
                  <div className="text-xs text-slate-500 flex-shrink-0">{new Date(n.date).toLocaleString()}</div>
              </div>
              {n.body && <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">{n.body}</div>}
            </div>

            <div className="flex flex-col items-center gap-1 sm:gap-2">
                <button type="button" onClick={() => toggleRead(n.id, n.read)} className="p-1.5 sm:p-2 rounded-full text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30" aria-label={n.read ? t('notifications.mark_as_unread') : t('notifications.mark_as_read')} title={n.read ? t('notifications.mark_as_unread') : t('notifications.mark_as_read')}>
                {n.read ? <Circle size={16} /> : <CheckCircle size={16} />}
              </button>
                <button type="button" onClick={() => remove(n.id)} className="p-1.5 sm:p-2 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" aria-label={t('notifications.delete_notification')} title={t('notifications.delete_notification')}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllNotifications;
