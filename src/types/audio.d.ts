declare module 'audio-types' {
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

  export interface BackgroundMusicState {
    isEnabled: boolean;
    volume: number;
    currentTrack: MusicTrack;
  }

  export interface SoundEffectsState {
    isEnabled: boolean;
    volume: number;
    lastPlayed: SoundEffect | null;
  }

  export interface AmbientSoundState {
    isEnabled: boolean;
    activeSounds: AmbientSound[];
    volumes: Record<AmbientSound, number>;
  }

  export interface VoiceInputOptions {
    locale?: string;
  }

  export interface VoiceInputCallbacks {
    onResult: (result: string) => void;
    onError: (error: string) => void;
  }

  export interface VoiceInputState {
    isListening: boolean;
    lastResult: string | null;
    error: string | null;
  }
} 