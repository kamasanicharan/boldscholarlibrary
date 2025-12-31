
import React from 'react';
import { 
  FileText,
  Plus,
  BookOpen,
  Image as ImageIcon,
  ChevronRight,
  RefreshCw,
  Cloud,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { AppSection } from '../types';

const Dashboard: React.FC = () => {
  const { user, setActiveSection, state, fetchCloudData } = useAppContext();

  const isConfigured = !state.lastSyncTime?.includes("error");

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Welcome Section */}
      <section className="pt-4 flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-black text-slate-800 leading-tight tracking-tight">
            Hello, <br />
            <span className="text-indigo-600">{user?.name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 mt-2 font-semibold text-base">Your digital library is ready.</p>
        </div>
        <button 
          onClick={fetchCloudData}
          disabled={state.isSyncing}
          className="p-4 bg-white rounded-3xl border border-slate-100 shadow-sm text-slate-400 active:scale-90 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-6 h-6 ${state.isSyncing ? 'animate-spin text-indigo-600' : ''}`} />
        </button>
      </section>

      {/* Main Navigation Grid */}
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
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{state.files.filter(f => f.category === 'CS').length} Resources</span>
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
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{state.files.filter(f => f.category === 'MASTERY').length} Items</span>
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
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{state.media.length} Photos</span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-colors" />
        </button>
      </div>

      {/* Connection Status Info */}
      <div className={`rounded-[32px] p-6 text-white relative overflow-hidden transition-colors ${isConfigured ? 'bg-slate-900' : 'bg-amber-600'}`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10" />
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Cloud className="w-5 h-5 text-white" />
            </div>
            <h4 className="text-lg font-bold">Cloud Connectivity</h4>
          </div>
          {state.isSyncing ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white/50" />
          ) : isConfigured ? (
            <CheckCircle className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-200" />
          )}
        </div>
        <p className="text-white/70 text-sm leading-relaxed">
          {state.isSyncing 
            ? 'Establishing secure link...' 
            : state.lastSyncTime 
              ? `Connected: ${new Date(state.lastSyncTime).toLocaleTimeString()}`
              : 'App is currently in local-only mode. Finish Firebase setup to enable cloud syncing.'}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
