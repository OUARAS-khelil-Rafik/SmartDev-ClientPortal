
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MessageSquare, Check, Loader2, Video, Lock, List, AlignLeft, RefreshCw, ExternalLink, Info, Briefcase } from 'lucide-react';
import { api } from '../services/mockApi';
import { User, ViewState, Booking as BookingType, Project } from '../types';

interface BookingProps {
    user: User | null;
    setView: (view: ViewState) => void;
}

const SERVICES = [
    "AI & Machine Learning",
    "Cybersecurity",
    "Web Development",
    "Mobile Solutions",
    "Cloud Infrastructure",
    "Big Data Analysis"
];

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

  const fetchHistory = async () => {
      if (!user) return;
      setHistoryLoading(true);
      try {
          const data = await api.getBookings(user.id, 'client');
          setMyBookings(data.reverse());
      } catch (e) { console.error(e); }
      finally { setHistoryLoading(false); }
  };

  // If not logged in, show restricted access state
  if (!user) {
      return (
          <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
              <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={32} className="text-slate-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Login Required</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Please log in or create an account to schedule a consultation with our experts.
                  </p>
                  <button 
                    onClick={() => setView(ViewState.LOGIN)}
                    className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-blue-500/30 hover:scale-105 transition-all"
                  >
                      Go to Login
                  </button>
              </div>
          </div>
      );
  }

  // Prevent Admin from Booking
  if (user.role === 'admin') {
      return (
          <div className="min-h-screen pt-24 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
              <div className="text-center max-w-md">
                  <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Lock size={32} className="text-red-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Admin Access Restricted</h2>
                  <p className="text-slate-600 dark:text-slate-400 mb-8">
                      Administrators cannot book meetings. Please switch to a client account to test booking functionality.
                  </p>
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
            return occupiedSlots.some(slot => {
                    const slotISO = normalizeToISODate(slot.date);
                    return slotISO === dateISO && slot.time === time;
            });
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
        alert('Please select or create a related project before confirming the request.');
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
        alert(e.message || "Booking failed");
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
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="max-w-6xl w-full flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex justify-center">
            <div className="bg-white dark:bg-slate-900 p-1 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 flex">
                <button 
                    onClick={() => setActiveTab('new')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'new' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    New Reservation
                </button>
                <button 
                    onClick={() => setActiveTab('history')}
                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                >
                    My Requests
                </button>
            </div>
        </div>

        {activeTab === 'new' ? (
             success ? (
                <div className="w-full bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-8 text-center border border-slate-200 dark:border-slate-800 animate-fadeIn max-w-2xl mx-auto">
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Check size={32} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Request Sent!</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-sm">
                        We have received your request for <b>{formatDateDisplay(selectedDate)} at {selectedTime ? formatTimeDisplay(selectedTime) : ''}</b>.
                    </p>
                    
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl text-left mb-6 border border-blue-100 dark:border-blue-800">
                        <div className="flex items-start gap-3">
                            <Video className="text-blue-500 mt-1" size={20} />
                            <div>
                                <p className="font-bold text-slate-800 dark:text-white text-sm">Google Meet Integration</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    Once an admin approves your request, a functional Google Meet link will be generated and sent to <b>{user.email}</b>.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 justify-center">
                         <button 
                            onClick={resetForm}
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold py-3 px-8 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Book Another
                        </button>
                        <button 
                            onClick={() => setActiveTab('history')}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 px-8 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                            View My Requests
                        </button>
                    </div>
                </div>
             ) : (
                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row border border-slate-200 dark:border-slate-800 animate-fadeIn">
                {/* Left Side: Info */}
                <div className="lg:w-1/3 bg-slate-900 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none"></div>
                    <div>
                        <h2 className="text-3xl font-bold mb-4">Schedule a Consultation</h2>
                        <p className="text-slate-300 mb-8">
                            Select one or more services you are interested in. We'll verify the availability in our agenda and secure your slot.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Live Availability</p>
                                    <p className="text-xs text-slate-400">Real-time slot checking</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400">
                                    <Video size={20} />
                                </div>
                                <div>
                                    <p className="font-semibold">Google Meet</p>
                                    <p className="text-xs text-slate-400">Unique link per booking</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-6 border-t border-slate-800">
                        <p className="text-sm font-semibold text-slate-200">Logged in as:</p>
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
                            <CalendarIcon size={18} className="text-blue-500"/> Select Date
                        </h3>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            <input
                                type="date"
                                value={selectedDate || ''}
                                aria-label="Select date"
                                min={new Date().toISOString().slice(0,10)}
                                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().slice(0,10)}
                                onChange={(e) => { setSelectedDate(e.target.value); setSelectedTime(null); }}
                                className="py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                            <div className="text-xs text-slate-500">
                                {selectedDate ? (
                                    <>
                                        Agenda for <b>{new Date(selectedDate).toLocaleDateString()}</b>
                                    </>
                                ) : (
                                    'Pick a date to view agenda and available hours.'
                                )}
                            </div>
                        </div>
                        {/* Show agenda (occupied slots) for selected date */}
                        {selectedDate && (
                            <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
                                <div className="font-semibold mb-2">Occupied Slots</div>
                                <div className="flex flex-wrap gap-2">
                                    {occupiedSlots.filter(s => normalizeToISODate(s.date) === selectedDate).length === 0 ? (
                                        <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700">No bookings</span>
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
                                <Clock size={18} className="text-blue-500"/> Select Time
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
                            <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                                <div className="w-3 h-3 bg-slate-100 dark:bg-slate-800 border border-slate-300 rounded"></div>
                                <span>Occupied Slot</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        
                         {/* Project Selection (NEW) */}
                                 <div>
                                     <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 ml-1">Related Project (Rejected or newly created projects — not approved)</label>
                            <div className="relative">
                                <Briefcase className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <select
                                    aria-label="Related project"
                                    title="Related project"
                                    value={selectedProjectId}
                                    onChange={(e) => setSelectedProjectId(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white appearance-none cursor-pointer"
                                >
                                    <option value="">-- Select Related Project --</option>
                                    {userProjects.map(p => {
                                        const st = (p.status || '').toLowerCase();
                                        const enabled = st === 'rejected' || st === 'planning';
                                        return (
                                            <option key={p.id} value={p.id} disabled={!enabled}>
                                                {p.name} ({p.status}){!enabled ? ' — not eligible' : ''}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>

                        {/* Project creation moved to My Projects page (inline creation removed) */}

                         {/* Multi-Select Topics */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-2 ml-1">Services / Functionalities</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {SERVICES.map(s => (
                                    <button
                                        key={s}
                                        onClick={() => toggleTopic(s)}
                                        className={`flex items-center gap-3 p-3 rounded-xl border text-sm font-medium transition-all text-left ${
                                            selectedTopics.includes(s)
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-400'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded border flex items-center justify-center ${selectedTopics.includes(s) ? 'bg-blue-500 border-blue-500' : 'border-slate-400'}`}>
                                            {selectedTopics.includes(s) && <Check size={14} className="text-white" />}
                                        </div>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Description Textarea */}
                        <div>
                            <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">Project Description</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 text-slate-400" size={18} />
                                <textarea 
                                    placeholder="Describe your project goals, specific features, or questions..." 
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
                            {loading ? 'Processing...' : 'Confirm Request'}
                        </button>
                    </div>
                </div>
            </div>
             )
        ) : (
            // History Tab
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 sm:p-8 animate-fadeIn">
                 <div className="flex justify-between items-center mb-6">
                     <h2 className="text-2xl font-bold text-slate-900 dark:text-white">My Requests</h2>
                            <button onClick={fetchHistory} disabled={historyLoading} aria-label="Refresh bookings" title="Refresh" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                         <RefreshCw size={20} className={`text-slate-500 ${historyLoading ? 'animate-spin' : ''}`} />
                     </button>
                 </div>

                 {myBookings.length === 0 ? (
                     <div className="text-center py-12 text-slate-500">
                         <CalendarIcon size={48} className="mx-auto mb-4 opacity-20" />
                         <p>No booking history found.</p>
                     </div>
                 ) : (
                     <div className="space-y-4">
                         {myBookings.map(booking => (
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
                                             <Video size={16} /> Join Meet
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
    </div>
  );
};

export default Booking;
