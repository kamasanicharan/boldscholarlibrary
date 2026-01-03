
import React, { useRef } from 'react';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  UploadCloud, 
  ExternalLink,
  ChevronRight,
  BrainCircuit
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const MasterySection: React.FC = () => {
  const { state, uploadFile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const masteryFiles = state.files.filter(f => f.category === 'MASTERY');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, 'MASTERY');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[40px] shadow-xl text-white">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <BrainCircuit className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider mb-4 border border-white/20">
            <Sparkles className="w-3 h-3" /> Mastery Mode
          </div>
          <h2 className="text-3xl font-extrabold mb-2">Deep Learning</h2>
          <p className="text-indigo-100 text-sm font-medium opacity-80 mb-6">Store complex research and mastery notes in one secure vault.</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-black/10 active:scale-95 transition-transform"
          >
            <UploadCloud className="w-5 h-5" /> Upload Notes
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            onChange={handleUpload}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg">Curated Materials</h3>
        <button className="p-2 bg-slate-100 rounded-xl text-slate-500"><Search className="w-5 h-5" /></button>
      </div>

      <div className="space-y-4">
        {masteryFiles.map((file) => (
          <div key={file.id} className="group relative bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm hover:border-indigo-200 transition-all flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800">{file.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-2 py-0.5 bg-violet-100 text-violet-600 font-bold rounded-full">Scholar+</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase">{file.size}</span>
                </div>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ))}
        
        {/* Placeholder if empty */}
        {masteryFiles.length === 0 && (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-12 rounded-[40px] flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
              <Sparkles className="w-8 h-8 text-indigo-300" />
            </div>
            <p className="font-bold text-slate-800">Your path to mastery starts here</p>
            <p className="text-slate-400 text-sm mt-1 max-w-[200px]">Upload research papers or study guides to begin.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterySection;
