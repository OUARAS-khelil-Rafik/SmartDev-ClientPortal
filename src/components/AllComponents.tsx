import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import Services from './Services';
import Dashboard from './Dashboard';
import Booking from './Booking';
import AIConsultant from './AIConsultant';
import FloatingCopilot from './FloatingCopilot';
import Auth from './Auth';
import AdminDashboard from './AdminDashboard';
import { useI18n } from '../i18n';

const AllComponents: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="space-y-12 p-6">
      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.navbar')}</h2>
        <div className="border p-4"><Navbar currentView={null as any} setView={() => {}} isDark={false} toggleTheme={() => {}} user={null as any} onLogout={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.hero')}</h2>
        <div className="border p-4"><Hero setView={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.services')}</h2>
        <div className="border p-4"><Services /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.dashboard')}</h2>
        <div className="border p-4"><Dashboard user={null as any} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.booking')}</h2>
        <div className="border p-4"><Booking user={null as any} setView={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.ai_consultant')}</h2>
        <div className="border p-4"><AIConsultant /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.auth')}</h2>
        <div className="border p-4"><Auth onLogin={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.admin_dashboard')}</h2>
        <div className="border p-4"><AdminDashboard /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">{t('all_components.floating_copilot')}</h2>
        <div className="border p-4"><FloatingCopilot /></div>
      </section>

    </div>
  );
};

export default AllComponents;
