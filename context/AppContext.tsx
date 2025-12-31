
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppSection, UserProfile, LibraryFile, MediaItem } from '../types';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { collection, addDoc, query, getDocs, orderBy, limit } from "firebase/firestore";

interface AppContextType {
  state: AppState;
  activeSection: AppSection;
  setActiveSection: (section: AppSection) => void;
  user: UserProfile | null;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  linkGoogleAccount: () => Promise<void>;
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
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Try to get stored user with access token from localStorage
        const storedUser = localStorage.getItem('scholar_user');
        let accessToken: string | undefined;
        
        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser);
            accessToken = parsed.accessToken;
          } catch (e) {
            console.warn('Failed to parse stored user');
          }
        }
        
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Scholar',
          email: firebaseUser.email || '',
          phone: firebaseUser.phoneNumber || '',
          bio: 'Knowledge Architect',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.email}`,
          accessToken: accessToken
        };
        setUser(profile);
        fetchCloudData(profile.uid);
      } else {
        setUser(null);
        localStorage.removeItem('scholar_user');
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
      const result = await signInWithPopup(auth, googleProvider);
      // Get the Google OAuth credential to access Google APIs
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken) {
        // Store the access token for Drive API usage
        const profile: UserProfile = {
          uid: result.user.uid,
          name: result.user.displayName || 'Scholar',
          email: result.user.email || '',
          phone: result.user.phoneNumber || '',
          bio: 'Knowledge Architect',
          avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${result.user.email}`,
          accessToken: credential.accessToken
        };
        setUser(profile);
        // Store in localStorage for persistence
        localStorage.setItem('scholar_user', JSON.stringify(profile));
      }
    } catch (error: any) {
      console.error("Login failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error("Domain Not Authorized: Add this URL to 'Authorized Domains' in Firebase Authentication Settings.");
      } else {
        throw new Error(error.message || 'Google login failed');
      }
    }
  };

  const signUpWithEmail = async (email: string, password: string, name: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update user profile with display name
      if (result.user) {
        await updateProfile(result.user, {
          displayName: name,
          photoURL: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
        });
      }

      // Create user profile (email/password users won't have Drive access token)
      const profile: UserProfile = {
        uid: result.user.uid,
        name: name,
        email: result.user.email || email,
        phone: result.user.phoneNumber || '',
        bio: 'Knowledge Architect',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        accessToken: undefined // Email/password users don't get Drive access
      };
      setUser(profile);
      localStorage.setItem('scholar_user', JSON.stringify(profile));
    } catch (error: any) {
      console.error("Sign up failed", error);
      let errorMessage = 'Sign up failed';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please sign in instead.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use at least 6 characters.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Create user profile (email/password users won't have Drive access token)
      const profile: UserProfile = {
        uid: result.user.uid,
        name: result.user.displayName || result.user.email?.split('@')[0] || 'Scholar',
        email: result.user.email || email,
        phone: result.user.phoneNumber || '',
        bio: 'Knowledge Architect',
        avatar: result.user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        accessToken: undefined // Email/password users don't get Drive access
      };
      setUser(profile);
      localStorage.setItem('scholar_user', JSON.stringify(profile));
    } catch (error: any) {
      console.error("Login failed", error);
      let errorMessage = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please sign up first.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      throw new Error(errorMessage);
    }
  };

  const linkGoogleAccount = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // Get the Google OAuth credential to access Google APIs
      const credential = GoogleAuthProvider.credentialFromResult(result);
      if (credential?.accessToken && user) {
        // Update user profile with Google Drive access token
        const updatedProfile: UserProfile = {
          ...user,
          accessToken: credential.accessToken,
          // Optionally update avatar if Google has one
          avatar: result.user.photoURL || user.avatar
        };
        setUser(updatedProfile);
        localStorage.setItem('scholar_user', JSON.stringify(updatedProfile));
      }
    } catch (error: any) {
      console.error("Link Google account failed", error);
      if (error.code === 'auth/unauthorized-domain') {
        throw new Error("Domain Not Authorized: Add this URL to 'Authorized Domains' in Firebase Authentication Settings.");
      } else if (error.code === 'auth/credential-already-in-use') {
        throw new Error("This Google account is already linked to another account.");
      } else {
        throw new Error(error.message || 'Failed to link Google account');
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
      syncStatus: 'synced',
      category
    };
    
    // Show file immediately - upload happens in background
    setState(prev => ({ ...prev, files: [newFile, ...prev.files] }));
    
    // Save to Firestore immediately
    try {
      await addDoc(collection(db, "users", user.uid, "files"), newFile);
    } catch (e) {
      console.warn("Firestore save failed, using local storage:", e);
    }
    
    localStorage.setItem('scholar_files', JSON.stringify([newFile, ...state.files]));
    
    // Upload to Google Drive in background (if user has access token)
    if (user.accessToken) {
      // Do this asynchronously without blocking UI
      (async () => {
        try {
          const metadata = {
            name: file.name,
            mimeType: file.type || 'application/octet-stream',
            parents: []
          };

          const form = new FormData();
          form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
          form.append('file', file);

          const xhr = new XMLHttpRequest();
          
          const driveFileId = await new Promise<string>((resolve, reject) => {
            xhr.addEventListener('load', () => {
              if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                resolve(response.id);
              } else {
                reject(new Error(`Upload failed: ${xhr.statusText}`));
              }
            });

            xhr.addEventListener('error', () => reject(new Error('Upload failed')));
            
            xhr.open('POST', 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart');
            xhr.setRequestHeader('Authorization', `Bearer ${user.accessToken}`);
            xhr.send(form);
          });
          
          // Update file with Drive ID silently
          setState(prev => ({
            ...prev,
            files: prev.files.map(f => f.id === fileId ? { ...f, driveFileId } : f)
          }));
        } catch (driveError) {
          console.warn('Background Drive upload failed:', driveError);
          // Silently fail - file is already in library
        }
      })();
    }
  };

  const toggleAutoSync = () => {
    const newVal = !state.autoSyncEnabled;
    setState(prev => ({ ...prev, autoSyncEnabled: newVal }));
    localStorage.setItem('scholar_autosync', String(newVal));
  };

  const analyzeFile = async (fileName: string) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return "API key not configured. Please set GEMINI_API_KEY in .env.local";
    }
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const prompt = `Act as a senior academic librarian. Analyze the file titled "${fileName}" and provide 3 key learning objectives or academic insights this file might contain for a university student. Keep it concise and professional.`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text() || "Insight could not be generated.";
    } catch (e) {
      console.error("Gemini Error:", e);
      return "AI Analysis requires a valid GEMINI_API_KEY. Please ensure your environment is configured.";
    }
  };

  const syncMedia = () => fetchCloudData();
  const requestPermissions = () => {
    setPermissionsGranted(true);
    localStorage.setItem('scholar_perms', 'granted');
  };

  return (
    <AppContext.Provider value={{
      state, activeSection, setActiveSection, user, loginWithGoogle, signUpWithEmail, loginWithEmail, linkGoogleAccount, logout, 
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
