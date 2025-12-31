
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState, AppSection, UserProfile, LibraryFile, MediaItem } from '../types';
import { GoogleGenAI } from "@google/genai";

interface AppContextType {
  state: AppState;
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  user: UserProfile | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  uploadFile: (file: File, category: 'CS' | 'MASTERY') => Promise<void>;
  analyzeFile: (fileName: string) => Promise<string>;
  syncMedia: () => Promise<void>;
  toggleAutoSync: () => void;
  fetchCloudData: () => Promise<void>;
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
    files: [],
    media: [],
    isSyncing: false,
    autoSyncEnabled: localStorage.getItem('scholar_autosync') === 'true',
    lastSyncTime: null,
    lastDiscoveryTime: null
  });

  // Fetch data on login or app start
  useEffect(() => {
    const storedUser = localStorage.getItem('scholar_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCloudData(parsedUser.uid);
    }
    const storedPerms = localStorage.getItem('scholar_perms');
    if (storedPerms === 'granted') setPermissionsGranted(true);
    setIsInitialized(true);
  }, []);

  // Background Media Watcher Loop
  useEffect(() => {
    let interval: number;
    if (state.autoSyncEnabled && user && permissionsGranted) {
      // Discover new media every 30 seconds while app is active
      interval = window.setInterval(() => {
        discoverAndUploadNewMedia();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [state.autoSyncEnabled, user, permissionsGranted]);

  const toggleAutoSync = () => {
    const newVal = !state.autoSyncEnabled;
    setState(prev => ({ ...prev, autoSyncEnabled: newVal }));
    localStorage.setItem('scholar_autosync', String(newVal));
  };

  const discoverAndUploadNewMedia = useCallback(async () => {
    if (state.isSyncing) return;
    
    // In a real mobile app, this would use a native bridge to scan folders.
    // Here we simulate discovering 1-2 "new" items from the device storage.
    console.log("[ScholarWatcher] Scanning for new mobile media...");
    
    const sources: ('gallery' | 'whatsapp' | 'instagram' | 'snapchat')[] = ['gallery', 'whatsapp', 'instagram', 'snapchat'];
    const randomSource = sources[Math.floor(Math.random() * sources.length)];
    
    const newItem: MediaItem = {
      id: `m-discovered-${Date.now()}`,
      url: `https://picsum.photos/seed/${Math.random()}/800/800`,
      type: 'image',
      source: randomSource,
      timestamp: new Date().toISOString(),
      syncStatus: 'uploading',
      progress: 0
    };

    setState(prev => ({ 
      ...prev, 
      media: [newItem, ...prev.media],
      lastDiscoveryTime: new Date().toISOString() 
    }));

    // Simulate Background Upload to Google Drive + Firebase Meta update
    for (let i = 0; i <= 100; i += 25) {
      await new Promise(r => setTimeout(r, 800));
      setState(prev => ({
        ...prev,
        media: prev.media.map(m => m.id === newItem.id ? { ...m, progress: i } : m)
      }));
    }

    setState(prev => ({
      ...prev,
      media: prev.media.map(m => m.id === newItem.id ? { 
        ...m, 
        syncStatus: 'synced', 
        driveFileId: `drive-${newItem.id}` 
      } : m)
    }));
  }, [state.isSyncing]);

  const fetchCloudData = async (uid?: string) => {
    const targetUid = uid || user?.uid;
    if (!targetUid) return;
    setState(prev => ({ ...prev, isSyncing: true }));
    await new Promise(r => setTimeout(r, 1000));
    
    // Simulate real-time retrieval from Firebase
    const cloudMedia: MediaItem[] = Array.from({ length: 6 }).map((_, i) => ({
      id: `cloud-m-${i}`,
      driveFileId: `drive-vid-${i}`,
      url: `https://picsum.photos/seed/cloud${i}/800/800`,
      type: i % 3 === 0 ? 'video' : 'image',
      source: i % 2 === 0 ? 'gallery' : 'whatsapp',
      timestamp: new Date().toISOString(),
      syncStatus: 'synced'
    }));

    setState(prev => ({
      ...prev,
      media: cloudMedia,
      isSyncing: false,
      lastSyncTime: new Date().toISOString()
    }));
  };

  const loginWithGoogle = async () => {
    const mockGoogleUser: UserProfile = {
      uid: 'google-uid-123',
      name: 'Scholar User',
      email: 'user@gmail.com',
      phone: '+1 555-0000',
      bio: 'Knowledge Architect',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user@gmail.com`,
      accessToken: 'ya29.auth-token'
    };
    setUser(mockGoogleUser);
    localStorage.setItem('scholar_user', JSON.stringify(mockGoogleUser));
    await fetchCloudData(mockGoogleUser.uid);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scholar_user');
    setState(prev => ({ ...prev, files: [], media: [] }));
    setActiveSection(AppSection.DASHBOARD);
  };

  const uploadFile = async (file: File, category: 'CS' | 'MASTERY') => {
    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile: LibraryFile = {
      id: fileId,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(1) + 'MB',
      type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
      uploadedAt: new Date().toISOString(),
      syncStatus: 'uploading',
      progress: 0,
      category
    };
    setState(prev => ({ ...prev, files: [newFile, ...prev.files] }));
    for (let i = 0; i <= 100; i += 20) {
      await new Promise(r => setTimeout(r, 300));
      setState(prev => ({ ...prev, files: prev.files.map(f => f.id === fileId ? { ...f, progress: i } : f) }));
    }
    setState(prev => ({ ...prev, files: prev.files.map(f => f.id === fileId ? { ...f, syncStatus: 'synced', driveFileId: `drive-${fileId}` } : f) }));
  };

  const analyzeFile = async (fileName: string) => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain educational relevance of ${fileName}.`,
    });
    return response.text || "No insights.";
  };

  const syncMedia = async () => {
    await fetchCloudData();
  };

  const requestPermissions = () => {
    setPermissionsGranted(true);
    localStorage.setItem('scholar_perms', 'granted');
  };

  return (
    <AppContext.Provider value={{
      state, activeSection, setActiveSection, user, loginWithGoogle, logout, 
      uploadFile, analyzeFile, syncMedia, toggleAutoSync, fetchCloudData, 
      isInitialized, permissionsGranted, requestPermissions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
