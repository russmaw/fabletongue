declare module '@react-native-voice/voice' {
  interface Voice {
    onSpeechStart: ((e: any) => void) | null;
    onSpeechEnd: ((e: any) => void) | null;
    onSpeechResults: ((e: { value: string[] }) => void) | null;
    onSpeechError: ((e: { error?: { message: string } }) => void) | null;

    start(locale?: string): Promise<void>;
    stop(): Promise<void>;
    destroy(): Promise<void>;
    isAvailable(): Promise<boolean>;
    cancel(): Promise<void>;
  }

  const Voice: Voice;
  export default Voice;
} 