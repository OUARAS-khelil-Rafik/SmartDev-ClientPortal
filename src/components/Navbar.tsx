
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from '../i18n';
import { ViewState, User } from '../types';
import { Sun, Moon, Hexagon, LayoutDashboard, Calendar, Sparkles, Monitor, LogOut, User as UserIcon, Shield, ChevronDown, Check } from 'lucide-react';
import Notifications from './Notifications';

interface NavbarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
  isDark: boolean;
  toggleTheme: () => void;
  user: User | null;
  onLogout: () => void;
}

// Flag icon components (SVG)
const FlagGB = () => (
  <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 640 480">
    <path fill="#012169" d="M0 0h640v480H0z"/>
    <path fill="#FFF" d="m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0h75z"/>
    <path fill="#C8102E" d="m424 281 216 159v40L369 281h55zm-184 20 6 35L54 480H0l240-179zM640 0v3L391 191l2-44L590 0h50zM0 0l239 176h-60L0 42V0z"/>
    <path fill="#FFF" d="M241 0v480h160V0H241zM0 160v160h640V160H0z"/>
    <path fill="#C8102E" d="M0 193v96h640v-96H0zM273 0v480h96V0h-96z"/>
  </svg>
);

const FlagFR = () => (
  <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 640 480">
    <path fill="#002654" d="M0 0h213.3v480H0z"/>
    <path fill="#FFF" d="M213.3 0h213.4v480H213.3z"/>
    <path fill="#CE1126" d="M426.7 0H640v480H426.7z"/>
  </svg>
);

const FlagNL = () => (
  <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 640 480">
    <path fill="#21468B" d="M0 0h640v480H0z"/>
    <path fill="#FFF" d="M0 0h640v320H0z"/>
    <path fill="#AE1C28" d="M0 0h640v160H0z"/>
  </svg>
);

const FlagDE = () => (
  <svg className="w-5 h-4 rounded-sm shadow-sm" viewBox="0 0 640 480">
    <path fill="#FFCE00" d="M0 320h640v160H0z"/>
    <path fill="#000" d="M0 0h640v160H0z"/>
    <path fill="#DD0000" d="M0 160h640v160H0z"/>
  </svg>
);

const flagComponents: Record<string, React.FC> = {
  en: FlagGB,
  fr: FlagFR,
  nl: FlagNL,
  de: FlagDE,
};

// Language configuration with flags and names
const languages = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'nl', name: 'Nederlands' },
  { code: 'de', name: 'Deutsch' },
] as const;

type LangCode = typeof languages[number]['code'];

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, isDark, toggleTheme, user, onLogout }) => {
  const { t, lang, setLang } = useI18n();
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languages.find(l => l.code === lang) || languages[0];

  const handleLangChange = (code: LangCode) => {
    setLang(code);
    setLangMenuOpen(false);
  };

  const navItems = [
    { id: ViewState.HOME, label: t('nav.home'), icon: <Hexagon size={18} /> },
    { id: ViewState.SERVICES, label: t('nav.services'), icon: <Monitor size={18} /> },
    { id: ViewState.AI_CONSULT, label: t('nav.ai'), icon: <Sparkles size={18} /> },
  ];

  // Add specific items based on role
    if (user) {
      if (user.role === 'admin') {
        navItems.push({ id: ViewState.ADMIN_DASHBOARD, label: t('nav.admin_panel'), icon: <Shield size={18} /> });
        // Admins do not book meetings, so we skip adding the Booking link
      } else if (user.role === 'developer') {
        // Developers see "Projects" (not "My Projects") and cannot book meetings
        navItems.push({ id: ViewState.DASHBOARD, label: t('nav.projects'), icon: <LayoutDashboard size={18} /> });
      } else {
        // Clients see "My Projects" and can book meetings
        navItems.push({ id: ViewState.DASHBOARD, label: t('nav.my_projects'), icon: <LayoutDashboard size={18} /> });
        navItems.push({ id: ViewState.BOOKING, label: t('nav.bookings'), icon: <Calendar size={18} /> });
      }
    } else {
      // Guest view
      navItems.push({ id: ViewState.BOOKING, label: t('nav.book_meeting'), icon: <Calendar size={18} /> });
    }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer group" onClick={() => setView(ViewState.HOME)}>
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 rounded-lg group-hover:shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
              <Hexagon className="text-white transition-transform group-hover:rotate-180 duration-500" size={24} strokeWidth={2.5} />
            </div>
            <span className="ml-3 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 group-hover:from-blue-600 group-hover:to-cyan-500 transition-all duration-300">
              SYNARIZMIE
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setView(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:scale-105 animate-fade-in-down ${
                    currentView === item.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 shadow-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={`transition-transform duration-300 ${currentView === item.id ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-blue-500 dark:hover:text-blue-400 transition-all duration-300 hover:scale-110 hover:rotate-180 hover:shadow-lg"
              title={isDark ? t('theme.switch_light') : t('theme.switch_dark')}
              aria-label={isDark ? t('theme.switch_light') : t('theme.switch_dark')}
            >
              {isDark ? <Sun size={20} className="animate-spin-slow" /> : <Moon size={20} />}
            </button>

            {/* Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className={`flex items-center gap-2 px-2.5 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  langMenuOpen 
                    ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 shadow-md ring-2 ring-blue-500/20' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 hover:shadow-md'
                }`}
                aria-label={t('nav.toggle_language')}
                title={t('nav.toggle_language')}
              >
                {React.createElement(flagComponents[currentLang.code])}
                <span className="hidden sm:inline font-semibold text-xs">{currentLang.code.toUpperCase()}</span>
                <ChevronDown 
                  size={12} 
                  className={`transition-transform duration-300 ${langMenuOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Dropdown Menu */}
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl shadow-slate-200/50 dark:shadow-black/30 border border-slate-200/80 dark:border-slate-700 py-1.5 z-50 overflow-hidden backdrop-blur-xl animate-dropdown-in">
                  {languages.map((language) => {
                    const FlagIcon = flagComponents[language.code];
                    return (
                      <button
                        key={language.code}
                        onClick={() => handleLangChange(language.code)}
                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-left transition-all duration-150 group ${
                          lang === language.code
                            ? 'bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300'
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                        }`}
                      >
                        <div className={`transition-transform duration-200 ${lang !== language.code ? 'group-hover:scale-110' : ''}`}>
                          <FlagIcon />
                        </div>
                        <span className={`flex-1 text-sm ${lang === language.code ? 'font-semibold' : 'font-medium'}`}>
                          {language.name}
                        </span>
                        {lang === language.code && (
                          <div className="w-5 h-5 rounded-full bg-blue-500 dark:bg-blue-400 flex items-center justify-center">
                            <Check size={12} className="text-white dark:text-slate-900" strokeWidth={3} />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {user && <Notifications user={user} setView={setView} />}

            {user ? (
                <div className="hidden md:flex items-center gap-4 animate-fade-in">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-sm font-bold text-slate-800 dark:text-white">{user.name}</span>
                        <span className="text-xs text-slate-500 capitalize">{user.role}</span>
                    </div>
                    <button 
                      onClick={onLogout}
                      className="p-2 text-slate-500 hover:text-red-500 transition-all duration-300 hover:scale-110 hover:rotate-12"
                      title={t('nav.logout')}
                      aria-label={t('nav.logout')}
                    >
                      <LogOut size={20} />
                    </button>
                </div>
            ) : (
                <button 
                    onClick={() => setView(ViewState.LOGIN)}
                    className="hidden sm:flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-4 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all duration-300 shadow-lg shadow-blue-500/20 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30 animate-fade-in"
                >
                  <UserIcon size={16} /> {t('nav.sign_in')}
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
                className={`p-2 rounded-lg flex-shrink-0 mx-1 transition-all duration-300 hover:scale-110 ${currentView === item.id ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 scale-110' : 'text-slate-500 dark:text-slate-400'}`}
             >
                 {item.icon}
             </button>
          ))}
          {user && (
            <div className="flex items-center">
              <Notifications user={user} setView={setView} />
            </div>
          )}
            {user ? (
              <button onClick={onLogout} title={t('nav.logout')} aria-label={t('nav.logout')} className="p-2 rounded-lg flex-shrink-0 mx-1 text-red-500 hover:scale-110 transition-transform">
                <LogOut size={18} />
              </button>
            ) : (
              <button onClick={() => setView(ViewState.LOGIN)} title={t('nav.sign_in')} aria-label={t('nav.sign_in')} className="p-2 rounded-lg flex-shrink-0 mx-1 text-blue-500 hover:scale-110 transition-transform">
                <UserIcon size={18} />
              </button>
            )}
      </div>
    </nav>
  );
};

export default Navbar;
