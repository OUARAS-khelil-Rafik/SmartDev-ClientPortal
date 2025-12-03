import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash, Loader2, Edit } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { api } from '../services/mockApi';
import { User, Project } from '../types';
import { useI18n } from '../i18n';

interface Props { user: User | null }

const MyProjects: React.FC<Props> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState<string>('');

  useEffect(() => {
    if (!user) return;
    load();
  }, [user]);

  const load = async () => {
    setLoading(true);
    try {
      const p = await api.getProjects(user!.id, 'client');
      setProjects(p);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Rename dialog state
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [pendingRename, setPendingRename] = useState<{ id: string; name?: string } | null>(null);
  const [renameInput, setRenameInput] = useState('');

  const openRenameDialog = (id: string) => {
    const proj = projects.find(p => p.id === id);
    setPendingRename({ id, name: proj?.name });
    setRenameInput(proj?.name || '');
    setRenameDialogOpen(true);
  };

  const confirmRenameFromDialog = async () => {
    if (!pendingRename) return;
    const id = pendingRename.id;
    if (!renameInput || !renameInput.trim()) return alert(t('my_projects.errors.provide_valid_name'));
    setRenameDialogOpen(false);
    setLoading(true);
    try {
      await api.renameProject(id, renameInput.trim(), { id: user!.id, role: user!.role });
      await load();
      // Notify other components (Booking) that projects changed
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) { alert(e.message || 'Failed to rename'); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!name) return alert(t('my_projects.errors.provide_name'));
    setLoading(true);
    try {
      // Client-side duplicate name check
      const existing = projects.find(p => p.clientId === user!.id && p.name.toLowerCase() === name.toLowerCase());
      if (existing) throw new Error(t('my_projects.errors.duplicate_name'));

      await api.createProject({ name, clientId: user!.id, deadline: deadline || new Date().toISOString().slice(0,10), status: 'Planning' }, { id: user!.id, role: user!.role });
      setName(''); setDeadline(''); setCreating(false);
      await load();
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) { alert(e.message || t('my_projects.errors.failed_create')); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return alert(t('my_projects.errors.project_not_found'));
    if (project.clientId !== user!.id) return alert(t('my_projects.errors.only_delete_own'));
    // Prevent deletion if project is no longer in Planning
    if (project.status !== 'Planning') return alert(t('my_projects.errors.only_planning_delete'));

    // Check for bookings
    try {
      const bookings = await api.getBookings(user!.id, user!.role);
      const hasActiveBooking = bookings.some(b => b.projectId === id && b.status !== 'rejected');
      if (hasActiveBooking) return alert(t('my_projects.errors.has_bookings'));
    } catch (e) {
      // ignore booking fetch error and rely on server-side checks
    }

    // show UI confirmation handled by dialog in the component
    // This function is retained for backward compatibility but will be triggered by the dialog.
    setLoading(true);
    try {
      await api.deleteProject(id, { id: user!.id, role: user!.role });
      await load();
    } catch (e: any) { alert(e.message || t('my_projects.errors.failed_delete')); }
    finally { setLoading(false); }
  };

  // Dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name?: string } | null>(null);

  const openDeleteDialog = (id: string) => {
    const proj = projects.find(p => p.id === id);
    setPendingDelete({ id, name: proj?.name });
    setDeleteDialogOpen(true);
  };

  const confirmDeleteFromDialog = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id;

    const project = projects.find(p => p.id === id);
    if (!project) return alert(t('my_projects.errors.project_not_found'));
    if (project.status !== 'Planning') return alert(t('my_projects.errors.only_planning_delete'));

    try {
      const bookings = await api.getBookings(user!.id, user!.role);
      const hasActiveBooking = bookings.some(b => b.projectId === id && b.status !== 'rejected');
      if (hasActiveBooking) { setDeleteDialogOpen(false); return alert(t('my_projects.errors.has_bookings')); }
    } catch (e) {}

    setDeleteDialogOpen(false);
    setLoading(true);
    try {
      await api.deleteProject(id, { id: user!.id, role: user!.role });
      await load();
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) { alert(e.message || t('my_projects.errors.failed_delete')); }
    finally { setLoading(false); }
  };

  const { t } = useI18n();

  if (!user) return null;
  if (user.role !== 'client') {
    return (
      <div className="min-h-screen pt-28 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-600 dark:text-slate-400">Only client accounts can create or delete projects here. Administrators manage projects from the Admin Control Center.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-4 sm:mb-6 animate-fade-in-down">
          <h2 className="text-xl sm:text-2xl font-bold">{t('my_projects.title')}</h2>
          <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300">
            <Plus size={16} className={`transition-transform duration-300 ${creating ? 'rotate-45' : ''}`}/> {creating ? t('common.cancel') : t('my_projects.create_project')}
          </button>
        </div>

        {creating && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border mb-4 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <input aria-label={t('my_projects.form.project_name')} title={t('my_projects.form.project_name')} value={name} onChange={e => setName(e.target.value)} placeholder={t('my_projects.form.project_name')} className="col-span-2 p-2 border rounded bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
              <input aria-label={t('my_projects.form.deadline')} title={t('my_projects.form.deadline')} type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 hover:scale-105 transition-all duration-300">{t('common.create')}</button>
              <button onClick={() => { setCreating(false); setName(''); setDeadline(''); }} className="px-4 py-2 border rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300">{t('common.cancel')}</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 stagger-children">
          {loading && <div className="col-span-full text-center py-8"><Loader2 className="animate-spin mx-auto"/></div>}
          {projects.map((p) => {
            const statusClass = (() => {
              const map: Record<string, string> = {
                'Planning': 'text-yellow-600',
                'Active': 'text-green-600',
                'In Progress': 'text-green-600',
                'Review': 'text-blue-600',
                'Completed': 'text-blue-600'
              };
              return map[p.status as string] || 'text-blue-600';
            })();
            return (
            <div key={p.id} className="p-4 bg-white dark:bg-slate-900 rounded-lg border flex flex-col hover-lift animate-fade-in-up hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold hover:text-blue-600 transition-colors">{p.name}</h3>
                  <p className="text-xs text-slate-500">{t('my_projects.card.due')} {p.deadline} • {t('my_projects.card.status')} <span className={`font-medium ${statusClass}`}>{p.status}</span></p>
                </div>
                <div className="flex gap-2">
                  <button title={t('my_projects.actions.rename')} onClick={() => openRenameDialog(p.id)} className="p-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/20 dark:text-slate-300 hover:scale-110 transition-all duration-300"><Edit size={16}/></button>
                  <button title={t('my_projects.actions.delete')} onClick={() => openDeleteDialog(p.id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40 hover:scale-110 transition-all duration-300"><Trash size={16}/></button>
                </div>
              </div>
            </div>
            );
          })}
          {projects.length === 0 && !loading && (
            <div className="col-span-full p-6 bg-white dark:bg-slate-900 rounded-lg text-center text-slate-500 animate-fade-in">
              <Briefcase size={48} className="mx-auto mb-4 opacity-30" />
              {t('my_projects.empty')}
            </div>
          )}
        </div>
        <ConfirmDialog
          open={deleteDialogOpen}
          title={t('my_projects.dialogs.delete_title')}
          message={pendingDelete?.name ? `${t('my_projects.dialogs.delete_with_name_prefix')} "${pendingDelete.name}"? ${t('my_projects.dialogs.delete_suffix')}` : t('my_projects.dialogs.delete_generic')}
          confirmLabel={t('common_ui.delete') || t('common.delete')}
          cancelLabel={t('common.cancel')}
          loading={loading}
          onConfirm={confirmDeleteFromDialog}
          onCancel={() => setDeleteDialogOpen(false)}
        />
        {renameDialogOpen && pendingRename && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
            <div className="absolute inset-0 bg-black/40 animate-fade-in" onClick={() => setRenameDialogOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in-bounce">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('my_projects.dialogs.rename_title')}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t('my_projects.dialogs.rename_desc_prefix')} "{pendingRename.name}"</p>
              <input aria-label={t('my_projects.form.new_project_name')} placeholder={t('my_projects.form.new_project_name')} value={renameInput} onChange={e => setRenameInput(e.target.value)} className="w-full p-2 border rounded mb-4 bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all duration-300" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setRenameDialogOpen(false)} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300">{t('common.cancel')}</button>
                <button onClick={confirmRenameFromDialog} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 transition-all duration-300">{loading ? t('common.saving') : t('common.save')}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
