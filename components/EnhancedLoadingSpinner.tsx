import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Sprout, Droplets, Sun, Leaf } from 'lucide-react-native';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

interface EnhancedLoadingSpinnerProps {
  message?: string;
  type?: 'analyzing' | 'uploading' | 'downloading' | 'syncing' | 'growing';
  size?: 'small' | 'medium' | 'large';
  showProgress?: boolean;
  progress?: number;
}

export const EnhancedLoadingSpinner: React.FC<EnhancedLoadingSpinnerProps> = ({
  message = 'Loading...',
  type = 'analyzing',
  size = 'medium',
  showProgress = false,
  progress = 0,
}) => {
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);
  
  const spinValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const progressValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleValue, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Continuous spin animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    return () => spinAnimation.stop();
  }, []);

  useEffect(() => {
    if (showProgress) {
      Animated.timing(progressValue, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, showProgress]);

  const getAnimationConfig = () => {
    switch (type) {
      case 'analyzing':
        return {
          icon: Leaf,
          color: Colors.primary[500],
          description: '🔍 Analyzing leaf patterns...',
        };
      case 'uploading':
        return {
          icon: Sprout,
          color: Colors.secondary[500],
          description: '🌱 Seeds sprouting while uploading...',
        };
      case 'downloading':
        return {
          icon: Droplets,
          color: Colors.accent.orange,
          description: '💧 Watering while downloading...',
        };
      case 'syncing':
        return {
          icon: Sun,
          color: Colors.accent.yellow,
          description: '🐝 Bee flying between flowers...',
        };
      case 'growing':
        return {
          icon: Sprout,
          color: Colors.primary[600],
          description: '🌿 Plant growing...',
        };
      default:
        return {
          icon: Leaf,
          color: Colors.primary[500],
          description: 'Processing...',
        };
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'medium': return 48;
      case 'large': return 64;
      default: return 48;
    }
  };

  const config = getAnimationConfig();
  const IconComponent = config.icon;
  const iconSize = getSize();

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidth = progressValue.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeValue,
          transform: [{ scale: scaleValue }],
        },
      ]}
    >
      <View style={styles.spinnerContainer}>
        <Animated.View
          style={[
            styles.spinner,
            {
              width: iconSize + 16,
              height: iconSize + 16,
              borderColor: config.color,
              transform: [{ rotate: spin }],
            },
          ]}
        />
        <View style={[styles.iconContainer, { backgroundColor: theme.background }]}>
          <IconComponent size={iconSize * 0.6} color={config.color} />
        </View>
      </View>

      {showProgress && (
        <View style={[styles.progressContainer, { backgroundColor: theme.border }]}>
          <Animated.View
            style={[
              styles.progressBar,
              {
                width: progressWidth,
                backgroundColor: config.color,
              },
            ]}
          />
        </View>
      )}

      <Text style={[styles.message, { color: theme.text }]}>{message}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {config.description}
      </Text>

      {showProgress && (
        <Text style={[styles.progressText, { color: theme.textSecondary }]}>
          {Math.round(progress)}%
        </Text>
      )}

      {/* Floating particles animation */}
      <View style={styles.particlesContainer}>
        {[...Array(6)].map((_, index) => (
          <FloatingParticle key={index} delay={index * 200} color={config.color} />
        ))}
      </View>
    </Animated.View>
  );
};

const FloatingParticle: React.FC<{ delay: number; color: string }> = ({ delay, color }) => {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: -30,
            duration: 2000,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start(() => {
        translateY.setValue(0);
        opacity.setValue(0);
        animate();
      });
    };

    animate();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.particle,
        {
          backgroundColor: color,
          opacity,
          transform: [{ translateY }],
          left: `${Math.random() * 80 + 10}%`,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  spinnerContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  spinner: {
    borderWidth: 3,
    borderTopColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'transparent',
    borderRadius: 100,
  },
  iconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -12 }],
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: 200,
    height: 6,
    borderRadius: 3,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  particlesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    width: 4,
    height: 4,
    borderRadius: 2,
    top: '60%',
  },
});