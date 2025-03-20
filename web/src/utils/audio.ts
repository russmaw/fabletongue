export class AudioPlayer {
  private audio: HTMLAudioElement;
  private isLoaded: boolean = false;

  constructor(source?: string) {
    this.audio = new window.Audio(source);
  }

  async loadAsync(source: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.audio.src = source;
      this.audio.oncanplaythrough = () => {
        this.isLoaded = true;
        resolve();
      };
      this.audio.onerror = (error) => reject(error);
    });
  }

  async playAsync(): Promise<void> {
    if (!this.isLoaded) throw new Error('Audio not loaded');
    return this.audio.play();
  }

  async pauseAsync(): Promise<void> {
    this.audio.pause();
    return Promise.resolve();
  }

  async stopAsync(): Promise<void> {
    this.audio.pause();
    this.audio.currentTime = 0;
    return Promise.resolve();
  }

  async setPositionAsync(position: number): Promise<void> {
    this.audio.currentTime = position / 1000; // Convert ms to seconds
    return Promise.resolve();
  }

  async setVolumeAsync(volume: number): Promise<void> {
    this.audio.volume = Math.max(0, Math.min(1, volume));
    return Promise.resolve();
  }

  async setIsLoopingAsync(isLooping: boolean): Promise<void> {
    this.audio.loop = isLooping;
    return Promise.resolve();
  }

  getStatusAsync(): Promise<{
    isLoaded: boolean;
    isPlaying: boolean;
    positionMillis: number;
    durationMillis: number;
    volume: number;
    isLooping: boolean;
  }> {
    return Promise.resolve({
      isLoaded: this.isLoaded,
      isPlaying: !this.audio.paused,
      positionMillis: this.audio.currentTime * 1000,
      durationMillis: (this.audio.duration || 0) * 1000,
      volume: this.audio.volume,
      isLooping: this.audio.loop,
    });
  }

  async unloadAsync(): Promise<void> {
    this.audio.src = '';
    this.isLoaded = false;
    return Promise.resolve();
  }
} 