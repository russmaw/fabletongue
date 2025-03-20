import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

type FeedbackType = 'loading' | 'success' | 'error';

interface FeedbackOverlayProps {
  visible: boolean;
  type?: FeedbackType;
  message?: string;
  onDismiss?: () => void;
}

export const FeedbackOverlay: React.FC<FeedbackOverlayProps> = ({
  visible,
  type = 'loading',
  message,
  onDismiss,
}) => {
  const theme = useTheme<Theme>();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();

      if (type === 'success' || type === 'error') {
        const timer = setTimeout(() => {
          handleDismiss();
        }, 2000);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, type]);

  const handleDismiss = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      onDismiss?.();
    });
  };

  const getFeedbackContent = () => {
    switch (type) {
      case 'success':
        return {
          icon: 'checkmark-circle',
          color: theme.colors.success,
          defaultMessage: 'Operation completed successfully',
        };
      case 'error':
        return {
          icon: 'alert-circle',
          color: theme.colors.error,
          defaultMessage: 'An error occurred',
        };
      default:
        return {
          color: theme.colors.primary,
          defaultMessage: 'Loading...',
        };
    }
  };

  const { icon, color, defaultMessage } = getFeedbackContent();

  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    content: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: theme.spacing.m,
      minWidth: 120,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    icon: {
      marginBottom: theme.spacing.s,
    },
    message: {
      color: theme.colors.text,
      fontSize: 16,
      textAlign: 'center',
      marginTop: theme.spacing.s,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleDismiss}
    >
      <Animated.View
        style={[
          styles.modalContainer,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <View style={styles.content}>
          {type === 'loading' ? (
            <ActivityIndicator
              size="large"
              color={color}
              style={styles.icon}
            />
          ) : (
            <Ionicons
              name={icon as any}
              size={48}
              color={color}
              style={styles.icon}
            />
          )}
          <Text style={styles.message}>
            {message || defaultMessage}
          </Text>
        </View>
      </Animated.View>
    </Modal>
  );
}; 