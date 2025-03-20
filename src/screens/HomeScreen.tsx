import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import Logo from '../components/Logo';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useStoryMusic } from '../hooks/useStoryMusic';
import { Ionicons } from '@expo/vector-icons';
import AnimatedProgressBar from '../components/AnimatedProgressBar';
import useChallengeStore from '../services/ChallengeManager';
import useProgressStore from '../services/ProgressManager';
import AdComponent from '../components/AdComponent';
import ErrorBoundary from '../components/ErrorBoundary';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

interface QuickPracticeOption {
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  mode: string;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme<Theme>();
  const storyMusic = useStoryMusic();
  const [streakCount] = React.useState(7);
  const { currentChallenge, generateNewChallenge } = useChallengeStore();
  const { vocabulary, grammar, pronunciation, level, totalXp } = useProgressStore();

  useEffect(() => {
    if (!currentChallenge) {
      generateNewChallenge();
    }
  }, [currentChallenge]);

  // Progress data (replace with actual progress tracking)
  const progress = {
    vocabulary: 75,
    grammar: 60,
    pronunciation: 45,
  };

  const quickPracticeOptions: QuickPracticeOption[] = [
    {
      id: 'vocab',
      title: 'Vocabulary Spells',
      icon: 'book',
      color: theme.colors.spellPink,
      mode: 'vocabulary'
    },
    {
      id: 'grammar',
      title: 'Grammar Rituals',
      icon: 'school',
      color: theme.colors.crystalBlue,
      mode: 'grammar'
    },
    {
      id: 'pronunciation',
      title: 'Voice Enchantments',
      icon: 'mic',
      color: theme.colors.forestGreen,
      mode: 'pronunciation'
    },
  ];

  const handleStartQuest = () => {
    storyMusic.startQuest();
    navigation.navigate('Quest', { questId: 'intro' });
  };

  const handleQuickPractice = (mode: string) => {
    storyMusic.startPractice();
    navigation.navigate('Practice', { mode });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <Logo size={160} />
        
        <Text variant="magical" style={styles.title}>
          Welcome, Apprentice
        </Text>

        {/* Level and XP Display */}
        <View style={styles.statsContainer}>
          <View style={styles.levelContainer}>
            <Text variant="magical" style={styles.levelText}>
              Level {level}
            </Text>
            <Ionicons name="shield" size={24} color={theme.colors.mysticPurple} />
          </View>
          <Text variant="body" style={styles.xpText}>
            {totalXp} XP Total
          </Text>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakContainer}>
          <Ionicons 
            name="flame" 
            size={24} 
            color={theme.colors.amberGold} 
          />
          <Text variant="body" style={styles.streakText}>
            {streakCount} Day Streak
          </Text>
        </View>

        {/* Daily Challenge */}
        <TouchableOpacity
          style={[styles.dailyChallenge, { backgroundColor: theme.colors.mysticPurple }]}
          onPress={handleStartQuest}
        >
          <View style={styles.challengeHeader}>
            <Text variant="magical" style={[styles.challengeTitle, { color: theme.colors.lightText }]}>
              Daily Challenge
            </Text>
            <Ionicons name="star" size={24} color={theme.colors.amberGold} />
          </View>
          <Text style={[styles.challengeDesc, { color: theme.colors.lightText }]}>
            {currentChallenge?.description || 'Loading challenge...'}
          </Text>
          {currentChallenge && (
            <View style={styles.challengeInfo}>
              <Text style={[styles.challengeReward, { color: theme.colors.amberGold }]}>
                +{currentChallenge.xpReward} XP
              </Text>
              <View style={styles.difficultyContainer}>
                {Array.from({ length: currentChallenge.difficulty }).map((_, i) => (
                  <Ionicons
                    key={i}
                    name="flame"
                    size={16}
                    color={theme.colors.amberGold}
                    style={styles.difficultyIcon}
                  />
                ))}
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* Progress Overview */}
        <View style={styles.progressContainer}>
          <Text variant="header" style={styles.sectionTitle}>
            Magical Proficiency
          </Text>
          <View style={styles.progressBars}>
            <AnimatedProgressBar
              progress={vocabulary}
              label="Vocabulary"
              color={theme.colors.spellPink}
            />
            <AnimatedProgressBar
              progress={grammar}
              label="Grammar"
              color={theme.colors.crystalBlue}
            />
            <AnimatedProgressBar
              progress={pronunciation}
              label="Pronunciation"
              color={theme.colors.forestGreen}
            />
          </View>
        </View>

        {/* Quick Practice Options */}
        <Text variant="header" style={styles.sectionTitle}>
          Quick Practice
        </Text>
        <View style={styles.quickPracticeGrid}>
          {quickPracticeOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.practiceOption, { backgroundColor: option.color }]}
              onPress={() => handleQuickPractice(option.mode)}
            >
              <Ionicons name={option.icon} size={24} color={theme.colors.lightText} />
              <Text
                variant="body"
                style={[styles.optionText, { color: theme.colors.lightText }]}
              >
                {option.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Main Quest Button */}
        <TouchableOpacity
          style={[styles.mainButton, { backgroundColor: theme.colors.mysticPurple }]}
          onPress={handleStartQuest}
        >
          <Text variant="magical" style={[styles.buttonText, { color: theme.colors.lightText }]}>
            Begin Your Quest
          </Text>
        </TouchableOpacity>

        <View style={styles.section}>
          <Text variant="sectionTitle">Special Features</Text>
          <View style={styles.buttonGrid}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.colors.secondary }]}
              onPress={() => navigation.navigate('BedtimeMenu')}
            >
              <Ionicons
                name="moon"
                size={24}
                color={theme.colors.white}
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText} variant="buttonLabel">
                Bedtime Stories
              </Text>
              <Text style={styles.buttonSubtext} variant="caption">
                Peaceful tales for sweet dreams
              </Text>
            </TouchableOpacity>
            
            {/* ... other special feature buttons ... */}
          </View>
        </View>
      </ScrollView>
      <View style={styles.adContainer}>
        <ErrorBoundary
          onError={(error) => {
            console.error('Ad error in HomeScreen:', error);
          }}
        >
          <AdComponent 
            type="banner"
            onLoadError={(error) => {
              console.error('Ad load error:', error);
            }}
          />
        </ErrorBoundary>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    marginVertical: 20,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakText: {
    marginLeft: 8,
  },
  dailyChallenge: {
    width: '100%',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
  },
  challengeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  challengeTitle: {
    fontSize: 20,
  },
  challengeDesc: {
    opacity: 0.9,
  },
  progressContainer: {
    width: '100%',
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  progressBars: {
    gap: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  levelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  levelText: {
    fontSize: 24,
  },
  xpText: {
    opacity: 0.8,
  },
  challengeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  challengeReward: {
    fontSize: 16,
  },
  difficultyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  difficultyIcon: {
    marginLeft: 8,
  },
  quickPracticeGrid: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  practiceOption: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionText: {
    marginTop: 8,
    textAlign: 'center',
  },
  mainButton: {
    width: '100%',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
  section: {
    width: '100%',
    marginBottom: 24,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  button: {
    flex: 1,
    minWidth: '45%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonIcon: {
    marginBottom: 8,
  },
  buttonSubtext: {
    opacity: 0.8,
  },
  adContainer: {
    width: '100%',
    minHeight: 50,
    marginTop: 8,
  },
});

export default HomeScreen; 