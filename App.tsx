
import React, { useState } from 'react';
import { 
  BookOpen, 
  Settings, 
  LogOut,
  ChevronRight,
  RefreshCw,
  Zap,
  Chrome,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppProvider, useAppContext } from './context/AppContext';
import { AppSection } from './types';

// Pages
import Dashboard from './components/Dashboard';
import CSSection from './components/CSSection';
import MasterySection from './components/MasterySection';
import MediaSection from './components/MediaSection';
import Login from './components/Login';
import Navigation from './components/Navigation';

const AppContent: React.FC = () => {
  const { state, activeSection, setActiveSection, user, logout, toggleAutoSync, linkGoogleAccount } = useAppContext();
  const [showProfile, setShowProfile] = useState(false);
  const [isLinkingGoogle, setIsLinkingGoogle] = useState(false);
  const [linkError, setLinkError] = useState('');

  if (!user) {
    return <Login />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD: return <Dashboard />;
      case AppSection.CS: return <CSSection />;
      case AppSection.MASTERY: return <MasterySection />;
      case AppSection.MEDIA: return <MediaSection />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full max-w-md mx-auto bg-slate-50 relative overflow-hidden md:shadow-2xl">
      {/* Header */}
      <header className="px-6 py-5 glass sticky top-0 z-40 flex items-center justify-between border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-100">
            <BookOpen className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-800">BoldScholar</h1>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="w-10 h-10 rounded-full border-2 border-indigo-50 overflow-hidden shadow-sm active:scale-95 transition-transform"
          >
            <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto no-scrollbar pb-24">
        {renderSection()}
      </main>

      {/* Bottom Navigation */}
      <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />

      {/* Profile Overlay */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-end justify-center">
          <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 shadow-2xl transform transition-transform duration-300 animate-in slide-in-from-bottom-full">
            <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" onClick={() => setShowProfile(false)} />
            
            <div className="flex flex-col items-center mb-8">
              <img src={user.avatar} className="w-24 h-24 rounded-[32px] object-cover shadow-2xl mb-4" />
              <h2 className="text-2xl font-extrabold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 text-sm font-medium">{user.email}</p>
            </div>
            
            <div className="space-y-3">
              <div className="w-full p-4 flex items-center justify-between rounded-3xl bg-slate-50 border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-100 text-amber-600"><Zap className="w-5 h-5" /></div>
                  <div>
                    <span className="block font-bold text-slate-700 text-base">Auto-Sync Media</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Background Watcher</span>
                  </div>
                </div>
                <button 
                  onClick={toggleAutoSync}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${state.autoSyncEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${state.autoSyncEnabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              {/* Google Drive Access Status */}
              {!user.accessToken && (
                <div className="w-full p-4 rounded-3xl bg-amber-50 border border-amber-100 mb-3">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-amber-800 text-sm mb-1">Enhanced Storage Available</span>
                      <span className="text-xs text-amber-600">Link your Google account for expanded library storage</span>
                    </div>
                  </div>
                  {linkError && (
                    <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs">
                      {linkError}
                    </div>
                  )}
                  <button
                    onClick={async () => {
                      setIsLinkingGoogle(true);
                      setLinkError('');
                      try {
                        await linkGoogleAccount();
                        setLinkError('');
                      } catch (err: any) {
                        setLinkError(err.message || 'Failed to link Google account');
                      } finally {
                        setIsLinkingGoogle(false);
                      }
                    }}
                    disabled={isLinkingGoogle}
                    className="w-full py-2.5 px-4 bg-amber-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-amber-700 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLinkingGoogle ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Linking...
                      </>
                    ) : (
                      <>
                        <Chrome className="w-4 h-4" />
                        Link Google Account
                      </>
                    )}
                  </button>
                </div>
              )}

              {user.accessToken && (
                <div className="w-full p-4 rounded-3xl bg-emerald-50 border border-emerald-100 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <span className="block font-bold text-emerald-800 text-sm">Enhanced Storage Active</span>
                      <span className="text-xs text-emerald-600">Your library has expanded storage capacity</span>
                    </div>
                  </div>
                </div>
              )}

              <button className="w-full p-4 flex items-center justify-between rounded-3xl bg-slate-50 hover:bg-indigo-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600"><Settings className="w-5 h-5" /></div>
                  <span className="font-bold text-slate-700 text-base">Account Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>

              <button 
                onClick={logout}
                className="w-full p-4 flex items-center gap-3 rounded-3xl text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <div className="p-3 rounded-2xl bg-red-50 text-red-600"><LogOut className="w-5 h-5" /></div>
                <span className="font-bold text-base">Logout</span>
              </button>
            </div>
            
            <button onClick={() => setShowProfile(false)} className="w-full py-6 mt-4 font-bold text-slate-400">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
