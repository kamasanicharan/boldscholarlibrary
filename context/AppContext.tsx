
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppSection, UserProfile, LibraryFile, MediaItem } from '../types';
import { GoogleGenAI } from "@google/genai";
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import { collection, addDoc, query, getDocs, orderBy, limit } from "firebase/firestore";

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
    files: JSON.parse(localStorage.getItem('scholar_files') || '[]'),
    media: JSON.parse(localStorage.getItem('scholar_media') || '[]'),
    isSyncing: false,
    autoSyncEnabled: localStorage.getItem('scholar_autosync') === 'true',
    lastSyncTime: localStorage.getItem('scholar_last_sync'),
    lastDiscoveryTime: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Scholar',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          bio: 'Knowledge Architect',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          accessToken: (firebaseUser as any).stsTokenManager?.accessToken 
        };
        setUser(profile);
        fetchCloudData(profile.uid);
      } else {
        setUser(null);
      }
      setIsInitialized(true);
    });
    const storedPerms = localStorage.getItem('scholar_perms');
    if (storedPerms === 'granted') setPermissionsGranted(true);
    return () => unsubscribe();
  }, []);

  const fetchCloudData = async (uid?: string) => {
    const targetUid = uid || user?.uid;
    if (!targetUid) return;
    setState(prev => ({ ...prev, isSyncing: true }));
    
    try {
      // Attempt to fetch latest media from Firestore
      const q = query(
        collection(db, "users", targetUid, "media"), 
        orderBy("timestamp", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const cloudMedia = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MediaItem));
      
      setState(prev => ({
        ...prev,
        media: cloudMedia.length > 0 ? cloudMedia : prev.media,
        isSyncing: false,
        lastSyncTime: new Date().toISOString()
      }));
    } catch (e) {
      console.warn("Cloud connection limited (likely billing/setup pending). Using local cache.");
      setState(prev => ({ ...prev, isSyncing: false }));
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        alert("Domain Not Authorized: Add this URL to 'Authorized Domains' in Firebase Authentication Settings.");
      } else {
        alert(`Login Error: ${error.message}`);
      }
    }
  };

  const logout = () => {
    signOut(auth);
    setUser(null);
    setActiveSection(AppSection.DASHBOARD);
  };

  const uploadFile = async (file: File, category: 'CS' | 'MASTERY') => {
    if (!user) return;
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
    
    // Simulate Drive Upload Progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 100));
      setState(prev => ({
        ...prev,
        files: prev.files.map(f => f.id === fileId ? { ...f, progress: i } : f)
      }));
    }

    const finalFile = { ...newFile, syncStatus: 'synced' as const, progress: 100 };
    
    try {
      await addDoc(collection(db, "users", user.uid, "files"), finalFile);
    } catch (e) {
      console.warn("DB save pending config.");
    }

    const updatedFiles = state.files.map(f => f.id === fileId ? finalFile : f);
    localStorage.setItem('scholar_files', JSON.stringify(updatedFiles));
    setState(prev => ({ ...prev, files: updatedFiles }));
  };

  const toggleAutoSync = () => {
    const newVal = !state.autoSyncEnabled;
    setState(prev => ({ ...prev, autoSyncEnabled: newVal }));
    localStorage.setItem('scholar_autosync', String(newVal));
  };

  const analyzeFile = async (fileName: string) => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Act as a senior academic librarian. Analyze the file titled "${fileName}" and provide 3 key learning objectives or academic insights this file might contain for a university student. Keep it concise and professional.`,
      });
      return response.text || "Insight could not be generated.";
    } catch (e) {
      console.error("Gemini Error:", e);
      return "AI Analysis requires a valid API_KEY. Please ensure your environment is configured.";
    }
  };

  const syncMedia = () => fetchCloudData();
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
