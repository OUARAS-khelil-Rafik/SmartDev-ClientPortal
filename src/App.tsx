import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import AppsShowcase from './components/AppsShowcase';
import FloatingCopilot from './components/FloatingCopilot';
import { I18nProvider } from './i18n';
import { ViewState, User } from './types';
import CustomCursor from './components/CustomCursor';

const Dashboard = React.lazy(() => import('./components/Dashboard'));
const Booking = React.lazy(() => import('./components/Booking'));
const DemoBooking = React.lazy(() => import('./components/DemoBooking'));
const AIConsultant = React.lazy(() => import('./components/AIConsultant'));
const Auth = React.lazy(() => import('./components/Auth'));
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'));
const AllComponents = React.lazy(() => import('./components/AllComponents'));
const AllNotifications = React.lazy(() => import('./components/AllNotifications'));

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
            <AppsShowcase />
          </>
        );
      case ViewState.SERVICES:
        return <Services />;
      
      // Protected Routes
      case ViewState.DASHBOARD:
        if (!user) {
          return (
            <Suspense fallback={null}>
              <Auth onLogin={handleLogin} />
            </Suspense>
          );
        }
        return (
          <Suspense fallback={null}>
            <Dashboard user={user} />
          </Suspense>
        );
      
      case ViewState.ADMIN_DASHBOARD:
        if (!user || user.role !== 'admin') {
          return (
            <Suspense fallback={null}>
              <Auth onLogin={handleLogin} />
            </Suspense>
          );
        }
        return (
          <Suspense fallback={null}>
            <AdminDashboard />
          </Suspense>
        );
        
      case ViewState.BOOKING:
        // Booking handles its own auth check internally for the UI, but we pass user
        return (
          <Suspense fallback={null}>
            <Booking user={user} setView={setView} />
          </Suspense>
        );

      case ViewState.DEMO_BOOKING:
        // Demo booking for new users - no login required
        return (
          <Suspense fallback={null}>
            <DemoBooking setView={setView} />
          </Suspense>
        );
        
      case ViewState.AI_CONSULT:
        return (
          <Suspense fallback={null}>
            <AIConsultant />
          </Suspense>
        );

      case ViewState.ALL_COMPONENTS:
        return (
          <Suspense fallback={null}>
            <AllComponents />
          </Suspense>
        );
      case ViewState.ALL_NOTIFICATIONS:
        if (!user) {
          return (
            <Suspense fallback={null}>
              <Auth onLogin={handleLogin} />
            </Suspense>
          );
        }
        return (
          <Suspense fallback={null}>
            <AllNotifications user={user} />
          </Suspense>
        );
        
      case ViewState.LOGIN:
        return (
          <Suspense fallback={null}>
            <Auth onLogin={handleLogin} />
          </Suspense>
        );
        
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
      <div id="app-top" />
      
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 8, scale: 0.995 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.995 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className="animate-fadeIn"
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>

      <FloatingCopilot />

      <CustomCursor />

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 text-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 text-left">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white mb-4">NOVALIS AI</h4>
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
              <p>hello@novalis-ai.dev</p>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-800 pt-8">
            © {new Date().getFullYear()} NOVALIS AI Development. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
    </I18nProvider>
  );
};

export default App;
