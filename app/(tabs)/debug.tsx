import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DetectionVerifier } from '../../components/DetectionVerifier';
import { getThemeColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';

export default function DebugScreen() {
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView}>
        <DetectionVerifier />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});