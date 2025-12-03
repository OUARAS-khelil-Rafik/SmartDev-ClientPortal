import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash, Loader2, Edit } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { api } from '../services/mockApi';
import { User, Project } from '../types';

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
    if (!renameInput || !renameInput.trim()) return alert('Please provide a valid project name');
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
    if (!name) return alert('Please provide a project name');
    setLoading(true);
    try {
      // Client-side duplicate name check
      const existing = projects.find(p => p.clientId === user!.id && p.name.toLowerCase() === name.toLowerCase());
      if (existing) throw new Error('You already have a project with that name.');

      await api.createProject({ name, clientId: user!.id, deadline: deadline || new Date().toISOString().slice(0,10), status: 'Planning' }, { id: user!.id, role: user!.role });
      setName(''); setDeadline(''); setCreating(false);
      await load();
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) { alert(e.message || 'Failed to create'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    const project = projects.find(p => p.id === id);
    if (!project) return alert('Project not found');
    if (project.clientId !== user!.id) return alert("You can only delete your own projects");
    // Prevent deletion if project is no longer in Planning
    if (project.status !== 'Planning') return alert('Only projects in Planning can be deleted. Contact Admin for protected projects.');

    // Check for bookings
    try {
      const bookings = await api.getBookings(user!.id, user!.role);
      const hasActiveBooking = bookings.some(b => b.projectId === id && b.status !== 'rejected');
      if (hasActiveBooking) return alert('This project has associated bookings and cannot be deleted.');
    } catch (e) {
      // ignore booking fetch error and rely on server-side checks
    }

    // show UI confirmation handled by dialog in the component
    // This function is retained for backward compatibility but will be triggered by the dialog.
    setLoading(true);
    try {
      await api.deleteProject(id, { id: user!.id, role: user!.role });
      await load();
    } catch (e: any) { alert(e.message || 'Failed to delete'); }
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
    if (!project) return alert('Project not found');
    if (project.status !== 'Planning') return alert('Only projects in Planning can be deleted. Contact Admin for protected projects.');

    try {
      const bookings = await api.getBookings(user!.id, user!.role);
      const hasActiveBooking = bookings.some(b => b.projectId === id && b.status !== 'rejected');
      if (hasActiveBooking) { setDeleteDialogOpen(false); return alert('This project has associated bookings and cannot be deleted.'); }
    } catch (e) {}

    setDeleteDialogOpen(false);
    setLoading(true);
    try {
      await api.deleteProject(id, { id: user!.id, role: user!.role });
      await load();
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) { alert(e.message || 'Failed to delete'); }
    finally { setLoading(false); }
  };

  if (!user) return null;
  if (user.role !== 'client') {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="max-w-2xl text-center">
          <h2 className="text-2xl font-bold mb-2">Access Restricted</h2>
          <p className="text-slate-600 dark:text-slate-400">Only client accounts can create or delete projects here. Administrators manage projects from the Admin Control Center.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">My Projects</h2>
          <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg">
            <Plus size={16}/> {creating ? 'Cancel' : 'Create project'}
          </button>
        </div>

        {creating && (
          <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
              <input aria-label="Project name" title="Project name" value={name} onChange={e => setName(e.target.value)} placeholder="Project name" className="col-span-2 p-2 border rounded bg-white dark:bg-slate-800 dark:text-white" />
              <input aria-label="Deadline" title="Deadline" type="date" value={deadline} onChange={e => setDeadline(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white" />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleCreate} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
              <button onClick={() => { setCreating(false); setName(''); setDeadline(''); }} className="px-4 py-2 border rounded">Cancel</button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div className="col-span-full text-center py-8"><Loader2 className="animate-spin"/></div>}
          {projects.map(p => (
            <div key={p.id} className="p-4 bg-white dark:bg-slate-900 rounded-lg border flex flex-col">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{p.name}</h3>
                  <p className="text-xs text-slate-500">Due: {p.deadline} • Status: {p.status}</p>
                </div>
                <div className="flex gap-2">
                  <button title="Rename" onClick={() => openRenameDialog(p.id)} className="p-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/20 dark:text-slate-300"><Edit size={16}/></button>
                  <button title="Delete" onClick={() => openDeleteDialog(p.id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40"><Trash size={16}/></button>
                </div>
              </div>
            </div>
          ))}
          {projects.length === 0 && !loading && (
            <div className="col-span-full p-6 bg-white dark:bg-slate-900 rounded-lg text-center text-slate-500">
              You don't have any projects yet.
            </div>
          )}
        </div>
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Project"
          message={pendingDelete?.name ? `Are you sure you want to delete "${pendingDelete.name}"? This action cannot be undone.` : 'Are you sure you want to delete this project? This action cannot be undone.'}
          confirmLabel="Delete"
          cancelLabel="Cancel"
          loading={loading}
          onConfirm={confirmDeleteFromDialog}
          onCancel={() => setDeleteDialogOpen(false)}
        />
        {renameDialogOpen && pendingRename && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Rename Project</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Rename "{pendingRename.name}"</p>
              <input aria-label="New project name" placeholder="New project name" value={renameInput} onChange={e => setRenameInput(e.target.value)} className="w-full p-2 border rounded mb-4 bg-white dark:bg-slate-800 dark:text-white" />
              <div className="flex justify-end gap-3">
                <button onClick={() => setRenameDialogOpen(false)} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Cancel</button>
                <button onClick={confirmRenameFromDialog} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? 'Saving...' : 'Save'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProjects;
