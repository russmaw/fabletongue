import Voice from '@react-native-voice/voice';

export type MusicTrack = 'lullaby' | 'peaceful' | 'adventure' | 'focus' | null;

export type SoundEffect = 
  | 'correct'
  | 'incorrect'
  | 'levelUp'
  | 'achievement'
  | 'tap'
  | 'swipe'
  | 'pageFlip'
  | 'bedtimeStart'
  | 'bedtimeEnd';

export type AmbientSound = 
  | 'crickets'
  | 'rain'
  | 'waves'
  | 'wind'
  | 'fire'
  | 'birds'
  | 'stream'
  | 'night';

export interface AudioState {
  isEnabled: boolean;
  volume: number;
}

export interface BackgroundMusicState extends AudioState {
  currentTrack: MusicTrack;
}

export interface SoundEffectsState extends AudioState {
  lastPlayed: SoundEffect | null;
}

export interface AmbientSoundState extends AudioState {
  currentTrack: AmbientSound | null;
}

export interface VoiceInputOptions {
  locale?: string;
}

export interface VoiceInputState {
  isListening: boolean;
  results: string[];
  partialResults: string[];
  error: string | null;
  isAvailable: boolean;
  isLoading: boolean;
  locale: string;
}

export interface VoiceInputCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onResults?: (results: string[]) => void;
  onPartialResults?: (results: string[]) => void;
  onError?: (error: string) => void;
}

export interface SpeechResultsEvent {
  value?: string[];
}

export interface SpeechErrorEvent {
  error?: {
    message?: string;
  };
} 