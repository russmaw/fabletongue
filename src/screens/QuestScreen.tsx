import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from '../components/Text';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Ionicons } from '@expo/vector-icons';
import useChallengeStore from '../services/ChallengeManager';
import useProgressStore from '../services/ProgressManager';

type Props = NativeStackScreenProps<RootStackParamList, 'Quest'>;

interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  completed: boolean;
}

const QuestScreen: React.FC<Props> = ({ route, navigation }) => {
  const theme = useTheme<Theme>();
  const { questId } = route.params;
  const { currentChallenge, completeChallenge } = useChallengeStore();
  const { addXp } = useProgressStore();
  
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  // Generate exercises based on challenge type
  useEffect(() => {
    if (currentChallenge) {
      const generatedExercises = generateExercisesForChallenge(currentChallenge);
      setExercises(generatedExercises);
      fadeIn();
    }
  }, [currentChallenge]);

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleAnswer = async (selectedAnswer: string) => {
    const currentExercise = exercises[currentExerciseIndex];
    const correct = selectedAnswer === currentExercise.correctAnswer;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
    }

    // Update exercise completion status
    const updatedExercises = [...exercises];
    updatedExercises[currentExerciseIndex].completed = true;
    setExercises(updatedExercises);

    // Wait for feedback animation
    setTimeout(() => {
      setShowFeedback(false);
      
      if (currentExerciseIndex < exercises.length - 1) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        fadeIn();
      } else {
        // Quest completed
        const questScore = (score / exercises.length) * 100;
        if (questScore >= 70) { // Pass threshold
          completeChallenge(questId);
          addXp(currentChallenge!.xpReward, currentChallenge!.type);
        }
        navigation.navigate('Home');
      }
    }, 1500);
  };

  const generateExercisesForChallenge = (challenge: Challenge): Exercise[] => {
    // This is a simplified version - you would want to expand this based on your content
    switch (challenge.type) {
      case 'vocabulary':
        return [
          {
            id: '1',
            question: 'What is the magical word for "Hello"?',
            options: ['Salve', 'Vale', 'Gratias', 'Nox'],
            correctAnswer: 'Salve',
            completed: false,
          },
          {
            id: '2',
            question: 'Choose the correct translation for "Thank you"',
            options: ['Vale', 'Gratias', 'Nox', 'Lumos'],
            correctAnswer: 'Gratias',
            completed: false,
          },
          // Add more exercises...
        ];
      case 'grammar':
        return [
          {
            id: '1',
            question: 'Complete the spell: "I ___ studying magic"',
            options: ['am', 'is', 'are', 'be'],
            correctAnswer: 'am',
            completed: false,
          },
          {
            id: '2',
            question: 'Which is the correct form: "The potion ___ ready"',
            options: ['is', 'are', 'be', 'am'],
            correctAnswer: 'is',
            completed: false,
          },
          // Add more exercises...
        ];
      case 'pronunciation':
        return [
          {
            id: '1',
            question: 'Which word has the correct stress pattern: ○●○',
            options: ['Magical', 'Enchanted', 'Potion', 'Spell'],
            correctAnswer: 'Enchanted',
            completed: false,
          },
          {
            id: '2',
            question: 'Choose the word that rhymes with "charm"',
            options: ['Warm', 'Wand', 'Witch', 'Wise'],
            correctAnswer: 'Warm',
            completed: false,
          },
          // Add more exercises...
        ];
      default:
        return [];
    }
  };

  if (!currentChallenge) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}>
        <Text variant="magical">Quest not found</Text>
      </View>
    );
  }

  const currentExercise = exercises[currentExerciseIndex];

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.mainBackground }]}
      contentContainerStyle={styles.content}
    >
      {/* Quest Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.mysticPurple} />
        </TouchableOpacity>
        <Text variant="magical" style={styles.title}>
          {currentChallenge.title}
        </Text>
      </View>

      {/* Progress Indicator */}
      <View style={styles.progressBar}>
        {exercises.map((exercise, index) => (
          <View
            key={exercise.id}
            style={[
              styles.progressDot,
              {
                backgroundColor: index === currentExerciseIndex
                  ? theme.colors.mysticPurple
                  : exercise.completed
                  ? theme.colors.success
                  : theme.colors.scrollBeige,
              },
            ]}
          />
        ))}
      </View>

      {/* Exercise Content */}
      {currentExercise && (
        <Animated.View style={[styles.exerciseContainer, { opacity: fadeAnim }]}>
          <Text variant="body" style={styles.question}>
            {currentExercise.question}
          </Text>

          {/* Answer Options */}
          <View style={styles.optionsContainer}>
            {currentExercise.options.map((option) => (
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
        </Animated.View>
      )}

      {/* Feedback Overlay */}
      {showFeedback && (
        <View style={[
          styles.feedback,
          { backgroundColor: isCorrect ? theme.colors.success : theme.colors.error }
        ]}>
          <Text variant="magical" style={styles.feedbackText}>
            {isCorrect ? '✨ Correct! ✨' : 'Try Again!'}
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
    marginRight: 40, // To center the title accounting for back button
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
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    padding: 16,
    borderRadius: 12,
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

export default QuestScreen; 