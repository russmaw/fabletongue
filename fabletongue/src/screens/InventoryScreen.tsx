import React, { useState } from 'react';
import { StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Box, Text } from '../components/themed';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import * as Haptics from 'expo-haptics';
import { MagicalItem } from '../types';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 48) / 2;

interface ItemCardProps {
  item: MagicalItem;
  onSelect: (item: MagicalItem) => void;
}

const ItemCard = ({ item, onSelect }: ItemCardProps) => {
  const theme = useTheme<Theme>();
  const [glowAnim] = useState(new Animated.Value(0));

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
    onSelect(item);
  };

  const getRarityColor = (rarity: MagicalItem['rarity']) => {
    return theme.colors[rarity];
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <Animated.View
        style={[
          styles.itemCard,
          {
            borderColor: getRarityColor(item.rarity),
            shadowColor: getRarityColor(item.rarity),
            shadowOpacity: glowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          },
        ]}
      >
        <LinearGradient
          colors={[theme.colors.cardPrimary, theme.colors.background]}
          style={styles.cardGradient}
        >
          <Box padding="m">
            <Text variant="subheader" color={item.rarity} marginBottom="s">
              {item.name}
            </Text>
            <Text variant="body" color="textSecondary" marginBottom="s">
              {item.translation}
            </Text>
            <Text variant="caption" color="textSecondary" numberOfLines={2}>
              {item.description}
            </Text>
            <Text variant="caption" color="accent" marginTop="s">
              Power: {item.power}
            </Text>
          </Box>
        </LinearGradient>
      </Animated.View>
    </TouchableOpacity>
  );
};

export const InventoryScreen = () => {
  const theme = useTheme<Theme>();
  const [selectedItem, setSelectedItem] = useState<MagicalItem | null>(null);

  // Sample items - in real app, these would come from your game state
  const sampleItems: MagicalItem[] = [
    {
      id: '1',
      name: 'Amuleto de Sabiduría',
      translation: 'Amulet of Wisdom',
      description: 'An ancient amulet that enhances your learning abilities.',
      power: 'Increases vocabulary retention',
      maslowLevel: 'safety',
      rarity: 'rare',
    },
    {
      id: '2',
      name: 'Anillo de Memoria',
      translation: 'Ring of Memory',
      description: 'A magical ring that helps you remember words more easily.',
      power: 'Boosts recall speed',
      maslowLevel: 'esteem',
      rarity: 'epic',
    },
    // Add more sample items
  ];

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.card]}
      style={styles.container}
    >
      <Box flex={1} padding="l">
        <Text variant="header" color="primary" marginBottom="xl">
          Magical Items
        </Text>
        <Box style={styles.itemGrid}>
          {sampleItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onSelect={setSelectedItem}
            />
          ))}
        </Box>
      </Box>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemCard: {
    width: ITEM_WIDTH,
    marginBottom: 16,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    elevation: 5,
  },
  cardGradient: {
    borderRadius: 6,
  },
  itemGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
}); 