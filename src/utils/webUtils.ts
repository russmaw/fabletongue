import { Platform } from 'react-native';

// Web Speech API wrapper
export const speak = (text: string, options: { language?: string; pitch?: number; rate?: number } = {}) => {
  if (Platform.OS !== 'web') return;
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = options.language || 'en-US';
  utterance.pitch = options.pitch || 1;
  utterance.rate = options.rate || 1;
  
  window.speechSynthesis.speak(utterance);
};

// Web Notifications wrapper
export const requestNotificationPermission = async () => {
  if (Platform.OS !== 'web') return false;
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

export const scheduleNotification = async (title: string, body: string) => {
  if (Platform.OS !== 'web') return;
  
  try {
    const permission = await requestNotificationPermission();
    if (permission) {
      new Notification(title, { body });
    }
  } catch (error) {
    console.error('Error scheduling notification:', error);
  }
};

// Web Storage wrapper
export const saveToFile = async (content: string, filename: string) => {
  if (Platform.OS !== 'web') return;
  
  try {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error('Error saving file:', error);
  }
};

// Web Share API wrapper
export const share = async (options: { title?: string; text?: string; url?: string }) => {
  if (Platform.OS !== 'web') return;
  
  try {
    if (navigator.share) {
      await navigator.share(options);
    } else {
      console.warn('Web Share API not supported');
    }
  } catch (error) {
    console.error('Error sharing:', error);
  }
};

// Device info wrapper
export const getDeviceInfo = () => {
  if (Platform.OS !== 'web') return null;
  
  return {
    brand: 'web',
    manufacturer: 'web',
    modelName: 'web',
    osName: 'web',
    osVersion: 'web',
    platformApiLevel: 0,
  };
}; 