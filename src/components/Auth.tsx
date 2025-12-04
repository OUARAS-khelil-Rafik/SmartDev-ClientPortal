
import React, { useState } from 'react';
import { useI18n } from '../i18n';
import { User, Lock, Mail, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { api } from '../services/mockApi';
import { User as UserType } from '../types';

interface AuthProps {
    onLogin: (user: UserType) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    // Google sign-in removed
    const [error, setError] = useState('');
    const { t } = useI18n();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            let user;
            if (isLogin) {
                user = await api.login(email);
            } else {
                if (!name) throw new Error("Name is required");
                user = await api.signup(name, email);
                // New signups require admin approval; don't auto-login
                if ((user as any).status === 'pending') {
                    setError('Account created and is pending administrator approval. You will be notified once approved.');
                    setLoading(false);
                    return;
                }
            }
            onLogin(user);
        } catch (err: any) {
            setError(err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    // Google sign-in removed. Use email signup/login.

    return (
        <div className="min-h-screen pt-20 md:pt-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md animate-fade-in-up">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-shadow duration-500">
                    <div className="p-5 sm:p-8 pb-0 text-center">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl sm:rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-4 sm:mb-6 animate-scale-in-bounce hover:rotate-12 transition-transform cursor-pointer">
                            <Sparkles className="text-white animate-pulse" size={24} />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white animate-fade-in-up animation-delay-200">
                            {isLogin ? t('auth.welcome_back') : t('auth.create_account')}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm animate-fade-in-up animation-delay-300">
                            {isLogin ? t('auth.access_portal') : t('auth.start_journey')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-5 sm:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8 space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center animate-wiggle">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                             <div className="space-y-1 animate-fade-in-up">
                                <label className="text-xs font-semibold uppercase text-slate-500 ml-1">{t('auth.full_name')}</label>
                                <div className="relative group">
                                    <User className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 text-slate-900 dark:text-white focus:shadow-lg focus:shadow-blue-500/10"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1 animate-fade-in-up animation-delay-100">
                            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">{t('auth.email')}</label>
                            <div className="relative group">
                                <Mail className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 text-slate-900 dark:text-white focus:shadow-lg focus:shadow-blue-500/10"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1 animate-fade-in-up animation-delay-200">
                            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">{t('auth.password')}</label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all duration-300 text-slate-900 dark:text-white focus:shadow-lg focus:shadow-blue-500/10"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all duration-300 flex items-center justify-center gap-2 mt-4 hover:scale-[1.02] hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] animate-fade-in-up animation-delay-300"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isLogin ? t('auth.sign_in') : t('auth.create_account_cta')}
                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-all duration-300 hover:scale-105 underline-animate"
                        >
                            {isLogin ? t('auth.dont_have') : t('auth.already_have')}
                        </button>
                        {!isLogin && (
                            <p className="mt-2 text-xs text-slate-500 dark:text-slate-500">
                                {t('auth.developer_note')}
                            </p>
                        )}
                    </div>
                </div>
                
                {/* Admin Tip */}
                <p className="mt-8 text-center text-xs text-slate-400 animate-fade-in animation-delay-500">
                    {t('auth.admin_tip')}
                </p>
                <p className="mt-2 text-center text-xs text-slate-400 animate-fade-in animation-delay-500">
                    {t('auth.developer_tip')}
                </p>
            </div>
        </div>
    );
};

export default Auth;
