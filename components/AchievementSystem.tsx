import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Animated, 
  Modal, 
  ScrollView,
  Dimensions 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Star, Target, Zap, Award, Camera, BookOpen, TrendingUp, X } from 'lucide-react-native';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { height } = Dimensions.get('window');

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  category: 'scanning' | 'learning' | 'streak' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  visible: boolean;
  onClose: () => void;
}

export const AchievementSystem: React.FC<AchievementSystemProps> = ({ visible, onClose }) => {
  const { state, isDarkMode } = useAppContext();
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [celebrationAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(300));

  const achievements: Achievement[] = [
    {
      id: 'first_scan',
      title: 'First Steps',
      description: 'Complete your first crop scan',
      icon: <Camera size={24} color="white" />,
      progress: Math.min(state.detections.length, 1),
      maxProgress: 1,
      unlocked: state.detections.length >= 1,
      category: 'scanning',
      rarity: 'common'
    },
    {
      id: 'scan_master',
      title: 'Scan Master',
      description: 'Complete 10 successful scans',
      icon: <Target size={24} color="white" />,
      progress: Math.min(state.detections.length, 10),
      maxProgress: 10,
      unlocked: state.detections.length >= 10,
      category: 'scanning',
      rarity: 'rare'
    },
    {
      id: 'detection_expert',
      title: 'Detection Expert',
      description: 'Complete 50 crop analyses',
      icon: <Zap size={24} color="white" />,
      progress: Math.min(state.detections.length, 50),
      maxProgress: 50,
      unlocked: state.detections.length >= 50,
      category: 'scanning',
      rarity: 'epic'
    },
    {
      id: 'learning_enthusiast',
      title: 'Learning Enthusiast',
      description: 'Access educational content 5 times',
      icon: <BookOpen size={24} color="white" />,
      progress: 3, // Mock progress
      maxProgress: 5,
      unlocked: false,
      category: 'learning',
      rarity: 'common'
    },
    {
      id: 'streak_warrior',
      title: 'Streak Warrior',
      description: 'Use the app for 7 consecutive days',
      icon: <TrendingUp size={24} color="white" />,
      progress: 4, // Mock progress
      maxProgress: 7,
      unlocked: false,
      category: 'streak',
      rarity: 'rare'
    },
    {
      id: 'farming_legend',
      title: 'Farming Legend',
      description: 'Complete 100 scans and maintain 30-day streak',
      icon: <Trophy size={24} color="white" />,
      progress: state.detections.length,
      maxProgress: 100,
      unlocked: false,
      category: 'milestone',
      rarity: 'legendary'
    },
    {
      id: 'pest_hunter',
      title: 'Pest Hunter',
      description: 'Detect 20 different pest types',
      icon: <Target size={24} color="white" />,
      progress: 8, // Mock progress
      maxProgress: 20,
      unlocked: false,
      category: 'scanning',
      rarity: 'rare'
    },
    {
      id: 'disease_detective',
      title: 'Disease Detective',
      description: 'Identify 15 plant diseases',
      icon: <Zap size={24} color="white" />,
      progress: 5, // Mock progress
      maxProgress: 15,
      unlocked: false,
      category: 'scanning',
      rarity: 'rare'
    },
    {
      id: 'knowledge_seeker',
      title: 'Knowledge Seeker',
      description: 'Complete 10 educational modules',
      icon: <BookOpen size={24} color="white" />,
      progress: 2, // Mock progress
      maxProgress: 10,
      unlocked: false,
      category: 'learning',
      rarity: 'epic'
    },
    {
      id: 'consistency_champion',
      title: 'Consistency Champion',
      description: 'Maintain a 30-day usage streak',
      icon: <TrendingUp size={24} color="white" />,
      progress: 12, // Mock progress
      maxProgress: 30,
      unlocked: false,
      category: 'streak',
      rarity: 'epic'
    }
  ];

  const categories = [
    { id: 'all', name: 'All', icon: Award },
    { id: 'scanning', name: 'Scanning', icon: Camera },
    { id: 'learning', name: 'Learning', icon: BookOpen },
    { id: 'streak', name: 'Streaks', icon: TrendingUp },
    { id: 'milestone', name: 'Milestones', icon: Trophy }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(celebrationAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      slideAnim.setValue(300);
      celebrationAnim.setValue(0);
    }
  }, [visible]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return ['#10b981', '#059669'];
      case 'rare': return ['#3b82f6', '#2563eb'];
      case 'epic': return ['#8b5cf6', '#7c3aed'];
      case 'legendary': return ['#f59e0b', '#d97706'];
      default: return ['#6b7280', '#4b5563'];
    }
  };

  const renderAchievement = (achievement: Achievement) => {
    const progressPercentage = (achievement.progress / achievement.maxProgress) * 100;
    const rarityColors = getRarityColor(achievement.rarity);

    return (
      <TouchableOpacity key={achievement.id} style={[styles.achievementCard, { backgroundColor: theme.surface }]}>
        <LinearGradient
          colors={achievement.unlocked ? rarityColors : ['#6b7280', '#4b5563']}
          style={styles.achievementIcon}
        >
          {achievement.icon}
        </LinearGradient>
        
        <View style={styles.achievementContent}>
          <View style={styles.achievementHeader}>
            <Text style={[styles.achievementTitle, { color: theme.text }]}>{achievement.title}</Text>
            <View style={[styles.rarityBadge, { backgroundColor: rarityColors[0] }]}>
              <Text style={styles.rarityText}>{achievement.rarity.toUpperCase()}</Text>
            </View>
          </View>
          
          <Text style={[styles.achievementDescription, { color: theme.textSecondary }]}>
            {achievement.description}
          </Text>
          
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${progressPercentage}%`,
                    backgroundColor: achievement.unlocked ? rarityColors[0] : Colors.neutral[400]
                  }
                ]} 
              />
            </View>
            <Text style={[styles.progressText, { color: theme.textSecondary }]}>
              {formatNumber(achievement.progress)}/{formatNumber(achievement.maxProgress)}
            </Text>
          </View>
          
          {achievement.unlocked && (
            <View style={styles.unlockedBadge}>
              <Star size={12} color="#fbbf24" />
              <Text style={styles.unlockedText}>UNLOCKED</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalOverlay}>
        <Animated.View 
          style={[
            styles.modalContent,
            { backgroundColor: theme.background },
            { transform: [{ translateY: slideAnim }] }
          ]}
        >
          <View style={[styles.header, { borderBottomColor: theme.border }]}>
            <View style={styles.headerContent}>
              <Trophy size={24} color={Colors.primary[500]} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Achievements</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{formatNumber(unlockedCount)}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Unlocked</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statNumber, { color: theme.text }]}>{formatNumber(totalCount)}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: theme.surface }]}>
              <Text style={[styles.statNumber, { color: theme.text }]}>
                {Math.round((unlockedCount / totalCount) * 100)}%
              </Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Complete</Text>
            </View>
          </View>

          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                  style={[
                    styles.categoryButton,
                    { backgroundColor: theme.surface },
                    selectedCategory === category.id && { backgroundColor: Colors.primary[500] }
                  ]}
                >
                  <IconComponent 
                    size={16} 
                    color={selectedCategory === category.id ? 'white' : theme.textSecondary} 
                  />
                  <Text style={[
                    styles.categoryText,
                    { color: theme.textSecondary },
                    selectedCategory === category.id && { color: 'white' }
                  ]}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <ScrollView 
            style={styles.achievementsList}
            contentContainerStyle={styles.achievementsContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            {filteredAchievements.map(renderAchievement)}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  closeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
    maxHeight: 50,
  },
  categoriesContent: {
    gap: 8,
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  achievementsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  achievementsContent: {
    paddingBottom: 40,
  },
  achievementCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  achievementContent: {
    flex: 1,
  },
  achievementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  rarityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  rarityText: {
    fontSize: 8,
    fontWeight: 'bold',
    color: 'white',
  },
  achievementDescription: {
    fontSize: 12,
    marginBottom: 8,
    lineHeight: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '600',
    minWidth: 40,
  },
  unlockedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  unlockedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fbbf24',
    marginLeft: 4,
  },
});