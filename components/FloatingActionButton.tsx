import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from 'react-native';
import { Camera, Mic, Cloud, Phone, History, Plus, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Colors } from '../constants/colors';

interface FloatingActionButtonProps {
  onVoiceNote?: () => void;
  onWeatherCheck?: () => void;
  onEmergencyContact?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onVoiceNote,
  onWeatherCheck,
  onEmergencyContact,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const actions = [
    {
      icon: Camera,
      label: 'Quick Scan',
      color: Colors.primary[500],
      onPress: () => {
        router.push('/detect');
        toggleExpanded();
      },
    },
    {
      icon: Mic,
      label: 'Voice Note',
      color: Colors.secondary[500],
      onPress: () => {
        onVoiceNote?.();
        toggleExpanded();
      },
    },
    {
      icon: Cloud,
      label: 'Weather',
      color: Colors.accent.orange,
      onPress: () => {
        onWeatherCheck?.();
        toggleExpanded();
      },
    },
    {
      icon: History,
      label: 'Last Result',
      color: Colors.accent.yellow,
      onPress: () => {
        router.push('/history');
        toggleExpanded();
      },
    },
    {
      icon: Phone,
      label: 'Emergency',
      color: Colors.accent.red,
      onPress: () => {
        onEmergencyContact?.();
        toggleExpanded();
      },
    },
  ];

  const toggleExpanded = () => {
    const toValue = isExpanded ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(rotateAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.stagger(50, actions.map((_, index) =>
        Animated.timing(scaleAnim, {
          toValue,
          duration: 200,
          useNativeDriver: true,
        })
      )),
    ]).start();

    setIsExpanded(!isExpanded);

    // Haptic feedback simulation for web
    if (Platform.OS === 'web') {
      // Visual feedback for web
      console.log('Haptic feedback simulated');
    }
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const renderActionButton = (action: any, index: number) => {
    const IconComponent = action.icon;
    const translateY = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, -(60 * (index + 1))],
    });

    const scale = scaleAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.actionButton,
          {
            transform: [
              { translateY },
              { scale },
            ],
          },
        ]}
      >
        <TouchableOpacity
          onPress={action.onPress}
          style={[styles.actionButtonTouchable, { backgroundColor: action.color }]}
          activeOpacity={0.8}
        >
          <IconComponent size={20} color="white" />
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {isExpanded && <View style={styles.overlay} />}
      
      {actions.map((action, index) => renderActionButton(action, index))}
      
      <TouchableOpacity
        onPress={toggleExpanded}
        style={styles.mainButton}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={styles.mainButtonGradient}
        >
          <Animated.View style={{ transform: [{ rotate: rotation }] }}>
            {isExpanded ? (
              <X size={24} color="white" />
            ) : (
              <Plus size={24} color="white" />
            )}
          </Animated.View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    right: -1000,
    bottom: -1000,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: -1,
  },
  mainButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  mainButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    position: 'absolute',
    bottom: 0,
  },
  actionButtonTouchable: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});