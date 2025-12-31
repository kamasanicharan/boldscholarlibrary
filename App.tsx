
import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  User as UserIcon, 
  Settings, 
  Cloud, 
  LogOut,
  ChevronRight
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
  const { state, activeSection, setActiveSection, user, logout } = useAppContext();
  const [showProfile, setShowProfile] = useState(false);

  if (!user) {
    return <Login />;
  }

  const renderSection = () => {
    switch (activeSection) {
      case AppSection.DASHBOARD:
        return <Dashboard />;
      case AppSection.CS:
        return <CSSection />;
      case AppSection.MASTERY:
        return <MasterySection />;
      case AppSection.MEDIA:
        return <MediaSection />;
      default:
        return <Dashboard />;
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
            <img src={user.avatar || `https://picsum.photos/seed/${user.email}/100/100`} alt="Avatar" className="w-full h-full object-cover" />
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
              <div className="relative mb-4">
                <img src={user.avatar || `https://picsum.photos/seed/${user.email}/100/100`} className="w-24 h-24 rounded-[32px] object-cover shadow-2xl" />
                <div className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 rounded-2xl text-white shadow-xl">
                  <Settings className="w-4 h-4" />
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-800">{user.name}</h2>
              <p className="text-slate-500 text-sm font-medium">{user.email}</p>
            </div>
            
            <div className="space-y-3">
              <button className="w-full p-4 flex items-center justify-between rounded-3xl bg-slate-50 hover:bg-indigo-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-100 text-indigo-600"><UserIcon className="w-5 h-5" /></div>
                  <span className="font-bold text-slate-700 text-base">Account Settings</span>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </button>
              <button 
                onClick={logout}
                className="w-full p-4 flex items-center gap-3 rounded-3xl text-red-600 hover:bg-red-50 transition-colors mt-4"
              >
                <div className="p-3 rounded-2xl bg-red-50 text-red-600">
                  <LogOut className="w-5 h-5" />
                </div>
                <span className="font-bold text-base">Logout</span>
              </button>
            </div>
            
            <button 
              onClick={() => setShowProfile(false)}
              className="w-full py-6 mt-4 font-bold text-slate-400"
            >
              Close
            </button>
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
