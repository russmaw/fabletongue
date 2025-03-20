import OpenAI from 'openai';
import { Character, Quest, VocabularyWord, MagicalItem, Spell } from '../types';

// Initialize OpenAI - in production, use environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface QuestGenerationParams {
  character: Character;
  currentMaslowLevel: string;
  targetWords: string[];
  heroJourneyStage: string;
}

interface EncounterGenerationParams {
  character: Character;
  quest: Quest;
  currentWord: VocabularyWord;
  emotionalContext: string;
}

export class AIService {
  async interpretCharacter(description: string): Promise<Partial<Character>> {
    const prompt = `
      As a language learning game master, interpret this character description:
      "${description}"
      
      Create a rich character profile that includes:
      1. Their motivations for learning
      2. Suggested learning style
      3. Types of quests that would suit them
      4. Thematic elements for their journey
      
      Keep the tone magical and epic, but accessible for language learning.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    // In a real implementation, parse the response and create a character profile
    return {
      // Basic implementation - expand based on AI response
      currentMaslowLevel: 'physiological',
      journeyProgress: {
        external: { stage: 'call', progress: 0 },
        internal: { stage: 'need', progress: 0 },
      },
    };
  }

  private async generatePrompt(params: QuestGenerationParams): Promise<string> {
    return `
      As a magical language learning game master, create an epic quest for:
      Character: ${params.character.description}
      Learning: ${params.character.targetLanguage}
      Maslow Level: ${params.currentMaslowLevel}
      Hero's Journey Stage: ${params.heroJourneyStage}
      Target Words: ${params.targetWords.join(', ')}

      Create a quest that:
      1. Feels epic and magical like Skyrim
      2. Naturally incorporates the target words
      3. Matches the character's current emotional needs (${params.currentMaslowLevel})
      4. Advances their hero's journey (${params.heroJourneyStage})
      5. Uses persuasive storytelling techniques
      6. Creates emotional investment
      7. Provides clear language learning goals

      Format the response as JSON with:
      - title: Epic quest title
      - description: Engaging quest description
      - objectives: List of specific goals
      - rewards: Appropriate magical rewards
      - emotionalRewards: How it fulfills current needs
      - progression: How it advances the hero's journey
    `;
  }

  async generateQuest(params: QuestGenerationParams): Promise<Quest> {
    const prompt = await this.generatePrompt(params);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const questData = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      id: Date.now().toString(),
      title: questData.title,
      description: questData.description,
      maslowLevel: params.currentMaslowLevel as any,
      targetWords: params.targetWords,
      rewards: await this.generateRewards(questData.rewards, params),
      progress: 0,
      completed: false,
    };
  }

  private async generateRewards(rewardDescription: string, params: QuestGenerationParams) {
    const prompt = `
      Create magical rewards for completing a quest at the ${params.currentMaslowLevel} level.
      Quest rewards should include:
      ${rewardDescription}
      
      Format as JSON with:
      - experience: number
      - items: array of magical items
      - spells: array of learned spells
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  async generateEncounter(params: EncounterGenerationParams): Promise<string> {
    const prompt = `
      Create an epic magical encounter in ${params.character.targetLanguage} that teaches the word "${params.currentWord.original}".
      
      Character Context:
      - Description: ${params.character.description}
      - Current Quest: ${params.quest.title}
      - Emotional Context: ${params.emotionalContext}
      - Word to Learn: ${params.currentWord.original} (${params.currentWord.translation})
      
      The encounter should:
      1. Feel like a moment from Skyrim
      2. Create emotional investment
      3. Use persuasive storytelling
      4. Make the word memorable
      5. Provide clear context
      6. Include practice opportunities
      
      Include:
      1. Scene description
      2. Character dialogue
      3. Interactive elements
      4. Word usage examples
      5. Cultural context
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    return response.choices[0].message.content || "An error occurred generating the encounter.";
  }

  async generateCharacterInsights(description: string): Promise<any> {
    const prompt = `
      Analyze this character description for a language learning RPG:
      "${description}"
      
      Provide insights on:
      1. Learning style preferences
      2. Motivational factors
      3. Emotional needs (Maslow)
      4. Ideal quest types
      5. Recommended progression path
      6. Potential challenges
      7. Suggested rewards
      
      Format as JSON with clear sections.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }
} 