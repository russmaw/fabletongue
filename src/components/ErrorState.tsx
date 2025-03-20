import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type ErrorVariant = 'network' | 'notFound' | 'server' | 'generic';

interface ErrorStateProps {
  variant?: ErrorVariant;
  message?: string;
  onRetry?: () => void;
  containerStyle?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  variant = 'generic',
  message,
  onRetry,
  containerStyle,
}) => {
  const theme = useTheme<Theme>();

  const getErrorContent = () => {
    switch (variant) {
      case 'network':
        return {
          icon: 'cloud-offline',
          title: 'Connection Error',
          defaultMessage: 'Please check your internet connection and try again.',
        };
      case 'notFound':
        return {
          icon: 'search',
          title: 'Not Found',
          defaultMessage: 'The requested content could not be found.',
        };
      case 'server':
        return {
          icon: 'server-outline',
          title: 'Server Error',
          defaultMessage: 'Something went wrong on our end. Please try again later.',
        };
      default:
        return {
          icon: 'alert-circle',
          title: 'Error',
          defaultMessage: 'An unexpected error occurred. Please try again.',
        };
    }
  };

  const { icon, title, defaultMessage } = getErrorContent();

  const styles = StyleSheet.create({
    container: {
      padding: theme.spacing.m,
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 200,
    },
    icon: {
      marginBottom: theme.spacing.m,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.s,
      textAlign: 'center',
    },
    message: {
      fontSize: 16,
      color: theme.colors.textMuted,
      textAlign: 'center',
      marginBottom: theme.spacing.m,
      paddingHorizontal: theme.spacing.l,
    },
    retryButton: {
      backgroundColor: theme.colors.primary,
      paddingVertical: theme.spacing.s,
      paddingHorizontal: theme.spacing.m,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
    },
    retryText: {
      color: theme.colors.white,
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={[styles.container, containerStyle]}>
      <Ionicons
        name={icon as any}
        size={64}
        color={theme.colors.textMuted}
        style={styles.icon}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>
        {message || defaultMessage}
      </Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh" size={20} color={theme.colors.white} />
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}; 