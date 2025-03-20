export interface Challenge {
  id: string;
  type: 'translation' | 'vocabulary' | 'grammar' | 'pronunciation';
  difficulty: 'easy' | 'medium' | 'hard';
  content: {
    text: string;
    translation?: string;
    options?: string[];
    correctAnswer?: string;
  };
  points: number;
  createdAt: string;
  completedAt?: string;
}

export interface ChallengeProgress {
  userId: string;
  challengeId: string;
  startedAt: string;
  completedAt?: string;
  attempts: number;
  score: number;
} 