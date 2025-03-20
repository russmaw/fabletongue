declare module '@react-native-community/slider' {
  import { ViewProps } from 'react-native';

  interface SliderProps extends ViewProps {
    value?: number;
    minimumValue?: number;
    maximumValue?: number;
    step?: number;
    minimumTrackTintColor?: string;
    maximumTrackTintColor?: string;
    thumbTintColor?: string;
    onValueChange?: (value: number) => void;
    onSlidingComplete?: (value: number) => void;
  }

  export default class Slider extends React.Component<SliderProps> {}
}

declare module '@react-native-community/voice' {
  interface SpeechResultsEvent {
    value?: string[];
  }

  interface SpeechErrorEvent {
    error?: {
      message?: string;
    };
  }

  interface VoiceModule {
    onSpeechStart: (() => void) | null;
    onSpeechEnd: (() => void) | null;
    onSpeechResults: ((e: SpeechResultsEvent) => void) | null;
    onSpeechPartialResults: ((e: SpeechResultsEvent) => void) | null;
    onSpeechError: ((e: SpeechErrorEvent) => void) | null;
    start: (locale?: string) => Promise<void>;
    stop: () => Promise<void>;
    destroy: () => Promise<void>;
    removeAllListeners: () => void;
  }

  const Voice: VoiceModule;
  export default Voice;
  export { SpeechResultsEvent, SpeechErrorEvent };
}

declare module '@shopify/restyle' {
  import { ViewStyle, TextStyle, ImageStyle } from 'react-native';

  export type BaseTheme = {
    colors: {
      [key: string]: string;
    };
    spacing: {
      [key: string]: number;
    };
    borderRadii: {
      [key: string]: number;
    };
    shadows: {
      [key: string]: ViewStyle;
    };
  };

  export function useTheme<T extends BaseTheme>(): T;
  export function createTheme<T extends BaseTheme>(theme: T): T;
}

declare module 'expo-av' {
  export namespace Audio {
    interface Sound {
      playAsync(): Promise<void>;
      pauseAsync(): Promise<void>;
      stopAsync(): Promise<void>;
      unloadAsync(): Promise<void>;
      setVolumeAsync(volume: number): Promise<void>;
      replayAsync(): Promise<void>;
      playFromPositionAsync(position: number): Promise<void>;
    }

    interface SoundOptions {
      volume?: number;
      isLooping?: boolean;
      shouldPlay?: boolean;
    }

    interface AudioMode {
      playsInSilentModeIOS?: boolean;
      staysActiveInBackground?: boolean;
      interruptionModeIOS?: number;
      interruptionModeAndroid?: number;
      shouldDuckAndroid?: boolean;
    }

    const INTERRUPTION_MODE_IOS_DUCK_OTHERS: number;
    const INTERRUPTION_MODE_ANDROID_DUCK_OTHERS: number;

    const Sound: {
      createAsync(
        source: any,
        options?: SoundOptions
      ): Promise<{ sound: Sound }>;
    };

    function setAudioModeAsync(mode: AudioMode): Promise<void>;
  }
} 