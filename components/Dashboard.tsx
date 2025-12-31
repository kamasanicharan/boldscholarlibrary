
import React from 'react';
import { 
  FileText,
  Plus,
  BookOpen,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AppSection } from '../types';

const Dashboard: React.FC = () => {
  const { user, setActiveSection } = useAppContext();

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <section className="pt-4">
        <h2 className="text-4xl font-black text-slate-800 leading-tight tracking-tight">
          Hello, <br />
          <span className="text-indigo-600">{user?.name.split(' ')[0]}</span>
        </h2>
        <p className="text-slate-500 mt-2 font-semibold text-base">Your digital library is ready.</p>
      </section>

      {/* Main Navigation Grid - Mobile Optimized */}
      <div className="grid grid-cols-1 gap-4">
        <button 
          onClick={() => setActiveSection(AppSection.CS)}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
              <FileText className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-800 text-lg">CS Library</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Resources</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button 
          onClick={() => setActiveSection(AppSection.MASTERY)}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <BookOpen className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-800 text-lg">Mastery Vault</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Deep Study</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-violet-600 transition-colors" />
        </button>

        <button 
          onClick={() => setActiveSection(AppSection.MEDIA)}
          className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center justify-between group active:scale-[0.98] transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ImageIcon className="w-7 h-7" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-slate-800 text-lg">Media Vault</span>
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Encrypted Sync</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* Simple Status Bar */}
      <div className="pt-4">
        <div className="bg-slate-100/50 rounded-3xl p-4 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Secure Cloud Connection Active</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
