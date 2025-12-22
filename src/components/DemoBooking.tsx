
import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Check, Loader2, Video, User, Mail, Building, Phone, MessageSquare, Sparkles, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { api } from '../services/mockApi';
import { ViewState } from '../types';
import { useI18n } from '../i18n';

interface DemoBookingProps {
  setView: (view: ViewState) => void;
}

const DemoBooking: React.FC<DemoBookingProps> = ({ setView }) => {
  const { t } = useI18n();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [occupiedSlots, setOccupiedSlots] = useState<{date: string, time: string}[]>([]);

  // Load occupied slots on mount
  useEffect(() => {
    api.getOccupiedSlots().then(setOccupiedSlots);
  }, []);

  // Time slots: every hour from 08:00 to 18:00
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = 8 + i;
    return `${hour.toString().padStart(2, '0')}:00`;
  });

  const normalizeToISODate = (input: string) => {
    try {
      const d = new Date(input);
      if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    } catch (e) {}
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
      return `${dd}/${mm}/${yy}`;
    } catch (e) { return iso; }
  };

  const isFormValid = () => {
    return name.trim() !== '' && 
           email.trim() !== '' && 
           email.includes('@') &&
           selectedDate && 
           selectedTime && 
           message.trim() !== '';
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    setLoading(true);
    try {
      await api.createDemoBooking({
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        phone: phone.trim() || undefined,
        date: selectedDate!,
        time: selectedTime!,
        message: message.trim()
      });
      setSuccess(true);
      // Refresh availability
      api.getOccupiedSlots().then(setOccupiedSlots);
    } catch (e: any) {
      alert(e?.message || t('demo_booking.processing'));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setName('');
    setEmail('');
    setCompany('');
    setPhone('');
    setSelectedDate(null);
    setSelectedTime(null);
    setMessage('');
    api.getOccupiedSlots().then(setOccupiedSlots);
  };

  // Success state
  if (success) {
    return (
      <div className="min-h-screen pt-8 md:pt-6 pb-20 bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center">
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={48} className="text-emerald-500" />
            </div>
            <h2 data-gsap-split="words" className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
              {t('demo_booking.success_title')}
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 mb-2">
              {t('demo_booking.success_message')} <span className="font-semibold">{formatDateDisplay(selectedDate)}</span> at <span className="font-semibold">{selectedTime && formatTimeDisplay(selectedTime)}</span>.
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {t('demo_booking.success_email_note')} <span className="font-semibold text-blue-600 dark:text-blue-400">{email}</span>.
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-8 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center justify-center gap-2 text-blue-700 dark:text-blue-300">
                <Video size={20} />
                <span className="font-medium">{t('demo_booking.contact_soon')}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetForm}
                className="px-6 py-3 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 transition-all hover:scale-105"
              >
                {t('demo_booking.book_another')}
              </button>
              <button
                onClick={() => setView(ViewState.HOME)}
                className="px-6 py-3 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all hover:scale-105"
              >
                {t('demo_booking.back_home')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-8 md:pt-6 pb-20 bg-slate-50 dark:bg-slate-950 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-4 border border-blue-100 dark:border-blue-800">
            <Sparkles size={16} />
            <span>{t('demo_booking.no_login_required')}</span>
            <span className="mx-2">•</span>
            <span>{t('demo_booking.free_consultation')}</span>
          </div>
          <h1 data-gsap-split="words" className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t('demo_booking.title')}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            {t('demo_booking.subtitle')}
          </p>
        </div>

        {/* Back button */}
        <button
          onClick={() => setView(ViewState.HOME)}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>{t('demo_booking.back_home')}</span>
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Contact Info */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <User size={24} className="text-blue-500" />
              Your Information
            </h2>
            
            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('demo_booking.name_label')} *
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t('demo_booking.name_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('demo_booking.email_label')} *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('demo_booking.email_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('demo_booking.company_label')}
                </label>
                <div className="relative">
                  <Building size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder={t('demo_booking.company_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('demo_booking.phone_label')}
                </label>
                <div className="relative">
                  <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t('demo_booking.phone_placeholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                  {t('demo_booking.message_label')} *
                </label>
                <div className="relative">
                  <MessageSquare size={18} className="absolute left-3 top-3 text-slate-400" />
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t('demo_booking.message_placeholder')}
                    rows={4}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Date & Time */}
          <div className="space-y-6">
            {/* Date Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <label htmlFor="demo-date-picker" className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <CalendarIcon size={24} className="text-blue-500" />
                {t('demo_booking.select_date')} *
              </label>
              <input
                id="demo-date-picker"
                type="date"
                value={selectedDate || ''}
                min={new Date().toISOString().slice(0, 10)}
                title={t('demo_booking.select_date')}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setSelectedTime(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all mt-4"
              />
            </div>

            {/* Time Selection */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Clock size={24} className="text-blue-500" />
                {t('demo_booking.select_time')} *
              </h2>
              {selectedDate ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {timeSlots.map((time) => {
                    const occupied = isSlotOccupied(selectedDate, time);
                    return (
                      <button
                        key={time}
                        onClick={() => !occupied && setSelectedTime(time)}
                        disabled={occupied}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          selectedTime === time
                            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                            : occupied
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed line-through'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {formatTimeDisplay(time)}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-slate-500 dark:text-slate-400 text-center py-8">
                  Please select a date first
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                isFormValid() && !loading
                  ? 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/25 hover:-translate-y-1'
                  : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  {t('demo_booking.processing')}
                </>
              ) : (
                <>
                  <Check size={20} />
                  {t('demo_booking.confirm_demo')}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoBooking;
