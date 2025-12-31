
import React from 'react';
import { Home, Layers, BookOpen, Image as ImageIcon } from 'lucide-react';
import { AppSection } from '../types';

interface NavProps {
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
}

const Navigation: React.FC<NavProps> = ({ activeSection, setActiveSection }) => {
  const tabs = [
    { id: AppSection.DASHBOARD, label: 'Home', icon: Home },
    { id: AppSection.CS, label: 'CS', icon: Layers },
    { id: AppSection.MASTERY, label: 'Mastery', icon: BookOpen },
    { id: AppSection.MEDIA, label: 'Media', icon: ImageIcon },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 px-6 pb-8 pt-2">
      <div className="glass rounded-[32px] shadow-2xl p-2.5 flex items-center justify-between border border-white/50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSection === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2.5 transition-all duration-300 relative ${
                isActive ? 'text-indigo-600' : 'text-slate-400'
              }`}
            >
              <div className={`transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'scale-100'}`}>
                <Icon className={`w-6 h-6 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className={`text-[10px] font-black tracking-wider transition-all mt-1 ${isActive ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute -top-1 w-1 h-1 bg-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;
