import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Mic, MicOff, Volume2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

interface VoiceCommandsProps {
  onCommand?: (command: string) => void;
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommand }) => {
  const { isDarkMode } = useAppContext();
  const { t } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');

  // Mock voice recognition for web platform
  const mockVoiceRecognition = () => {
    const commands = [
      'take a photo',
      'show my history',
      'what is the weather',
      'record a note',
      'help me with pests',
      'scan my crops',
      'open settings'
    ];
    
    return commands[Math.floor(Math.random() * commands.length)];
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase();
    
    // Provide audio feedback
    speakResponse(`Processing command: ${command}`);
    
    if (lowerCommand.includes('photo') || lowerCommand.includes('scan') || lowerCommand.includes('camera')) {
      router.push('/detect');
      speakResponse('Opening camera for crop scanning');
    } else if (lowerCommand.includes('history')) {
      router.push('/history');
      speakResponse('Showing your detection history');
    } else if (lowerCommand.includes('weather')) {
      speakResponse('Current weather is 28 degrees Celsius, partly cloudy. Good conditions for spraying treatments.');
    } else if (lowerCommand.includes('note') || lowerCommand.includes('record')) {
      speakResponse('Voice note recording started');
      // Implement voice note functionality
    } else if (lowerCommand.includes('help') || lowerCommand.includes('support')) {
      speakResponse('How can I help you with your farming needs?');
    } else if (lowerCommand.includes('settings')) {
      router.push('/settings');
      speakResponse('Opening settings');
    } else {
      speakResponse('I did not understand that command. Try saying take a photo, show history, or what is the weather.');
    }
    
    onCommand?.(command);
  };

  const speakResponse = (text: string) => {
    if (Platform.OS === 'web') {
      // Web Speech API
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    }
    // For mobile platforms, you would use expo-speech
  };

  const startListening = () => {
    if (Platform.OS === 'web') {
      // Mock implementation for web
      setIsListening(true);
      
      setTimeout(() => {
        const mockCommand = mockVoiceRecognition();
        setLastCommand(mockCommand);
        processVoiceCommand(mockCommand);
        setIsListening(false);
      }, 2000);
    } else {
      // For mobile platforms, implement actual speech recognition
      Alert.alert('Voice Commands', 'Voice recognition would be implemented using expo-speech and speech-to-text libraries on mobile platforms.');
    }
  };

  const stopListening = () => {
    setIsListening(false);
  };

  const availableCommands = [
    '"Take a photo" - Opens camera',
    '"Show my history" - View past scans',
    '"What\'s the weather?" - Weather info',
    '"Record a note" - Voice memo',
    '"Help me with..." - Get assistance',
    '"Open settings" - App settings'
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Volume2 size={20} color={Colors.primary[500]} />
        <Text style={[styles.title, { color: theme.text }]}>Voice Commands</Text>
      </View>

      <TouchableOpacity
        onPress={isListening ? stopListening : startListening}
        style={styles.micButton}
        disabled={isListening}
      >
        <LinearGradient
          colors={isListening ? [Colors.accent.red, '#dc2626'] : [Colors.primary[500], Colors.primary[600]]}
          style={styles.micButtonGradient}
        >
          {isListening ? (
            <MicOff size={32} color="white" />
          ) : (
            <Mic size={32} color="white" />
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Text style={[styles.status, { color: theme.textSecondary }]}>
        {isListening ? 'Listening... Speak now' : 'Tap to start voice command'}
      </Text>

      {lastCommand && (
        <View style={[styles.lastCommandContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.lastCommandLabel, { color: theme.textSecondary }]}>Last command:</Text>
          <Text style={[styles.lastCommand, { color: theme.text }]}>"{lastCommand}"</Text>
        </View>
      )}

      <View style={styles.commandsList}>
        <Text style={[styles.commandsTitle, { color: theme.text }]}>Available Commands:</Text>
        {availableCommands.map((command, index) => (
          <Text key={index} style={[styles.commandItem, { color: theme.textSecondary }]}>
            • {command}
          </Text>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  micButton: {
    alignSelf: 'center',
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  micButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  status: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  lastCommandContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  lastCommandLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  lastCommand: {
    fontSize: 14,
    fontWeight: '600',
  },
  commandsList: {
    marginTop: 8,
  },
  commandsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  commandItem: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 4,
  },
});