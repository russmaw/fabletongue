declare module 'expo-av' {
  export namespace Audio {
    export interface Sound {
      playAsync(): Promise<void>;
      playFromPositionAsync(position: number): Promise<void>;
      pauseAsync(): Promise<void>;
      stopAsync(): Promise<void>;
      setVolumeAsync(volume: number): Promise<void>;
      unloadAsync(): Promise<void>;
    }

    export interface SoundOptions {
      volume?: number;
      isLooping?: boolean;
      shouldPlay?: boolean;
    }

    export interface AudioMode {
      playsInSilentModeIOS?: boolean;
      allowsRecordingIOS?: boolean;
      interruptionModeIOS?: number;
      interruptionModeAndroid?: number;
      shouldDuckAndroid?: boolean;
      playThroughEarpieceAndroid?: boolean;
      staysActiveInBackground?: boolean;
    }

    export const INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS: number;
    export const INTERRUPTION_MODE_IOS_DO_NOT_MIX: number;
    export const INTERRUPTION_MODE_IOS_DUCK_OTHERS: number;

    export const INTERRUPTION_MODE_ANDROID_DO_NOT_MIX: number;
    export const INTERRUPTION_MODE_ANDROID_DUCK_OTHERS: number;

    export function setAudioModeAsync(mode: Partial<AudioMode>): Promise<void>;
    export function setIsEnabledAsync(enabled: boolean): Promise<void>;

    export const Sound: {
      createAsync(
        source: number | { uri: string },
        options?: SoundOptions,
        onPlaybackStatusUpdate?: (status: any) => void,
        downloadFirst?: boolean
      ): Promise<{ sound: Sound; status: any }>;
    };
  }
} 