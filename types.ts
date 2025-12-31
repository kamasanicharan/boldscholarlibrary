
export enum AppSection {
  CS = 'CS',
  MASTERY = 'MASTERY',
  MEDIA = 'MEDIA',
  DASHBOARD = 'DASHBOARD'
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
}

export interface LibraryFile {
  id: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  syncStatus: 'synced' | 'pending' | 'error';
  category: 'CS' | 'MASTERY';
}

export interface MediaItem {
  id: string;
  url: string;
  type: 'image' | 'video';
  source: 'gallery' | 'whatsapp' | 'instagram' | 'snapchat';
  timestamp: string;
  syncStatus: 'synced' | 'pending' | 'error';
}

export interface AppState {
  user: UserProfile | null;
  files: LibraryFile[];
  media: MediaItem[];
  isSyncing: boolean;
  lastSyncTime: string | null;
}
