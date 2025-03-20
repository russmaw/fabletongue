// Web fallback for expo-speech
export const speakAsync = async (text, options = {}) => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    window.speechSynthesis.speak(utterance);
  }
};

export const stopAsync = async () => {
  window.speechSynthesis.cancel();
};

export const pauseAsync = async () => {
  window.speechSynthesis.pause();
};

export const resumeAsync = async () => {
  window.speechSynthesis.resume();
};

export default {
  speakAsync,
  stopAsync,
  pauseAsync,
  resumeAsync,
}; 