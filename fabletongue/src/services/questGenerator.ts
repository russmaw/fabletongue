import { Character, Quest, MaslowLevel, VocabularyWord } from '../types';
import OpenAI from 'openai';

// Initialize OpenAI with environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuestContext {
  character: Character;
  maslowLevel: MaslowLevel;
  difficulty: number;
  targetWords: VocabularyWord[];
  completedQuests: Quest[];
  masteredWords: VocabularyWord[];
}

interface QuestTheme {
  setting: string;
  mood: string;
  challengeType: string;
  culturalElement: string;
}

export class QuestGenerator {
  private readonly maslowThemes: Record<MaslowLevel, QuestTheme[]> = {
    physiological: [
      {
        setting: 'Mystical Garden',
        mood: 'peaceful',
        challengeType: 'gathering',
        culturalElement: 'traditional healing practices',
      },
      {
        setting: 'Ancient Kitchen',
        mood: 'nurturing',
        challengeType: 'crafting',
        culturalElement: 'traditional cuisine',
      },
    ],
    safety: [
      {
        setting: 'Enchanted Fortress',
        mood: 'protective',
        challengeType: 'defense',
        culturalElement: 'traditional architecture',
      },
      {
        setting: 'Sacred Grove',
        mood: 'secure',
        challengeType: 'warding',
        culturalElement: 'protective rituals',
      },
    ],
    belonging: [
      {
        setting: 'Magical Academy',
        mood: 'welcoming',
        challengeType: 'cooperation',
        culturalElement: 'community celebrations',
      },
      {
        setting: 'Festival Square',
        mood: 'joyful',
        challengeType: 'social',
        culturalElement: 'traditional festivals',
      },
    ],
    esteem: [
      {
        setting: 'Tournament Arena',
        mood: 'competitive',
        challengeType: 'achievement',
        culturalElement: 'honor systems',
      },
      {
        setting: 'Grand Library',
        mood: 'scholarly',
        challengeType: 'mastery',
        culturalElement: 'academic traditions',
      },
    ],
    selfActualization: [
      {
        setting: 'Celestial Observatory',
        mood: 'enlightening',
        challengeType: 'discovery',
        culturalElement: 'philosophical teachings',
      },
      {
        setting: 'Crystal Cave',
        mood: 'transcendent',
        challengeType: 'innovation',
        culturalElement: 'wisdom traditions',
      },
    ],
  };

  private getQuestTheme(maslowLevel: MaslowLevel, completedQuests: Quest[]): QuestTheme {
    const themes = this.maslowThemes[maslowLevel];
    const usedThemes = new Set(completedQuests.map(q => q.culturalContext));
    
    // Try to find an unused theme first
    const unusedTheme = themes.find(theme => !usedThemes.has(theme.culturalElement));
    if (unusedTheme) {
      return unusedTheme;
    }
    
    // If all themes have been used, pick a random one
    return themes[Math.floor(Math.random() * themes.length)];
  }

  private getLearningStylePrompt(learningStyle: string): string {
    switch (learningStyle) {
      case 'visual':
        return 'Create challenges that emphasize visualization, imagery, and spatial relationships.';
      case 'auditory':
        return 'Design challenges focusing on pronunciation, listening comprehension, and musical elements.';
      case 'kinesthetic':
        return 'Include physical activities, gestures, and interactive elements in the challenges.';
      case 'reading/writing':
        return 'Incorporate written exercises, story elements, and documentation tasks.';
      default:
        return 'Balance different learning approaches in the challenges.';
    }
  }

  private getDifficultyAdjustments(difficulty: number, masteredWords: VocabularyWord[]): string {
    const masteryRate = masteredWords.length > 0
      ? masteredWords.filter(w => w.mastered).length / masteredWords.length
      : 0;

    return `
Difficulty Level: ${difficulty}/10
Current Mastery Rate: ${(masteryRate * 100).toFixed(1)}%

Adjust challenge complexity based on:
${difficulty < 4 ? '- Provide more scaffolding and support' : ''}
${difficulty >= 4 && difficulty < 7 ? '- Balance challenge with achievability' : ''}
${difficulty >= 7 ? '- Create advanced, multi-step challenges' : ''}
${masteryRate > 0.8 ? '- Introduce more complex language patterns' : ''}
${masteryRate < 0.4 ? '- Include more repetition and reinforcement' : ''}
`;
  }

  private async generateQuestPrompt(context: QuestContext): Promise<string> {
    const {
      character,
      maslowLevel,
      difficulty,
      targetWords,
      completedQuests,
      masteredWords
    } = context;
    
    const theme = this.getQuestTheme(maslowLevel, completedQuests);
    const learningStylePrompt = this.getLearningStylePrompt(character.learningStyle);
    const difficultyAdjustments = this.getDifficultyAdjustments(difficulty, masteredWords);
    
    return `
As a master storyteller and language teacher, create an epic quest for a language learning RPG.

Character Profile:
- Name: ${character.name}
- Learning Style: ${character.learningStyle}
- Current Level: ${character.level}
- Emotional Need (Maslow): ${maslowLevel}
- Hero's Journey Stage: ${character.journeyProgress.external.stage}

Quest Theme:
- Setting: ${theme.setting}
- Mood: ${theme.mood}
- Challenge Type: ${theme.challengeType}
- Cultural Element: ${theme.culturalElement}

Learning Context:
- Target Words: ${targetWords.map(w => `${w.original} (${w.translation})`).join(', ')}
- Previously Mastered Words: ${masteredWords.map(w => w.original).join(', ')}
- Completed Quests: ${completedQuests.length}

${difficultyAdjustments}

Learning Style Adaptation:
${learningStylePrompt}

Requirements:
1. Create an emotionally engaging quest that:
   - Resonates with the character's current Maslow level (${maslowLevel})
   - Advances their hero's journey naturally
   - Uses their preferred learning style
   - Incorporates target words organically
   - Builds on previously mastered concepts

2. Include rich cultural context that:
   - Teaches about ${theme.culturalElement}
   - Makes language learning meaningful
   - Creates memorable associations
   - Respects cultural authenticity

3. Design appropriate challenges that:
   - Match the current difficulty level
   - Build on existing knowledge
   - Provide clear progression
   - Offer meaningful choices

4. Create rewards that:
   - Support emotional growth
   - Enhance language mastery
   - Feel epic and magical
   - Connect to the quest theme

Format the response as JSON with:
{
  "title": "Epic quest title",
  "description": "Engaging quest description",
  "objectives": ["list", "of", "specific", "goals"],
  "culturalContext": "Relevant cultural information",
  "challenges": [{
    "type": "challenge type",
    "description": "challenge description",
    "targetWord": "word to practice",
    "difficulty": "1-10",
    "learningStyle": "how this matches the character's learning style"
  }],
  "rewards": {
    "experience": number,
    "items": [{
      "name": "item name",
      "description": "item description",
      "power": "item effect",
      "culturalSignificance": "how this item relates to the cultural theme"
    }],
    "emotionalGrowth": "how this advances character growth",
    "languageMastery": "specific language skills improved"
  }
}
`;
  }

  async generateQuest(context: QuestContext): Promise<Quest> {
    try {
      const prompt = await this.generateQuestPrompt(context);
      
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        response_format: { type: "json_object" },
      });

      const questData = JSON.parse(response.choices[0].message.content || '{}');
      
      // Transform the AI response into a Quest object
      return {
        id: Date.now().toString(),
        title: questData.title,
        description: questData.description,
        maslowLevel: context.maslowLevel,
        targetWords: context.targetWords.map(w => w.original),
        culturalContext: questData.culturalContext,
        objectives: questData.objectives,
        challenges: questData.challenges.map(c => ({
          type: c.type,
          description: c.description,
          targetWord: c.targetWord,
          difficulty: c.difficulty,
        })),
        rewards: {
          experience: questData.rewards.experience,
          items: questData.rewards.items.map(item => ({
            id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
            name: item.name,
            translation: context.targetWords.find(w => w.original === item.name)?.translation || '',
            description: item.description,
            power: item.power,
            maslowLevel: context.maslowLevel,
            rarity: this.calculateItemRarity(context.difficulty),
          })),
          emotionalGrowth: questData.rewards.emotionalGrowth,
        },
        difficulty: context.difficulty,
        progress: 0,
        completed: false,
      };
    } catch (error) {
      console.error('Error generating quest:', error);
      throw new Error('Failed to generate quest');
    }
  }

  private calculateItemRarity(difficulty: number): 'common' | 'rare' | 'epic' | 'legendary' {
    if (difficulty >= 9) return 'legendary';
    if (difficulty >= 7) return 'epic';
    if (difficulty >= 5) return 'rare';
    return 'common';
  }

  async generateQuestBatch(context: QuestContext, count: number): Promise<Quest[]> {
    const quests: Quest[] = [];
    for (let i = 0; i < count; i++) {
      const quest = await this.generateQuest({
        ...context,
        difficulty: Math.min(10, context.difficulty + (i * 0.2)), // Gradually increase difficulty
      });
      quests.push(quest);
    }
    return quests;
  }
} 