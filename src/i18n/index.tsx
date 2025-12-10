import React, { createContext, useContext, useState, useMemo } from 'react';
import en from './en';
import fr from './fr';
import nl from './nl';
import de from './de';

type Lang = 'en' | 'fr' | 'nl' | 'de';

const translations: Record<Lang, any> = { en, fr, nl, de };

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (path: string, fallback?: string) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Lang>('en');

  const t = (path: string, fallback = '') => {
    const parts = path.split('.');
    let cur: any = translations[lang];
    for (const p of parts) {
      if (!cur) return fallback || path;
      cur = cur[p];
    }
    return typeof cur === 'string' ? cur : fallback || path;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};
