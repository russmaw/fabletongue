import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';
import Text from '../../../components/Text';
import { useBedtimeStore } from '../store';
import { StoryNote, StoryProgress } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface StoryNotesProps {
  storyId: string;
  currentPage: number;
}

export const StoryNotes: React.FC<StoryNotesProps> = ({
  storyId,
  currentPage,
}) => {
  const theme = useTheme<Theme>();
  const [newNote, setNewNote] = useState('');
  const { progress, addNote, removeNote } = useBedtimeStore();

  const storyProgress = progress.find((p: StoryProgress) => p.storyId === storyId);
  const notes = storyProgress?.notes.filter((n: StoryNote) => n.pageNumber === currentPage) || [];

  const handleAddNote = () => {
    if (newNote.trim()) {
      addNote(storyId, {
        pageNumber: currentPage,
        content: newNote.trim(),
      });
      setNewNote('');
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.spacing.m,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.colors.text,
    },
    noteCount: {
      fontSize: 14,
      color: theme.colors.textMuted,
    },
    inputContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.m,
    },
    input: {
      flex: 1,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: theme.spacing.s,
      marginRight: theme.spacing.s,
      color: theme.colors.text,
      backgroundColor: theme.colors.background,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      padding: theme.spacing.s,
      justifyContent: 'center',
      alignItems: 'center',
    },
    addButtonText: {
      color: theme.colors.white,
      fontWeight: 'bold',
    },
    notesList: {
      flex: 1,
    },
    noteItem: {
      backgroundColor: theme.colors.cardBackground,
      borderRadius: 8,
      padding: theme.spacing.m,
      marginBottom: theme.spacing.s,
    },
    noteContent: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    noteTimestamp: {
      fontSize: 12,
      color: theme.colors.textMuted,
    },
    deleteButton: {
      position: 'absolute',
      top: theme.spacing.s,
      right: theme.spacing.s,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.colors.textMuted,
      textAlign: 'center',
    },
  });

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Notes</Text>
        <Text style={styles.noteCount}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newNote}
          onChangeText={setNewNote}
          placeholder="Add a note..."
          placeholderTextColor={theme.colors.textMuted}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.addButton,
            !newNote.trim() && { opacity: 0.5 },
          ]}
          onPress={handleAddNote}
          disabled={!newNote.trim()}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notesList}>
        {notes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No notes for this page yet.{'\n'}
              Add your first note above!
            </Text>
          </View>
        ) : (
          notes.map((note: StoryNote) => (
            <View key={note.id} style={styles.noteItem}>
              <Text style={styles.noteContent}>{note.content}</Text>
              <Text style={styles.noteTimestamp}>
                {formatDate(note.createdAt)}
              </Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeNote(storyId, note.id)}
              >
                <Ionicons
                  name="close-circle"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}; 