
export enum AppSection {
  CS = 'CS',
  MASTERY = 'MASTERY',
  MEDIA = 'MEDIA',
  DASHBOARD = 'DASHBOARD'
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar?: string;
  accessToken?: string;
}

export interface LibraryFile {
  id: string;
  driveFileId?: string;
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'uploading';
  progress?: number;
  category: 'CS' | 'MASTERY';
}

export interface MediaItem {
  id: string;
  driveFileId?: string;
  url: string;
  type: 'image' | 'video';
  source: 'gallery' | 'whatsapp' | 'instagram' | 'snapchat';
  timestamp: string;
  syncStatus: 'synced' | 'pending' | 'error' | 'uploading';
  progress?: number;
}

export interface AppState {
  user: UserProfile | null;
  files: LibraryFile[];
  media: MediaItem[];
  isSyncing: boolean;
  autoSyncEnabled: boolean;
  lastSyncTime: string | null;
  lastDiscoveryTime: string | null;
}
