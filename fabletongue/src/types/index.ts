export type MaslowLevel = 'physiological' | 'safety' | 'belonging' | 'esteem' | 'selfActualization';

export interface Character {
  id: string;
  name: string;
  description: string;
  level: number;
  experience: number;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading/writing';
  targetLanguage: string;
  currentMaslowLevel: MaslowLevel;
  journeyProgress: {
    external: {
      stage: string;
      progress: number;
    };
    internal: {
      stage: string;
      progress: number;
    };
  };
  inventory: MagicalItem[];
  knownSpells: Spell[];
  masteredWords: VocabularyWord[];
}

export interface MagicalItem {
  id: string;
  name: string;
  translation: string;
  description: string;
  power: string;
  maslowLevel: MaslowLevel;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Spell {
  id: string;
  word: string;
  translation: string;
  effect: string;
  powerLevel: number;
  mastery: number;
  lastPracticed: Date;
}

export interface VocabularyWord {
  id: string;
  original: string;
  translation: string;
  context: string[];
  difficulty: number;
  mastered: boolean;
  lastPracticed?: Date;
}

export interface QuestRewards {
  experience: number;
  items?: MagicalItem[];
  spells?: Spell[];
  emotionalGrowth?: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  maslowLevel: MaslowLevel;
  targetWords: string[];
  culturalContext?: string;
  objectives: string[];
  challenges?: {
    type: string;
    description: string;
    targetWord: string;
    difficulty: number;
  }[];
  rewards: QuestRewards;
  difficulty: number;
  progress: number;
  completed: boolean;
}

export interface GameState {
  character: Character;
  currentQuest: Quest | null;
  quests: Quest[];
  settings: {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
  };
} 