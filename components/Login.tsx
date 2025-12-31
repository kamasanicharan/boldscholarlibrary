
import React, { useState } from 'react';
import { BookOpen, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const { login } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    await login(email, password);
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col p-8 overflow-y-auto no-scrollbar max-w-md mx-auto relative">
      <div className="mt-16 mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-100 mb-6 animate-pulse-slow">
          <BookOpen className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">BoldScholar</h1>
        <p className="text-slate-400 font-semibold mt-1">Smart Document Vault</p>
      </div>

      <div className="flex-1 w-full max-w-xs mx-auto">
        <h2 className="text-2xl font-extrabold text-slate-800 mb-8">Log in</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Identifier</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Mail className="w-5 h-5" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email or Phone"
                className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1 tracking-widest">Secret</label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Lock className="w-5 h-5" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-4 bg-white rounded-3xl border border-slate-100 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-slate-700 shadow-sm"
              />
            </div>
          </div>

          <button type="button" className="w-full text-right text-indigo-600 text-xs font-extrabold py-2 active:opacity-60">
            Recover Access
          </button>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-4 rounded-3xl font-black flex items-center justify-center gap-2 shadow-xl shadow-slate-200 hover:bg-black active:scale-[0.98] transition-all mt-6"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Enter Library <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="py-10 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Secure Cloud Protection</span>
        </div>
        <div className="h-1 w-12 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
};

export default Login;
