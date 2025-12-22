import React, { useEffect, useState } from 'react';
import MotionZone from './MotionZone';
import { Briefcase, Plus, Trash, Loader2, Edit, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { api } from '../services/mockApi';
import { User, Project } from '../types';
import { useI18n } from '../i18n';

// Available services/functionalities
const AVAILABLE_SERVICES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Backend API',
  'Database Design',
  'Cloud Hosting',
  'E-commerce',
  'CMS Integration',
  'SEO Optimization',
  'Maintenance & Support'
];

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

  // Project details dialog state
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [detailsDescription, setDetailsDescription] = useState('');
  const [detailsServices, setDetailsServices] = useState<string[]>([]);
  const [detailsFeatures, setDetailsFeatures] = useState<string[]>([]);
  const [newFeature, setNewFeature] = useState('');
  const [savingDetails, setSavingDetails] = useState(false);

  // Expanded project cards
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const openDetailsDialog = (project: Project) => {
    setSelectedProject(project);
    setDetailsDescription(project.description || '');
    setDetailsServices(project.services || []);
    setDetailsFeatures(project.features || []);
    setNewFeature('');
    setDetailsDialogOpen(true);
  };

  const toggleService = (service: string) => {
    setDetailsServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    );
  };

  const addFeature = () => {
    if (newFeature.trim() && !detailsFeatures.includes(newFeature.trim())) {
      setDetailsFeatures(prev => [...prev, newFeature.trim()]);
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setDetailsFeatures(prev => prev.filter(f => f !== feature));
  };

  const saveProjectDetails = async () => {
    if (!selectedProject) return;
    setSavingDetails(true);
    try {
      await api.updateProjectDetails(
        selectedProject.id,
        { description: detailsDescription, services: detailsServices, features: detailsFeatures },
        { id: user!.id, role: user!.role }
      );
      await load();
      setDetailsDialogOpen(false);
      try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
    } catch (e: any) {
      alert(e.message || 'Failed to save details');
    } finally {
      setSavingDetails(false);
    }
  };

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
    <MotionZone variant="fadeUp" className="min-h-screen pt-28 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
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
            const isExpanded = expandedProjects.has(p.id);
            const hasDetails = p.description || (p.services && p.services.length > 0) || (p.features && p.features.length > 0);
            return (
            <div key={p.id} className="bg-white dark:bg-slate-900 rounded-lg border flex flex-col hover-lift animate-fade-in-up hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold hover:text-blue-600 transition-colors truncate">{p.name}</h3>
                    <p className="text-xs text-slate-500">{t('my_projects.card.due')} {p.deadline} • {t('my_projects.card.status')} <span className={`font-medium ${statusClass}`}>{p.status}</span></p>
                    {/* Services badges */}
                    {p.services && p.services.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {p.services.slice(0, 3).map(s => (
                          <span key={s} className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full">{s}</span>
                        ))}
                        {p.services.length > 3 && (
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">+{p.services.length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 ml-2 flex-shrink-0">
                    <button title={t('my_projects.actions.details')} onClick={() => openDetailsDialog(p)} className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-800/40 hover:scale-110 transition-all duration-300"><FileText size={16}/></button>
                    <button title={t('my_projects.actions.rename')} onClick={() => openRenameDialog(p.id)} className="p-2 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/20 dark:text-slate-300 hover:scale-110 transition-all duration-300"><Edit size={16}/></button>
                    <button title={t('my_projects.actions.delete')} onClick={() => openDeleteDialog(p.id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40 hover:scale-110 transition-all duration-300"><Trash size={16}/></button>
                  </div>
                </div>
              </div>
              
              {/* Expandable details section */}
              {hasDetails && (
                <>
                  <button 
                    onClick={() => toggleExpand(p.id)} 
                    className="flex items-center justify-center gap-1 py-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {isExpanded ? <ChevronUp size={14}/> : <ChevronDown size={14}/>}
                    {isExpanded ? t('my_projects.card.hide_details') : t('my_projects.card.show_details')}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-800 animate-fade-in">
                      {p.description && (
                        <div className="mt-3">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('my_projects.card.description')}</h4>
                          <p className="text-sm text-slate-700 dark:text-slate-300">{p.description}</p>
                        </div>
                      )}
                      {p.features && p.features.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('my_projects.card.features')}</h4>
                          <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
                            {p.features.map((f, i) => <li key={i}>{f}</li>)}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
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

        {/* Project Details Dialog */}
        {detailsDialogOpen && selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4">
            <div className="absolute inset-0 bg-black/40" onClick={() => setDetailsDialogOpen(false)} />
            <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scale-in-bounce">
              <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 pb-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{t('my_projects.dialogs.details_title')}: {selectedProject.name}</h3>
                <button title={t('common.close')} onClick={() => setDetailsDialogOpen(false)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={20} className="text-slate-500" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('my_projects.form.description')}</label>
                  <textarea
                    value={detailsDescription}
                    onChange={e => setDetailsDescription(e.target.value)}
                    placeholder={t('my_projects.form.description_placeholder')}
                    rows={3}
                    className="w-full p-3 border rounded-lg bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all"
                  />
                </div>

                {/* Services/Functionalities */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('my_projects.form.services')}</label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_SERVICES.map(service => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => toggleService(service)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                          detailsServices.includes(service)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">{t('my_projects.form.features')}</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={e => setNewFeature(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder={t('my_projects.form.feature_placeholder')}
                      className="flex-1 p-2 border rounded-lg bg-white dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      title={t('my_projects.actions.add_feature')}
                      onClick={addFeature}
                      disabled={!newFeature.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                  {detailsFeatures.length > 0 && (
                    <div className="space-y-2">
                      {detailsFeatures.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg group">
                          <span className="flex-1 text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                          <button
                            type="button"
                            title={t('my_projects.actions.remove_feature')}
                            onClick={() => removeFeature(feature)}
                            className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="sticky bottom-0 bg-white dark:bg-slate-900 p-6 pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3">
                <button onClick={() => setDetailsDialogOpen(false)} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                  {t('common.cancel')}
                </button>
                <button onClick={saveProjectDetails} disabled={savingDetails} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-all flex items-center gap-2">
                  {savingDetails ? <Loader2 size={16} className="animate-spin" /> : null}
                  {savingDetails ? t('common.saving') : t('common.save')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MotionZone>
  );
};

export default MyProjects;
