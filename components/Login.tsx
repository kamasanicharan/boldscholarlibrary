
import React, { useState } from 'react';
import { BookOpen, ShieldCheck, Chrome } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const Login: React.FC = () => {
  const { loginWithGoogle } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    await loginWithGoogle();
    setIsLoading(false);
  };

  return (
    <div className="h-screen w-full bg-slate-50 flex flex-col p-8 overflow-y-auto no-scrollbar max-w-md mx-auto relative">
      <div className="mt-16 mb-12 flex flex-col items-center">
        <div className="w-20 h-20 bg-indigo-600 rounded-[32px] flex items-center justify-center shadow-2xl shadow-indigo-100 mb-6">
          <BookOpen className="text-white w-10 h-10" />
        </div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight text-center">BoldScholar</h1>
        <p className="text-slate-400 font-semibold mt-2 text-center px-4 leading-tight">
          Your library, synced across all your devices via Google Cloud.
        </p>
      </div>

      <div className="flex-1 flex flex-col justify-center w-full max-w-xs mx-auto">
        <button 
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className="w-full bg-white border border-slate-200 text-slate-700 py-4 px-6 rounded-[24px] font-bold flex items-center justify-center gap-3 shadow-sm hover:bg-slate-50 active:scale-[0.98] transition-all"
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
          ) : (
            <>
              <Chrome className="w-6 h-6 text-indigo-600" />
              Sign in with Google
            </>
          )}
        </button>
        
        <p className="text-[10px] text-slate-400 text-center mt-6 font-bold uppercase tracking-widest px-2">
          Syncs with Google Drive & Firebase Firestore
        </p>
      </div>

      <div className="py-10 flex flex-col items-center justify-center gap-4">
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
