import * as Font from 'expo-font';
import { useState, useEffect } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          'MedievalSharp': require('../../assets/fonts/MedievalSharp-Regular.ttf'),
          'Lora-Regular': require('../../assets/fonts/Lora-Regular.ttf'),
          'Lora-Bold': require('../../assets/fonts/Lora-Bold.ttf'),
          'Lora-Italic': require('../../assets/fonts/Lora-Italic.ttf'),
          'Almendra-Regular': require('../../assets/fonts/Almendra-Regular.ttf'),
          'Almendra-Bold': require('../../assets/fonts/Almendra-Bold.ttf'),
        });
        setFontsLoaded(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load fonts');
        // Fallback to system fonts
        setFontsLoaded(true);
      }
    }

    loadFonts();
  }, []);

  return { fontsLoaded, error };
}; 