
import React, { useEffect, useState } from 'react';
import { Booking, Project, User } from '../types';
import { api } from '../services/mockApi';
import { Check, X, Video, Calendar, Clock, Loader2, Users, Briefcase, ExternalLink, FileText, BarChart3, Trash, Edit } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';

const AdminDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'bookings' | 'projects'>('bookings');
    const [descriptionModal, setDescriptionModal] = useState<Booking | null>(null);
    const [projectDeleteDialogOpen, setProjectDeleteDialogOpen] = useState(false);
    const [pendingProjectDelete, setPendingProjectDelete] = useState<Project | null>(null);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [pendingRenameProject, setPendingRenameProject] = useState<Project | null>(null);
    const [renameInput, setRenameInput] = useState('');

    // Admin no longer creates/deletes client projects here — clients manage their own projects.

    useEffect(() => {
        loadAdminData();
    }, []);

    const loadAdminData = async () => {
        try {
            const [b, p, u] = await Promise.all([
                api.getBookings('admin', 'admin'),
                api.getProjects('admin', 'admin'),
                api.getAllUsers()
            ]);
            setBookings(b.reverse()); // Newest first
            setProjects(p);
            setUsers(u.filter(user => user.role === 'client')); // Include clients (may be pending/rejected)
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleApproveUser = async (id: string) => {
        try {
            const updated = await api.approveUser(id);
            setUsers(updated.filter((user: any) => user.role === 'client'));
        } catch (e) { console.error(e) }
    };

    const handleRejectUser = async (id: string) => {
        try {
            const updated = await api.rejectUser(id);
            setUsers(updated.filter((user: any) => user.role === 'client'));
        } catch (e) { console.error(e) }
    };

    const handleDeleteUser = async (id: string) => {
        try {
            const updated = await api.deleteUser(id);
            setUsers(updated.filter((user: any) => user.role === 'client'));
        } catch (e) { console.error(e) }
    };

    const handleApprove = async (id: string) => {
        try {
            const updated = await api.confirmBooking(id);
            setBookings(updated.reverse());
        } catch(e) { console.error(e) }
    };

    const handleReject = async (id: string) => {
        try {
            const updated = await api.rejectBooking(id);
            setBookings(updated.reverse());
        } catch(e) { console.error(e) }
    };

    const handleCancelBooking = async (id: string) => {
        try {
            const updated = await api.cancelBooking(id, { id: 'admin', role: 'admin' });
            setBookings(updated.reverse());
        } catch (e) { console.error(e); }
    };

    const handleFinishBooking = async (id: string) => {
        try {
            const updated = await api.finishBooking(id, { id: 'admin', role: 'admin' });
            setBookings(updated.reverse());
        } catch (e) { console.error(e); }
    };

    // Admin: open delete dialog for project
    const openProjectDeleteDialog = (project: Project) => {
        setPendingProjectDelete(project);
        setProjectDeleteDialogOpen(true);
    };

    const confirmAdminDeleteProject = async () => {
        if (!pendingProjectDelete) return;
        try {
            await api.deleteProject(pendingProjectDelete.id, { id: 'admin', role: 'admin' });
            const [p, b] = await Promise.all([
                api.getProjects('admin', 'admin'),
                api.getBookings('admin', 'admin')
            ]);
            setProjects(p);
            setBookings(b.reverse());
        } catch (e) { console.error(e); }
        finally { setProjectDeleteDialogOpen(false); setPendingProjectDelete(null); }
    };

    const openRenameProjectDialog = (project: Project) => {
        setPendingRenameProject(project);
        setRenameInput(project.name);
        setRenameDialogOpen(true);
    };

    const confirmAdminRenameProject = async () => {
        if (!pendingRenameProject) return;
        if (!renameInput || !renameInput.trim()) return alert('Please provide a valid project name');
        try {
            await api.renameProject(pendingRenameProject.id, renameInput.trim(), { id: 'admin', role: 'admin' });
            const p = await api.getProjects('admin', 'admin');
            setProjects(p);
        } catch (e: any) { alert(e.message || 'Failed to rename'); }
        finally { setRenameDialogOpen(false); setPendingRenameProject(null); }
    };

    // Project creation removed for admins; clients create/delete their own projects in My Projects.

    if (loading) {
        return (
            <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 size={48} className="animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Control Center</h1>
                    <p className="text-slate-600 dark:text-slate-400">Manage client meetings, approvals, and projects.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Pending Bookings</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {bookings.filter(b => b.status === 'pending').length}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                <Users size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Active Clients</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {users.length}
                                </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                <Briefcase size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">Total Projects</p>
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* User Management */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Users</h3>
                        <div className="text-xs text-slate-500">Approve or remove client accounts</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {users.map(u => (
                                    <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                                        <td className="px-4 py-3 text-xs">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${u.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                  u.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {u.status || 'approved'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleApproveUser(u.id)} disabled={u.status === 'approved'} className="px-2 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-md text-xs">Approve</button>
                                                <button onClick={() => handleRejectUser(u.id)} disabled={u.status === 'rejected'} className="px-2 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-xs">Reject</button>
                                                <button onClick={() => handleDeleteUser(u.id)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs">Delete</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {users.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-6 text-center text-slate-500">No users found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Tab Nav */}
                <div className="flex space-x-1 rounded-xl bg-slate-200 dark:bg-slate-800 p-1 mb-8 w-fit">
                     <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Meeting Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        Manage Projects
                    </button>
                </div>

                {/* CONTENT: Bookings */}
                {activeTab === 'bookings' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-12 animate-fadeIn">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Client</th>
                                    <th className="px-6 py-4">Services / Description</th>
                                    <th className="px-6 py-4">Date & Time</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {bookings.map(booking => (
                                    <tr key={booking.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 dark:text-white">{booking.userName}</div>
                                            <div className="text-xs">{booking.userEmail}</div>
                                        </td>
                                        <td className="px-6 py-4 max-w-xs">
                                            <div className="flex flex-wrap gap-1 mb-1">
                                                {booking.topic.map((t, i) => (
                                                    <span key={i} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                            {booking.projectId && (
                                                <div className="text-xs font-semibold text-blue-500 mb-1">
                                                    Project: {projects.find(p => p.id === booking.projectId)?.name || 'Unknown Project'}
                                                </div>
                                            )}
                                            <div className="text-xs text-slate-500 truncate flex items-start gap-1" title={booking.description}>
                                                <FileText size={12} className="mt-0.5 flex-shrink-0" /> {booking.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={14} /> {booking.date}
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock size={14} /> {booking.time}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                  booking.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                {booking.status}
                                            </span>
                                            {booking.meetLink && (
                                                <div className="mt-2">
                                                     <a href={booking.meetLink} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded border border-blue-100 dark:border-blue-800 w-fit">
                                                        <Video size={12} /> {booking.meetLink}
                                                    </a>
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2 items-center">
                                                <button
                                                    onClick={() => setDescriptionModal(booking)}
                                                    className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                                                    title="Show description"
                                                >
                                                    <FileText size={16} />
                                                </button>
                                                {booking.status === 'pending' && (
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleApprove(booking.id)}
                                                            className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors" title="Approve & Send Link"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(booking.id)}
                                                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title="Reject"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleFinishBooking(booking.id)}
                                                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" title="Mark finished"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title="Cancel booking"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {bookings.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                            No booking requests found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                {/* Description Modal */}
                {descriptionModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-slate-900/60" onClick={() => setDescriptionModal(null)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl p-6 max-w-2xl w-full z-10 shadow-lg border border-slate-200 dark:border-slate-800">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">{descriptionModal.userName}</h3>
                                    <p className="text-xs text-slate-500">{descriptionModal.date} at {descriptionModal.time}</p>
                                </div>
                                <button onClick={() => setDescriptionModal(null)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">Close</button>
                            </div>
                            <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {descriptionModal.description || 'No description provided.'}
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Project Delete Confirm */}
                <ConfirmDialog
                    open={projectDeleteDialogOpen}
                    title="Delete Project"
                    message={pendingProjectDelete ? `Are you sure you want to permanently delete "${pendingProjectDelete.name}"? This will remove the project and detach any related bookings.` : 'Are you sure you want to delete this project?'}
                    confirmLabel="Delete"
                    cancelLabel="Cancel"
                    loading={false}
                    onConfirm={confirmAdminDeleteProject}
                    onCancel={() => { setProjectDeleteDialogOpen(false); setPendingProjectDelete(null); }}
                />

                {/* Admin Rename Modal */}
                {renameDialogOpen && pendingRenameProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Rename Project</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Rename "{pendingRenameProject.name}"</p>
                            <input aria-label="New project name" placeholder="New project name" value={renameInput} onChange={e => setRenameInput(e.target.value)} className="w-full p-2 border rounded mb-4 bg-white dark:bg-slate-800 dark:text-white" />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setRenameDialogOpen(false)} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">Cancel</button>
                                <button onClick={confirmAdminRenameProject} className="px-4 py-2 rounded bg-blue-600 text-white">Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: Projects */}
                {activeTab === 'projects' && (
                    <div className="space-y-6 animate-fadeIn">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Projects</h3>
                                        <div className="text-xs text-slate-500">Clients create and delete their own projects in My Projects.</div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map(project => {
                                    const client = users.find(u => u.id === project.clientId);
                                    return (
                                        <div key={project.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate pr-2">{project.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                                    ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                                                <Users size={14} />
                                                Client: {client ? client.name : 'Unknown User'}
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span className="flex items-center gap-1"><Clock size={12}/> Due: {project.deadline}</span>
                                                <span className="flex items-center gap-1"><BarChart3 size={12}/> {project.progress}%</span>
                                            </div>
                                            <div className="mt-3 flex justify-end gap-2">
                                                <button title="Rename" onClick={() => openRenameProjectDialog(project)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-xs flex items-center gap-2"><Edit size={14}/> Rename</button>
                                                <button title="Delete" onClick={() => openProjectDeleteDialog(project)} className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700 text-xs flex items-center gap-2"><Trash size={14}/> Delete</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
