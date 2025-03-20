# Story Export Documentation

The Story Export feature allows users to save and share their language learning journey in multiple formats, creating a personalized narrative of their progress.

## Features

### Export Formats

1. **Text Format (TXT)**
   - Narrative story structure
   - Formatted sections
   - Progress statistics
   - Quest history
   - Vocabulary list

2. **JSON Format**
   - Structured data
   - Complete game state
   - Progress metrics
   - Detailed quest information
   - Vocabulary tracking

## StoryExportService

The `StoryExportService` handles the creation and export of story files.

### Core Methods

#### exportStory

```typescript
public async exportStory(
  gameState: GameState,
  format: 'txt' | 'json' = 'txt'
): Promise<string>
```

Exports the user's story in the specified format and returns the file path or URL.

### Story Components

#### Character Summary
```typescript
private formatCharacterSummary(character: Character): string
```
Generates a formatted summary of the character's:
- Name and level
- Learning style
- Description
- Progress metrics
- Journey stages

#### Quest History
```typescript
private formatQuestForStory(quest: Quest): string
```
Formats individual quests with:
- Title and description
- Objectives
- Cultural context
- Challenges faced
- Rewards earned
- Personal growth

#### Progress Tracking
```typescript
private calculateProgress(gameState: GameState): StoryProgress
```
Calculates:
- Quests completed
- Total experience
- Words learned
- Current level
- Maslow hierarchy progress

## Usage Examples

### Exporting as Text

```typescript
const storyExport = new StoryExportService();
const filePath = await storyExport.exportStory(gameState, 'txt');
```

### Exporting as JSON

```typescript
const storyExport = new StoryExportService();
const filePath = await storyExport.exportStory(gameState, 'json');
```

## Platform-Specific Handling

### Web Platform
- Creates downloadable blob
- Triggers browser download
- Handles file naming

### Mobile Platforms
- Saves to app directory
- Supports sharing functionality
- Manages file system access

## File Format Examples

### Text Format
```text
Language Quest - Your Magical Journey
===================================

[Character Summary]
Name's Journey
-------------
Level 5 language wizard with visual learning style.

[Progress Summary]
Quests Completed: 10
Total Experience: 1500
Words Mastered: 25
Current Level: 5
Maslow's Progress: belonging (50%)

[Quest Journal]
...
```

### JSON Format
```json
{
  "character": {
    "name": "string",
    "level": number,
    "experience": number,
    // ...other character properties
  },
  "progress": {
    "questsCompleted": number,
    "totalExperience": number,
    "wordsLearned": number,
    // ...other progress metrics
  },
  "completedQuests": [
    // Array of completed quests
  ],
  "masteredWords": [
    // Array of mastered vocabulary
  ]
}
```

## Error Handling

The service includes comprehensive error handling:

```typescript
try {
  const filePath = await storyExport.exportStory(gameState);
} catch (error) {
  console.error('Export error:', error);
  // Handle error appropriately
}
```

## Best Practices

1. **File Management**
   - Clean up temporary files
   - Use appropriate file extensions
   - Handle large datasets efficiently

2. **Formatting**
   - Maintain consistent structure
   - Use clear section headers
   - Include relevant metadata

3. **Platform Compatibility**
   - Handle platform-specific paths
   - Support multiple sharing options
   - Consider file size limitations

4. **Privacy**
   - Remove sensitive information
   - Validate exported data
   - Handle permissions appropriately

## Integration

### With Game State
```typescript
// In your game component
const handleExport = async () => {
  const storyExport = new StoryExportService();
  const filePath = await storyExport.exportStory(currentGameState);
  // Handle successful export
};
```

### With UI
```typescript
function ExportButton({ gameState }) {
  const handleExport = async () => {
    try {
      const storyExport = new StoryExportService();
      await storyExport.exportStory(gameState);
      // Show success message
    } catch (error) {
      // Show error message
    }
  };

  return (
    <Button
      onPress={handleExport}
      title="Export Journey"
    />
  );
}
```

## Performance Considerations

1. **Large Datasets**
   - Stream data when possible
   - Implement pagination for large histories
   - Optimize memory usage

2. **Background Processing**
   - Handle exports asynchronously
   - Show progress indicators
   - Allow cancellation

3. **Caching**
   - Cache recent exports
   - Implement incremental updates
   - Manage cache size

## Future Enhancements

1. **Additional Formats**
   - PDF export
   - HTML export
   - Social media sharing

2. **Enhanced Formatting**
   - Custom templates
   - Theme support
   - Rich media inclusion

3. **Analytics Integration**
   - Track export patterns
   - Gather usage metrics
   - Improve user experience 