import { Quest, MaslowLevel } from '../types';

export const sampleQuests: Quest[] = [
  // Physiological Level Quests (Basic Needs)
  {
    id: '1',
    title: 'The Market\'s Call',
    description: 'Master the ancient words of sustenance by navigating the magical marketplace.',
    maslowLevel: 'physiological',
    targetWords: ['pan', 'agua', 'comida', 'dormir', 'casa'],
    rewards: {
      experience: 100,
      items: [{
        id: 'food_pouch',
        name: 'Bolsa Mágica',
        translation: 'Magic Pouch',
        description: 'A pouch that helps you remember food-related words.',
        power: 'Food vocabulary boost',
        maslowLevel: 'physiological',
        rarity: 'common',
      }],
    },
    progress: 0,
    completed: false,
  },

  // Safety Level Quests
  {
    id: '2',
    title: 'The Guardian\'s Path',
    description: 'Learn protective enchantments to safeguard your magical sanctuary.',
    maslowLevel: 'safety',
    targetWords: ['proteger', 'seguro', 'fuerte', 'escudo', 'guardia'],
    rewards: {
      experience: 150,
      spells: [{
        id: 'shield_spell',
        word: 'escudo',
        translation: 'shield',
        effect: 'Creates a magical barrier',
        powerLevel: 2,
        mastery: 0,
        lastPracticed: new Date(),
      }],
    },
    progress: 0,
    completed: false,
  },

  // Belonging Level Quests
  {
    id: '3',
    title: 'The Fellowship Gathering',
    description: 'Form bonds with fellow mages by mastering social enchantments.',
    maslowLevel: 'belonging',
    targetWords: ['amigo', 'familia', 'juntos', 'compartir', 'equipo'],
    rewards: {
      experience: 200,
      items: [{
        id: 'friendship_amulet',
        name: 'Amuleto de Amistad',
        translation: 'Friendship Amulet',
        description: 'Enhances your ability to connect with others through language.',
        power: 'Social vocabulary boost',
        maslowLevel: 'belonging',
        rarity: 'rare',
      }],
    },
    progress: 0,
    completed: false,
  },

  // Esteem Level Quests
  {
    id: '4',
    title: 'The Master\'s Challenge',
    description: 'Prove your worth by mastering advanced magical terminology.',
    maslowLevel: 'esteem',
    targetWords: ['poderoso', 'sabio', 'maestro', 'experto', 'talento'],
    rewards: {
      experience: 250,
      spells: [{
        id: 'mastery_spell',
        word: 'maestría',
        translation: 'mastery',
        effect: 'Enhances learning speed',
        powerLevel: 4,
        mastery: 0,
        lastPracticed: new Date(),
      }],
    },
    progress: 0,
    completed: false,
  },

  // Self-Actualization Level Quests
  {
    id: '5',
    title: 'The Path of Enlightenment',
    description: 'Unlock the deepest mysteries of magical language mastery.',
    maslowLevel: 'selfActualization',
    targetWords: ['crear', 'inspirar', 'soñar', 'transformar', 'trascender'],
    rewards: {
      experience: 300,
      items: [{
        id: 'wisdom_crystal',
        name: 'Cristal de Sabiduría',
        translation: 'Crystal of Wisdom',
        description: 'A legendary artifact that unlocks deep understanding of language.',
        power: 'Complete language mastery',
        maslowLevel: 'selfActualization',
        rarity: 'legendary',
      }],
    },
    progress: 0,
    completed: false,
  },
]; 