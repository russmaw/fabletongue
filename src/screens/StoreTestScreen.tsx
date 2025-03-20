import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { StoreTest } from '../features/bedtime/components/StoreTest';

export const StoreTestScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StoreTest />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 