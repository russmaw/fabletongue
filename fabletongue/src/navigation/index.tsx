import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { CharacterCreation } from '../screens/CharacterCreation';
import { QuestScreen } from '../screens/QuestScreen';
import { SpellbookScreen } from '../screens/SpellbookScreen';
import { InventoryScreen } from '../screens/InventoryScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from '@shopify/restyle';
import { Theme } from '../theme';
import { Ionicons } from '@expo/vector-icons';

// We'll create these screens later
const QuestScreen = () => null;
const SpellbookScreen = () => null;
const InventoryScreen = () => null;
const ProfileScreen = () => null;

export type RootStackParamList = {
  Onboarding: undefined;
  MainGame: undefined;
};

export type MainTabParamList = {
  Quests: undefined;
  Spellbook: undefined;
  Inventory: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs = () => {
  const theme = useTheme<Theme>();

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.card,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
      }}
    >
      <Tab.Screen 
        name="Quests" 
        component={QuestScreen}
        options={{
          title: 'Quests',
        }}
      />
      <Tab.Screen 
        name="Spellbook" 
        component={SpellbookScreen}
        options={{
          title: 'Spellbook',
        }}
      />
      <Tab.Screen 
        name="Inventory" 
        component={InventoryScreen}
        options={{
          title: 'Inventory',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const theme = useTheme<Theme>();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
          headerTintColor: theme.colors.text,
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={CharacterCreation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MainGame"
          component={MainTabs}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 