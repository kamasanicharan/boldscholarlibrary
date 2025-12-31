
import React, { useRef } from 'react';
import { 
  FilePlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Share2, 
  Trash2, 
  Download,
  Info,
  /* Import missing Layers icon */
  Layers
} from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const CSSection: React.FC = () => {
  const { state, uploadFile } = useAppContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const csFiles = state.files.filter(f => f.category === 'CS');

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file, 'CS');
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800">CS Library</h2>
          <p className="text-slate-500 text-sm font-medium">Resources & Documentation</p>
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 transition-transform"
        >
          <FilePlus className="w-6 h-6" />
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleUpload}
          accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
        />
      </div>

      {/* Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
        <input 
          type="text" 
          placeholder="Search documents..." 
          className="w-full pl-12 pr-12 py-4 bg-white rounded-2xl border border-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-slate-50">
          <Filter className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* File List */}
      <div className="grid grid-cols-1 gap-4">
        {csFiles.length > 0 ? csFiles.map((file) => (
          <div key={file.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow group">
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-600">
              <Info className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-slate-800 text-base truncate pr-6">{file.name}</h3>
              <p className="text-xs font-medium text-slate-400 mt-1">Uploaded {new Date(file.uploadedAt).toLocaleDateString()}</p>
              
              <div className="flex items-center gap-4 mt-4">
                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
                <button className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            </div>
            <button className="p-1 rounded-full text-slate-300 hover:text-slate-600">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        )) : (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
              <Layers className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-bold">No documents yet</p>
            <p className="text-sm">Upload your first CS file</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CSSection;
