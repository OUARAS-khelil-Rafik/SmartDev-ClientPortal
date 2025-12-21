
import React, { useEffect, useState } from 'react';
import { Booking, Project, User } from '../types';
import { api } from '../services/mockApi';
import { Check, X, Video, Calendar, Clock, Loader2, Users, Briefcase, ExternalLink, FileText, BarChart3, Trash, Edit, Plus, Code } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { useI18n } from '../i18n';

const AdminDashboard: React.FC = () => {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [developers, setDevelopers] = useState<User[]>([]);
    const [userToggling, setUserToggling] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [bookingFilter, setBookingFilter] = useState('');
    const [clientFilter, setClientFilter] = useState('');
    const [developerFilter, setDeveloperFilter] = useState('');
    const [projectNameFilter, setProjectNameFilter] = useState('');
    const [projectClientFilter, setProjectClientFilter] = useState('');
    const [projectDeveloperFilter, setProjectDeveloperFilter] = useState('');
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [clearIncludeFinished, setClearIncludeFinished] = useState(false);
    const [clearLoading, setClearLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'clients' | 'bookings' | 'projects' | 'developers'>('bookings');
    const [descriptionModal, setDescriptionModal] = useState<Booking | null>(null);
    const [projectDeleteDialogOpen, setProjectDeleteDialogOpen] = useState(false);
    const [pendingProjectDelete, setPendingProjectDelete] = useState<Project | null>(null);
    const [renameDialogOpen, setRenameDialogOpen] = useState(false);
    const [pendingRenameProject, setPendingRenameProject] = useState<Project | null>(null);
    const [renameInput, setRenameInput] = useState('');

    // Developer management state
    const [showAddDeveloper, setShowAddDeveloper] = useState(false);
    const [newDevName, setNewDevName] = useState('');
    const [newDevEmail, setNewDevEmail] = useState('');
    const [editingDeveloper, setEditingDeveloper] = useState<User | null>(null);
    const [editDevName, setEditDevName] = useState('');
    const [editDevEmail, setEditDevEmail] = useState('');
    const [devDeleteDialogOpen, setDevDeleteDialogOpen] = useState(false);
    const [pendingDevDelete, setPendingDevDelete] = useState<User | null>(null);

    // Project-Developer assignment state
    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
    const [assigningProject, setAssigningProject] = useState<Project | null>(null);
    const [selectedDeveloperId, setSelectedDeveloperId] = useState<string>('');

    // Admin no longer creates/deletes client projects here — clients manage their own projects.

    useEffect(() => {
        loadAdminData();
    }, []);

    const { t } = useI18n();

    const loadAdminData = async () => {
        try {
            const [b, p, allUsers] = await Promise.all([
                api.getBookings('admin', 'admin'),
                api.getProjects('admin', 'admin'),
                api.getAllUsers()
            ]);
            setBookings(b.reverse()); // Newest first
            setProjects(p);
            setUsers(allUsers.filter(user => user.role === 'client')); // Include clients (may be pending/rejected)
            setDevelopers(allUsers.filter(user => user.role === 'developer'));
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

    const toggleUserApproval = async (id: string, approve: boolean) => {
        setUserToggling(id);
        try {
            if (approve) await handleApproveUser(id);
            else await handleRejectUser(id);
        } catch (e) { console.error(e) }
        finally { setUserToggling(null); }
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

    // --- Developer Management ---
    const handleCreateDeveloper = async () => {
        if (!newDevName.trim() || !newDevEmail.trim()) return alert('Please provide name and email');
        try {
            await api.createDeveloper(newDevName.trim(), newDevEmail.trim());
            const allUsers = await api.getAllUsers();
            setDevelopers(allUsers.filter(u => u.role === 'developer'));
            setNewDevName('');
            setNewDevEmail('');
            setShowAddDeveloper(false);
        } catch (e: any) { alert(e.message || 'Failed to create developer'); }
    };

    const handleUpdateDeveloper = async () => {
        if (!editingDeveloper) return;
        if (!editDevName.trim() || !editDevEmail.trim()) return alert('Please provide name and email');
        try {
            const updated = await api.updateDeveloper(editingDeveloper.id, { 
                name: editDevName.trim(), 
                email: editDevEmail.trim() 
            });
            setDevelopers(updated);
            setEditingDeveloper(null);
            setEditDevName('');
            setEditDevEmail('');
        } catch (e: any) { alert(e.message || 'Failed to update developer'); }
    };

    const openEditDeveloper = (dev: User) => {
        setEditingDeveloper(dev);
        setEditDevName(dev.name);
        setEditDevEmail(dev.email);
    };

    const openDeleteDevDialog = (dev: User) => {
        setPendingDevDelete(dev);
        setDevDeleteDialogOpen(true);
    };

    const confirmDeleteDeveloper = async () => {
        if (!pendingDevDelete) return;
        try {
            const updated = await api.deleteDeveloper(pendingDevDelete.id);
            setDevelopers(updated);
            // Refresh projects since developer assignments may have changed
            const p = await api.getProjects('admin', 'admin');
            setProjects(p);
        } catch (e: any) { alert(e.message || 'Failed to delete developer'); }
        finally { setDevDeleteDialogOpen(false); setPendingDevDelete(null); }
    };

    // --- Project-Developer Assignment ---
    const openAssignDialog = (project: Project) => {
        setAssigningProject(project);
        setSelectedDeveloperId(project.developerId || '');
        setAssignDialogOpen(true);
    };

    const confirmAssignDeveloper = async () => {
        if (!assigningProject) return;
        try {
            const updated = await api.assignDeveloperToProject(
                assigningProject.id, 
                selectedDeveloperId || null
            );
            setProjects(updated);
        } catch (e: any) { alert(e.message || 'Failed to assign developer'); }
        finally { setAssignDialogOpen(false); setAssigningProject(null); setSelectedDeveloperId(''); }
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
        if (!renameInput || !renameInput.trim()) return alert(t('admin.provide_valid_project_name'));
        try {
            await api.renameProject(pendingRenameProject.id, renameInput.trim(), { id: 'admin', role: 'admin' });
            const p = await api.getProjects('admin', 'admin');
            setProjects(p);
        } catch (e: any) { alert(e.message || t('admin.failed_to_rename')); }
        finally { setRenameDialogOpen(false); setPendingRenameProject(null); }
    };

    // Project creation removed for admins; clients create/delete their own projects in My Projects.

    if (loading) {
        return (
            <div className="min-h-screen pt-28 md:pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <Loader2 size={48} className="animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-7xl mx-auto">
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">{t('admin.title')}</h1>
                    <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{t('admin.subtitle')}</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500">{t('admin.pending_bookings')}</p>
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
                                        <p className="text-sm text-slate-500">{t('admin.active_clients')}</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {users.length}
                                        </h3>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400">
                                <Code size={24} />
                            </div>
                            <div>
                                        <p className="text-sm text-slate-500">{t('admin.active_developers')}</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                                            {developers.length}
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
                                        <p className="text-sm text-slate-500">{t('admin.total_projects')}</p>
                                        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{projects.length}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Nav */}
                <div className="flex space-x-1 rounded-xl bg-slate-200 dark:bg-slate-800 p-1 mb-8 w-fit">
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'bookings' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t('admin.meeting_requests')}
                    </button>
                    <button
                        onClick={() => setActiveTab('clients')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'clients' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t('admin.manage_clients')}
                    </button>
                    <button
                        onClick={() => setActiveTab('developers')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'developers' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t('admin.manage_developers')}
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'projects' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {t('admin.manage_projects')}
                    </button>
                </div>

                {/* CONTENT: Clients */}
                {activeTab === 'clients' && (
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm mb-8 animate-fadeIn">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.manage_clients')}</h3>
                            <div className="text-xs text-slate-500">{t('admin.approve_remove_tip')}</div>
                        </div>
                        <div className="mb-4">
                            <input
                                type="search"
                                placeholder={t('admin.filter_clients_placeholder')}
                                value={clientFilter}
                                onChange={e => setClientFilter(e.target.value)}
                                className="custom-input input-filter w-64"
                            />
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-center text-sm text-slate-600 dark:text-slate-400">
                                <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3">{t('admin.name')}</th>
                                        <th className="px-4 py-3">{t('admin.email')}</th>
                                        <th className="px-4 py-3">{t('admin.company')}</th>
                                        <th className="px-4 py-3">{t('admin.status')}</th>
                                        <th className="px-4 py-3">{t('admin.actions')}</th>
                                        <th className="px-4 py-3">{t('admin.activate')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                    {users
                                        .filter(u => {
                                            if (!clientFilter.trim()) return true;
                                            const q = clientFilter.toLowerCase();
                                            return u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || (u.company || '').toLowerCase().includes(q);
                                        })
                                        .map(u => (
                                        <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{u.name}</td>
                                            <td className="px-4 py-3 text-xs">{u.email}</td>
                                            <td className="px-4 py-3 text-xs">{u.company || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                    ${u.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                                                      u.status === 'rejected' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                                                      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                    {u.status || 'approved'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            disabled={userToggling === u.id}
                                                            title={t('admin.delete')}
                                                            aria-label={t('admin.delete')}
                                                            className="p-2 rounded text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 disabled:pointer-events-none"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center">
                                                    <label className="inline-flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            role="switch"
                                                            aria-label={u.status === 'approved' ? t('admin.deactivate') : t('admin.activate')}
                                                            checked={u.status === 'approved'}
                                                            onChange={(e) => toggleUserApproval(u.id, e.target.checked)}
                                                            disabled={userToggling === u.id}
                                                            className="sr-only"
                                                        />
                                                        <div
                                                            role="presentation"
                                                            className={`w-11 h-6 rounded-full relative transition-colors ${userToggling === u.id ? 'opacity-50 pointer-events-none' : ''} ${u.status === 'approved' ? 'bg-green-500' : 'bg-slate-200'}`}
                                                            aria-hidden="true"
                                                        >
                                                            <span className={`absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform ${u.status === 'approved' ? 'translate-x-5' : 'translate-x-0'}`}></span>
                                                        </div>
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {users.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-4 py-6 text-center text-slate-500">{t('admin.no_users_found')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* CONTENT: Bookings */}
                {activeTab === 'bookings' && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm mb-12 animate-fadeIn">
                    <div className="p-6">
                        <div className="flex items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.meeting_requests')}</h3>
                            <div className="text-xs text-slate-500 whitespace-nowrap">{t('admin.showing_requests').replace('{count}', String(bookings.length))}</div>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <input type="search" placeholder={t('admin.filter_requests_placeholder')} value={bookingFilter} onChange={e => setBookingFilter(e.target.value)} className="custom-input input-filter w-64" />
                            <button
                                onClick={() => { setClearIncludeFinished(false); setClearDialogOpen(true); }}
                                className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm whitespace-nowrap"
                            >
                                {t('admin.clear_history')}
                            </button>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 dark:text-slate-400">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.client_label')}</th>
                                    <th className="px-6 py-4">{t('admin.services_description')}</th>
                                    <th className="px-6 py-4">{t('admin.date_time')}</th>
                                    <th className="px-6 py-4">{t('admin.status')}</th>
                                    <th className="px-6 py-4">{t('admin.actions')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                {bookings
                                    .filter(b => {
                                        if (!bookingFilter.trim()) return true;
                                        const q = bookingFilter.toLowerCase();
                                        const inTopic = b.topic.join(' ').toLowerCase().includes(q);
                                        return [b.userName, b.userEmail, b.date, b.time, b.description].some(s => (s || '').toLowerCase().includes(q)) || inTopic;
                                    })
                                    .map(booking => (
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
                                                    {t('admin.client_label_short')} {projects.find(p => p.id === booking.projectId)?.name || 'Unknown Project'}
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
                                                        title={t('admin.show_description')}
                                                    >
                                                    <FileText size={16} />
                                                </button>
                                                {booking.status === 'pending' && (
                                                            <div className="flex gap-2">
                                                        <button 
                                                            onClick={() => handleApprove(booking.id)}
                                                            className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors" title={t('admin.approve_send_link')}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReject(booking.id)}
                                                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title={t('admin.reject')}
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </div>
                                                )}
                                                {booking.status === 'confirmed' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleFinishBooking(booking.id)}
                                                            className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors" title={t('admin.mark_finished')}
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancelBooking(booking.id)}
                                                            className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors" title={t('admin.cancel_booking')}
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
                                            {t('admin.no_booking_requests')}
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                )}

                <ConfirmDialog
                    open={clearDialogOpen}
                    title={t('admin.clear_booking_history_title')}
                    message={t('admin.clear_booking_history_message')}
                    confirmLabel={t('admin.clear_confirm')}
                    cancelLabel={t('common_ui.cancel')}
                    loading={clearLoading}
                    onConfirm={async () => {
                        setClearLoading(true);
                        try {
                            await api.clearBookingHistory(undefined, { id: 'admin', role: 'admin' }, { includeFinished: clearIncludeFinished });
                            const b = await api.getBookings('admin', 'admin');
                            setBookings(b.reverse());
                        } catch (e) { console.error(e); alert((e as any)?.message || 'Failed to clear history'); }
                        finally { setClearLoading(false); setClearDialogOpen(false); }
                    }}
                    onCancel={() => setClearDialogOpen(false)}
                >
                    <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={clearIncludeFinished} onChange={e => setClearIncludeFinished(e.target.checked)} />
                            <span className="text-xs text-slate-500">{t('admin.include_finished')}</span>
                        </label>
                </ConfirmDialog>

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
                                <button onClick={() => setDescriptionModal(null)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white">{t('common_ui.cancel')}</button>
                            </div>
                            <div className="mt-4 text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                {descriptionModal.description || t('admin.no_description_provided')}
                            </div>
                        </div>
                    </div>
                )}

                {/* Admin Project Delete Confirm */}
                <ConfirmDialog
                    open={projectDeleteDialogOpen}
                    title={t('admin.delete')}
                    message={pendingProjectDelete ? t('confirm.delete_confirm_with_name').replace('{name}', pendingProjectDelete.name) : t('confirm.delete_confirm')}
                    confirmLabel={t('common_ui.delete')}
                    cancelLabel={t('common_ui.cancel')}
                    loading={false}
                    onConfirm={confirmAdminDeleteProject}
                    onCancel={() => { setProjectDeleteDialogOpen(false); setPendingProjectDelete(null); }}
                />

                {/* Admin Rename Modal */}
                {renameDialogOpen && pendingRenameProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40" onClick={() => setRenameDialogOpen(false)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('admin.rename_project')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{t('admin.rename_project')}: "{pendingRenameProject.name}"</p>
                            <input aria-label={t('dashboard.project_name')} placeholder={t('dashboard.project_name')} value={renameInput} onChange={e => setRenameInput(e.target.value)} className="w-full p-2 border rounded mb-4 bg-white dark:bg-slate-800 dark:text-white" />
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setRenameDialogOpen(false)} className="px-4 py-2 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">{t('common_ui.cancel')}</button>
                                <button onClick={confirmAdminRenameProject} className="px-4 py-2 rounded bg-blue-600 text-white">{t('common_ui.save')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: Projects */}
                {activeTab === 'projects' && (
                    <div className="space-y-6 animate-fadeIn">
                                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                                    <div className="flex items-center justify-between gap-4 mb-4">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.all_projects')}</h3>
                                        <div className="text-xs text-slate-500 whitespace-nowrap">{t('admin.clients_create_note')}</div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-3 mb-4">
                                        <input
                                            type="search"
                                            placeholder={t('admin.filter_by_name')}
                                            value={projectNameFilter}
                                            onChange={e => setProjectNameFilter(e.target.value)}
                                            className="custom-input input-filter"
                                        />
                                        <div className="select-wrapper group">
                                            <select
                                                value={projectClientFilter}
                                                onChange={e => setProjectClientFilter(e.target.value)}
                                                aria-label={t('admin.filter_by_client')}
                                                className="custom-select select-filter"
                                            >
                                                <option value="">{t('admin.all_clients')}</option>
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>{u.name}</option>
                                                ))}
                                            </select>
                                            <svg className="select-icon !right-2.5 !w-4 !h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.004l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="select-wrapper group">
                                            <select
                                                value={projectDeveloperFilter}
                                                onChange={e => setProjectDeveloperFilter(e.target.value)}
                                                aria-label={t('admin.filter_by_developer')}
                                                className="custom-select select-filter"
                                            >
                                                <option value="">{t('admin.all_developers')}</option>
                                                <option value="unassigned">{t('admin.no_developer_assigned')}</option>
                                                {developers.map(d => (
                                                    <option key={d.id} value={d.id}>{d.name}</option>
                                                ))}
                                            </select>
                                            <svg className="select-icon !right-2.5 !w-4 !h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.004l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects
                                    .filter(project => {
                                        // Filter by name
                                        if (projectNameFilter.trim() && !project.name.toLowerCase().includes(projectNameFilter.toLowerCase())) {
                                            return false;
                                        }
                                        // Filter by client
                                        if (projectClientFilter && project.clientId !== projectClientFilter) {
                                            return false;
                                        }
                                        // Filter by developer
                                        if (projectDeveloperFilter) {
                                            if (projectDeveloperFilter === 'unassigned') {
                                                if (project.developerId) return false;
                                            } else {
                                                if (project.developerId !== projectDeveloperFilter) return false;
                                            }
                                        }
                                        return true;
                                    })
                                    .map(project => {
                                    const client = users.find(u => u.id === project.clientId);
                                    const developer = developers.find(d => d.id === project.developerId);
                                    return (
                                        <div key={project.id} className="p-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/30">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-slate-900 dark:text-white truncate pr-2">{project.name}</h4>
                                                <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                                    ${project.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                                    {project.status}
                                                </span>
                                            </div>
                                            <div className="text-sm text-slate-500 mb-1 flex items-center gap-1">
                                                <Users size={14} />
                                                {t('admin.client_label_short')} {client ? client.name : t('admin.no_users_found')}
                                            </div>
                                            <div className="text-sm text-slate-500 mb-3 flex items-center gap-1">
                                                <Code size={14} />
                                                {t('admin.developer_label_short')} {developer ? developer.name : <span className="italic text-slate-400">{t('admin.no_developer_assigned')}</span>}
                                            </div>
                                            <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700 pt-3">
                                                <span className="flex items-center gap-1"><Clock size={12}/> {t('admin.due_label')} {project.deadline}</span>
                                                <span className="flex items-center gap-1"><BarChart3 size={12}/> {project.progress}%</span>
                                            </div>
                                            <div className="mt-3 flex flex-wrap justify-end gap-2">
                                                <button title={t('admin.assign_developer')} onClick={() => openAssignDialog(project)} className="px-2 py-1 bg-orange-100 hover:bg-orange-200 rounded text-orange-700 text-xs flex items-center gap-2"><Code size={14}/> {t('admin.assign_developer')}</button>
                                                <button title={t('admin.rename')} onClick={() => openRenameProjectDialog(project)} className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 text-xs flex items-center gap-2"><Edit size={14}/> {t('admin.rename')}</button>
                                                <button title={t('admin.delete')} onClick={() => openProjectDeleteDialog(project)} className="px-2 py-1 bg-red-100 hover:bg-red-200 rounded text-red-700 text-xs flex items-center gap-2"><Trash size={14}/> {t('admin.delete')}</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* CONTENT: Developers */}
                {activeTab === 'developers' && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
                            <div className="flex items-center justify-between gap-4 mb-4">
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('admin.manage_developers')}</h3>
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <input
                                    type="search"
                                    placeholder={t('admin.filter_developers_placeholder')}
                                    value={developerFilter}
                                    onChange={e => setDeveloperFilter(e.target.value)}
                                    className="custom-input input-filter w-64"
                                />
                                <button
                                    onClick={() => setShowAddDeveloper(!showAddDeveloper)}
                                    title={showAddDeveloper ? t('common_ui.cancel') : t('admin.add_developer')}
                                    aria-label={showAddDeveloper ? t('common_ui.cancel') : t('admin.add_developer')}
                                    className="w-10 h-10 flex items-center justify-center bg-blue-600 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-300 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors"
                                >
                                    {showAddDeveloper ? <X size={18} /> : <Plus size={18} />}
                                </button>
                            </div>

                            {/* Add Developer Form */}
                            {showAddDeveloper && (
                                <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                        <input
                                            aria-label={t('admin.developer_name')}
                                            placeholder={t('admin.developer_name')}
                                            value={newDevName}
                                            onChange={e => setNewDevName(e.target.value)}
                                            className="custom-input input-compact"
                                        />
                                        <input
                                            aria-label={t('admin.developer_email')}
                                            placeholder={t('admin.developer_email')}
                                            type="email"
                                            value={newDevEmail}
                                            onChange={e => setNewDevEmail(e.target.value)}
                                            className="custom-input input-compact"
                                        />
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => { setShowAddDeveloper(false); setNewDevName(''); setNewDevEmail(''); }} className="px-3 py-1 rounded bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">{t('common_ui.cancel')}</button>
                                        <button 
                                            onClick={handleCreateDeveloper} 
                                            disabled={!newDevName.trim() || !newDevEmail.trim()}
                                            className="px-3 py-1 rounded bg-blue-600 text-white text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                                        >
                                            {t('admin.create_developer')}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Developers Table */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-center text-sm text-slate-600 dark:text-slate-400">
                                    <thead className="bg-slate-50 dark:bg-slate-800/50 text-xs uppercase font-semibold text-slate-500">
                                        <tr>
                                            <th className="px-4 py-3">{t('admin.name')}</th>
                                            <th className="px-4 py-3">{t('admin.email')}</th>
                                            <th className="px-4 py-3">{t('admin.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                                        {developers
                                            .filter(dev => {
                                                if (!developerFilter.trim()) return true;
                                                const q = developerFilter.toLowerCase();
                                                return dev.name.toLowerCase().includes(q) || dev.email.toLowerCase().includes(q);
                                            })
                                            .map(dev => (
                                            <tr key={dev.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                                <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{dev.name}</td>
                                                <td className="px-4 py-3 text-xs">{dev.email}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => openEditDeveloper(dev)}
                                                            title={t('admin.edit')}
                                                            className="p-2 rounded text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/10 dark:hover:bg-blue-900/20 dark:text-blue-400"
                                                        >
                                                            <Edit size={14} />
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteDevDialog(dev)}
                                                            title={t('admin.delete')}
                                                            className="p-2 rounded text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/10 dark:hover:bg-red-900/20 dark:text-red-400"
                                                        >
                                                            <Trash size={14} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {developers.length === 0 && (
                                            <tr>
                                                <td colSpan={3} className="px-4 py-6 text-center text-slate-500">{t('admin.no_developers_found')}</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Developer Modal */}
                {editingDeveloper && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingDeveloper(null)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('admin.edit_developer')}</h3>
                            <div className="space-y-4 mb-5">
                                <div className="select-wrapper">
                                    <input
                                        aria-label={t('admin.developer_name')}
                                        placeholder={t('admin.developer_name')}
                                        value={editDevName}
                                        onChange={e => setEditDevName(e.target.value)}
                                        className="custom-input"
                                    />
                                </div>
                                <div className="select-wrapper">
                                    <input
                                        aria-label={t('admin.developer_email')}
                                        placeholder={t('admin.developer_email')}
                                        type="email"
                                        value={editDevEmail}
                                        onChange={e => setEditDevEmail(e.target.value)}
                                        className="custom-input"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setEditingDeveloper(null)} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{t('common_ui.cancel')}</button>
                                <button onClick={handleUpdateDeveloper} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">{t('admin.update_developer')}</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Developer Confirm Dialog */}
                <ConfirmDialog
                    open={devDeleteDialogOpen}
                    title={t('admin.delete')}
                    message={pendingDevDelete ? t('confirm.delete_confirm_with_name').replace('{name}', pendingDevDelete.name) : t('confirm.delete_confirm')}
                    confirmLabel={t('common_ui.delete')}
                    cancelLabel={t('common_ui.cancel')}
                    loading={false}
                    onConfirm={confirmDeleteDeveloper}
                    onCancel={() => { setDevDeleteDialogOpen(false); setPendingDevDelete(null); }}
                />

                {/* Assign Developer Modal */}
                {assignDialogOpen && assigningProject && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAssignDialogOpen(false)} />
                        <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-700">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{t('admin.assign_developer')}</h3>
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-5">Project: "{assigningProject.name}"</p>
                            <div className="select-wrapper group mb-5">
                                <div className="select-glow rounded-xl"></div>
                                <select
                                    value={selectedDeveloperId}
                                    onChange={e => setSelectedDeveloperId(e.target.value)}
                                    aria-label={t('admin.select_developer')}
                                    className="custom-select"
                                >
                                    <option value="">{t('admin.no_developer_assigned')}</option>
                                    {developers.map(dev => (
                                        <option key={dev.id} value={dev.id}>{dev.name} ({dev.email})</option>
                                    ))}
                                </select>
                                <svg className="select-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.004l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                                <div className="select-underline"></div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button onClick={() => setAssignDialogOpen(false)} className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">{t('common_ui.cancel')}</button>
                                <button onClick={confirmAssignDeveloper} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">{t('common_ui.save')}</button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
