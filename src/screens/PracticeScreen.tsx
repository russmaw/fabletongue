import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import useProgressStore from '../services/ProgressManager';
import useStreakStore from '../services/StreakManager';
import TypingInput from '../components/TypingInput';
import { useAdStore } from '../services/AdService';
import AdComponent from '../components/AdComponent';

type Props = NativeStackScreenProps<RootStackParamList, 'Practice'>;

interface PracticeExercise {
  id: string;
  type: 'flashcard' | 'multipleChoice' | 'typing';
  question: string;
  answer: string;
  options?: string[];
  hint?: string;
}

const practiceContent: Record<string, PracticeExercise[]> = {
  vocabulary: [
    {
      id: 'v1',
      type: 'flashcard',
      question: 'Magical Greeting',
      answer: 'Salve',
      hint: 'Used to say hello in a formal setting',
    },
    {
      id: 'v2',
      type: 'multipleChoice',
      question: 'Choose the correct translation: "Good luck with your spells!"',
      answer: 'Fortuna in incantamentis!',
      options: [
        'Fortuna in incantamentis!',
        'Vale in magicis!',
        'Gratias pro auxilium!',
        'Bene in studiis!',
      ],
    },
  ],
  grammar: [
    {
      id: 'g1',
      type: 'multipleChoice',
      question: 'Select the correct verb form: "The wizard ___ casting a spell."',
      answer: 'is',
      options: ['is', 'are', 'be', 'was'],
    },
    {
      id: 'g2',
      type: 'typing',
      question: 'Complete the sentence: "I ___ learning magic." (present continuous)',
      answer: 'am',
    },
  ],
  pronunciation: [
    {
      id: 'p1',
      type: 'flashcard',
      question: 'Practice pronouncing: "Lumos"',
      answer: 'LOO-mos',
      hint: 'Stress on the first syllable',
    },
    {
      id: 'p2',
      type: 'multipleChoice',
      question: 'Which word has the same stress pattern as "Alohomora"?',
      answer: 'Abracadabra',
      options: [
        'Abracadabra',
        'Lumos',
        'Nox',
        'Wingardium',
      ],
    },
  ],
};

const PracticeScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme<Theme>();
  const { mode } = route.params;
  const { addXp } = useProgressStore();
  const { updateStreak } = useStreakStore();
  const { shouldShowAd, incrementExerciseCount } = useAdStore();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [exercises, setExercises] = useState<PracticeExercise[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    setExercises(practiceContent[mode] || []);
  }, [mode]);

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowAnswer(false);
      fadeIn();
    });
  };

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const handleAnswer = async (answer: string) => {
    const currentExercise = exercises[currentIndex];
    const correct = answer.toLowerCase() === currentExercise.answer.toLowerCase();
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }

    setTimeout(async () => {
      setShowFeedback(false);
      if (currentIndex < exercises.length - 1) {
        fadeOut();
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
        }, 200);
      } else {
        // Practice session completed
        const sessionScore = (score / exercises.length) * 100;
        await Promise.all([
          addXp(Math.round(sessionScore / 2), mode as any),
          updateStreak(),
        ]);
        
        // Increment exercise count and show ad if needed
        incrementExerciseCount();
        if (shouldShowAd()) {
          try {
            // Show interstitial ad with a timeout
            const adPromise = new Promise((resolve) => {
              // Component will handle its own errors
              return (
                <>
                  <AdComponent type="interstitial" />
                  {resolve(true)}
                </>
              );
            });
            
            // Wait for ad or timeout after 5 seconds
            await Promise.race([
              adPromise,
              new Promise(resolve => setTimeout(resolve, 5000))
            ]);
          } catch (error) {
            console.error('Ad display error:', error);
          } finally {
            // Always navigate back, even if ad fails
            navigation.goBack();
          }
        } else {
          navigation.goBack();
        }
      }
    }, 1500);
  };

  const currentExercise = exercises[currentIndex];

  if (!currentExercise) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
        <Text variant="magical">No exercises available</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}
      contentContainerStyle={styles.content}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.mysticPurple} />
        </TouchableOpacity>
        <Text variant="magical" style={styles.title}>
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Practice
        </Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        {exercises.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentIndex
                  ? theme.colors.mysticPurple
                  : index < currentIndex
                  ? theme.colors.success
                  : theme.colors.scrollBeige,
              },
            ]}
          />
        ))}
      </View>

      {/* Exercise Content */}
      <Animated.View style={[styles.exerciseContainer, { opacity: fadeAnim }]}>
        <Text variant="body" style={styles.question}>
          {currentExercise.question}
        </Text>

        {currentExercise.type === 'flashcard' && (
          <TouchableOpacity
            style={[styles.flashcard, { backgroundColor: theme.colors.scrollBeige }]}
            onPress={() => setShowAnswer(!showAnswer)}
          >
            <Text variant="body">
              {showAnswer ? currentExercise.answer : 'Tap to reveal'}
            </Text>
            {currentExercise.hint && !showAnswer && (
              <Text variant="caption" style={styles.hint}>
                Hint: {currentExercise.hint}
              </Text>
            )}
          </TouchableOpacity>
        )}

        {currentExercise.type === 'multipleChoice' && (
          <View style={styles.optionsContainer}>
            {currentExercise.options?.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  { backgroundColor: theme.colors.scrollBeige },
                ]}
                onPress={() => handleAnswer(option)}
                disabled={showFeedback}
              >
                <Text variant="body">{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentExercise.type === 'typing' && (
          <View style={styles.typingContainer}>
            <TypingInput
              onSubmit={handleAnswer}
              disabled={showFeedback}
              placeholder="Type your answer..."
            />
          </View>
        )}
      </Animated.View>

      {/* Feedback Overlay */}
      {showFeedback && (
        <View style={[
          styles.feedback,
          { backgroundColor: isCorrect ? theme.colors.success : theme.colors.error }
        ]}>
          <Text variant="magical" style={styles.feedbackText}>
            {isCorrect ? '✨ Excellent! ✨' : 'Keep practicing!'}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    gap: 8,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  exerciseContainer: {
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
  },
  flashcard: {
    width: '100%',
    aspectRatio: 1.6,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    marginTop: 12,
    fontStyle: 'italic',
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  typingContainer: {
    width: '100%',
    alignItems: 'center',
  },
  submitButton: {
    padding: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  feedback: {
    position: 'absolute',
    top: '50%',
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
  },
  feedbackText: {
    color: 'white',
  },
});

export default PracticeScreen; 