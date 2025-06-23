import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { OnboardingScreen } from '../components/OnboardingScreen';
import { AuthScreen } from '../components/AuthScreen';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import { useAuthContext } from '../components/AuthProvider';
import { Colors } from '../constants/colors';

export default function IndexScreen() {
  const { state } = useAppContext();
  const { user, loading } = useAuthContext();

  useEffect(() => {
    // Auto-navigate to main app if user is authenticated and onboarded
    if (user && state.isOnboarded) {
      const timer = setTimeout(() => {
        router.replace('/(tabs)');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [user, state.isOnboarded]);

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

  // Show onboarding if not completed
  if (!state.isOnboarded) {
    return <OnboardingScreen />;
  }

  // Show auth screen if not authenticated
  if (!user) {
    return (
      <AuthScreen 
        onAuthSuccess={() => {
          router.replace('/(tabs)');
        }}
      />
    );
  }

  // Show loading while navigating
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600]]}
        style={styles.loadingContainer}
      >
        <LoadingSpinner message="Welcome back!" size="large" />
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