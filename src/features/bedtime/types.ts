import { Story } from '../../services/BedtimeStoryManager';

export interface FavoriteStory extends Story {
  favoriteId: string;
  favoritedAt: string;
  lastReadAt: string;
  timesRead: number;
  createdAt: Date;
}

export interface StoryProgress {
  storyId: string;
  lastPageRead: number;
  completedPages: number[];
  timeSpent: number; // in seconds
  lastReadAt: Date;
  bookmarks: number[];
  notes: StoryNote[];
}

export interface StoryNote {
  id: string;
  pageNumber: number;
  content: string;
  createdAt: Date;
}

export interface VoiceNarrationSettings {
  enabled: boolean;
  voice: string;
  speed: number;
  pitch: number;
  useCustomVoice?: boolean;
  customVoicePath?: string;
}

export interface NotificationSettings {
  dailyReminder: {
    enabled: boolean;
    time: string;
  };
  achievements: {
    enabled: boolean;
  };
  weeklyProgress: {
    enabled: boolean;
    dayOfWeek: number;
    time: string;
  };
  socialUpdates: {
    enabled: boolean;
  };
}

export interface ParentControls {
  maxDuration: number;
  allowedTimeRange: {
    start: string; // HH:mm
    end: string; // HH:mm
  };
  requireParentUnlock: boolean;
  pinCode?: string;
  restrictedContent: string[];
}

export interface BedtimeStoryState {
  favorites: string[];
  progress: StoryProgress[];
  currentStory: string | null;
  settings: BedtimeSettings;
  narrationSettings: VoiceNarrationSettings;
  notificationSettings: NotificationSettings;
  parentControls: ParentControls;
}

export interface BedtimeSettings {
  includeMusic: boolean;
  includeAmbientSounds: boolean;
  volume: number;
  autoPlayNext: boolean;
  reminderTime: string | null;
  voicePreference: string | null;
  readingSpeed: 'slow' | 'normal' | 'fast';
}

export interface BedtimeActions {
  setCurrentStory: (storyId: string | null) => void;
  addToFavorites: (storyId: string) => void;
  removeFromFavorites: (storyId: string) => void;
  updateProgress: (storyId: string, pageNumber: number) => void;
  addBookmark: (storyId: string, pageNumber: number) => void;
  removeBookmark: (storyId: string, pageNumber: number) => void;
  addNote: (storyId: string, note: Omit<StoryNote, 'id' | 'createdAt'>) => void;
  removeNote: (storyId: string, noteId: string) => void;
  updateSettings: (settings: Partial<BedtimeSettings>) => void;
  updateNotificationSettings: (settings: NotificationSettings) => Promise<void>;
  updateAchievementNotifications: (enabled: boolean) => Promise<void>;
  updateSocialNotifications: (enabled: boolean) => Promise<void>;
  updateParentControls: (controls: Partial<ParentControls>) => Promise<void>;
  updateNarrationSettings: (settings: Partial<VoiceNarrationSettings>) => Promise<void>;
  incrementTimeSpent: (storyId: string, seconds: number) => void;
  reset: () => void;
}

export type BedtimeState = BedtimeStoryState & {
  isLoading?: boolean;
  error?: string | null;
}; 