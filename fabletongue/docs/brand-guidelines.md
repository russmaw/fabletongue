# FableTongue Brand Guidelines

## Brand Overview

FableTongue represents the intersection of storytelling and language learning, where magical narratives become the vehicle for linguistic growth. Our brand embodies the enchanting journey of language acquisition through immersive storytelling.

## Brand Elements

### Name
- **Full Name**: FableTongue
- **Usage**: Always written as one word with capital 'F' and 'T'
- **Incorrect Uses**: 
  - Fable Tongue
  - fableTongue
  - FABLETONGUE

### Brand Story
FableTongue transforms language learning into an enchanted journey where every word learned is a spell mastered, every conversation a quest completed, and every milestone a chapter in the learner's own magical story.

## Visual Identity

### Color Palette

#### Primary Colors
- **Mystic Purple** (#6A3EA1)
  - Represents magic and wisdom
  - Use for primary actions and headers

- **Story Gold** (#FFB86B)
  - Represents storytelling and achievement
  - Use for highlights and rewards

#### Secondary Colors
- **Sage Green** (#2D9474)
  - Represents growth and progress
  - Use for success states and progress indicators

- **Night Blue** (#1B2D45)
  - Represents depth and knowledge
  - Use for dark mode and backgrounds

#### Accent Colors
- **Spell Pink** (#FF7C7C)
  - Use for alerts and special features
- **Scroll Beige** (#F5E6D3)
  - Use for background textures and cards

### Typography

#### Primary Font
- **Name**: "Crimson Pro"
- **Usage**: Headings and feature text
- **Weights**: Regular (400), Semi-Bold (600), Bold (700)

#### Secondary Font
- **Name**: "Inter"
- **Usage**: Body text and UI elements
- **Weights**: Regular (400), Medium (500)

#### Special Display Font
- **Name**: "Luminari" (or "Dragon Hunter" as fallback)
- **Usage**: Magical elements and special titles
- **Limited Usage**: Only for key magical terms or special headings

### Iconography

#### App Icon
- Minimalist scroll with a glowing magical aura
- Incorporates primary brand colors
- Clear space requirement: 20% of icon size on all sides

#### UI Icons
- Rounded corners (4px radius)
- 2px stroke weight
- Magical theme with subtle gradients
- Consistent 24x24px base size

## Voice and Tone

### Brand Voice
- Enchanting but clear
- Educational but playful
- Magical but grounded
- Encouraging and supportive

### Writing Style
- Use magical metaphors for technical concepts
- Keep instructions clear and concise
- Incorporate storytelling elements
- Maintain an encouraging tone

### Common Phrases
- "Craft your language journey"
- "Master the magic of words"
- "Where stories and languages intertwine"
- "Every word is a new spell"

## UI Elements

### Buttons
- Rounded corners (8px radius)
- Gradient backgrounds using primary colors
- Subtle glow effect on hover
- Clear state changes for interactions

### Cards
- Soft shadows (0 4px 6px rgba(0, 0, 0, 0.1))
- Scroll-like borders on special elements
- Magical accent elements in corners
- Semi-transparent overlays for disabled states

### Progress Indicators
- Animated sparkle effects
- Gradient progress bars
- Circular progress with magical elements
- Clear numerical indicators

## Animation Guidelines

### Transitions
- Smooth easing functions
- Duration: 300ms standard
- Magical particle effects for achievements
- Page transitions with scroll-like animations

### Interactive Elements
- Subtle hover effects
- Clear focus states
- Magical feedback for completions
- Reduced motion option for accessibility

## Accessibility

### Color Contrast
- Minimum contrast ratio: 4.5:1
- Dark mode support
- Clear focus indicators
- Alternative text patterns

### Typography
- Minimum text size: 16px body, 20px headings
- Clear hierarchy
- Adequate line spacing (1.5)
- Responsive scaling

## File Naming Convention

### Assets
- Format: `ft-[category]-[name]-[size].[extension]`
- Example: `ft-icon-spell-24.svg`

### Documentation
- Format: `fabletongue-[category]-[name].[extension]`
- Example: `fabletongue-story-20240215.txt`

## Implementation Guidelines

### Code Constants
```typescript
export const BRAND = {
  name: 'FableTongue',
  colors: {
    mysticPurple: '#6A3EA1',
    storyGold: '#FFB86B',
    sageGreen: '#2D9474',
    nightBlue: '#1B2D45',
    spellPink: '#FF7C7C',
    scrollBeige: '#F5E6D3',
  },
  fonts: {
    primary: 'Crimson Pro',
    secondary: 'Inter',
    display: 'Luminari, "Dragon Hunter", fantasy',
  },
};
```

### CSS Variables
```css
:root {
  --ft-color-primary: #6A3EA1;
  --ft-color-secondary: #FFB86B;
  --ft-font-primary: 'Crimson Pro', serif;
  --ft-font-secondary: 'Inter', sans-serif;
  --ft-radius-standard: 8px;
  --ft-shadow-card: 0 4px 6px rgba(0, 0, 0, 0.1);
}
``` 