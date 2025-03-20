import { useState, useEffect, useCallback } from 'react';
import useBackgroundMusic from '../services/BackgroundMusic';
import useSoundEffects from '../services/SoundEffects';

export type StoryMood = 'peaceful' | 'dreamy' | 'calm' | 'gentle';
export type StoryScene = 'forest' | 'stars' | 'moon' | 'clouds' | 'animals';

interface StoryPage {
  text: string;
  mood: StoryMood;
  scene: StoryScene;
  duration: number; // seconds
}

interface StorySettings {
  targetDuration: number; // minutes
  includeMusic: boolean;
  includeAmbientSounds: boolean;
  autoProgress: boolean;
}

interface StoryState {
  currentPage: number;
  timeRemaining: number;
  isPlaying: boolean;
  isComplete: boolean;
}

const generateStoryPages = (duration: number): StoryPage[] => {
  // This is a simple example. In production, this would use a more sophisticated
  // story generation system with proper pacing and narrative structure
  const pagesCount = Math.ceil(duration / 2); // One page every ~2 minutes
  const pages: StoryPage[] = [];

  const moods: StoryMood[] = ['peaceful', 'dreamy', 'calm', 'gentle'];
  const scenes: StoryScene[] = ['forest', 'stars', 'moon', 'clouds', 'animals'];
  
  const storyBeginnings = [
    "In a peaceful forest under twinkling stars...",
    "As the gentle moon rose over the sleepy meadow...",
    "Deep in the magical woods where dreams begin...",
    "On a quiet evening when the clouds danced softly...",
  ];

  const storyMiddles = [
    "The friendly animals gathered for their nightly rest...",
    "Soft moonbeams painted everything in silver light...",
    "A gentle breeze carried sweet dreams through the trees...",
    "The stars sang their quiet lullaby to the world below...",
  ];

  const storyEndings = [
    "And so, wrapped in nature's peaceful embrace, everyone drifted into sweet dreams...",
    "As the night grew deeper, the forest settled into a peaceful slumber...",
    "Under the watchful moon, all found their perfect spot to rest...",
    "The gentle night wrapped everyone in its cozy blanket of stars...",
  ];

  // Generate story structure
  pages.push({
    text: storyBeginnings[Math.floor(Math.random() * storyBeginnings.length)],
    mood: 'peaceful',
    scene: 'forest',
    duration: 120,
  });

  for (let i = 1; i < pagesCount - 1; i++) {
    pages.push({
      text: storyMiddles[Math.floor(Math.random() * storyMiddles.length)],
      mood: moods[Math.floor(Math.random() * moods.length)],
      scene: scenes[Math.floor(Math.random() * scenes.length)],
      duration: 120,
    });
  }

  pages.push({
    text: storyEndings[Math.floor(Math.random() * storyEndings.length)],
    mood: 'dreamy',
    scene: 'stars',
    duration: 120,
  });

  return pages;
};

export const useBedtimeStory = (settings: StorySettings) => {
  const [pages, setPages] = useState<StoryPage[]>([]);
  const [state, setState] = useState<StoryState>({
    currentPage: 0,
    timeRemaining: settings.targetDuration * 60,
    isPlaying: false,
    isComplete: false,
  });

  const { playMusic, stopMusic } = useBackgroundMusic();
  const { playSound } = useSoundEffects();

  useEffect(() => {
    // Generate story based on target duration
    setPages(generateStoryPages(settings.targetDuration));
  }, [settings.targetDuration]);

  useEffect(() => {
    if (!state.isPlaying) return;

    const interval = setInterval(() => {
      setState(prev => {
        const newTimeRemaining = prev.timeRemaining - 1;
        
        if (newTimeRemaining <= 0) {
          clearInterval(interval);
          return {
            ...prev,
            timeRemaining: 0,
            isPlaying: false,
            isComplete: true,
          };
        }

        return { ...prev, timeRemaining: newTimeRemaining };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [state.isPlaying]);

  const start = useCallback(() => {
    if (settings.includeMusic) {
      playMusic('bedtime', 'peaceful');
    }
    playSound('bedtimeStart');
    setState(prev => ({ ...prev, isPlaying: true }));
  }, [settings.includeMusic]);

  const pause = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const nextPage = useCallback(() => {
    if (state.currentPage < pages.length - 1) {
      playSound('bedtimeTransition');
      setState(prev => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  }, [state.currentPage, pages.length]);

  const complete = useCallback(() => {
    stopMusic();
    playSound('bedtimeComplete');
    setState(prev => ({
      ...prev,
      isPlaying: false,
      isComplete: true,
    }));
  }, []);

  return {
    pages,
    currentPage: pages[state.currentPage],
    timeRemaining: state.timeRemaining,
    isPlaying: state.isPlaying,
    isComplete: state.isComplete,
    progress: {
      current: state.currentPage + 1,
      total: pages.length,
    },
    actions: {
      start,
      pause,
      nextPage,
      complete,
    },
  };
};

export default useBedtimeStory; 