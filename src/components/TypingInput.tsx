import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import Text from './Text';

interface TypingInputProps {
  onSubmit: (answer: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const TypingInput: React.FC<TypingInputProps> = ({
  onSubmit,
  disabled = false,
  placeholder = 'Type your answer...',
}) => {
  const theme = useTheme<Theme>();
  const [answer, setAnswer] = useState('');

  const handleSubmit = () => {
    if (answer.trim()) {
      onSubmit(answer.trim());
      setAnswer('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.scrollBeige,
            color: theme.colors.darkText,
          },
        ]}
        value={answer}
        onChangeText={setAnswer}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.darkText + '80'}
        autoCapitalize="none"
        autoCorrect={false}
        editable={!disabled}
      />
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: theme.colors.mysticPurple,
            opacity: disabled || !answer.trim() ? 0.5 : 1,
          },
        ]}
        onPress={handleSubmit}
        disabled={disabled || !answer.trim()}
      >
        <Text variant="body" style={{ color: theme.colors.lightText }}>
          Submit
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12,
  },
  input: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  submitButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TypingInput; 