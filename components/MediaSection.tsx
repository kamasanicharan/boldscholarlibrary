
import React from 'react';
import { 
  Play,
  Heart,
  ShieldAlert,
  Image as ImageIcon,
  Lock,
  CloudUpload,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MediaSection: React.FC = () => {
  const { state, permissionsGranted, requestPermissions } = useAppContext();

  if (!permissionsGranted) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="relative mb-8">
          <div className="w-24 h-24 bg-indigo-50 rounded-[32px] flex items-center justify-center text-indigo-600">
            <ShieldAlert className="w-12 h-12" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 border border-indigo-50">
            <Lock className="w-5 h-5" />
          </div>
        </div>
        
        <div className="max-w-[280px] space-y-3 mb-10">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Media Privacy</h2>
          <p className="text-slate-500 font-medium text-sm leading-relaxed">
            Enable the background watcher to securely sync all mobile media to your Scholar Vault.
          </p>
        </div>

        <button 
          onClick={requestPermissions}
          className="w-full max-w-[240px] bg-indigo-600 text-white py-4 rounded-[20px] font-black text-base shadow-xl shadow-indigo-200 active:scale-95 transition-all"
        >
          Grant Permission
        </button>
      </div>
    );
  }

  const isUploadingAny = state.media.some(m => m.syncStatus === 'uploading');

  return (
    <div className="flex flex-col animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="px-6 pt-6 pb-2 flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">Media</h2>
        {state.autoSyncEnabled && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Watcher Active</span>
          </div>
        )}
      </div>

      {isUploadingAny && (
        <div className="mx-6 mb-4 p-4 bg-indigo-50 rounded-2xl flex items-center justify-between border border-indigo-100 animate-pulse">
          <div className="flex items-center gap-3">
            <CloudUpload className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-800">New mobile discovery uploading...</span>
          </div>
          <div className="w-12 h-1 bg-indigo-200 rounded-full overflow-hidden">
            <div className="h-full bg-indigo-600 animate-[loading_2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}

      {/* Media Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 pb-24">
        {state.media.map((item) => (
          <div 
            key={item.id} 
            className="aspect-square rounded-[24px] overflow-hidden relative group cursor-pointer shadow-sm active:scale-[0.97] transition-all bg-slate-100"
          >
            <img 
              src={item.url} 
              alt="Media" 
              className={`w-full h-full object-cover transition-opacity duration-500 ${item.syncStatus === 'uploading' ? 'opacity-40 grayscale' : 'opacity-100 grayscale-0'}`} 
              loading="lazy"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[9px] text-white font-black uppercase tracking-wider drop-shadow-sm">
                {item.source}
              </span>
              {item.syncStatus === 'synced' ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
            </div>

            {item.type === 'video' && item.syncStatus === 'synced' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            )}

            {item.syncStatus === 'uploading' && (
              <div className="absolute inset-x-4 bottom-8 h-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300" 
                  style={{ width: `${item.progress}%` }} 
                />
              </div>
            )}
          </div>
        ))}

        {state.isSyncing && Array.from({ length: 4 }).map((_, i) => (
          <div key={`loading-${i}`} className="aspect-square rounded-[24px] bg-slate-200 animate-pulse" />
        ))}
      </div>

      {state.media.length === 0 && !state.isSyncing && (
        <div className="flex flex-col items-center justify-center py-32 px-10 text-center">
          <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
            <ImageIcon className="w-8 h-8 text-slate-200" />
          </div>
          <p className="font-bold text-slate-400 text-sm">No mobile media discovered</p>
          <p className="text-slate-300 text-xs mt-1">Enable "Auto-Sync" to start discovery</p>
        </div>
      )}

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MediaSection;
