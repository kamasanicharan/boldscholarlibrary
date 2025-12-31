
import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Chrome, Mail, Lock, Eye, EyeOff, UserPlus, LogIn } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const { loginWithGoogle, signUpWithEmail, loginWithEmail } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google login failed');
    }
    setIsLoading(false);
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (isSignUp && !name) {
      setError('Please enter your name');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signUpWithEmail(email, password, name);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || `${isSignUp ? 'Sign up' : 'Login'} failed`);
    }
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col p-8 overflow-y-auto no-scrollbar max-w-md mx-auto relative">
      <div className="mt-8 mb-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-100 mb-6">
          <BookOpen className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight text-center">BoldScholar</h1>
        <p className="text-slate-400 font-semibold mt-2 text-center px-4 leading-tight">
          Your personal library, accessible across all your devices.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-xs mx-auto space-y-6">
        {/* Email/Password Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <UserPlus className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Mail className="w-5 h-5" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-[20px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-white border border-slate-200 rounded-[20px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                disabled={isLoading}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[16px] text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-[24px] font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                {isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />}
                {isSignUp ? 'Create Account' : 'Sign In'}
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">OR</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google Sign In */}
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 text-slate-700 py-4 px-6 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          ) : (
            <>
              <Chrome className="w-6 h-6 text-indigo-600" />
              Continue with Google
            </>
          )}
        </button>

        {/* Toggle Sign Up / Sign In */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
              setEmail('');
              setPassword('');
              setName('');
            }}
            disabled={isLoading}
            className="text-sm text-slate-600 hover:text-indigo-600 font-medium transition-colors disabled:opacity-50"
          >
            {isSignUp ? (
              <>Already have an account? <span className="font-bold">Sign In</span></>
            ) : (
              <>Don't have an account? <span className="font-bold">Sign Up</span></>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-widest px-2">
          Syncs with Google Drive & Firebase Firestore
        </p>
      </div>

      <div className="py-6 flex flex-col items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-slate-400">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cross-Device Vault</span>
        </div>
        <div className="h-1 w-12 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
};

export default Login;
