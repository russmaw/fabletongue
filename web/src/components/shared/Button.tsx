import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const Button = ({ onPress, title, variant = 'primary', disabled = false }: ButtonProps) => {
  const buttonStyle = [
    styles.button,
    variant === 'primary' ? styles.buttonPrimary : styles.buttonSecondary,
    disabled && styles.buttonDisabled,
  ];

  const textStyle = [
    styles.text,
    variant === 'secondary' ? styles.textSecondary : styles.textPrimary,
    disabled && styles.textDisabled,
  ];

  return (
    <TouchableOpacity
      style={buttonStyle}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        userSelect: 'none',
      },
    }),
  },
  buttonPrimary: {
    backgroundColor: '#3B82F6', // blue-500
  },
  buttonSecondary: {
    backgroundColor: '#F3F4F6', // gray-100
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  textPrimary: {
    color: '#FFFFFF',
  },
  textSecondary: {
    color: '#374151', // gray-700
  },
  textDisabled: {
    color: '#9CA3AF', // gray-400
  },
}); 