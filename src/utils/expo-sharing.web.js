// Web fallback for expo-sharing
export const isAvailableAsync = async () => false;
export const shareAsync = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'FableTongue',
        text: 'Check out FableTongue!',
        url: window.location.href,
      });
    } catch (error) {
      console.warn('Error sharing:', error);
    }
  }
};

export default {
  isAvailableAsync,
  shareAsync,
}; 