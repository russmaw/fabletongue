import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { webStyles } from './styles/webStyles';
import { speak, scheduleNotification, share } from './utils/webUtils';

export default function App() {
  const handleSpeak = () => {
    speak('Hello from FableTongue!');
  };

  const handleNotification = async () => {
    await scheduleNotification('FableTongue', 'This is a web notification!');
  };

  const handleShare = async () => {
    await share({
      title: 'FableTongue',
      text: 'Check out FableTongue!',
      url: window.location.href,
    });
  };

  return (
    <View style={webStyles.container}>
      <View style={webStyles.header}>
        <Text style={webStyles.responsiveTitle}>FableTongue</Text>
      </View>
      
      <View style={webStyles.content}>
        <View style={webStyles.card}>
          <Text style={webStyles.responsiveText}>
            Welcome to FableTongue on the web!
          </Text>
          
          <View style={webStyles.navigation}>
            <TouchableOpacity
              style={[webStyles.button, webStyles.navButton]}
              onPress={handleSpeak}
            >
              <Text style={webStyles.buttonText}>Speak</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[webStyles.button, webStyles.navButton]}
              onPress={handleNotification}
            >
              <Text style={webStyles.buttonText}>Notify</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[webStyles.button, webStyles.navButton]}
              onPress={handleShare}
            >
              <Text style={webStyles.buttonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
} 