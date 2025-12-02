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

const AllComponents: React.FC = () => {
  return (
    <div className="space-y-12 p-6">
      <section>
        <h2 className="text-xl font-bold mb-4">Navbar</h2>
        <div className="border p-4"><Navbar currentView={null as any} setView={() => {}} isDark={false} toggleTheme={() => {}} user={null as any} onLogout={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Hero</h2>
        <div className="border p-4"><Hero setView={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Services</h2>
        <div className="border p-4"><Services /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Dashboard</h2>
        <div className="border p-4"><Dashboard user={null as any} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Booking</h2>
        <div className="border p-4"><Booking user={null as any} setView={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">AIConsultant</h2>
        <div className="border p-4"><AIConsultant /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">Auth</h2>
        <div className="border p-4"><Auth onLogin={() => {}} /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">AdminDashboard</h2>
        <div className="border p-4"><AdminDashboard /></div>
      </section>

      <section>
        <h2 className="text-xl font-bold mb-4">FloatingCopilot</h2>
        <div className="border p-4"><FloatingCopilot /></div>
      </section>

    </div>
  );
};

export default AllComponents;
