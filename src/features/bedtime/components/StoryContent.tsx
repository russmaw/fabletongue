import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import { LoadingState } from '../../../components/LoadingState';
import { ErrorState } from '../../../components/ErrorState';
import { useBedtimeStore } from '../store';

interface StoryContentProps {
  storyId: string;
}

export const StoryContent: React.FC<StoryContentProps> = ({ storyId }) => {
  const theme = useTheme<Theme>();
  const store = useBedtimeStore();
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    const loadStory = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch story content here
        await store.setCurrentStory(storyId);
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [storyId]);

  const handleRetry = () => {
    setIsLoading(true);
    setError(null);
    // Retry loading the story
    store.setCurrentStory(storyId);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
  });

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingState variant="story" lines={3} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ErrorState
          variant={error.message.includes('network') ? 'network' : 'generic'}
          message={error.message}
          onRetry={handleRetry}
        />
      </View>
    );
  }

  // Render actual story content here
  return (
    <View style={styles.container}>
      {/* Story content */}
    </View>
  );
}; 