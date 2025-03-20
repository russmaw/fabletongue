// Web fallback for expo-av
const AudioContext = window.AudioContext || window.webkitAudioContext;
const audioContext = AudioContext ? new AudioContext() : null;

export const Audio = {
  setAudioModeAsync: async () => {},
  getPermissionsAsync: async () => ({ status: 'granted' }),
  requestPermissionsAsync: async () => ({ status: 'granted' }),
  createAsync: async (source, options = {}) => {
    if (!audioContext) {
      console.warn('AudioContext not supported in this browser');
      return {
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
      };
    }

    let audioElement = null;
    if (typeof source === 'string') {
      audioElement = new Audio(source);
    } else if (source.uri) {
      audioElement = new Audio(source.uri);
    }

    if (!audioElement) {
      throw new Error('Invalid audio source');
    }

    return {
      sound: {
        playAsync: async () => {
          try {
            await audioElement.play();
          } catch (error) {
            console.warn('Error playing audio:', error);
          }
        },
        pauseAsync: async () => {
          audioElement.pause();
        },
        stopAsync: async () => {
          audioElement.pause();
          audioElement.currentTime = 0;
        },
        setPositionAsync: async (position) => {
          audioElement.currentTime = position / 1000; // Convert ms to seconds
        },
        setVolumeAsync: async (volume) => {
          audioElement.volume = volume;
        },
        setRateAsync: async (rate) => {
          audioElement.playbackRate = rate;
        },
        setIsMutedAsync: async (isMuted) => {
          audioElement.muted = isMuted;
        },
        setIsLoopingAsync: async (isLooping) => {
          audioElement.loop = isLooping;
        },
        getStatusAsync: async () => ({
          isLoaded: true,
          isPlaying: !audioElement.paused,
          positionMillis: audioElement.currentTime * 1000,
          durationMillis: audioElement.duration * 1000,
          volume: audioElement.volume,
          rate: audioElement.playbackRate,
          isMuted: audioElement.muted,
          isLooping: audioElement.loop,
        }),
        unloadAsync: async () => {
          audioElement.pause();
          audioElement.src = '';
        },
      },
    };
  },
};

export const Video = {
  createAsync: async (source, options = {}) => {
    let videoElement = null;
    if (typeof source === 'string') {
      videoElement = document.createElement('video');
      videoElement.src = source;
    } else if (source.uri) {
      videoElement = document.createElement('video');
      videoElement.src = source.uri;
    }

    if (!videoElement) {
      throw new Error('Invalid video source');
    }

    return {
      video: {
        playAsync: async () => {
          try {
            await videoElement.play();
          } catch (error) {
            console.warn('Error playing video:', error);
          }
        },
        pauseAsync: async () => {
          videoElement.pause();
        },
        stopAsync: async () => {
          videoElement.pause();
          videoElement.currentTime = 0;
        },
        setPositionAsync: async (position) => {
          videoElement.currentTime = position / 1000; // Convert ms to seconds
        },
        setVolumeAsync: async (volume) => {
          videoElement.volume = volume;
        },
        setIsMutedAsync: async (isMuted) => {
          videoElement.muted = isMuted;
        },
        setIsLoopingAsync: async (isLooping) => {
          videoElement.loop = isLooping;
        },
        getStatusAsync: async () => ({
          isLoaded: true,
          isPlaying: !videoElement.paused,
          positionMillis: videoElement.currentTime * 1000,
          durationMillis: videoElement.duration * 1000,
          volume: videoElement.volume,
          isMuted: videoElement.muted,
          isLooping: videoElement.loop,
        }),
        unloadAsync: async () => {
          videoElement.pause();
          videoElement.src = '';
        },
      },
    };
  },
};

export default {
  Audio,
  Video,
}; 