import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../constants/colors';
import { MicroInteraction } from './AdvancedAnimations';

const { width } = Dimensions.get('window');

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  onPress: () => void;
  gradient?: string[];
  size?: 'small' | 'large';
}

export const ActionCard: React.FC<ActionCardProps> = ({
  title,
  icon,
  onPress,
  gradient = [Colors.primary[500], Colors.primary[600]],
  size = 'small'
}) => {
  const cardWidth = size === 'large' ? (width - 40) : (width - 52) / 2;

  return (
    <TouchableOpacity onPress={onPress} style={[styles.container, { width: cardWidth }]} activeOpacity={0.9}>
      <LinearGradient
        colors={gradient}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {icon}
          </View>
          <Text style={styles.title}>{title}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    marginBottom: 12,
  },
  gradient: {
    padding: 16,
    minHeight: 90,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    lineHeight: 16,
  },
});