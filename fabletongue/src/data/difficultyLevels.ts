export interface DifficultyLevel {
  level: number;
  name: string;
  description: string;
  wordCount: number;
  timeLimit: number;
  mistakesAllowed: number;
}

export const difficultyLevels: DifficultyLevel[] = [
  {
    level: 1,
    name: 'Novice',
    description: 'Perfect for beginners starting their magical journey',
    wordCount: 3,
    timeLimit: 300,
    mistakesAllowed: 3,
  },
  {
    level: 2,
    name: 'Apprentice',
    description: 'For those who have mastered the basics',
    wordCount: 5,
    timeLimit: 240,
    mistakesAllowed: 2,
  },
  {
    level: 3,
    name: 'Adept',
    description: 'Challenge yourself with more complex spells',
    wordCount: 7,
    timeLimit: 180,
    mistakesAllowed: 2,
  },
  {
    level: 4,
    name: 'Expert',
    description: 'Test your mastery with advanced challenges',
    wordCount: 10,
    timeLimit: 120,
    mistakesAllowed: 1,
  },
  {
    level: 5,
    name: 'Master',
    description: 'Only for the most dedicated language wizards',
    wordCount: 15,
    timeLimit: 90,
    mistakesAllowed: 1,
  },
]; 