import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Dashboard from './components/Dashboard';
import Booking from './components/Booking';
import AIConsultant from './components/AIConsultant';
import FloatingCopilot from './components/FloatingCopilot';
import Auth from './components/Auth';
import AdminDashboard from './components/AdminDashboard';
import AllComponents from './components/AllComponents';
import AllNotifications from './components/AllNotifications';
import { I18nProvider } from './i18n';
import { ViewState, User } from './types';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  const [currentView, setView] = useState<ViewState>(ViewState.HOME);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  // Theme Toggling Logic
  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDark(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (!isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleLogin = (loggedInUser: User) => {
      setUser(loggedInUser);
      if (loggedInUser.role === 'admin') {
          setView(ViewState.ADMIN_DASHBOARD);
      } else if (loggedInUser.role === 'developer') {
          setView(ViewState.DASHBOARD);
      } else {
          setView(ViewState.DASHBOARD);
      }
  };

  const handleLogout = () => {
      setUser(null);
      setView(ViewState.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case ViewState.HOME:
        return (
          <>
            <Hero setView={setView} />
            <Services />
            <div className="py-20 bg-slate-900 text-center px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to Disrupt the Market?</h2>
              <button 
                onClick={() => setView(ViewState.BOOKING)}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
              >
                Schedule Free Consultation
              </button>
            </div>
          </>
        );
      case ViewState.SERVICES:
        return <Services />;
      
      // Protected Routes
      case ViewState.DASHBOARD:
        if (!user) return <Auth onLogin={handleLogin} />;
        return <Dashboard user={user} />;
      
      case ViewState.ADMIN_DASHBOARD:
        if (!user || user.role !== 'admin') return <Auth onLogin={handleLogin} />;
        return <AdminDashboard />;
        
      case ViewState.BOOKING:
        // Booking handles its own auth check internally for the UI, but we pass user
        return <Booking user={user} setView={setView} />;
        
      case ViewState.AI_CONSULT:
        return <AIConsultant />;

      case ViewState.ALL_COMPONENTS:
        return <AllComponents />;
      case ViewState.ALL_NOTIFICATIONS:
        if (!user) return <Auth onLogin={handleLogin} />;
        return <AllNotifications user={user} />;
        
      case ViewState.LOGIN:
        return <Auth onLogin={handleLogin} />;
        
      default:
        return <Hero setView={setView} />;
    }
  };

  return (
    <I18nProvider>
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
      <Navbar 
        currentView={currentView} 
        setView={setView} 
        isDark={isDark} 
        toggleTheme={toggleTheme} 
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="flex-grow animate-fadeIn">
        {renderView()}
      </main>

      <FloatingCopilot />

      <CustomCursor />

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Nexus</h4>
              <p>Engineering the future with code.</p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Links</h4>
              <ul className="space-y-2">
                <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setView(ViewState.HOME)}>Home</li>
                <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setView(ViewState.SERVICES)}>Services</li>
                <li className="hover:text-blue-500 cursor-pointer transition-colors" onClick={() => setView(ViewState.AI_CONSULT)}>AI Architect</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">Contact</h4>
              <p>hello@nexus.dev</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            © {new Date().getFullYear()} Nexus Development. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </I18nProvider>
  );
};

export default App;
