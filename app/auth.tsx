import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { AuthScreen } from '../components/AuthScreen';
import { useAuthContext } from '../components/AuthProvider';
import { useAppContext } from '../context/AppContext';
import { getThemeColors } from '../constants/colors';

export default function AuthPage() {
  const { isAuthenticated } = useAuthContext();
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);

  const handleAuthSuccess = () => {
    // Navigate to main app after successful authentication
    router.replace('/');
  };

  // If user is already authenticated, redirect to main app
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <AuthScreen onAuthSuccess={handleAuthSuccess} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});