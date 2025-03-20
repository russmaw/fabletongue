import { Character, Quest, GameState, VocabularyWord } from '../types';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import * as Sharing from 'expo-sharing';

interface StoryProgress {
  questsCompleted: number;
  totalExperience: number;
  wordsLearned: number;
  currentLevel: number;
  maslowProgress: {
    level: string;
    progress: number;
  };
}

export class StoryExportService {
  private formatQuestForStory(quest: Quest): string {
    return `
Chapter: ${quest.title}

${quest.description}

In this chapter of your journey:
${quest.objectives.map(obj => `- ${obj}`).join('\n')}

Cultural Context:
${quest.culturalContext || 'No additional cultural context.'}

Challenges Faced:
${quest.challenges?.map(challenge => `
- ${challenge.description}
  Word Mastered: ${challenge.targetWord}
  Difficulty: ${challenge.difficulty}/10
`).join('\n') || 'No specific challenges recorded.'}

Rewards Earned:
- Experience: ${quest.rewards.experience}
${quest.rewards.items?.map(item => `- Item: ${item.name} (${item.description})`).join('\n') || ''}
${quest.rewards.spells?.map(spell => `- Spell: ${spell.word} (${spell.effect})`).join('\n') || ''}

Personal Growth:
${quest.rewards.emotionalGrowth || 'Continuing the journey of self-improvement.'}
`;
  }

  private calculateProgress(gameState: GameState): StoryProgress {
    const completedQuests = gameState.quests.filter(q => q.completed);
    
    return {
      questsCompleted: completedQuests.length,
      totalExperience: completedQuests.reduce((sum, q) => sum + q.rewards.experience, 0),
      wordsLearned: gameState.character.masteredWords.length,
      currentLevel: gameState.character.level,
      maslowProgress: {
        level: gameState.character.currentMaslowLevel,
        progress: this.calculateMaslowProgress(gameState.character),
      },
    };
  }

  private calculateMaslowProgress(character: Character): number {
    const levels: Record<string, number> = {
      physiological: 0,
      safety: 25,
      belonging: 50,
      esteem: 75,
      selfActualization: 100,
    };
    
    return levels[character.currentMaslowLevel] || 0;
  }

  private formatCharacterSummary(character: Character): string {
    return `
${character.name}'s Journey
${'-'.repeat(character.name.length + 9)}

A ${character.level} level language wizard with a ${character.learningStyle} learning style.

"${character.description}"

Current Progress:
- Maslow's Level: ${character.currentMaslowLevel}
- Known Spells: ${character.knownSpells.length}
- Magical Items: ${character.inventory.length}
- Words Mastered: ${character.masteredWords.length}

Journey Stage:
- External: ${character.journeyProgress.external.stage} (${character.journeyProgress.external.progress}%)
- Internal: ${character.journeyProgress.internal.stage} (${character.journeyProgress.internal.progress}%)
`;
  }

  private formatMasteredWords(words: VocabularyWord[]): string {
    return `
Mastered Vocabulary
${'-'.repeat(18)}

${words.map(word => `${word.original} - ${word.translation}
Context: ${word.context.join(', ')}
`).join('\n')}
`;
  }

  public async exportStory(gameState: GameState, format: 'txt' | 'json' = 'txt'): Promise<string> {
    const progress = this.calculateProgress(gameState);
    const completedQuests = gameState.quests.filter(q => q.completed);
    
    let content: string | object;
    
    if (format === 'txt') {
      content = `
${this.formatCharacterSummary(gameState.character)}

Progress Summary
--------------
Quests Completed: ${progress.questsCompleted}
Total Experience: ${progress.totalExperience}
Words Mastered: ${progress.wordsLearned}
Current Level: ${progress.currentLevel}
Maslow's Progress: ${progress.maslowProgress.level} (${progress.maslowProgress.progress}%)

Quest Journal
------------

${completedQuests.map(quest => this.formatQuestForStory(quest)).join('\n\n')}

${this.formatMasteredWords(gameState.character.masteredWords)}
`;
    } else {
      content = {
        character: gameState.character,
        progress,
        completedQuests,
        masteredWords: gameState.character.masteredWords,
      };
    }

    const filename = this.generateFileName(format);
    
    try {
      if (Platform.OS === 'web') {
        // For web, create a downloadable blob
        const blob = new Blob(
          [format === 'txt' ? content as string : JSON.stringify(content, null, 2)],
          { type: format === 'txt' ? 'text/plain' : 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
        return filename;
      } else {
        // For mobile platforms
        const directory = `${FileSystem.documentDirectory}stories/`;
        const filePath = `${directory}${filename}`;
        
        // Ensure directory exists
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        
        // Write the file
        await FileSystem.writeAsStringAsync(
          filePath,
          format === 'txt' ? content as string : JSON.stringify(content, null, 2)
        );
        
        // Share the file
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(filePath);
        }
        
        return filePath;
      }
    } catch (error) {
      console.error('Error exporting story:', error);
      throw new Error('Failed to export story');
    }
  }

  private generateHeader(): string {
    return `FableTongue - Your Magical Journey
===================================`;
  }

  private generateFileName(format: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return `fabletongue-story-${timestamp}.${format}`;
  }
} 