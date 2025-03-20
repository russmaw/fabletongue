// Web fallback for expo-av
export const Audio = {
  setAudioModeAsync: async () => {},
  getPermissionsAsync: async () => ({ status: 'granted' }),
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  createAsync: async () => ({
    sound: {
      playAsync: async () => {},
      pauseAsync: async () => {},
      stopAsync: async () => {},
      setPositionAsync: async () => {},
      setVolumeAsync: async () => {},
      setRateAsync: async () => {},
      setIsMutedAsync: async () => {},
      setIsLoopingAsync: async () => {},
      getStatusAsync: async () => ({
        isLoaded: true,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 0,
        volume: 1,
        rate: 1,
        isMuted: false,
        isLooping: false,
      }),
      unloadAsync: async () => {},
    },
  }),
};

export const Video = {
  createAsync: async () => ({
    video: {
      playAsync: async () => {},
      pauseAsync: async () => {},
      stopAsync: async () => {},
      setPositionAsync: async () => {},
      setVolumeAsync: async () => {},
      setIsMutedAsync: async () => {},
      setIsLoopingAsync: async () => {},
      getStatusAsync: async () => ({
        isLoaded: true,
        isPlaying: false,
        positionMillis: 0,
        durationMillis: 0,
        volume: 1,
        isMuted: false,
        isLooping: false,
      }),
      unloadAsync: async () => {},
    },
  }),
};

export default {
  Audio,
  Video,
}; 