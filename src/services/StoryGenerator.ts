import { Story, StoryPage } from './BedtimeStoryManager';
import { StoryMood, StoryScene } from '../hooks/useBedtimeStory';
import { v4 as uuidv4 } from 'uuid';

interface StoryTemplate {
  title: string;
  openings: string[];
  middles: string[];
  endings: string[];
  recommendedMood: StoryMood;
  recommendedScene: StoryScene;
  ambientSoundSets: Record<StoryScene, string[]>;
}

const STORY_TEMPLATES: StoryTemplate[] = [
  {
    title: "The Enchanted Forest",
    openings: [
      "In a peaceful forest under twinkling stars...",
      "Deep in the magical woods where dreams begin...",
      "As the gentle moon rose over the sleepy meadow..."
    ],
    middles: [
      "The friendly animals gathered for their nightly rest...",
      "Soft moonbeams painted everything in silver light...",
      "A gentle breeze carried sweet dreams through the trees..."
    ],
    endings: [
      "And so, wrapped in nature's peaceful embrace, everyone drifted into sweet dreams...",
      "As the night grew deeper, the forest settled into a peaceful slumber...",
      "Under the watchful moon, all found their perfect spot to rest..."
    ],
    recommendedMood: "peaceful",
    recommendedScene: "forest",
    ambientSoundSets: {
      forest: ["crickets", "wind", "birds"],
      stars: ["crickets", "wind"],
      moon: ["crickets", "wind"],
      clouds: ["wind"],
      animals: ["crickets", "birds"]
    }
  },
  {
    title: "Ocean Dreams",
    openings: [
      "By the peaceful seashore as stars twinkled above...",
      "As gentle waves lapped at the moonlit beach...",
      "In a cozy cove where the ocean sang lullabies..."
    ],
    middles: [
      "The sea creatures danced in the moonlit waters...",
      "Waves whispered ancient stories to the shore...",
      "Starfish and shells shared secrets in the sand..."
    ],
    endings: [
      "The ocean's gentle rhythm carried everyone to dreamland...",
      "As the tide rose softly, all drifted into peaceful dreams...",
      "Under the starlit sky, the beach became a perfect place to rest..."
    ],
    recommendedMood: "dreamy",
    recommendedScene: "stars",
    ambientSoundSets: {
      forest: ["wind", "stream"],
      stars: ["waves", "wind"],
      moon: ["waves", "wind"],
      clouds: ["waves", "wind"],
      animals: ["waves", "birds"]
    }
  }
];

export class StoryGenerator {
  private selectRandomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  private generatePage(
    text: string,
    mood: StoryMood,
    scene: StoryScene,
    duration: number,
    ambientSounds: string[]
  ): StoryPage {
    return {
      id: uuidv4(),
      text,
      mood,
      scene,
      duration,
      ambientSounds
    };
  }

  public generateStory(duration: number): Story {
    // Select a random template
    const template = this.selectRandomElement(STORY_TEMPLATES);
    
    // Calculate number of pages based on duration
    const pagesCount = Math.max(3, Math.floor(duration / 2)); // At least 3 pages, roughly 2 minutes per page
    const pageDuration = Math.floor((duration * 60) / pagesCount); // Convert duration to seconds and divide by pages

    // Generate pages
    const pages: StoryPage[] = [];

    // Opening page
    pages.push(
      this.generatePage(
        this.selectRandomElement(template.openings),
        template.recommendedMood,
        template.recommendedScene,
        pageDuration,
        template.ambientSoundSets[template.recommendedScene]
      )
    );

    // Middle pages
    for (let i = 1; i < pagesCount - 1; i++) {
      pages.push(
        this.generatePage(
          this.selectRandomElement(template.middles),
          template.recommendedMood,
          template.recommendedScene,
          pageDuration,
          template.ambientSoundSets[template.recommendedScene]
        )
      );
    }

    // Ending page
    pages.push(
      this.generatePage(
        this.selectRandomElement(template.endings),
        template.recommendedMood,
        template.recommendedScene,
        pageDuration,
        template.ambientSoundSets[template.recommendedScene]
      )
    );

    return {
      id: uuidv4(),
      title: template.title,
      pages,
      duration,
      recommendedMood: template.recommendedMood,
      recommendedScene: template.recommendedScene
    };
  }
} 