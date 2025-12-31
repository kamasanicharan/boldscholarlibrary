
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

  useEffect(() => {
    let interval: number;
    if (state.autoSyncEnabled && user && permissionsGranted) {
      interval = window.setInterval(() => {
        discoverAndUploadNewMedia();
      }, 30000);
    }
    return () => clearInterval(interval);
  }, [state.autoSyncEnabled, user, permissionsGranted]);

  /**
   * INTEGRATION POINT: Google Drive API
   * In a production environment, this function would use 'gapi.client.drive.files.create'
   * or a multipart POST request to https://www.googleapis.com/upload/drive/v3/files
   */
  const performDriveUpload = async (fileData: any, metadata: any, onProgress: (p: number) => void) => {
    // REAL API CALL PSEUDOCODE:
    // const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${user?.accessToken}` },
    //   body: formBody
    // });
    
    // MOCK FOR DEV:
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      onProgress(i);
    }
    return `drive-id-${Math.random().toString(36).substr(2, 9)}`;
  };

  const toggleAutoSync = () => {
    const newVal = !state.autoSyncEnabled;
    setState(prev => ({ ...prev, autoSyncEnabled: newVal }));
    localStorage.setItem('scholar_autosync', String(newVal));
  };

  const discoverAndUploadNewMedia = useCallback(async () => {
    if (state.isSyncing) return;
    
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

    // Trigger the actual (mocked) Drive Upload
    const driveId = await performDriveUpload(null, { name: newItem.id }, (p) => {
      setState(prev => ({
        ...prev,
        media: prev.media.map(m => m.id === newItem.id ? { ...m, progress: p } : m)
      }));
    });

    // Update state once "Drive" confirms success
    setState(prev => ({
      ...prev,
      media: prev.media.map(m => m.id === newItem.id ? { 
        ...m, 
        syncStatus: 'synced', 
        driveFileId: driveId 
      } : m)
    }));
  }, [state.isSyncing]);

  const fetchCloudData = async (uid?: string) => {
    const targetUid = uid || user?.uid;
    if (!targetUid) return;
    setState(prev => ({ ...prev, isSyncing: true }));
    
    // INTEGRATION POINT: Firebase Firestore
    // Here we would call: getDocs(collection(db, "users", targetUid, "media"))
    await new Promise(r => setTimeout(r, 1000));
    
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
    // INTEGRATION POINT: Firebase Auth
    // const result = await signInWithPopup(auth, googleProvider);
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
    
    const driveId = await performDriveUpload(file, { name: file.name }, (p) => {
      setState(prev => ({ ...prev, files: prev.files.map(f => f.id === fileId ? { ...f, progress: p } : f) }));
    });

    setState(prev => ({ ...prev, files: prev.files.map(f => f.id === fileId ? { ...f, syncStatus: 'synced', driveFileId: driveId } : f) }));
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
