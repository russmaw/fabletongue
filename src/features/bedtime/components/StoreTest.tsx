import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator } from 'react-native';
import { useBedtimeStore } from '../store';

export const StoreTest: React.FC = () => {
  const [testStatus, setTestStatus] = useState<string>('');
  const store = useBedtimeStore();

  const runTests = async () => {
    try {
      setTestStatus('Running tests...\n');

      // Test favorites
      await testFavorites();
      setTestStatus(prev => prev + 'Favorites test passed\n');

      // Test progress
      await testProgress();
      setTestStatus(prev => prev + 'Progress test passed\n');

      // Test narration settings
      await testNarrationSettings();
      setTestStatus(prev => prev + 'Narration settings test passed\n');

      // Test notification settings
      await testNotificationSettings();
      setTestStatus(prev => prev + 'Notification settings test passed\n');

      // Test parent controls
      await testParentControls();
      setTestStatus(prev => prev + 'Parent controls test passed\n');

      setTestStatus(prev => prev + 'All tests passed!');
    } catch (error) {
      setTestStatus(prev => prev + `Test failed: ${error}\n`);
    }
  };

  const testFavorites = async () => {
    // Add a favorite
    store.addToFavorites('test-story-1');
    if (!store.favorites.includes('test-story-1')) {
      throw new Error('Failed to add favorite');
    }

    // Remove a favorite
    store.removeFromFavorites('test-story-1');
    if (store.favorites.includes('test-story-1')) {
      throw new Error('Failed to remove favorite');
    }
  };

  const testProgress = async () => {
    // Update progress
    store.updateProgress('test-story-1', 1);
    const progress = store.progress.find(p => p.storyId === 'test-story-1');
    if (!progress || progress.lastPageRead !== 1) {
      throw new Error('Failed to update progress');
    }

    // Add bookmark
    store.addBookmark('test-story-1', 1);
    const progressWithBookmark = store.progress.find(p => p.storyId === 'test-story-1');
    if (!progressWithBookmark || !progressWithBookmark.bookmarks.includes(1)) {
      throw new Error('Failed to add bookmark');
    }

    // Add note
    store.addNote('test-story-1', {
      pageNumber: 1,
      content: 'Test note',
    });
    const progressWithNote = store.progress.find(p => p.storyId === 'test-story-1');
    if (!progressWithNote || !progressWithNote.notes.some(n => n.content === 'Test note')) {
      throw new Error('Failed to add note');
    }

    // Test time spent
    store.incrementTimeSpent('test-story-1', 60);
    const progressWithTime = store.progress.find(p => p.storyId === 'test-story-1');
    if (!progressWithTime || progressWithTime.timeSpent !== 60) {
      throw new Error('Failed to increment time spent');
    }
  };

  const testNarrationSettings = async () => {
    await store.updateNarrationSettings({
      enabled: true,
      voice: 'test-voice',
      speed: 1.5,
      pitch: 1.2,
    });

    if (store.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { narrationSettings } = store;
    if (
      !narrationSettings.enabled ||
      narrationSettings.voice !== 'test-voice' ||
      narrationSettings.speed !== 1.5 ||
      narrationSettings.pitch !== 1.2
    ) {
      throw new Error('Failed to update narration settings');
    }
  };

  const testNotificationSettings = async () => {
    await store.updateNotificationSettings({
      dailyReminder: {
        enabled: true,
        time: '20:00',
      },
      achievements: {
        enabled: true,
      },
      weeklyProgress: {
        enabled: true,
        dayOfWeek: 1,
        time: '18:00',
      },
      socialUpdates: {
        enabled: true,
      },
    });

    if (store.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { notificationSettings } = store;
    if (
      !notificationSettings.dailyReminder.enabled ||
      !notificationSettings.achievements.enabled ||
      !notificationSettings.weeklyProgress.enabled ||
      !notificationSettings.socialUpdates.enabled
    ) {
      throw new Error('Failed to update notification settings');
    }

    // Test individual notification updates
    await store.updateAchievementNotifications(false);
    if (store.notificationSettings.achievements.enabled) {
      throw new Error('Failed to update achievement notifications');
    }

    await store.updateSocialNotifications(false);
    if (store.notificationSettings.socialUpdates.enabled) {
      throw new Error('Failed to update social notifications');
    }
  };

  const testParentControls = async () => {
    await store.updateParentControls({
      maxDuration: 45,
      allowedTimeRange: {
        start: '18:00',
        end: '20:00',
      },
      requireParentUnlock: true,
      restrictedContent: ['scary', 'violent'],
    });

    if (store.isLoading) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const { parentControls } = store;
    if (
      parentControls.maxDuration !== 45 ||
      parentControls.allowedTimeRange.start !== '18:00' ||
      parentControls.allowedTimeRange.end !== '20:00' ||
      !parentControls.requireParentUnlock ||
      !parentControls.restrictedContent.includes('scary') ||
      !parentControls.restrictedContent.includes('violent')
    ) {
      throw new Error('Failed to update parent controls');
    }
  };

  const resetStore = () => {
    store.reset();
    setTestStatus('Store reset\n');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store Test</Text>
      {store.isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Button title="Run Tests" onPress={runTests} />
          <Button title="Reset Store" onPress={resetStore} />
          {store.error && (
            <Text style={styles.error}>{store.error}</Text>
          )}
          <Text style={styles.status}>{testStatus}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    marginTop: 20,
    fontSize: 16,
    fontFamily: 'monospace',
  },
  error: {
    marginTop: 10,
    color: 'red',
    fontSize: 16,
  },
}); 