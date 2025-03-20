import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useErrorHandler } from '../hooks/useErrorHandler';

interface NetworkStatusProps {
  onNetworkChange?: (isConnected: boolean) => void;
}

export const NetworkStatus: React.FC<NetworkStatusProps> = ({ onNetworkChange }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const { handleWarning } = useErrorHandler('NetworkStatus');
  const translateY = useState(new Animated.Value(-100))[0];

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setIsVisible(!connected);
      onNetworkChange?.(connected);

      if (!connected) {
        handleWarning('Network connection lost', 'NetworkStatus', {
          type: state.type,
          details: state.details,
        });
      }

      // Animate the banner
      Animated.spring(translateY, {
        toValue: !connected ? 0 : -100,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    });

    // Check initial network state
    NetInfo.fetch().then((state: NetInfoState) => {
      const connected = state.isConnected ?? false;
      setIsConnected(connected);
      setIsVisible(!connected);
      onNetworkChange?.(connected);

      if (!connected) {
        handleWarning('No network connection', 'NetworkStatus', {
          type: state.type,
          details: state.details,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, [handleWarning, onNetworkChange, translateY]);

  if (!isVisible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { transform: [{ translateY }] },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.indicator} />
        <Text style={styles.text}>
          {isConnected ? 'Connected' : 'No Internet Connection'}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FF3B30',
    zIndex: 1000,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 8,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default NetworkStatus; 