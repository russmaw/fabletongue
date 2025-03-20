import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { AdMobBanner, AdMobInterstitial, setTestDeviceIDAsync } from 'expo-ads-admob';
import { useAdStore } from '../services/AdService';
import { useNetworkStore } from '../services/NetworkService';

// Replace these with your actual ad unit IDs
const BANNER_AD_UNIT_ID = __DEV__ 
  ? 'ca-app-pub-3940256099942544/6300978111' // Test ID
  : 'YOUR_PRODUCTION_BANNER_ID';

const INTERSTITIAL_AD_UNIT_ID = __DEV__
  ? 'ca-app-pub-3940256099942544/1033173712' // Test ID
  : 'YOUR_PRODUCTION_INTERSTITIAL_ID';

// Constants
const AD_LOAD_TIMEOUT = 5000; // 5 seconds
const RETRY_DELAY = 1000; // 1 second

interface AdComponentProps {
  type: 'banner' | 'interstitial';
  onLoadComplete?: () => void;
  onLoadError?: (error: Error) => void;
}

export const AdComponent: React.FC<AdComponentProps> = ({ 
  type, 
  onLoadComplete,
  onLoadError 
}) => {
  const { isAdFree, markAdShown } = useAdStore();
  const { isConnected } = useNetworkStore();
  const [adError, setAdError] = useState(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const maxRetries = 2;

  useEffect(() => {
    // Set up test device ID for development
    if (__DEV__) {
      setTestDeviceIDAsync('EMULATOR').catch(console.error);
    }
  }, []);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleAdTimeout = () => {
    if (!adLoaded && retryCount < maxRetries && isConnected) {
      // Retry loading the ad
      setRetryCount(prev => prev + 1);
      setAdError(false);
      // Force re-render of AdMobBanner
      setAdLoaded(false);
    } else if (!adLoaded) {
      // Give up after max retries or if offline
      setAdError(true);
      onLoadError?.(new Error('Ad load timeout'));
    }
  };

  const showInterstitial = async () => {
    if (!isConnected) {
      onLoadError?.(new Error('No network connection'));
      return null;
    }

    try {
      await AdMobInterstitial.setAdUnitID(INTERSTITIAL_AD_UNIT_ID);
      
      // Set up timeout for interstitial load
      const timeoutPromise = new Promise((_, reject) => {
        timeoutRef.current = setTimeout(() => {
          reject(new Error('Interstitial load timeout'));
        }, AD_LOAD_TIMEOUT);
      });

      // Try to load and show the ad
      await Promise.race([
        AdMobInterstitial.requestAdAsync(),
        timeoutPromise
      ]);

      await AdMobInterstitial.showAdAsync();
      markAdShown();
      onLoadComplete?.();
    } catch (error) {
      console.error('Failed to show interstitial ad:', error);
      onLoadError?.(error as Error);
      return null;
    } finally {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  if (isAdFree || !isConnected) {
    return null;
  }

  if (type === 'interstitial') {
    showInterstitial();
    return null;
  }

  // For banner ads, maintain layout space while loading
  return (
    <View style={[
      styles.bannerContainer,
      !adLoaded && styles.bannerPlaceholder,
      adError && styles.hidden
    ]}>
      <AdMobBanner
        bannerSize="smartBannerPortrait"
        adUnitID={BANNER_AD_UNIT_ID}
        onAdFailedToLoad={(error) => {
          console.error('Banner ad failed to load:', error);
          setAdError(true);
          onLoadError?.(new Error(error.message));
          
          // Set up timeout for retry
          if (retryCount < maxRetries && isConnected) {
            timeoutRef.current = setTimeout(() => {
              setRetryCount(prev => prev + 1);
              setAdError(false);
              setAdLoaded(false);
            }, RETRY_DELAY);
          }
        }}
        onAdLoaded={() => {
          setAdLoaded(true);
          setAdError(false);
          setRetryCount(0);
          onLoadComplete?.();
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
        }}
        servePersonalizedAds={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  bannerPlaceholder: {
    height: 50, // Default height for banner
  },
  hidden: {
    display: 'none', // Hide container completely if ad fails
  }
});

export default AdComponent; 