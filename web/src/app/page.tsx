'use client';

import { Card } from '@/components/shared/Card';
import { Button } from '@/components/shared/Button';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '@/styles/global';

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to FableTongue</Text>
        <Text style={styles.subtitle}>Learn languages through stories</Text>
      </View>

      <View style={styles.grid}>
        <Card
          title="Start Learning"
          description="Begin your language learning journey with our engaging stories."
          onPress={() => console.log('Start Learning')}
        >
          <Button
            title="Get Started"
            onPress={() => console.log('Get Started')}
          />
        </Card>

        <Card
          title="Featured Stories"
          description="Explore our collection of curated stories for language learners."
          onPress={() => console.log('Featured Stories')}
        />

        <Card
          title="Your Progress"
          description="Track your learning journey and achievements."
          onPress={() => console.log('Your Progress')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    flex: 1,
    minHeight: 800,
  },
  header: {
    alignItems: 'center',
    marginBottom: globalStyles.spacing.xxl,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: globalStyles.text.primary,
    marginBottom: globalStyles.spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: globalStyles.text.secondary,
    textAlign: 'center',
  },
  grid: {
    width: '100%',
    maxWidth: 1200,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: globalStyles.spacing.lg,
  },
}); 