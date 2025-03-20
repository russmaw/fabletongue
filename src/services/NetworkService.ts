import NetInfo from '@react-native-community/netinfo';
import { create } from 'zustand';

interface NetworkState {
  isConnected: boolean;
  lastChecked: number;
  checkConnection: () => Promise<boolean>;
}

export const useNetworkStore = create<NetworkState>((set) => ({
  isConnected: true,
  lastChecked: 0,
  checkConnection: async () => {
    try {
      const state = await NetInfo.fetch();
      const isConnected = !!state.isConnected;
      set({ 
        isConnected,
        lastChecked: Date.now()
      });
      return isConnected;
    } catch (error) {
      console.error('Failed to check network status:', error);
      return false;
    }
  }
}));

// Set up network state listener
NetInfo.addEventListener((state) => {
  useNetworkStore.setState({ 
    isConnected: !!state.isConnected,
    lastChecked: Date.now()
  });
}); 