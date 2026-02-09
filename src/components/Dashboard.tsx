
import React, { useEffect, useState } from 'react';
import { Project, User } from '../types';
import { api } from '../services/api.ts';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CheckCircle2, Circle, Plus, Loader2, Trash, Edit, X, GripVertical } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { useI18n } from '../i18n';

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
    const { t } = useI18n();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [addingTask, setAddingTask] = useState(false);
    const [creating, setCreating] = useState(false);
    // `showCreate` controls whether the create form is visible.
    // `creating` is used to indicate the creation is in-progress.
    const [showCreate, setShowCreate] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createDeadline, setCreateDeadline] = useState<string>('');
    
    // Check if dark mode is active
    const [isDark, setIsDark] = useState(false);
    useEffect(() => {
        const checkDarkMode = () => {
            setIsDark(document.documentElement.classList.contains('dark'));
        };
        checkDarkMode();
        const observer = new MutationObserver(checkDarkMode);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

  useEffect(() => {
    if (user) {
        loadData();
    }
  }, [user]);

  const loadData = async () => {
    try {
        const data = await api.getProjects(user.id, user.role);
        setProjects(data);
        if (data.length > 0 && !activeProjectId) {
            setActiveProjectId(data[0].id);
        }
    } catch (e) {
        console.error("Failed to load dashboard data", e);
    } finally {
        setLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!activeProjectId) return;
    // Developers have read-only access - they cannot toggle tasks
    if (user.role === 'developer') {
        alert(t('dashboard.developer_readonly'));
        return;
    }
    try {
        const updatedProjects = await api.toggleTaskCompletion(activeProjectId, taskId);
        // The API returns all projects, but simplified for mock.
        // We re-fetch or find the project in the returned list
        const updatedProject = updatedProjects.find(p => p.id === activeProjectId);
        if (updatedProject) {
            setProjects(prev => prev.map(p => p.id === activeProjectId ? updatedProject : p));
        }
    } catch (e) {
        console.error("Failed to toggle task", e);
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProjectId || !newTaskInput.trim()) return;
    // Developers have read-only access - they cannot add tasks
    if (user.role === 'developer') {
        alert(t('dashboard.developer_readonly'));
        return;
    }

    setAddingTask(true);
    try {
        const updatedProjects = await api.addTask(activeProjectId, newTaskInput);
        const updatedProject = updatedProjects.find(p => p.id === activeProjectId);
        if (updatedProject) {
            setProjects(prev => prev.map(p => p.id === activeProjectId ? updatedProject : p));
        }
        setNewTaskInput('');
    } catch (e) {
        console.error("Failed to add task", e);
    } finally {
        setAddingTask(false);
    }
  };

  // Task drag-and-drop state
  const [draggedTaskIndex, setDraggedTaskIndex] = useState<number | null>(null);
  const [dragOverTaskIndex, setDragOverTaskIndex] = useState<number | null>(null);

  const handleTaskDragStart = (index: number) => {
    setDraggedTaskIndex(index);
  };

  const handleTaskDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedTaskIndex !== null && draggedTaskIndex !== index) {
      setDragOverTaskIndex(index);
    }
  };

  const handleTaskDragLeave = () => {
    setDragOverTaskIndex(null);
  };

  const handleTaskDrop = async (toIndex: number) => {
    if (draggedTaskIndex === null || draggedTaskIndex === toIndex || !activeProjectId) {
      setDraggedTaskIndex(null);
      setDragOverTaskIndex(null);
      return;
    }
    
    // Developers have read-only access - they cannot reorder tasks
    if (user.role === 'developer') {
      setDraggedTaskIndex(null);
      setDragOverTaskIndex(null);
      return;
    }
    
    try {
      const updatedProjects = await api.reorderTasks(activeProjectId, draggedTaskIndex, toIndex);
      const updatedProject = updatedProjects.find(p => p.id === activeProjectId);
      if (updatedProject) {
        setProjects(prev => prev.map(p => p.id === activeProjectId ? updatedProject : p));
      }
    } catch (e) {
      console.error("Failed to reorder tasks", e);
    } finally {
      setDraggedTaskIndex(null);
      setDragOverTaskIndex(null);
    }
  };

  const handleTaskDragEnd = () => {
    setDraggedTaskIndex(null);
    setDragOverTaskIndex(null);
  };

        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
        const [pendingDelete, setPendingDelete] = useState<{ id: string; name?: string } | null>(null);
        // Rename dialog state
        const [renameDialogOpen, setRenameDialogOpen] = useState(false);
        const [renameInput, setRenameInput] = useState('');

        const openDeleteDialog = (projectId: string) => {
            const proj = projects.find(p => p.id === projectId);
            setPendingDelete({ id: projectId, name: proj?.name });
            setDeleteDialogOpen(true);
        };

        const performDeleteProject = async () => {
            if (!pendingDelete) return;
            const projectId = pendingDelete.id;
            setDeleteDialogOpen(false);

            const proj = projects.find(p => p.id === projectId);
            if (!proj) return alert(t('dashboard.project_not_found'));
            if (proj.status !== 'Planning') return alert(t('dashboard.only_planning_delete'));

            // Check bookings client-side
            try {
                const bookings = await api.getBookings(user.id, user.role);
                const hasActiveBooking = bookings.some(b => b.projectId === projectId && b.status !== 'rejected');
                if (hasActiveBooking) return alert('This project has associated bookings and cannot be deleted.');
            } catch (e) {}

            setLoading(true);
            try {
                await api.deleteProject(projectId, { id: user.id, role: user.role });
                await loadData();
                const remaining = await api.getProjects(user.id, user.role);
                setActiveProjectId(remaining.length ? remaining[0].id : null);
            } catch (e: any) {
                alert(e.message || 'Failed to delete');
            } finally {
                setLoading(false);
            }
        };

  const activeProject = projects.find(p => p.id === activeProjectId);

    const confirmRenameProject = async () => {
        if (!activeProject || !activeProjectId) return;
        if (!renameInput || !renameInput.trim()) return alert(t('dashboard.provide_valid_project_name'));
        setRenameDialogOpen(false);
        setLoading(true);
        try {
            await api.renameProject(activeProjectId, renameInput.trim(), { id: user.id, role: user.role });
            await loadData();
            try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
        } catch (e: any) {
            alert(e.message || t('dashboard_extra.failed_to_rename_project'));
        } finally {
            setLoading(false);
        }
    };

    const handleCreateProject = async (): Promise<void> => {
        if (!createName || !createName.trim()) return alert(t('dashboard.provide_valid_project_name'));

        // Prevent duplicate project names for this client
        const duplicate = projects.find(p => p.clientId === user.id && p.name.toLowerCase() === createName.trim().toLowerCase());
        if (duplicate) return alert(t('dashboard.duplicate_project_name'));

        setCreating(true);
        setLoading(true);
        try {
            const payload: { name: string; clientId: string; deadline: string; status: Project['status'] } = {
                name: createName.trim(),
                clientId: user.id,
                deadline: createDeadline || new Date().toISOString().slice(0, 10),
                status: 'Planning'
            };
            console.debug('[Dashboard] createProject payload', payload);
            const newProject = await api.createProject(payload, { id: user.id, role: user.role });
            console.debug('[Dashboard] createProject success', newProject);
            // Refresh list and select the newly created project
            await loadData();
            setActiveProjectId(newProject.id);
            // Close the create form on success
            setShowCreate(false);
            try { window.dispatchEvent(new Event('projects-updated')); } catch (e) {}
            // Reset inputs
            setCreateName('');
            setCreateDeadline('');
            setCreating(false);
        } catch (e: any) {
            console.error('[Dashboard] createProject error', e);
            alert(e?.message || t('dashboard.failed_to_create_project'));
        } finally {
            setLoading(false);
            setCreating(false);
        }
    };

  if (loading) {
      return (
          <div className="min-h-screen pt-8 md:pt-6 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
      );
  }

    return (
        <>
                <div className="min-h-screen pt-8 md:pt-6 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 animate-fade-in-down">
            <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('dashboard.title')}</h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{t('dashboard.welcome_back')} {user.name}.</p>
                {user.company && <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{user.company}</p>}
            </div>
            
            
        </div>
        {/* Project Selector card */}
        <div className="max-w-7xl mx-auto mb-6 animate-fade-in-up animation-delay-100">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        <label className="sr-only" htmlFor="project-select">Select project</label>
                        <div className="select-wrapper group w-full">
                            <div className="select-glow rounded-full"></div>
                            <select
                                id="project-select"
                                title={activeProject?.name ?? (projects.length ? t('dashboard.select_project') : t('dashboard.no_projects'))}
                                value={activeProjectId ?? ''}
                                onChange={(e) => setActiveProjectId(e.target.value || null)}
                                className="custom-select select-pill truncate"
                            >
                                {projects.length === 0 && <option value="" disabled>{t('dashboard.no_projects')}</option>}
                                {projects.length > 0 && <option value="" disabled>{t('dashboard.select_project')}</option>}
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                            <svg className="select-icon !right-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.004l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3">
                            {activeProject ? (
                                <>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 hover:scale-105 ${
                                        activeProject.status === 'Completed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                    }`}>{activeProject.status}</span>
                                    {activeProject.deadline && (
                                        <span className="text-sm text-slate-600 dark:text-slate-400">Deadline: {new Date(activeProject.deadline).toLocaleDateString()}</span>
                                    )}
                                </>
                                ) : (
                                <span className="text-sm text-slate-500 dark:text-slate-400">{t('dashboard.no_project_selected')}</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2 md:gap-3">
                            {user.role === 'client' && (
                                <button
                                    onClick={() => setShowCreate(prev => !prev)}
                                    title={showCreate ? t('dashboard.close_create_form') : t('dashboard.create_project')}
                                    aria-label={showCreate ? t('dashboard.close_create_form') : t('dashboard.create_project')}
                                    className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                                >
                                    {showCreate ? <X size={16} /> : <Plus size={16} />}
                                </button>
                            )}

                            {user.role === 'client' && activeProject && (
                                <>
                                    <button
                                        title={t('dashboard.rename_project')}
                                        aria-label={t('dashboard.rename_project')}
                                        onClick={() => { setRenameInput(activeProject.name); setRenameDialogOpen(true); }}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800/20 dark:text-slate-300 dark:hover:bg-slate-700/20 focus:outline-none focus:ring-2 focus:ring-slate-300"
                                    >
                                        <Edit size={16} />
                                    </button>

                                    <button
                                        title={t('dashboard.delete_project')}
                                        aria-label={t('dashboard.delete_project')}
                                        onClick={() => openDeleteDialog(activeProject.id)}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40 focus:outline-none focus:ring-2 focus:ring-red-300"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {user.role === 'client' && showCreate && (
                    <div className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                            <label className="sr-only" htmlFor="create-name">Project name</label>
                            <input
                                id="create-name"
                                aria-label={t('dashboard.project_name')}
                                title={t('dashboard.project_name')}
                                value={createName}
                                onChange={e => setCreateName(e.target.value)}
                                placeholder={t('dashboard.project_name')}
                                className="col-span-2 p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                            <label className="sr-only" htmlFor="create-deadline">Deadline</label>
                            <input
                                id="create-deadline"
                                aria-label={t('dashboard.deadline')}
                                title={t('dashboard.deadline')}
                                type="date"
                                value={createDeadline}
                                onChange={e => setCreateDeadline(e.target.value)}
                                className="p-2 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                        </div>
                        <div className="mt-3 flex gap-2 justify-end">
                            <button
                                onClick={handleCreateProject}
                                disabled={creating || loading || !createName.trim()}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                            >
                                {creating || loading ? <Loader2 size={16} className="animate-spin" /> : t('dashboard.create')}
                            </button>
                            <button
                                onClick={() => { setShowCreate(false); setCreateName(''); setCreateDeadline(''); setCreating(false); }}
                                className="px-4 py-2 border rounded bg-white text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                            >
                                {t('dashboard.cancel')}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>

                {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Project Status */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-4">
                                        <h1 className="text-xl font-bold text-slate-800 dark:text-white truncate pr-5">{activeProject.name}</h1>  
                                </div>

                {/* Project Details Section */}
                {(activeProject.description || (activeProject.services && activeProject.services.length > 0) || (activeProject.features && activeProject.features.length > 0)) && (
                  <div className="mb-6 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    {activeProject.services && activeProject.services.length > 0 && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-2">{t('dashboard.services')}</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeProject.services.map(s => (
                            <span key={s} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs rounded-full font-medium">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {activeProject.description && (
                      <div className="mb-3">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('dashboard.description')}</h4>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{activeProject.description}</p>
                      </div>
                    )}
                    {activeProject.features && activeProject.features.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase mb-1">{t('dashboard.features')}</h4>
                        <ul className="text-sm text-slate-600 dark:text-slate-400 list-disc list-inside space-y-0.5">
                          {activeProject.features.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">{t('dashboard.overall_progress')}</span>
                        <span className="font-bold text-blue-600 dark:text-blue-400">{activeProject.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden shadow-inner">
                        <style>{`.progress-fill-${activeProject.id} { width: ${activeProject.progress}%; }`}</style>
                        <div 
                            className={`bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 dark:from-blue-400 dark:via-blue-500 dark:to-indigo-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-500/30 dark:shadow-blue-400/20 progress-fill-${activeProject.id}`}
                        ></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {/* Task List */}
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex justify-between items-center">
                            {t('dashboard.tasks')}
                            <span className="text-xs font-normal text-slate-500">{t('dashboard.drag_to_reorder')}</span>
                        </h4>
                        <div className="space-y-2 max-h-96 overflow-y-auto overflow-x-visible p-1 -m-1 custom-scrollbar">
                            {activeProject.tasks.map((task, index) => (
                                <div 
                                    key={task.id} 
                                    draggable
                                    onDragStart={() => handleTaskDragStart(index)}
                                    onDragOver={(e) => handleTaskDragOver(e, index)}
                                    onDragLeave={handleTaskDragLeave}
                                    onDrop={() => handleTaskDrop(index)}
                                    onDragEnd={handleTaskDragEnd}
                                    className={`flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-grab active:cursor-grabbing group
                                        ${draggedTaskIndex === index ? 'opacity-50 scale-95' : ''}
                                        ${dragOverTaskIndex === index ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}
                                    `}
                                >
                                    <div className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-grab active:cursor-grabbing">
                                        <GripVertical size={16} />
                                    </div>
                                    <div 
                                        onClick={() => handleToggleTask(task.id)}
                                        className="flex items-center gap-3 flex-1 cursor-pointer"
                                    >
                                        {task.completed ? 
                                            <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} /> : 
                                            <Circle className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" size={20} />
                                        }
                                        <span className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                            {task.title}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add Task Form */}
                        <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskInput}
                                onChange={(e) => setNewTaskInput(e.target.value)}
                                placeholder={t('dashboard.add_new_task_placeholder')}
                                className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 outline-none dark:text-white"
                            />
                            <button 
                                type="submit"
                                disabled={addingTask || !newTaskInput.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg disabled:opacity-50 transition-colors"
                            >
                                {addingTask ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
                            </button>
                        </form>
                    </div>

                    {/* Weekly Velocity chart removed per request */}
                </div>
            </div>

            {/* Stats Sidebar */}
            <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex-1 min-h-[300px]">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">{t('dashboard.work_breakdown')}</h3>
                            <div className="h-full pb-6">
                                <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: t('dashboard.done'), value: activeProject.progress },
                                        { name: t('dashboard.remaining'), value: 100 - activeProject.progress }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    <Cell fill={isDark ? '#60a5fa' : '#3b82f6'} />
                                    <Cell fill={isDark ? '#334155' : '#e2e8f0'} />
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ 
                                        backgroundColor: isDark ? '#1e293b' : '#ffffff',
                                        border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                        borderRadius: '8px',
                                        color: isDark ? '#f1f5f9' : '#1e293b'
                                    }}
                                />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="font-bold text-2xl" fill={isDark ? '#f1f5f9' : '#1e293b'}>
                                    {activeProject.progress}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                {/* Upcoming Meeting removed per request; sidebar keeps only the Work Breakdown chart */}
            </div>
        </div>
        ) : (
            <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="mb-4">{t('empty.no_active_projects')}</p>
                <p className="text-sm">{t('empty.book_consultation')}</p>
            </div>
        )}
      </div>
        </div>
                {renameDialogOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('dashboard.rename_project')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t('dashboard.rename_project')} "{activeProject?.name}"</p>
                            <input aria-label={t('dashboard.project_name')} placeholder={t('dashboard.project_name')} value={renameInput} onChange={e => setRenameInput(e.target.value)} className="w-full p-2 border rounded mb-4 bg-white dark:bg-slate-800 dark:text-white" />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setRenameDialogOpen(false)} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{t('common_ui.cancel')}</button>
                                <button onClick={confirmRenameProject} disabled={loading} className="px-4 py-2 rounded bg-blue-600 text-white">{loading ? t('common_ui.saving') : t('common_ui.save')}</button>
                            </div>
                        </div>
                    </div>
                )}

                <ConfirmDialog
                    open={deleteDialogOpen}
                    title={t('dashboard.delete_project')}
                    message={pendingDelete?.name ? t('confirm.delete_confirm_with_name').replace('{name}', pendingDelete.name) : t('confirm.delete_confirm')}
                    confirmLabel={t('common_ui.delete')}
                    cancelLabel={t('common_ui.cancel')}
                    loading={loading}
                    onConfirm={performDeleteProject}
                    onCancel={() => setDeleteDialogOpen(false)}
                />
        </>
    );
};

export default Dashboard;
