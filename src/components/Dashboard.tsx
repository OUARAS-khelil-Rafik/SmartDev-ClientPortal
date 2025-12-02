
import React, { useEffect, useState } from 'react';
import { Project, User } from '../types';
import { api } from '../services/mockApi';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { CheckCircle2, Circle, Clock, Plus, Loader2, Trash } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const COLORS = ['#3b82f6', '#1e293b'];
const ACTIVITY_DATA = [
  { name: 'Mon', tasks: 4 },
  { name: 'Tue', tasks: 7 },
  { name: 'Wed', tasks: 5 },
  { name: 'Thu', tasks: 9 },
  { name: 'Fri', tasks: 6 },
];

interface DashboardProps {
    user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null);
  const [newTaskInput, setNewTaskInput] = useState('');
  const [addingTask, setAddingTask] = useState(false);
    const [creating, setCreating] = useState(false);
    const [createName, setCreateName] = useState('');
    const [createDeadline, setCreateDeadline] = useState<string>('');

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

        const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
        const [pendingDelete, setPendingDelete] = useState<{ id: string; name?: string } | null>(null);

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
            if (!proj) return alert('Project not found');
            if (proj.status !== 'Planning') return alert('Only projects in Planning can be deleted. This project is already in progress or completed.');

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

  if (loading) {
      return (
          <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
              <Loader2 size={48} className="animate-spin text-blue-600" />
          </div>
      );
  }

    return (
        <>
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Client Portal</h2>
                <p className="text-slate-600 dark:text-slate-400">Welcome back, {user.name}.</p>
            </div>
            
            {/* Project Selector */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                {projects.map(p => (
                    <button
                        key={p.id}
                        onClick={() => setActiveProjectId(p.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            activeProjectId === p.id 
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500'
                        }`}
                    >
                        {p.name}
                    </button>
                ))}
            </div>
        </div>

                {/* Create project inline for client users */}
                {user.role === 'client' && (
                    <div className="max-w-7xl mx-auto mb-6">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg">
                                <Plus size={16}/> {creating ? 'Cancel' : 'Create project'}
                            </button>
                        </div>

                        {creating && (
                            <div className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                                    <input aria-label="Project name" title="Project name" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Project name" className="col-span-2 p-2 border rounded bg-white dark:bg-slate-800 dark:text-white" />
                                    <input aria-label="Deadline" title="Deadline" type="date" value={createDeadline} onChange={e => setCreateDeadline(e.target.value)} className="p-2 border rounded bg-white dark:bg-slate-800 dark:text-white" />
                                </div>
                                <div className="mt-3 flex gap-2 justify-end">
                                    <button onClick={async () => {
                                        if (!createName) return alert('Please provide a project name');
                                        // Client-side duplicate name check
                                        const duplicate = projects.find(p => p.clientId === user.id && p.name.toLowerCase() === createName.toLowerCase());
                                        if (duplicate) return alert('You already have a project with that name. Choose a different name.');
                                        setLoading(true);
                                        try {
                                            await api.createProject({ name: createName, clientId: user.id, deadline: createDeadline || new Date().toISOString().slice(0,10), status: 'Planning' }, { id: user.id, role: user.role });
                                            setCreateName(''); setCreateDeadline(''); setCreating(false);
                                            await loadData();
                                        } catch (e: any) { alert(e.message || 'Failed to create'); }
                                        finally { setLoading(false); }
                                    }} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                                    <button onClick={() => { setCreating(false); setCreateName(''); setCreateDeadline(''); }} className="px-4 py-2 border rounded">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeProject ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Project Status */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                                <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-white truncate pr-4">{activeProject.name}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ${
                                                activeProject.status === 'Completed' 
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'
                                            }`}>
                                                {activeProject.status}
                                            </span>
                                            {user.role === 'client' && (
                                                <button title="Delete project" onClick={() => openDeleteDialog(activeProject.id)} className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-800/40">
                                                    <Trash size={16} />
                                                </button>
                                            )}
                                        </div>
                                </div>

                <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600 dark:text-slate-400">Overall Progress</span>
                        <span className="font-bold text-slate-900 dark:text-white">{activeProject.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div className={`bg-gradient-to-r from-blue-500 to-indigo-500 h-3 rounded-full transition-all duration-1000 ${`w-[${activeProject.progress}%]`}`}></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Task List */}
                    <div>
                        <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-4 flex justify-between items-center">
                            Tasks
                            <span className="text-xs font-normal text-slate-500">Click to toggle</span>
                        </h4>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                            {activeProject.tasks.map(task => (
                                <div 
                                    key={task.id} 
                                    onClick={() => handleToggleTask(task.id)}
                                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
                                >
                                    {task.completed ? 
                                        <CheckCircle2 className="text-green-500 flex-shrink-0" size={20} /> : 
                                        <Circle className="text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" size={20} />
                                    }
                                    <span className={`text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                        {task.title}
                                    </span>
                                </div>
                            ))}
                        </div>
                        
                        {/* Add Task Form */}
                        <form onSubmit={handleAddTask} className="mt-4 flex gap-2">
                            <input 
                                type="text" 
                                value={newTaskInput}
                                onChange={(e) => setNewTaskInput(e.target.value)}
                                placeholder="Add new task..."
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

                    {/* Chart */}
                    <div className="h-64">
                         <h4 className="font-semibold text-slate-700 dark:text-slate-200 mb-2">Weekly Velocity</h4>
                         <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ACTIVITY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                                <XAxis dataKey="name" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                                    cursor={{fill: 'transparent'}}
                                />
                                <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Stats Sidebar */}
            <div className="flex flex-col gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex-1 min-h-[300px]">
                     <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">Work Breakdown</h3>
                     <div className="h-full pb-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Done', value: activeProject.progress },
                                        { name: 'Left', value: 100 - activeProject.progress }
                                    ]}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >

                {/* Create project inline for client users */}
                {user.role === 'client' && (
                    <div className="max-w-7xl mx-auto mb-6">
                        <div className="flex items-center justify-end gap-2">
                            <button onClick={() => setCreating(!creating)} className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg">
                                <Plus size={16}/> {creating ? 'Cancel' : 'Create project'}
                            </button>
                        </div>

                        {creating && (
                            <div className="mt-3 p-4 bg-white dark:bg-slate-900 rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
                                    <input aria-label="Project name" title="Project name" value={createName} onChange={e => setCreateName(e.target.value)} placeholder="Project name" className="col-span-2 p-2 border rounded" />
                                    <input aria-label="Deadline" title="Deadline" type="date" value={createDeadline} onChange={e => setCreateDeadline(e.target.value)} className="p-2 border rounded" />
                                </div>
                                <div className="mt-3 flex gap-2 justify-end">
                                    <button onClick={async () => {
                                        if (!createName) return alert('Please provide a project name');
                                        setLoading(true);
                                        try {
                                            await api.createProject({ name: createName, clientId: user.id, deadline: createDeadline || new Date().toISOString().slice(0,10), status: 'Planning' }, { id: user.id, role: user.role });
                                            setCreateName(''); setCreateDeadline(''); setCreating(false);
                                            await loadData();
                                        } catch (e: any) { alert(e.message || 'Failed to create'); }
                                        finally { setLoading(false); }
                                    }} className="bg-green-600 text-white px-4 py-2 rounded">Create</button>
                                    <button onClick={() => { setCreating(false); setCreateName(''); setCreateDeadline(''); }} className="px-4 py-2 border rounded">Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#1e293b" />
                                </Pie>
                                <Tooltip />
                                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="fill-slate-900 dark:fill-white font-bold text-2xl">
                                    {activeProject.progress}%
                                </text>
                            </PieChart>
                        </ResponsiveContainer>
                     </div>
                </div>

                <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-2xl shadow-lg text-white">
                    <h3 className="font-bold text-lg mb-2">Upcoming Meeting</h3>
                    <div className="flex items-center gap-3 mb-4">
                        <Clock size={20} className="text-blue-200" />
                        <span>Nov 15, 10:00 AM EST</span>
                    </div>
                    <p className="text-blue-100 text-sm mb-4">Sprint Review & Planning</p>
                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium backdrop-blur-sm">
                        Join Call
                    </button>
                </div>
            </div>
        </div>
        ) : (
            <div className="text-center py-20 text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <p className="mb-4">You don't have any active projects yet.</p>
                <p className="text-sm">Book a consultation to get started.</p>
            </div>
        )}
      </div>
    </div>
        <ConfirmDialog
            open={deleteDialogOpen}
            title="Delete Project"
            message={pendingDelete?.name ? `Are you sure you want to delete "${pendingDelete.name}"? This action cannot be undone.` : 'Are you sure you want to delete this project? This action cannot be undone.'}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            loading={loading}
            onConfirm={performDeleteProject}
            onCancel={() => setDeleteDialogOpen(false)}
        />
        </>
    );
};

export default Dashboard;
