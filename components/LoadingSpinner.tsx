import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Colors, DarkColors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'medium' | 'large';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  size = 'medium' 
}) => {
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    const spin = () => {
      spinValue.setValue(0);
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      }).start(() => spin());
    };
    spin();
  }, []);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const getSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'medium': return 24;
      case 'large': return 40;
      default: return 24;
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.spinner,
          {
            width: getSize(),
            height: getSize(),
            borderTopColor: colorScheme.primary[500],
            borderRightColor: colorScheme.primary[300],
            borderBottomColor: colorScheme.primary[300],
            borderLeftColor: colorScheme.primary[300],
            transform: [{ rotate: spin }],
          },
        ]}
      />
      {message && <Text style={[styles.message, { color: theme.textSecondary }]}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  spinner: {
    borderWidth: 2,
    borderRadius: 100,
  },
  message: {
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
});