import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Platform } from 'react-native';
import * as StoreReview from 'expo-store-review';
import * as InAppPurchases from 'expo-in-app-purchases';

// Product IDs
export const REMOVE_ADS_PRODUCT_ID = Platform.select({
  ios: 'com.fabletongue.removeads',
  android: 'com.fabletongue.removeads',
  default: 'com.fabletongue.removeads'
});

interface AdState {
  isAdFree: boolean;
  sessionExerciseCount: number;
  lastAdShownAt: number;
  lastReviewPromptAt: number;
  purchaseReceipt: string | null;
  lastOfflineValidation: number;
  setAdFree: (value: boolean, receipt: string | null) => void;
  incrementExerciseCount: () => void;
  shouldShowAd: () => boolean;
  shouldPromptForReview: () => boolean;
  markAdShown: () => void;
  markReviewPrompted: () => void;
  validatePurchase: () => Promise<boolean>;
  restorePurchases: () => Promise<boolean>;
}

// Constants for ad frequency and review prompts
const AD_COOLDOWN = 5 * 60 * 1000; // 5 minutes in milliseconds
const EXERCISES_BEFORE_AD = 3; // Show ad every 3 exercises
const MIN_EXERCISES_BEFORE_REVIEW = 10; // Minimum exercises before asking for review
const REVIEW_COOLDOWN = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// Server endpoints
const API_BASE_URL = 'https://api.fabletongue.com'; // Replace with your actual API URL
const VALIDATE_RECEIPT_ENDPOINT = `${API_BASE_URL}/validate-receipt`;

// Offline validation cache duration (24 hours)
const OFFLINE_CACHE_DURATION = 24 * 60 * 60 * 1000;

async function validateReceiptWithServer(receipt: string): Promise<boolean> {
  try {
    const response = await fetch(VALIDATE_RECEIPT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        receipt,
        platform: Platform.OS,
      }),
    });

    if (!response.ok) {
      throw new Error('Receipt validation failed');
    }

    const data = await response.json();
    return data.isValid;
  } catch (error) {
    console.error('Server validation error:', error);
    // Return true for offline validation if we have a valid receipt
    // This allows users to maintain ad-free status when offline
    return !!receipt;
  }
}

export const useAdStore = create<AdState>()(
  persist(
    (set, get) => ({
      isAdFree: false,
      sessionExerciseCount: 0,
      lastAdShownAt: 0,
      lastReviewPromptAt: 0,
      purchaseReceipt: null,
      lastOfflineValidation: 0, // New state for tracking offline validation

      setAdFree: (value: boolean, receipt: string | null) => {
        set({ 
          isAdFree: value,
          purchaseReceipt: receipt,
          lastOfflineValidation: value ? Date.now() : 0
        });
      },

      incrementExerciseCount: () => {
        set(state => ({
          sessionExerciseCount: state.sessionExerciseCount + 1
        }));
      },

      shouldShowAd: () => {
        const state = get();
        if (state.isAdFree) return false;

        const now = Date.now();
        const timeSinceLastAd = now - state.lastAdShownAt;
        
        return (
          state.sessionExerciseCount % EXERCISES_BEFORE_AD === 0 && 
          state.sessionExerciseCount > 0 &&
          timeSinceLastAd >= AD_COOLDOWN
        );
      },

      shouldPromptForReview: () => {
        const state = get();
        const now = Date.now();
        const timeSinceLastPrompt = now - state.lastReviewPromptAt;

        return (
          state.sessionExerciseCount >= MIN_EXERCISES_BEFORE_REVIEW &&
          timeSinceLastPrompt >= REVIEW_COOLDOWN &&
          StoreReview.isAvailableAsync() // Only if store review is available
        );
      },

      markAdShown: () => {
        set({ lastAdShownAt: Date.now() });
      },

      markReviewPrompted: () => {
        set({ lastReviewPromptAt: Date.now() });
      },

      validatePurchase: async () => {
        try {
          const state = get();
          
          // If we're offline and have a recent offline validation, trust it
          const now = Date.now();
          if (state.isAdFree && 
              state.lastOfflineValidation && 
              (now - state.lastOfflineValidation) < OFFLINE_CACHE_DURATION) {
            return true;
          }

          // If we have a stored receipt, validate it first
          if (state.purchaseReceipt) {
            const isValid = await validateReceiptWithServer(state.purchaseReceipt);
            if (isValid) {
              set({ 
                isAdFree: true,
                lastOfflineValidation: now
              });
              return true;
            }
          }

          // Check purchase history
          try {
            await InAppPurchases.connectAsync();
            const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
            
            if (responseCode === InAppPurchases.IAPResponseCode.OK) {
              const adRemovalPurchase = results.find(
                purchase => purchase.productId === REMOVE_ADS_PRODUCT_ID
              );

              if (adRemovalPurchase) {
                const receipt = adRemovalPurchase.originalPurchaseTime.toString();
                const isValid = await validateReceiptWithServer(receipt);
                
                if (isValid) {
                  set({ 
                    isAdFree: true,
                    purchaseReceipt: receipt,
                    lastOfflineValidation: now
                  });
                  return true;
                }
              }
            }
          } catch (error) {
            console.error('Failed to check purchase history:', error);
            // If we can't check purchase history but have a receipt, give benefit of doubt
            if (state.purchaseReceipt) {
              set({ 
                isAdFree: true,
                lastOfflineValidation: now
              });
              return true;
            }
          }

          set({ 
            isAdFree: false, 
            purchaseReceipt: null,
            lastOfflineValidation: 0 
          });
          return false;
        } catch (error) {
          console.error('Failed to validate purchase:', error);
          // If validation fails but we have a receipt, maintain current state
          const state = get();
          return state.isAdFree && !!state.purchaseReceipt;
        } finally {
          try {
            await InAppPurchases.disconnectAsync();
          } catch (error) {
            console.error('Failed to disconnect IAP:', error);
          }
        }
      },

      restorePurchases: async () => {
        try {
          await InAppPurchases.connectAsync();
          const { responseCode, results } = await InAppPurchases.getPurchaseHistoryAsync();
          
          if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            const adRemovalPurchase = results.find(
              purchase => purchase.productId === REMOVE_ADS_PRODUCT_ID
            );

            if (adRemovalPurchase) {
              const receipt = adRemovalPurchase.originalPurchaseTime.toString();
              const isValid = await validateReceiptWithServer(receipt);
              
              if (isValid) {
                set({ 
                  isAdFree: true,
                  purchaseReceipt: receipt,
                  lastOfflineValidation: Date.now()
                });
                return true;
              }
            }
          }
          
          return false;
        } catch (error) {
          console.error('Failed to restore purchases:', error);
          // If restore fails but we have a receipt, maintain current state
          const state = get();
          return state.isAdFree && !!state.purchaseReceipt;
        } finally {
          try {
            await InAppPurchases.disconnectAsync();
          } catch (error) {
            console.error('Failed to disconnect IAP:', error);
          }
        }
      }
    }),
    {
      name: 'ad-storage',
      partialize: (state) => ({ 
        isAdFree: state.isAdFree,
        lastReviewPromptAt: state.lastReviewPromptAt,
        purchaseReceipt: state.purchaseReceipt,
        lastOfflineValidation: state.lastOfflineValidation
      })
    }
  )
); 