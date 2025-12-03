
import React from 'react';
import { ViewState, User } from '../types';
import { Sun, Moon, Hexagon, LayoutDashboard, Calendar, Sparkles, Monitor, LogOut, User as UserIcon, Shield } from 'lucide-react';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isDark, toggleTheme, user, onLogout }) => {
  const navItems = [
    { id: ViewState.HOME, label: 'Home', icon: <Hexagon size={18} /> },
    { id: ViewState.SERVICES, label: 'Services', icon: <Monitor size={18} /> },
    { id: ViewState.AI_CONSULT, label: 'AI Architect', icon: <Sparkles size={18} /> },
  ];

  // Add specific items based on role
  if (user) {
      if (user.role === 'admin') {
          navItems.push({ id: ViewState.ADMIN_DASHBOARD, label: 'Admin Panel', icon: <Shield size={18} /> });
          // Admins do not book meetings, so we skip adding the Booking link
      } else {
          navItems.push({ id: ViewState.DASHBOARD, label: 'My Projects', icon: <LayoutDashboard size={18} /> });
          navItems.push({ id: ViewState.BOOKING, label: 'Bookings', icon: <Calendar size={18} /> });
      }
  } else {
      // Guest view
      navItems.push({ id: ViewState.BOOKING, label: 'Book Meeting', icon: <Calendar size={18} /> });
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => setView(ViewState.HOME)}>
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300">
              <Hexagon className="text-white" size={24} strokeWidth={2.5} />
            </div>
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
              NEXUS
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ? (
                <div className="hidden md:flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</span>
                        <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      title="Logout"
                      aria-label="Logout"
                    >
                      <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setView(ViewState.LOGIN)}
                    className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/20"
                >
                  <UserIcon size={16} /> Sign In
                </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Bar */}
      <div className="md:hidden flex justify-around border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 py-3 backdrop-blur-lg overflow-x-auto">
          {navItems.map((item) => (
             <button
                key={item.id}
                onClick={() => setView(item.id)}
                title={item.label}
                aria-label={item.label}
                className={`p-2 rounded-lg flex-shrink-0 mx-1 ${currentView === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'text-slate-500 dark:text-slate-400'}`}
             >
                 {item.icon}
             </button>
          ))}
          {user ? (
              <button onClick={onLogout} title="Logout" aria-label="Logout" className="p-2 rounded-lg flex-shrink-0 mx-1 text-red-500">
                  <LogOut size={18} />
              </button>
          ) : (
              <button onClick={() => setView(ViewState.LOGIN)} title="Sign In" aria-label="Sign In" className="p-2 rounded-lg flex-shrink-0 mx-1 text-blue-500">
                  <UserIcon size={18} />
              </button>
          )}
      </div>
    </nav>
  );
};

export default Navbar;
