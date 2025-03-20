# FableTongue Tutorial System

The tutorial system provides an interactive, step-by-step guide to help new users understand and navigate the FableTongue application. Through magical metaphors and engaging storytelling, users learn how to use the app while being immersed in the fantasy theme.

## Overview

The tutorial system is designed to:
- Guide users through core features
- Introduce magical concepts and terminology
- Provide contextual help
- Track user progress
- Adapt to user learning style

## Components

### TutorialService

The `TutorialService` manages the tutorial state and progression:

```typescript
interface TutorialStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  magicalEffect?: 'glow' | 'sparkle' | 'float';
  completion?: {
    type: 'action' | 'navigation' | 'interaction';
    value: string;
  };
}

interface TutorialSection {
  id: string;
  title: string;
  steps: TutorialStep[];
  theme: 'spellcasting' | 'exploration' | 'mastery';
}
```

### TutorialOverlay

The `TutorialOverlay` component renders the tutorial UI:
- Magical highlight effects
- Step navigation
- Progress indicators
- Interactive elements

## Usage

### Starting a Tutorial

```typescript
const tutorialService = new TutorialService();

// Start the main tutorial
await tutorialService.start('main');

// Start a feature-specific tutorial
await tutorialService.start('spellcasting');
```

### Creating Tutorial Sections

```typescript
const spellcastingTutorial: TutorialSection = {
  id: 'spellcasting',
  title: 'The Art of Magical Words',
  theme: 'spellcasting',
  steps: [
    {
      id: 'spell-introduction',
      title: 'Your First Spell',
      description: 'Welcome to the magical art of language spellcasting!',
      target: '#spell-book',
      position: 'bottom',
      magicalEffect: 'sparkle',
    },
    // More steps...
  ],
};
```

## Best Practices

### Progressive Disclosure
- Introduce basic concepts first
- Gradually reveal advanced features
- Use magical metaphors consistently
- Provide clear success indicators

### Context Awareness
- Adapt to user's current task
- Recognize completed steps
- Offer relevant suggestions
- Remember user progress

### Accessibility
- Support keyboard navigation
- Provide screen reader descriptions
- Maintain color contrast
- Include skip tutorial option

## Integration

### With Game State
```typescript
function TutorialManager() {
  const gameState = useGameStore();
  const [currentStep, setCurrentStep] = useState<TutorialStep | null>(null);

  useEffect(() => {
    if (gameState.character && !gameState.character.completedTutorial) {
      tutorialService.start('main');
    }
  }, [gameState.character]);
}
```

### With UI Components
```typescript
function SpellbookComponent() {
  const tutorial = useTutorial();
  
  return (
    <View>
      <TutorialHighlight
        active={tutorial.currentStep?.target === '#spell-book'}
        effect="sparkle"
      >
        <SpellBook />
      </TutorialHighlight>
    </View>
  );
}
```

## Events and Hooks

### Tutorial Events
- `onTutorialStart`
- `onStepComplete`
- `onTutorialComplete`
- `onTutorialSkip`

### Custom Hooks
```typescript
function useTutorialProgress() {
  const [progress, setProgress] = useState(0);
  const [currentSection, setCurrentSection] = useState<TutorialSection | null>(null);

  // Implementation...
}
```

## Error Handling

```typescript
try {
  await tutorialService.start('spellcasting');
} catch (error) {
  if (error instanceof TutorialNotFoundError) {
    console.error('Tutorial section not found');
    // Fall back to main tutorial
    await tutorialService.start('main');
  }
  // Handle other errors
}
```

## Example Implementation

```typescript
function WelcomeTutorial() {
  const tutorial = useTutorial();
  const theme = useTheme();

  return (
    <TutorialOverlay
      visible={tutorial.isActive}
      step={tutorial.currentStep}
      onNext={tutorial.nextStep}
      onPrevious={tutorial.previousStep}
      onSkip={tutorial.skip}
      style={{
        backgroundColor: theme.colors.scrollBeige,
        borderRadius: theme.borderRadii.m,
        ...theme.shadows.light.medium,
      }}
    >
      <Text variant="magical">{tutorial.currentStep?.title}</Text>
      <Text variant="body">{tutorial.currentStep?.description}</Text>
      <TutorialNavigation
        currentStep={tutorial.currentStepIndex + 1}
        totalSteps={tutorial.totalSteps}
      />
    </TutorialOverlay>
  );
}
```

## Testing

```typescript
describe('TutorialService', () => {
  it('should progress through tutorial steps', async () => {
    const tutorial = new TutorialService();
    await tutorial.start('main');
    
    expect(tutorial.currentStep?.id).toBe('welcome');
    
    await tutorial.nextStep();
    expect(tutorial.currentStep?.id).toBe('character-creation');
  });
});
```

## Future Enhancements

1. **Advanced Features**
   - Interactive challenges
   - Branching tutorials
   - Personalized paths

2. **Enhanced Feedback**
   - Progress rewards
   - Achievement system
   - Social sharing

3. **Improved Accessibility**
   - Voice guidance
   - Alternative paths
   - Customizable pace 