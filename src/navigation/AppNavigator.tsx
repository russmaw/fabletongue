import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import PracticeScreen from '../screens/PracticeScreen';
import QuestScreen from '../screens/QuestScreen';
import BedtimeMenuScreen from '../screens/BedtimeMenuScreen';
import BedtimeStoryScreen from '../screens/BedtimeStoryScreen';

export type RootStackParamList = {
  Home: undefined;
  Practice: { mode: string };
  Quest: { id: string };
  BedtimeMenu: undefined;
  BedtimeStory: {
    settings: {
      targetDuration: number;
      includeMusic: boolean;
      includeAmbientSounds: boolean;
      autoProgress: boolean;
    };
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Practice" component={PracticeScreen} />
        <Stack.Screen name="Quest" component={QuestScreen} />
        <Stack.Screen name="BedtimeMenu" component={BedtimeMenuScreen} />
        <Stack.Screen
          name="BedtimeStory"
          component={BedtimeStoryScreen}
          options={{
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator; 