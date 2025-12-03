
import React, { useState } from 'react';
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
        <div className="min-h-screen pt-16 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 pb-0 text-center">
                        <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6">
                            <Sparkles className="text-white" size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                            {isLogin ? 'Access your client portal' : 'Start your journey with Nexus'}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="px-8 pt-8 pb-8 space-y-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm text-center">
                                {error}
                            </div>
                        )}

                        {!isLogin && (
                             <div className="space-y-1">
                                <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-semibold uppercase text-slate-500 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition text-slate-900 dark:text-white"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 text-center border-t border-slate-200 dark:border-slate-800">
                        <button 
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 font-medium transition-colors"
                        >
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
                
                {/* Admin Tip */}
                <p className="mt-8 text-center text-xs text-slate-400">
                    Tip: Use <b>admin@nexus.dev</b> to login as Administrator.
                </p>
            </div>
        </div>
    );
};

export default Auth;
