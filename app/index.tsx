import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { OnboardingScreen } from '../components/OnboardingScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../components/AuthProvider';
import { Colors } from '../constants/colors';

export default function IndexScreen() {
  const { state } = useAppContext();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated && state.isOnboarded) {
        const timer = setTimeout(() => {
          router.replace('/(tabs)');
        }, 1000);
        return () => clearTimeout(timer);
      } else if (isAuthenticated && !state.isOnboarded) {
        // User is authenticated but hasn't completed onboarding
        return;
      } else if (!isAuthenticated) {
        // User is not authenticated, show auth screen
        const timer = setTimeout(() => {
          router.replace('/auth');
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, loading, state.isOnboarded]);

  if (loading) {
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

  if (isAuthenticated && !state.isOnboarded) {
    return <OnboardingScreen />;
  }

  if (!isAuthenticated) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={[Colors.primary[500], Colors.primary[600]]}
          style={styles.loadingContainer}
        >
          <LoadingSpinner message="Welcome to AgriShield..." size="large" />
        </LinearGradient>
      </View>
    );
  }

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