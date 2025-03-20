import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Switch, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import Slider from '@react-native-community/slider';
import useBackgroundMusic from '../services/BackgroundMusic';
import useSoundEffects from '../services/SoundEffects';
import useAmbientSounds from '../services/AmbientSounds';
import AmbientControls from '../components/audio/AmbientControls';
import { useAdStore, REMOVE_ADS_PRODUCT_ID } from '../services/AdService';
import { Ionicons } from '@expo/vector-icons';
import * as InAppPurchases from 'expo-in-app-purchases';

interface SettingsScreenProps {
  navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const { 
    isEnabled: isMusicEnabled,
    volume: musicVolume,
    setVolume: setMusicVolume,
    toggleEnabled: toggleMusic,
  } = useBackgroundMusic();

  const {
    isEnabled: isSoundEnabled,
    volume: soundVolume,
    setVolume: setSoundVolume,
    toggleEnabled: toggleSound,
  } = useSoundEffects();

  const { isAdFree, setAdFree, validatePurchase, restorePurchases } = useAdStore();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Initialize in-app purchases
  useEffect(() => {
    const initializePurchases = async () => {
      try {
        await InAppPurchases.connectAsync();
        
        // Set up purchase listener
        InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results.forEach(purchase => {
              if (!purchase.acknowledged) {
                // Acknowledge the purchase
                InAppPurchases.finishTransactionAsync(purchase, true);
                
                // Update ad-free status
                if (purchase.productId === REMOVE_ADS_PRODUCT_ID) {
                  setAdFree(true, purchase.originalPurchaseTime.toString());
                  Alert.alert(
                    'Thank You!',
                    'You now have an ad-free experience. Enjoy!'
                  );
                }
              }
            });
          } else if (errorCode) {
            Alert.alert(
              'Purchase Failed',
              'There was an error processing your purchase. Please try again.'
            );
          }
          setIsPurchasing(false);
        });

        // Validate existing purchase on mount
        validatePurchase();
      } catch (err) {
        console.error('Failed to initialize purchases:', err);
      }
    };

    initializePurchases();

    return () => {
      // Cleanup
      InAppPurchases.disconnectAsync();
    };
  }, []);

  const handleRemoveAds = async () => {
    try {
      setIsPurchasing(true);
      
      // Get the products
      const { responseCode, results } = await InAppPurchases.getProductsAsync([REMOVE_ADS_PRODUCT_ID]);
      
      if (responseCode === InAppPurchases.IAPResponseCode.OK && results.length > 0) {
        // Purchase the product
        await InAppPurchases.purchaseItemAsync(REMOVE_ADS_PRODUCT_ID);
      } else {
        Alert.alert(
          'Product Not Available',
          'The ad-free upgrade is currently unavailable. Please try again later.'
        );
        setIsPurchasing(false);
      }
    } catch (err) {
      console.error('Purchase error:', err);
      Alert.alert(
        'Purchase Failed',
        'There was an error initiating the purchase. Please try again.'
      );
      setIsPurchasing(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      setIsRestoring(true);
      const restored = await restorePurchases();
      
      if (restored) {
        Alert.alert(
          'Success',
          'Your ad-free purchase has been restored!'
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous ad-free purchases to restore.'
        );
      }
    } catch (error) {
      console.error('Restore error:', error);
      Alert.alert(
        'Restore Failed',
        'There was an error restoring your purchases. Please try again.'
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const handlePrivacyPolicy = () => {
    Linking.openURL('https://your-privacy-policy-url.com');
  };

  const handleTermsOfService = () => {
    Linking.openURL('https://your-terms-of-service-url.com');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    backButton: {
      marginRight: 16,
    },
    section: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.m,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
      paddingHorizontal: theme.spacing.s,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    sliderContainer: {
      paddingHorizontal: theme.spacing.s,
      marginBottom: theme.spacing.m,
    },
    card: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: theme.borderRadii.m,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.m,
      ...theme.shadows.medium,
    },
    setting: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    button: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 8,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    link: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
    },
    restoreButton: {
      alignSelf: 'center',
      paddingVertical: 8,
      marginTop: 8,
    },
  });

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text variant="header">Settings</Text>
      </View>

      <View style={styles.section}>
        <Text variant="sectionHeader">Ad Preferences</Text>
        <View style={styles.setting}>
          <View>
            <Text variant="body">Remove Ads</Text>
            <Text variant="caption" style={{ color: theme.colors.textLight }}>
              Support our app and enjoy an ad-free experience
            </Text>
          </View>
          {!isAdFree && (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.primary },
                isPurchasing && { opacity: 0.5 }
              ]}
              onPress={handleRemoveAds}
              disabled={isPurchasing}
            >
              <Text style={styles.buttonText}>
                {isPurchasing ? 'Processing...' : 'Remove Ads'}
              </Text>
            </TouchableOpacity>
          )}
          {isAdFree && (
            <Text variant="caption" style={{ color: theme.colors.success }}>
              Ads Removed ✓
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          style={[
            styles.restoreButton,
            isRestoring && { opacity: 0.5 }
          ]}
          onPress={handleRestorePurchases}
          disabled={isRestoring}
        >
          <Text variant="caption" style={{ color: theme.colors.primary }}>
            {isRestoring ? 'Restoring...' : 'Restore Previous Purchase'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text variant="sectionHeader">Legal</Text>
        <TouchableOpacity 
          style={styles.link}
          onPress={handlePrivacyPolicy}
        >
          <Text variant="body">Privacy Policy</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.link}
          onPress={handleTermsOfService}
        >
          <Text variant="body">Terms of Service</Text>
          <Ionicons name="chevron-forward" size={20} color={theme.colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Audio Settings</Text>
        
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Background Music</Text>
            <Switch
              value={isMusicEnabled}
              onValueChange={toggleMusic}
              trackColor={{ 
                false: theme.colors.inactive, 
                true: theme.colors.primary 
              }}
            />
          </View>
          {isMusicEnabled && (
            <View style={styles.sliderContainer}>
              <Slider
                value={musicVolume}
                onValueChange={setMusicVolume}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.inactive}
                thumbTintColor={theme.colors.primary}
              />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Sound Effects</Text>
            <Switch
              value={isSoundEnabled}
              onValueChange={toggleSound}
              trackColor={{ 
                false: theme.colors.inactive, 
                true: theme.colors.primary 
              }}
            />
          </View>
          {isSoundEnabled && (
            <View style={styles.sliderContainer}>
              <Slider
                value={soundVolume}
                onValueChange={setSoundVolume}
                minimumValue={0}
                maximumValue={1}
                step={0.1}
                minimumTrackTintColor={theme.colors.primary}
                maximumTrackTintColor={theme.colors.inactive}
                thumbTintColor={theme.colors.primary}
              />
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={[styles.label, { marginBottom: theme.spacing.m }]}>
            Ambient Sounds
          </Text>
          <AmbientControls />
        </View>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen; 