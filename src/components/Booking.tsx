import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MessageSquare, Check, Loader2, Video, Lock, List, AlignLeft, RefreshCw, ExternalLink, Info, Briefcase } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import { api } from '../services/mockApi';
import { User, ViewState, Booking as BookingType, Project } from '../types';
import { useI18n } from '../i18n';

interface BookingProps {
    user: User | null;
    setView: (view: ViewState) => void;
}
const Booking: React.FC<BookingProps> = ({ user, setView }) => {
  const [activeTab, setActiveTab] = useState<'new' | 'history'>('new');
    // selectedDate stored as ISO date string (yyyy-mm-dd)
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string>(''); // For linking project
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Data State
    const [occupiedSlots, setOccupiedSlots] = useState<{date: string, time: string}[]>([]);
    const [userProjects, setUserProjects] = useState<Project[]>([]);
    const [myBookings, setMyBookings] = useState<BookingType[]>([]);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [clearDialogOpen, setClearDialogOpen] = useState(false);
    const [clearIncludeFinished, setClearIncludeFinished] = useState(false);
    // Project creation/deletion moved to MyProjects page; remove inline creation state

  useEffect(() => {
      // Load availability and User Projects when component mounts or tab changes to 'new'
      if (user && activeTab === 'new') {
          api.getOccupiedSlots().then(setOccupiedSlots);
          // Fetch user's projects so they can select one
          api.getProjects(user.id, 'client').then(setUserProjects);
      }
      // Load history
      if (user && activeTab === 'history') {
          fetchHistory();
      }
  }, [user, activeTab]);

    // Listen for project updates so Booking can refresh its project list when MyProjects changes projects
    useEffect(() => {
        const onProjectsUpdated = () => {
            if (!user) return;
            api.getProjects(user.id, 'client').then(setUserProjects).catch(() => {});
        };
        window.addEventListener('projects-updated', onProjectsUpdated as EventListener);
        return () => window.removeEventListener('projects-updated', onProjectsUpdated as EventListener);
    }, [user]);

  const fetchHistory = async () => {
      if (!user) return;
      setHistoryLoading(true);
      try {
          const data = await api.getBookings(user.id, 'client');
          setMyBookings(data.reverse());
      } catch (e) { console.error(e); }
      finally { setHistoryLoading(false); }
  };

    const { t } = useI18n();

    // Build services list from translations (keep IDs consistent with `services.items` keys)
    const serviceIds = ['ai', 'sec', 'web', 'mob', 'cloud', 'data'];
    const SERVICES = serviceIds.map(id => ({ id, title: t(`services.items.${id}.title`) }));

  // If not logged in, show restricted access state
  if (!user) {
      return (
          <div className="min-h-screen pt-28 md:pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
              <div className="text-center max-w-md">
                                        <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Lock size={32} className="text-slate-500" />
                                        </div>
                                    <h2 data-gsap-split="words" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('booking.login_required')}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">{t('booking.please_log_in')}</p>
                  <button 
                    onClick={() => setView(ViewState.LOGIN)}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all"
                  >
                      {t('booking.go_to_login')}
                  </button>
              </div>
          </div>
      );
  }

  // Prevent Admin from Booking
  if (user.role === 'admin') {
      return (
          <div className="min-h-screen pt-28 md:pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
              <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={32} className="text-red-500" />
                  </div>
                  <h2 data-gsap-split="words" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('booking.admin_restricted')}</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">{t('booking.admin_restricted_msg')}</p>
              </div>
          </div>
      );
  }

    // Time slots: every hour from 08:00 to 18:00
    const timeSlots = Array.from({ length: 11 }, (_, i) => {
        const hour = 8 + i;
        return `${hour.toString().padStart(2, '0')}:00`;
    });

    const normalizeToISODate = (input: string) => {
        try {
            // Try parsing common formats
            const d = new Date(input);
            if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
        } catch (e) {}
        // Fallback: return input if it already looks like ISO
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
        return input;
    };

    const isSlotOccupied = (dateISO: string | null, time: string) => {
            if (!dateISO) return false;
            // Check if slot is already booked
            const isBooked = occupiedSlots.some(slot => {
                    const slotISO = normalizeToISODate(slot.date);
                    return slotISO === dateISO && slot.time === time;
            });
            if (isBooked) return true;
            
            // Check if slot is in the past (for today's date)
            const today = new Date().toISOString().slice(0, 10);
            if (dateISO === today) {
                const now = new Date();
                const [hours] = time.split(':').map(Number);
                // Block slots that are less than 1 hour from now
                if (hours <= now.getHours()) return true;
            }
            return false;
    };

    const formatTimeDisplay = (hhmm24: string) => {
        const [hh, mm] = hhmm24.split(':').map(Number);
        const period = hh >= 12 ? 'PM' : 'AM';
        const hh12 = ((hh + 11) % 12) + 1;
        return `${hh12.toString().padStart(2, '0')}:${mm.toString().padStart(2, '0')} ${period}`;
    };

    const formatDateDisplay = (iso: string | null) => {
        if (!iso) return '';
        try {
            const d = new Date(iso);
            const dd = d.getDate().toString().padStart(2, '0');
            const mm = (d.getMonth() + 1).toString().padStart(2, '0');
            const yy = d.getFullYear().toString().slice(-2);
            return `${dd}/${mm}/${yy}`; // dd/mm/yy
        } catch (e) { return iso; }
    };

  const toggleTopic = (topic: string) => {
      setSelectedTopics(prev => 
        prev.includes(topic) 
        ? prev.filter(t => t !== topic) 
        : [...prev, topic]
      );
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || selectedTopics.length === 0 || !description) return;
    if (!selectedProjectId) {
        alert(t('booking.select_project_required'));
        return;
    }

    setLoading(true);
    try {
        // Store date as ISO (yyyy-mm-dd) to ease comparisons
        await api.createBooking({ 
            userId: user.id,
            name: user.name, 
            email: user.email, 
            date: selectedDate, 
            time: selectedTime,
            topic: selectedTopics,
            description: description,
            projectId: selectedProjectId || undefined
        });
        setSuccess(true);
        // Refresh availability
        api.getOccupiedSlots().then(setOccupiedSlots);
    } catch (e: any) {
        alert((e as any)?.message || t('booking.booking_failed'));
    } finally {
        setLoading(false);
    }
  };

  const resetForm = () => {
      setSuccess(false);
      setSelectedDate(null);
      setSelectedTime(null);
      setDescription('');
      setSelectedTopics([]);
      setSelectedProjectId('');
      // Refresh availability
      api.getOccupiedSlots().then(setOccupiedSlots);
  };

    return (
        <div className="min-h-screen pt-28 md:pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center animate-fade-in-down">
            <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex">
                <button 
                    onClick={() => setActiveTab('new')}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${activeTab === 'new' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    {t('booking.new_reservation')}
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all duration-300 hover:scale-105 ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    {t('booking.my_requests')}
                </button>
            </div>
        </div>

        {activeTab === 'new' ? (
             success ? (
                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-800 animate-scale-in-bounce max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-subtle">
                        <Check size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 data-gsap-split="words" className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('common.request_sent')}</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                        {t('booking.request_received_prefix')}<b>{formatDateDisplay(selectedDate)}{selectedTime ? ` ${t('booking.select_time').toLowerCase()} ${formatTimeDisplay(selectedTime)}` : ''}</b>{t('booking.google_meet_msg_suffix')}
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-left mb-6 border border-blue-100 dark:border-blue-800 hover:shadow-lg transition-shadow">
                        <div className="flex items-start gap-3">
                            <Video className="text-blue-500 mt-1 animate-pulse" size={20} />
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">{t('booking.google_meet_integration')}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {t('booking.google_meet_msg_prefix')}<b>{user.email}</b>{t('booking.google_meet_msg_suffix')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Inline project rename removed from Booking component */}

                    <div className="flex gap-4 justify-center">
                        <button 
                            onClick={resetForm}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            {t('booking.book_another')}
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            {t('booking.view_my_requests')}
                        </button>
                    </div>
                </div>
             ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800 animate-fadeIn">
                {/* Left Side: Info */}
                <div className="lg:w-1/3 bg-slate-900 text-white p-6 sm:p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none"></div>
                    <div>
                                <h2 data-gsap-split="words" className="text-2xl sm:text-3xl font-bold mb-4">{t('booking.schedule_consultation')}</h2>
                        <p className="text-slate-300 mb-8">
                            {t('booking.select_services_hint')}
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">{t('booking.live_availability')}</p>
                                    <p className="text-xs text-slate-400">{t('booking.real_time_checking')}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Video size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">{t('booking.google_meet_integration')}</p>
                                    <p className="text-xs text-slate-400">{t('booking.unique_link_text')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-800">
                        <p className="text-sm font-semibold text-slate-200">{t('booking.logged_in_as')}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-xs">
                                    {user.name.charAt(0)}
                                </div>
                            )}
                            <div>
                                <p className="text-sm">{user.name}</p>
                                <p className="text-xs text-slate-400">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="lg:w-2/3 p-6 sm:p-8 lg:p-12">
                    {/* Date Selection (full date picker) */}
                    <div className="mb-8">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <CalendarIcon size={18} className="text-blue-500"/> {t('booking.select_date')}
                        </h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <input
                                type="date"
                                value={selectedDate || ''}
                                aria-label={t('booking.select_date')}
                                min={new Date().toISOString().slice(0,10)}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0,10)}
                                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                                <div className="text-xs text-slate-500">
                                {selectedDate ? (
                                    <>
                                        {t('booking.agenda_for')} <b>{new Date(selectedDate).toLocaleDateString()}</b>
                                    </>
                                ) : (
                                    t('booking.pick_date_hint')
                                )}
                            </div>
                        </div>
                        {/* Show agenda (occupied slots) for selected date */}
                        {selectedDate && (
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="font-semibold mb-2">{t('booking.occupied_slots')}</div>
                                <div className="flex flex-wrap gap-2">
                                    {occupiedSlots.filter(s => normalizeToISODate(s.date) === selectedDate).length === 0 ? (
                                        <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700">{t('booking.no_bookings')}</span>
                                    ) : (
                                        occupiedSlots.filter(s => normalizeToISODate(s.date) === selectedDate).map((s, i) => (
                                            <span key={i} className="px-3 py-1 rounded-full bg-red-50 dark:bg-red-900/20 text-red-700">{formatTimeDisplay(s.time)}</span>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Time Selection */}
                    {selectedDate && (
                        <div className="mb-8 animate-fadeIn">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Clock size={18} className="text-blue-500"/> {t('booking.select_time')}
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {timeSlots.map((time) => {
                                    const occupied = isSlotOccupied(selectedDate, time);
                                    return (
                                        <button
                                            key={time}
                                            onClick={() => !occupied && setSelectedTime(time)}
                                            disabled={occupied}
                                            className={`py-2 px-2 sm:px-4 rounded-lg text-xs sm:text-sm font-medium border transition-all ${
                                                occupied 
                                                ? 'bg-slate-100 dark:bg-slate-800/50 border-transparent text-slate-400 cursor-not-allowed decoration-slate-400 line-through'
                                                : selectedTime === time
                                                    ? 'bg-blue-100 dark:bg-blue-900/40 border-blue-500 text-blue-700 dark:text-blue-300'
                                                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-400 text-slate-600 dark:text-slate-300'
                                            }`}
                                        >
                                            {formatTimeDisplay(time)}
                                        </button>
                                    )
                                })}
                            </div>
                            {/* Occupied Slot legend removed as requested */}
                        </div>
                    )}

                    <div className="space-y-6">
                        
                         {/* Project Selection (NEW) */}
                                 <div>
                                     <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5 ml-1">{t('booking.related_project_label')}</label>
                            <div className="select-wrapper group">
                                <div className="select-glow rounded-xl"></div>
                                <Briefcase className="select-left-icon transition-colors group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400" size={18} />
                                <select
                                    aria-label={t('booking.related_project_label')}
                                    title={t('booking.related_project_label')}
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="custom-select select-lg with-icon"
                                >
                                    <option value="">{t('booking.select_project_placeholder')}</option>
                                    {userProjects.map(p => {
                                        const st = (p.status || '').toLowerCase();
                                        const enabled = st === 'rejected' || st === 'planning';
                                        return (
                                            <option key={p.id} value={p.id} disabled={!enabled}>
                                                {p.name} ({p.status}){!enabled ? t('booking.not_eligible_suffix') : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                                <svg className="select-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.12 1.004l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                                </svg>
                                <div className="select-underline"></div>
                            </div>
                        </div>

                        {/* Project creation moved to My Projects page (inline creation removed) */}

                         {/* Multi-Select Topics */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 ml-1">{t('booking.services_label')}</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SERVICES.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => toggleTopic(s.title)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                                            selectedTopics.includes(s.title)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedTopics.includes(s.title) ? 'bg-blue-500 border-blue-500' : 'border-slate-400'}`}>
                                            {selectedTopics.includes(s.title) && <Check size={14} className="text-white" />}
                                        </div>
                                        {s.title}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">{t('booking.description_label')}</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <textarea 
                                    placeholder={t('booking.description_placeholder')} 
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    rows={3}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white resize-none" 
                                />
                            </div>
                        </div>
                        
                        <button 
                            onClick={handleSubmit}
                            disabled={!selectedTime || !description || selectedTopics.length === 0 || !selectedProjectId || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-xl hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
                        >
                            {loading && <Loader2 size={20} className="animate-spin" />}
                            {loading ? t('booking.processing') : t('booking.confirm_request')}
                        </button>
                    </div>
                </div>
            </div>
             )
        ) : (
            // History Tab
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-fadeIn">
                 <div className="flex items-center justify-between gap-4 mb-6 overflow-x-auto pb-2">
                         <div className="flex items-center gap-3 flex-shrink-0">
                             <h2 data-gsap-split="words" className="text-2xl font-bold text-slate-900 dark:text-white whitespace-nowrap">{t('booking.my_requests')}</h2>
                         </div>
                         <div className="flex items-center gap-3 flex-shrink-0">
                             <input
                                 type="search"
                                 placeholder={t('admin.filter_requests_placeholder')}
                                 value={filterText}
                                 onChange={(e) => setFilterText(e.target.value)}
                                 className="custom-input input-filter w-40"
                             />
                             <button onClick={fetchHistory} disabled={historyLoading} aria-label={t('booking.refresh_bookings')} title={t('booking.refresh')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors flex-shrink-0">
                                 <RefreshCw size={20} className={`text-slate-500 ${historyLoading ? 'animate-spin' : ''}`} />
                             </button>
                             <button
                                 onClick={() => { setClearIncludeFinished(false); setClearDialogOpen(true); }}
                                 className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-md text-sm whitespace-nowrap flex-shrink-0"
                             >
                                 {t('booking.clear_history')}
                             </button>
                         </div>
                 </div>

                 {myBookings.length === 0 ? (
                     <div className="text-center py-12 text-slate-500">
                         <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                         <p>{t('booking.no_booking_history')}</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {myBookings
                            .filter(b => {
                                if (!filterText.trim()) return true;
                                const q = filterText.toLowerCase();
                                const inTopic = b.topic.join(' ').toLowerCase().includes(q);
                                return [b.userName, b.userEmail, b.date, b.time, b.description].some(s => (s || '').toLowerCase().includes(q)) || inTopic;
                            })
                            .map(booking => (
                             <div key={booking.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                     <div>
                                         <div className="flex flex-wrap items-center gap-2 mb-2">
                                             <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase
                                                ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                                                  booking.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                                                  'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                                 {booking.status}
                                             </span>
                                             {booking.topic.map(t => (
                                                 <span key={t} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded border border-slate-200 dark:border-slate-700">{t}</span>
                                             ))}
                                         </div>
                                         <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-2">{booking.description}</p>
                                         <div className="flex items-center gap-4 text-xs text-slate-500">
                                             <span className="flex items-center gap-1"><CalendarIcon size={12}/> {booking.date}</span>
                                             <span className="flex items-center gap-1"><Clock size={12}/> {booking.time}</span>
                                         </div>
                                     </div>
                                     
                                     {booking.status === 'confirmed' && booking.meetLink && (
                                         <a 
                                            href={booking.meetLink} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
                                         >
                                             <Video size={16} /> {t('booking.join_meet')}
                                         </a>
                                     )}
                                 </div>
                             </div>
                         ))}
                     </div>
                 )}
            </div>
        )}
        </div>

        <ConfirmDialog
            open={clearDialogOpen}
            title={t('admin.clear_booking_history_title')}
            message={t('admin.clear_booking_history_message')}
            confirmLabel={t('admin.clear_confirm')}
            cancelLabel={t('common_ui.cancel')}
            loading={historyLoading}
            onConfirm={async () => {
                setHistoryLoading(true);
                try {
                    await api.clearBookingHistory(user.id, { id: user.id, role: 'client' }, { includeFinished: clearIncludeFinished });
                    await fetchHistory();
                } catch (e) { console.error(e); alert((e as any)?.message || t('admin.clear_failed')) }
                finally { setHistoryLoading(false); setClearDialogOpen(false); }
            }}
            onCancel={() => setClearDialogOpen(false)}
        >
            <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={clearIncludeFinished} onChange={e => setClearIncludeFinished(e.target.checked)} />
                <span className="text-xs text-slate-500">{t('admin.include_finished')}</span>
            </label>
        </ConfirmDialog>
        </div>
    );
};

export default Booking;
