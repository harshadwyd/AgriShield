import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { OnboardingScreen } from '../components/OnboardingScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { Colors } from '../constants/colors';

export default function IndexScreen() {
  const { state } = useAppContext();

  useEffect(() => {
    // Auto-navigate to main app if already onboarded
    if (state.isOnboarded) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state.isOnboarded]);

  if (state.isOnboarded) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={styles.loadingContainer}
        >
          <LoadingSpinner message="Loading AgriShield..." size="large" />
        </LinearGradient>
      </View>
    );
  }

  return <OnboardingScreen />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});