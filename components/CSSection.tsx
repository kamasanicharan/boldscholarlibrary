
import React, { useRef, useState } from 'react';
import { 
  FilePlus, 
  Download, 
  Info, 
  Sparkles,
  CloudUpload,
  CheckCircle2
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CSSection: React.FC = () => {
  const { state, uploadFile, analyzeFile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [analyzing, setAnalyzing] = useState<string | null>(null);
  
  const csFiles = state.files.filter(f => f.category === 'CS');

  const handleAIInsight = async (fileName: string) => {
    setAnalyzing(fileName);
    const result = await analyzeFile(fileName);
    alert(`AI Insight for ${fileName}:\n\n${result}`);
    setAnalyzing(null);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight">CS Library</h2>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-14 h-14 bg-indigo-600 text-white rounded-[20px] flex items-center justify-center shadow-xl shadow-indigo-100 active:scale-90 transition-transform"
        >
          <FilePlus className="w-6 h-6" />
        </button>
        <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0], 'CS')} />
      </div>

      <div className="grid grid-cols-1 gap-4 pb-24">
        {csFiles.map((file) => (
          <div key={file.id} className="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm space-y-4 overflow-hidden relative">
            {file.syncStatus === 'uploading' && (
              <div 
                className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300" 
                style={{ width: `${file.progress}%` }} 
              />
            )}
            
            <div className="flex items-start gap-4">
              <div className={`p-4 rounded-2xl ${file.syncStatus === 'uploading' ? 'bg-indigo-50 text-indigo-400' : 'bg-slate-50 text-slate-400'}`}>
                {file.syncStatus === 'uploading' ? <CloudUpload className="w-6 h-6 animate-bounce" /> : <Info className="w-6 h-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-800 truncate">{file.name}</h3>
                  {file.syncStatus === 'synced' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                </div>
                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                  {file.syncStatus === 'uploading' ? `Uploading... ${file.progress}%` : `${file.size} • ${file.type}`}
                </p>
              </div>
            </div>
            
            {file.syncStatus === 'synced' && (
              <div className="flex gap-2">
                <button 
                  disabled={analyzing === file.name}
                  onClick={() => handleAIInsight(file.name)}
                  className="flex-1 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <Sparkles className={`w-3.5 h-3.5 ${analyzing === file.name ? 'animate-spin' : ''}`} />
                  {analyzing === file.name ? 'Analyzing...' : 'AI Insight'}
                </button>
                <button className="px-5 py-3 bg-slate-50 text-slate-600 rounded-2xl active:scale-95 transition-all">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CSSection;
