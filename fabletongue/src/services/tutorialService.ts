import { Character, Quest, GameState } from '../types';

export interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string; // CSS selector or component name
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: 'click' | 'type' | 'navigate';
  requiredForProgress?: boolean;
  completed: boolean;
}

export interface TutorialSection {
  id: string;
  title: string;
  steps: TutorialStep[];
  completed: boolean;
}

export class TutorialService {
  private tutorials: {
    characterCreation: TutorialSection;
    firstQuest: TutorialSection;
    spellcasting: TutorialSection;
    inventory: TutorialSection;
    practice: TutorialSection;
  };

  constructor() {
    this.tutorials = {
      characterCreation: {
        id: 'character-creation',
        title: 'Creating Your Magical Identity',
        steps: [
          {
            id: 'welcome',
            title: 'Welcome, Future Language Wizard!',
            description: 'Begin your journey by creating your magical alter ego.',
            target: '.character-creation-form',
            position: 'top',
            completed: false,
          },
          {
            id: 'choose-name',
            title: 'Choose Your Magical Name',
            description: 'Your magical name will be used throughout your journey.',
            target: '.name-input',
            position: 'bottom',
            action: 'type',
            requiredForProgress: true,
            completed: false,
          },
          {
            id: 'select-learning-style',
            title: 'Your Learning Style',
            description: 'Choose how you best learn magic (and language!).',
            target: '.learning-style-selector',
            position: 'right',
            action: 'click',
            requiredForProgress: true,
            completed: false,
          },
        ],
        completed: false,
      },
      firstQuest: {
        id: 'first-quest',
        title: 'Your First Magical Quest',
        steps: [
          {
            id: 'quest-introduction',
            title: 'Quest Introduction',
            description: 'Every journey begins with a single step. Let\'s start your first quest!',
            target: '.quest-board',
            position: 'top',
            completed: false,
          },
          {
            id: 'quest-objectives',
            title: 'Understanding Quest Objectives',
            description: 'Each quest has specific goals to achieve. Complete them to progress!',
            target: '.quest-objectives',
            position: 'right',
            completed: false,
          },
          {
            id: 'vocabulary-practice',
            title: 'Learning New Words',
            description: 'Master new words to enhance your magical abilities.',
            target: '.vocabulary-section',
            position: 'bottom',
            requiredForProgress: true,
            completed: false,
          },
        ],
        completed: false,
      },
      spellcasting: {
        id: 'spellcasting',
        title: 'The Art of Spellcasting',
        steps: [
          {
            id: 'spellbook-intro',
            title: 'Your Spellbook',
            description: 'Your spellbook contains all the magical words you\'ve learned.',
            target: '.spellbook',
            position: 'left',
            completed: false,
          },
          {
            id: 'cast-first-spell',
            title: 'Casting Your First Spell',
            description: 'Practice pronunciation and meaning to cast spells successfully.',
            target: '.spell-practice',
            position: 'bottom',
            action: 'click',
            requiredForProgress: true,
            completed: false,
          },
        ],
        completed: false,
      },
      inventory: {
        id: 'inventory',
        title: 'Managing Your Magical Items',
        steps: [
          {
            id: 'inventory-overview',
            title: 'Your Magical Inventory',
            description: 'Keep track of items you collect on your journey.',
            target: '.inventory-grid',
            position: 'right',
            completed: false,
          },
          {
            id: 'using-items',
            title: 'Using Magical Items',
            description: 'Items can help you learn and practice more effectively.',
            target: '.item-actions',
            position: 'bottom',
            action: 'click',
            completed: false,
          },
        ],
        completed: false,
      },
      practice: {
        id: 'practice',
        title: 'Practice Makes Perfect',
        steps: [
          {
            id: 'practice-modes',
            title: 'Different Ways to Practice',
            description: 'Choose from various practice modes to strengthen your skills.',
            target: '.practice-modes',
            position: 'top',
            completed: false,
          },
          {
            id: 'progress-tracking',
            title: 'Tracking Your Progress',
            description: 'Monitor your improvement and earn rewards.',
            target: '.progress-chart',
            position: 'right',
            completed: false,
          },
        ],
        completed: false,
      },
    };
  }

  public async startTutorial(section: keyof typeof this.tutorials): Promise<TutorialSection> {
    const tutorial = this.tutorials[section];
    if (!tutorial) {
      throw new Error(`Tutorial section ${section} not found`);
    }
    return tutorial;
  }

  public async completeTutorialStep(
    section: keyof typeof this.tutorials,
    stepId: string
  ): Promise<boolean> {
    const tutorial = this.tutorials[section];
    if (!tutorial) {
      return false;
    }

    const step = tutorial.steps.find(s => s.id === stepId);
    if (!step) {
      return false;
    }

    step.completed = true;

    // Check if all required steps are completed
    const allRequiredStepsCompleted = tutorial.steps
      .filter(s => s.requiredForProgress)
      .every(s => s.completed);

    if (allRequiredStepsCompleted) {
      tutorial.completed = true;
    }

    return true;
  }

  public async getTutorialProgress(): Promise<{
    [K in keyof typeof this.tutorials]: {
      completed: boolean;
      progress: number;
    };
  }> {
    const progress = {} as any;

    for (const [key, tutorial] of Object.entries(this.tutorials)) {
      const completedSteps = tutorial.steps.filter(s => s.completed).length;
      const totalSteps = tutorial.steps.length;
      progress[key] = {
        completed: tutorial.completed,
        progress: (completedSteps / totalSteps) * 100,
      };
    }

    return progress;
  }

  public async shouldShowTutorial(gameState: GameState): Promise<boolean> {
    // Show tutorial if:
    // 1. Character is new (level 1)
    // 2. No quests completed
    // 3. No tutorial sections completed
    if (gameState.character.level > 1) {
      return false;
    }

    if (gameState.quests.some(q => q.completed)) {
      return false;
    }

    const progress = await this.getTutorialProgress();
    return !Object.values(progress).some(p => p.completed);
  }

  public async getNextTutorialSection(gameState: GameState): Promise<TutorialSection | null> {
    for (const [key, tutorial] of Object.entries(this.tutorials)) {
      if (!tutorial.completed) {
        return tutorial;
      }
    }
    return null;
  }
} 