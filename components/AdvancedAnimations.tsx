import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../constants/colors';

interface AdvancedAnimationsProps {
  children: React.ReactNode;
  animationType?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'bounceIn' | 'morphIn';
  delay?: number;
  duration?: number;
}

export const AdvancedAnimations: React.FC<AdvancedAnimationsProps> = ({
  children,
  animationType = 'fadeIn',
  delay = 0,
  duration = 300
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animations = [];

    switch (animationType) {
      case 'fadeIn':
        animations.push(
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration,
            delay,
            useNativeDriver: true,
          })
        );
        break;

      case 'slideUp':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration,
              delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'scaleIn':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
              toValue: 1,
              delay,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'bounceIn':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: duration / 2,
              delay,
              useNativeDriver: true,
            }),
            Animated.sequence([
              Animated.timing(scaleAnim, {
                toValue: 1.1,
                duration: duration / 3,
                delay,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 0.95,
                duration: duration / 4,
                easing: Easing.in(Easing.quad),
                useNativeDriver: true,
              }),
              Animated.timing(scaleAnim, {
                toValue: 1,
                duration: duration / 4,
                easing: Easing.out(Easing.quad),
                useNativeDriver: true,
              }),
            ]),
          ])
        );
        break;

      case 'morphIn':
        animations.push(
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration,
              delay,
              easing: Easing.elastic(1.2),
              useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
              toValue: 1,
              duration,
              delay,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    if (animations.length > 0) {
      Animated.parallel(animations).start();
    }
  }, [animationType, delay, duration]);

  const getTransform = () => {
    const transforms = [];

    if (animationType === 'slideUp') {
      transforms.push({ translateY: slideAnim });
    }

    if (animationType === 'scaleIn' || animationType === 'bounceIn' || animationType === 'morphIn') {
      transforms.push({ scale: scaleAnim });
    }

    if (animationType === 'morphIn') {
      const rotation = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['10deg', '0deg'],
      });
      transforms.push({ rotate: rotation });
    }

    return transforms;
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: getTransform(),
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Micro-interaction component for buttons
interface MicroInteractionProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: boolean;
  scaleEffect?: boolean;
}

export const MicroInteraction: React.FC<MicroInteractionProps> = ({
  children,
  onPress,
  hapticFeedback = true,
  scaleEffect = true
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (scaleEffect) {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.8,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const handlePressOut = () => {
    if (scaleEffect) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 300,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }

    if (onPress) {
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
      onTouchStart={handlePressIn}
      onTouchEnd={handlePressOut}
    >
      {children}
    </Animated.View>
  );
};

// Parallax scroll effect component
interface ParallaxScrollProps {
  children: React.ReactNode;
  scrollY: Animated.Value;
  speed?: number;
}

export const ParallaxScroll: React.FC<ParallaxScrollProps> = ({
  children,
  scrollY,
  speed = 0.5
}) => {
  const translateY = scrollY.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -speed],
    extrapolateLeft: 'extend',
    extrapolateRight: 'extend',
  });

  return (
    <Animated.View
      style={[
        styles.parallaxContainer,
        {
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Skeleton loading component
export const SkeletonLoader: React.FC<{ width?: number; height?: number; borderRadius?: number }> = ({
  width = 100,
  height = 20,
  borderRadius = 4
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const shimmer = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    );
    shimmer.start();

    return () => shimmer.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  parallaxContainer: {
    flex: 1,
  },
  skeleton: {
    backgroundColor: Colors.neutral[300],
  },
});