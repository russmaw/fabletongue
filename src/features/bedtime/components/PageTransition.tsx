import React from 'react';
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  Dimensions,
  ViewStyle,
} from 'react-native';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../../../theme';

interface PageTransitionProps {
  children: React.ReactNode;
  onPageForward?: () => void;
  onPageBack?: () => void;
  style?: ViewStyle;
}

export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  onPageForward,
  onPageBack,
  style,
}) => {
  const theme = useTheme<Theme>();
  const { width } = Dimensions.get('window');
  const position = React.useRef(new Animated.Value(0)).current;
  const [currentPage, setCurrentPage] = React.useState<React.ReactNode>(children);
  const [nextPage, setNextPage] = React.useState<React.ReactNode | null>(null);
  const [direction, setDirection] = React.useState<'forward' | 'back' | null>(null);

  React.useEffect(() => {
    if (children !== currentPage) {
      setNextPage(children);
      setDirection('forward');
      animateTransition();
    }
  }, [children]);

  const panResponder = React.useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dx) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        const newDirection = gestureState.dx < 0 ? 'forward' : 'back';
        if (direction !== newDirection) {
          setDirection(newDirection);
          setNextPage(newDirection === 'forward' ? children : currentPage);
        }
        position.setValue(gestureState.dx);
      },
      onPanResponderRelease: (_, gestureState) => {
        const threshold = width * 0.4;
        if (Math.abs(gestureState.dx) > threshold) {
          if (gestureState.dx > 0 && onPageBack) {
            completeTransition('back');
          } else if (gestureState.dx < 0 && onPageForward) {
            completeTransition('forward');
          } else {
            cancelTransition();
          }
        } else {
          cancelTransition();
        }
      },
    })
  ).current;

  const animateTransition = (toValue = -width) => {
    Animated.spring(position, {
      toValue,
      useNativeDriver: true,
      tension: 30,
      friction: 7,
    }).start(({ finished }) => {
      if (finished) {
        setCurrentPage(nextPage);
        setNextPage(null);
        position.setValue(0);
      }
    });
  };

  const completeTransition = (dir: 'forward' | 'back') => {
    const toValue = dir === 'forward' ? -width : width;
    if (dir === 'forward') {
      onPageForward?.();
    } else {
      onPageBack?.();
    }
    animateTransition(toValue);
  };

  const cancelTransition = () => {
    Animated.spring(position, {
      toValue: 0,
      useNativeDriver: true,
      tension: 30,
      friction: 7,
    }).start(() => {
      setNextPage(null);
      setDirection(null);
    });
  };

  const currentPageStyle = {
    transform: [
      {
        translateX: position,
      },
    ],
  };

  const nextPageStyle = {
    transform: [
      {
        translateX: position.interpolate({
          inputRange: [-width, 0, width],
          outputRange: [0, width, width * 2],
        }),
      },
    ],
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      overflow: 'hidden',
    },
    page: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.background,
    },
    shadow: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'black',
      opacity: position.interpolate({
        inputRange: [-width, 0, width],
        outputRange: [0.2, 0, 0.2],
      }),
    },
  });

  return (
    <View style={[styles.container, style]} {...panResponder.panHandlers}>
      <Animated.View style={[styles.page, currentPageStyle]}>
        {currentPage}
      </Animated.View>
      {nextPage && (
        <Animated.View style={[styles.page, nextPageStyle]}>
          {nextPage}
        </Animated.View>
      )}
      <Animated.View style={styles.shadow} pointerEvents="none" />
    </View>
  );
}; 