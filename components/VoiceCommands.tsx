import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform, Animated } from 'react-native';
import { Mic, MicOff, Volume2, Play, Square } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors, DarkColors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

interface VoiceCommandsProps {
  onCommand?: (command: string) => void;
}

export const VoiceCommands: React.FC<VoiceCommandsProps> = ({ onCommand }) => {
  const { isDarkMode } = useAppContext();
  const { t } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [isListening, setIsListening] = useState(false);
  const [lastCommand, setLastCommand] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [speechSupported, setSpeechSupported] = useState(false);
  
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const waveAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Check if speech recognition is supported
    if (Platform.OS === 'web') {
      setSpeechSupported('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    } else {
      // For mobile platforms, assume it's supported (would need expo-speech)
      setSpeechSupported(true);
    }
  }, []);

  useEffect(() => {
    if (isListening) {
      // Start pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Start wave animation
      Animated.loop(
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        })
      ).start();
    } else {
      pulseAnim.setValue(1);
      waveAnim.setValue(0);
    }
  }, [isListening]);

  const speakResponse = (text: string) => {
    if (Platform.OS === 'web') {
      if ('speechSynthesis' in window) {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        utterance.lang = 'en-US';
        
        utterance.onstart = () => console.log('Speech started');
        utterance.onend = () => console.log('Speech ended');
        utterance.onerror = (event) => console.error('Speech error:', event);
        
        window.speechSynthesis.speak(utterance);
      }
    }
    // For mobile platforms, you would use expo-speech
  };

  const processVoiceCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    setLastCommand(command);
    setIsProcessing(true);
    
    // Provide audio feedback
    speakResponse(`Processing command: ${command}`);
    
    setTimeout(() => {
      if (lowerCommand.includes('photo') || lowerCommand.includes('scan') || lowerCommand.includes('camera') || lowerCommand.includes('detect')) {
        router.push('/detect');
        speakResponse('Opening camera for crop scanning');
      } else if (lowerCommand.includes('history') || lowerCommand.includes('past') || lowerCommand.includes('previous')) {
        router.push('/history');
        speakResponse('Showing your detection history');
      } else if (lowerCommand.includes('learn') || lowerCommand.includes('education') || lowerCommand.includes('guide')) {
        router.push('/learn');
        speakResponse('Opening learning resources');
      } else if (lowerCommand.includes('settings') || lowerCommand.includes('preferences') || lowerCommand.includes('config')) {
        router.push('/settings');
        speakResponse('Opening settings');
      } else if (lowerCommand.includes('home') || lowerCommand.includes('dashboard') || lowerCommand.includes('main')) {
        router.push('/');
        speakResponse('Going to home screen');
      } else if (lowerCommand.includes('weather') || lowerCommand.includes('temperature') || lowerCommand.includes('climate')) {
        speakResponse('Current weather is 28 degrees Celsius, partly cloudy. Good conditions for spraying treatments.');
      } else if (lowerCommand.includes('calculator') || lowerCommand.includes('calculate') || lowerCommand.includes('treatment')) {
        speakResponse('Treatment calculator would open here. You can calculate mixing ratios and costs.');
      } else if (lowerCommand.includes('help') || lowerCommand.includes('support') || lowerCommand.includes('assist')) {
        speakResponse('I can help you navigate the app. Try saying take a photo, show history, open settings, or what is the weather.');
      } else if (lowerCommand.includes('hello') || lowerCommand.includes('hi') || lowerCommand.includes('hey')) {
        speakResponse('Hello! I am your AgriShield voice assistant. How can I help you with your farming needs today?');
      } else {
        speakResponse('I did not understand that command. Try saying take a photo, show history, open settings, or what is the weather.');
      }
      
      setIsProcessing(false);
      onCommand?.(command);
    }, 1000);
  };

  const startListening = () => {
    if (!speechSupported) {
      Alert.alert('Not Supported', 'Speech recognition is not supported on this device or browser.');
      return;
    }

    setIsListening(true);
    setRecognizedText('');
    
    if (Platform.OS === 'web') {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
          console.log('Speech recognition started');
          speakResponse('Listening...');
        };

        recognition.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setRecognizedText(interimTranscript || finalTranscript);

          if (finalTranscript) {
            processVoiceCommand(finalTranscript);
            setIsListening(false);
          }
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          let errorMessage = 'Speech recognition failed. ';
          switch (event.error) {
            case 'no-speech':
              errorMessage += 'No speech was detected. Please try again.';
              break;
            case 'audio-capture':
              errorMessage += 'No microphone was found. Please check your microphone.';
              break;
            case 'not-allowed':
              errorMessage += 'Microphone permission was denied. Please allow microphone access.';
              break;
            default:
              errorMessage += 'Please try again.';
          }
          
          Alert.alert('Speech Recognition Error', errorMessage);
        };

        recognition.onend = () => {
          console.log('Speech recognition ended');
          setIsListening(false);
        };

        recognition.start();
      } catch (error) {
        console.error('Speech recognition not supported:', error);
        setIsListening(false);
        Alert.alert('Error', 'Speech recognition failed to start. Please try again.');
      }
    } else {
      // Mock implementation for mobile platforms
      setTimeout(() => {
        const mockCommands = [
          'take a photo',
          'show my history',
          'what is the weather',
          'open settings',
          'help me with pests',
          'scan my crops'
        ];
        
        const mockCommand = mockCommands[Math.floor(Math.random() * mockCommands.length)];
        setRecognizedText(mockCommand);
        processVoiceCommand(mockCommand);
        setIsListening(false);
      }, 2000);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (Platform.OS === 'web' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const testSpeech = () => {
    speakResponse('Voice commands are working correctly. You can now use voice to navigate the app.');
  };

  const availableCommands = [
    '"Take a photo" - Opens camera',
    '"Show my history" - View past scans',
    '"What\'s the weather?" - Weather info',
    '"Open settings" - App settings',
    '"Go to learn" - Educational content',
    '"Help me" - Get assistance'
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Volume2 size={20} color={colorScheme.primary[500]} />
        <Text style={[styles.title, { color: theme.text }]}>Voice Commands</Text>
        <TouchableOpacity onPress={testSpeech} style={styles.testButton}>
          <Play size={16} color={colorScheme.primary[500]} />
        </TouchableOpacity>
      </View>

      <View style={styles.micContainer}>
        <TouchableOpacity
          onPress={isListening ? stopListening : startListening}
          style={styles.micButton}
          disabled={isProcessing}
        >
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <LinearGradient
              colors={isListening ? [colorScheme.accent.red, '#dc2626'] : 
                     isProcessing ? [colorScheme.accent.orange, '#ea580c'] :
                     [colorScheme.primary[500], colorScheme.primary[600]]}
              style={styles.micButtonGradient}
            >
              {isListening ? (
                <Square size={32} color="white" />
              ) : isProcessing ? (
                <Volume2 size={32} color="white" />
              ) : (
                <Mic size={32} color="white" />
              )}
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

        {isListening && (
          <Animated.View 
            style={[
              styles.listeningWave,
              {
                opacity: waveAnim,
                transform: [{
                  scale: waveAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.5],
                  })
                }]
              }
            ]}
          />
        )}
      </View>

      <Text style={[styles.status, { color: theme.textSecondary }]}>
        {isProcessing ? 'Processing command...' :
         isListening ? 'Listening... Speak now' : 
         speechSupported ? 'Tap to start voice command' : 'Voice commands not supported'}
      </Text>

      {recognizedText && (
        <View style={[styles.recognizedTextContainer, { backgroundColor: theme.background }]}>
          <Text style={[styles.recognizedTextLabel, { color: theme.textSecondary }]}>Recognized:</Text>
          <Text style={[styles.recognizedText, { color: theme.text }]}>"{recognizedText}"</Text>
        </View>
      )}

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

      {!speechSupported && (
        <View style={[styles.warningContainer, { backgroundColor: colorScheme.accent.orange }]}>
          <Text style={styles.warningText}>
            ⚠️ Speech recognition not supported on this device/browser
          </Text>
        </View>
      )}
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
    flex: 1,
  },
  testButton: {
    padding: 8,
  },
  micContainer: {
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  micButton: {
    alignSelf: 'center',
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
  listeningWave: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: Colors.primary[300],
    top: -20,
  },
  status: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
    fontWeight: '500',
  },
  recognizedTextContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary[500],
  },
  recognizedTextLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
  },
  recognizedText: {
    fontSize: 14,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  lastCommandContainer: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: Colors.secondary[500],
  },
  lastCommandLabel: {
    fontSize: 12,
    marginBottom: 4,
    fontWeight: '600',
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
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  warningText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '600',
    textAlign: 'center',
  },
});