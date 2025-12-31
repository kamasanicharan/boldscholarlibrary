
import React from 'react';
import { 
  Play,
  ShieldAlert,
  Image as ImageIcon,
  Lock
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

      {/* Media Grid */}
      <div className="px-4 grid grid-cols-2 gap-2 pb-24">
        {state.media.map((item) => (
          <div 
            key={item.id} 
            className="aspect-square rounded-[24px] overflow-hidden relative group cursor-pointer shadow-sm active:scale-[0.97] transition-all bg-slate-100"
          >
            {item.type === 'video' ? (
              <video 
                src={item.url} 
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img 
                src={item.url} 
                alt="Media" 
                className="w-full h-full object-cover transition-opacity duration-500" 
                loading="lazy"
              />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[9px] text-white font-black uppercase tracking-wider drop-shadow-sm">
                {item.source}
              </span>
            </div>

            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
              </div>
            )}
          </div>
        ))}

      </div>

      {state.media.length === 0 && (
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
