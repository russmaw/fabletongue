import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Character, Quest, MagicalItem, Spell, VocabularyWord, MaslowLevel } from '../types';
import { sampleQuests } from '../data/sampleQuests';

interface GameState {
  character: Character | null;
  currentQuest: Quest | null;
  availableQuests: Quest[];
  inventory: MagicalItem[];
  spells: Spell[];
  masteredWords: VocabularyWord[];
  settings: {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    notificationsEnabled: boolean;
  };
  // Actions
  setCharacter: (character: Character) => void;
  startQuest: (quest: Quest) => void;
  completeQuest: (quest: Quest) => void;
  addItem: (item: MagicalItem) => void;
  learnSpell: (spell: Spell) => void;
  masterWord: (word: VocabularyWord) => void;
  updateSettings: (settings: Partial<GameState['settings']>) => void;
  progressMaslowLevel: () => void;
}

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      character: null,
      currentQuest: null,
      availableQuests: sampleQuests,
      inventory: [],
      spells: [],
      masteredWords: [],
      settings: {
        soundEnabled: true,
        hapticEnabled: true,
        notificationsEnabled: true,
      },

      setCharacter: (character) => set({ character }),

      startQuest: (quest) => set((state) => ({
        currentQuest: quest,
        availableQuests: state.availableQuests.filter(q => q.id !== quest.id),
      })),

      completeQuest: (quest) => {
        const state = get();
        if (!state.character) return;

        // Add rewards to inventory
        quest.rewards.items?.forEach(item => get().addItem(item));
        quest.rewards.spells?.forEach(spell => get().learnSpell(spell));

        // Update character experience and progress
        set((state) => ({
          character: state.character ? {
            ...state.character,
            journeyProgress: {
              ...state.character.journeyProgress,
              external: {
                ...state.character.journeyProgress.external,
                progress: Math.min(1, state.character.journeyProgress.external.progress + 0.1),
              },
            },
          } : null,
          currentQuest: null,
        }));
      },

      addItem: (item) => set((state) => ({
        inventory: [...state.inventory, item],
      })),

      learnSpell: (spell) => set((state) => ({
        spells: [...state.spells, spell],
      })),

      masterWord: (word) => set((state) => ({
        masteredWords: [...state.masteredWords, word],
      })),

      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings },
      })),

      progressMaslowLevel: () => {
        const state = get();
        if (!state.character) return;

        const levels: MaslowLevel[] = [
          'physiological',
          'safety',
          'belonging',
          'esteem',
          'selfActualization',
        ];

        const currentIndex = levels.indexOf(state.character.currentMaslowLevel);
        if (currentIndex < levels.length - 1) {
          set((state) => ({
            character: state.character ? {
              ...state.character,
              currentMaslowLevel: levels[currentIndex + 1],
            } : null,
          }));
        }
      },
    }),
    {
      name: 'fabletongue-storage',
    }
  )
); 