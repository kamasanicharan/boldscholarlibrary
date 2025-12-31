
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, AppSection, UserProfile, LibraryFile, MediaItem } from '../types';

interface AppContextType {
  state: AppState;
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  user: UserProfile | null;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  uploadFile: (file: File, category: 'CS' | 'MASTERY') => Promise<void>;
  syncMedia: () => Promise<void>;
  isInitialized: boolean;
  permissionsGranted: boolean;
  requestPermissions: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.DASHBOARD);
  const [isInitialized, setIsInitialized] = useState(false);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  
  const [state, setState] = useState<AppState>({
    user: null,
    files: [
      { id: '1', name: 'Intro_to_Algorithms.pdf', size: '2.4MB', type: 'PDF', uploadedAt: new Date().toISOString(), syncStatus: 'synced', category: 'CS' },
      { id: '2', name: 'Quantum_Mechanics_Notes.docx', size: '1.1MB', type: 'DOCX', uploadedAt: new Date().toISOString(), syncStatus: 'synced', category: 'MASTERY' }
    ],
    media: [
      { id: 'm1', url: 'https://picsum.photos/seed/a/400/400', type: 'image', source: 'instagram', timestamp: new Date().toISOString(), syncStatus: 'synced' },
      { id: 'm2', url: 'https://picsum.photos/seed/b/400/400', type: 'image', source: 'whatsapp', timestamp: new Date().toISOString(), syncStatus: 'synced' },
      { id: 'm3', url: 'https://picsum.photos/seed/c/400/400', type: 'image', source: 'gallery', timestamp: new Date().toISOString(), syncStatus: 'synced' },
    ],
    isSyncing: false,
    lastSyncTime: null
  });

  useEffect(() => {
    const storedUser = localStorage.getItem('scholar_user');
    const storedPerms = localStorage.getItem('scholar_perms');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedPerms === 'granted') {
      setPermissionsGranted(true);
    }
    setIsInitialized(true);
  }, []);

  // Auto-sync media when user is logged in and permissions are granted
  useEffect(() => {
    if (user && permissionsGranted && state.media.length < 10) {
      syncMedia();
    }
  }, [user, permissionsGranted]);

  const requestPermissions = () => {
    setPermissionsGranted(true);
    localStorage.setItem('scholar_perms', 'granted');
  };

  const login = async (email: string, pass: string) => {
    const mockUser: UserProfile = {
      name: 'Scholar User',
      email: email,
      phone: '+1 (555) 0123',
      bio: 'Enthusiastic researcher and data enthusiast.',
      avatar: `https://picsum.photos/seed/${email}/200/200`
    };
    setUser(mockUser);
    localStorage.setItem('scholar_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scholar_user');
    setActiveSection(AppSection.DASHBOARD);
  };

  const uploadFile = async (file: File, category: 'CS' | 'MASTERY') => {
    setState(prev => ({ ...prev, isSyncing: true }));
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newFile: LibraryFile = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadedAt: new Date().toISOString(),
      syncStatus: 'synced',
      category: category
    };

    setState(prev => ({
      ...prev,
      files: [newFile, ...prev.files],
      isSyncing: false,
      lastSyncTime: new Date().toISOString()
    }));
  };

  const syncMedia = async () => {
    if (state.isSyncing) return;
    setState(prev => ({ ...prev, isSyncing: true }));
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newMediaItems: MediaItem[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `m-sync-${Date.now()}-${i}`,
      url: `https://picsum.photos/seed/${Math.random()}/400/400`,
      type: 'image',
      source: ['whatsapp', 'instagram', 'snapchat', 'gallery'][Math.floor(Math.random() * 4)] as any,
      timestamp: new Date().toISOString(),
      syncStatus: 'synced'
    }));

    setState(prev => ({
      ...prev,
      media: [...newMediaItems, ...prev.media],
      isSyncing: false,
      lastSyncTime: new Date().toISOString()
    }));
  };

  return (
    <AppContext.Provider value={{
      state,
      activeSection,
      setActiveSection,
      user,
      login,
      logout,
      uploadFile,
      syncMedia,
      isInitialized,
      permissionsGranted,
      requestPermissions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
