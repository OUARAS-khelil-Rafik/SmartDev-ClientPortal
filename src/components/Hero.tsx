import React from 'react';
import { useI18n } from '../i18n';
import { ViewState } from '../types';
import { ArrowRight, Code2, ShieldCheck, Database, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeroProps {
  setView: (view: ViewState) => void;
}

const Hero: React.FC<HeroProps> = ({ setView }) => {
  const { t } = useI18n();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6 border border-blue-100 dark:border-blue-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            {t('hero.accepting')}
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6 leading-tight">
            {t('hero.title_line1')} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
              {t('hero.title_highlight')}
            </span>
          </h1>
          
          <p className="mt-4 text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {t('hero.subtitle')}
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button 
                onClick={() => setView(ViewState.BOOKING)}
                className="px-8 py-4 rounded-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-lg hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
            >
              {t('hero.start_project')} <ArrowRight size={20} />
            </button>
            <button 
                onClick={() => setView(ViewState.SERVICES)}
                className="px-8 py-4 rounded-full bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-300"
            >
              {t('hero.explore_services')}
            </button>
          </div>
        </motion.div>

        {/* 3D-ish Floating Elements */}
        <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
            <motion.div 
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl z-20"
            >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
                    <Code2 className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('hero.modern_stack.title')}</h3>
                <div className="space-y-2">
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="h-2 w-3/4 bg-blue-500 rounded-full"></div>
                    </div>
                    <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full">
                        <div className="h-2 w-1/2 bg-purple-500 rounded-full"></div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                animate={{ y: [0, 30, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 left-10 w-64 h-auto bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6 shadow-2xl z-10"
            >
                <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
                    <ShieldCheck className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">{t('hero.enterprise_security.title')}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{t('hero.enterprise_security.desc')}</p>
            </motion.div>

             <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full opacity-20 filter blur-2xl"
            />
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;