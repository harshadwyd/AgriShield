import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
  Platform,
  Alert,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { 
  Scan, 
  History, 
  Video, 
  FileText, 
  Wheat, 
  Phone, 
  Cloud, 
  Thermometer, 
  Droplets, 
  TrendingUp, 
  TriangleAlert as AlertTriangle, 
  Trophy, 
  Zap, 
  Calculator, 
  ArrowLeftRight,
  User,
  Settings
} from 'lucide-react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { ActionCard } from '../../components/ActionCard';
import { DynamicGreeting } from '../../components/DynamicGreeting';
import { FloatingActionButton } from '../../components/FloatingActionButton';
import { AchievementSystem } from '../../components/AchievementSystem';
import { VoiceCommands } from '../../components/VoiceCommands';
import { TreatmentCalculator } from '../../components/TreatmentCalculator';
import { PhotoComparison } from '../../components/PhotoComparison';
import { AdvancedAnimations, MicroInteraction } from '../../components/AdvancedAnimations';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../components/AuthProvider';
import { useDetections } from '../../hooks/useDetections';
import { useTranslation } from '../../hooks/useTranslation';
import { mockWeatherData } from '../../constants/mockData';

const { width, height } = Dimensions.get('window');

// Enhanced hook for dynamic padding that accounts for tab bar
const useDynamicPadding = () => {
  const insets = useSafeAreaInsets();
  
  return useMemo(() => {
    if (Platform.OS === 'ios') {
      // Account for tab bar height + safe area + extra clearance
      const bottomInset = Math.max(insets.bottom, 20);
      return 65 + bottomInset + 20; // Tab bar + safe area + clearance
    } else {
      // For Android, handle gesture navigation
      const hasGestureNav = height > 800 && insets.bottom > 0;
      const systemNavHeight = hasGestureNav ? insets.bottom : 0;
      return 65 + Math.max(systemNavHeight + 8, 12) + 20; // Tab bar + nav + clearance
    }
  }, [insets.bottom]);
};

export default function HomeScreen() {
  const { state, isDarkMode } = useAppContext();
  const { user, profile } = useAuthContext();
  const { detections, loading: detectionsLoading, refresh } = useDetections({ limit: 5, autoRefresh: true });
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  const dynamicPadding = useDynamicPadding();
  
  const [showAchievements, setShowAchievements] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  
  const recentDetections = detections.slice(0, 3);
  const totalDetections = detections.length;
  const issuesDetected = detections.filter(d => 
    d.result_data?.severity === 'High' || d.result_data?.severity === 'Medium'
  ).length;

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const actionCards = [
    {
      title: t('actions.scanNow'),
      icon: <Scan size={20} color="white" />,
      onPress: () => router.push('/detect'),
      gradient: [colorScheme.primary[500], colorScheme.primary[600]],
    },
    {
      title: t('actions.history'),
      icon: <History size={20} color="white" />,
      onPress: () => router.push('/history'),
      gradient: [colorScheme.secondary[500], colorScheme.secondary[600]],
    },
    {
      title: 'Calculator',
      icon: <Calculator size={20} color="white" />,
      onPress: () => setShowCalculator(true),
      gradient: [colorScheme.accent.orange, '#ea580c'],
    },
    {
      title: 'Compare Photos',
      icon: <ArrowLeftRight size={20} color="white" />,
      onPress: () => setShowComparison(true),
      gradient: ['#8b5cf6', '#7c3aed'],
    },
    {
      title: 'Achievements',
      icon: <Trophy size={20} color="white" />,
      onPress: () => setShowAchievements(true),
      gradient: ['#f59e0b', '#d97706'],
    },
    {
      title: 'Voice Commands',
      icon: <Zap size={20} color="white" />,
      onPress: () => setShowVoiceCommands(!showVoiceCommands),
      gradient: ['#059669', '#047857'],
    },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'High': return colorScheme.accent.red;
      case 'Medium': return colorScheme.accent.orange;
      case 'Low': return colorScheme.primary[500];
      default: return colorScheme.neutral[400];
    }
  };

  const handleVoiceNote = () => {
    Alert.alert(
      'Voice Note', 
      'Voice note recording would start here. This feature uses device microphone to record field observations.'
    );
  };

  const handleWeatherCheck = () => {
    Alert.alert(
      'Current Weather',
      `Temperature: ${mockWeatherData.temperature}°C\nCondition: ${mockWeatherData.condition}\nHumidity: ${mockWeatherData.humidity}%\n\nRecommendation: ${mockWeatherData.recommendation}`,
      [{ text: 'OK' }]
    );
  };

  const handleEmergencyContact = () => {
    Alert.alert(
      'Emergency Agricultural Support',
      'Contact local agricultural expert:\n\nDr. Rajesh Kumar\nPhone: +91-9876543210\nEmail: support@agriexpert.com\n\nAvailable 24/7 for crop emergencies',
      [
        { text: 'Call Now', onPress: () => console.log('Calling...') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Voice command received:', command);
  };

  const handleProfilePress = () => {
    router.push('/settings');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        style={styles.scrollContainer}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: dynamicPadding }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colorScheme.primary[500]]}
            tintColor={colorScheme.primary[500]}
          />
        }
        // Improve scroll performance
        removeClippedSubviews={true}
        scrollEventThrottle={16}
      >
        {/* Header with Profile */}
        <AdvancedAnimations animationType="slideUp" delay={0}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Text style={[styles.welcomeText, { color: theme.textSecondary }]}>
                Welcome back,
              </Text>
              <Text style={[styles.userName, { color: theme.text }]}>
                {profile?.full_name || user?.email?.split('@')[0] || 'Farmer'}
              </Text>
              {profile?.farm_name && (
                <Text style={[styles.farmName, { color: theme.textSecondary }]}>
                  {profile.farm_name}
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.profileImage} />
              ) : (
                <View style={[styles.profilePlaceholder, { backgroundColor: colorScheme.primary[500] }]}>
                  <User size={20} color="white" />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </AdvancedAnimations>

        {/* Dynamic Greeting */}
        <AdvancedAnimations animationType="slideUp" delay={100}>
          <DynamicGreeting />
        </AdvancedAnimations>

        {/* Stats Cards */}
        <AdvancedAnimations animationType="scaleIn" delay={200}>
          <View style={styles.statsContainer}>
            <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
              <View style={styles.statItem}>
                <TrendingUp size={18} color={colorScheme.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {formatNumber(totalDetections)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {t('home.totalScans')}
                </Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statItem}>
                <AlertTriangle size={18} color={colorScheme.accent.orange} />
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {formatNumber(issuesDetected)}
                </Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                  {t('home.issuesFound')}
                </Text>
              </View>
            </View>
          </View>
        </AdvancedAnimations>

        {/* Voice Commands Section */}
        {showVoiceCommands && (
          <AdvancedAnimations animationType="fadeIn" delay={0}>
            <VoiceCommands onCommand={handleVoiceCommand} />
          </AdvancedAnimations>
        )}

        {/* Quick Actions */}
        <AdvancedAnimations animationType="bounceIn" delay={400}>
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              {t('home.quickActions')}
            </Text>
            <View style={styles.actionGrid}>
              {actionCards.map((card, index) => (
                <MicroInteraction key={index}>
                  <ActionCard
                    title={card.title}
                    icon={card.icon}
                    onPress={card.onPress}
                    gradient={card.gradient}
                  />
                </MicroInteraction>
              ))}
            </View>
          </View>
        </AdvancedAnimations>

        {/* Recent Activity */}
        {recentDetections.length > 0 && (
          <AdvancedAnimations animationType="morphIn" delay={600}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                  {t('home.recentActivity')}
                </Text>
                <TouchableOpacity onPress={() => router.push('/history')}>
                  <Text style={[styles.sectionAction, { color: colorScheme.primary[600] }]}>
                    {t('home.viewAll')}
                  </Text>
                </TouchableOpacity>
              </View>
              {recentDetections.map((detection, index) => (
                <AdvancedAnimations key={detection.id} animationType="slideUp" delay={index * 100}>
                  <MicroInteraction>
                    <TouchableOpacity style={[styles.recentItem, { backgroundColor: theme.surface }]}>
                      <Image
                        source={{ uri: detection.image_url }}
                        style={styles.recentItemImage}
                      />
                      <View style={styles.recentItemContent}>
                        <Text 
                          style={[styles.recentItemTitle, { color: theme.text }]} 
                          numberOfLines={1}
                        >
                          {detection.result_data?.name || 'Detection Result'}
                        </Text>
                        <Text style={[styles.recentItemDate, { color: theme.textSecondary }]}>
                          {new Date(detection.created_at).toLocaleDateString()}
                        </Text>
                        <View style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(detection.result_data?.severity || 'Low') }
                        ]}>
                          <Text style={styles.severityText}>
                            {t(`severity.${(detection.result_data?.severity || 'low').toLowerCase()}`)}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </MicroInteraction>
                </AdvancedAnimations>
              ))}
            </View>
          </AdvancedAnimations>
        )}

        {/* Empty State for New Users */}
        {recentDetections.length === 0 && !detectionsLoading && (
          <AdvancedAnimations animationType="fadeIn" delay={600}>
            <View style={styles.emptyState}>
              <Scan size={60} color={colorScheme.primary[300]} />
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>
                Start Your First Scan
              </Text>
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                Use AI-powered detection to identify pests and diseases in your crops
              </Text>
              <TouchableOpacity 
                onPress={() => router.push('/detect')}
                style={styles.emptyStateButton}
              >
                <LinearGradient
                  colors={[colorScheme.primary[500], colorScheme.primary[600]]}
                  style={styles.emptyStateButtonGradient}
                >
                  <Scan size={16} color="white" />
                  <Text style={styles.emptyStateButtonText}>Start Scanning</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </AdvancedAnimations>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      <FloatingActionButton
        onVoiceNote={handleVoiceNote}
        onWeatherCheck={handleWeatherCheck}
        onEmergencyContact={handleEmergencyContact}
      />

      {/* Modals */}
      <AchievementSystem
        visible={showAchievements}
        onClose={() => setShowAchievements(false)}
      />

      <TreatmentCalculator
        visible={showCalculator}
        onClose={() => setShowCalculator(false)}
        treatmentName="Neem Oil"
      />

      <PhotoComparison
        visible={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // paddingBottom will be added dynamically via useDynamicPadding hook
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    marginBottom: 2,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  farmName: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  profileButton: {
    marginLeft: 16,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  profilePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statsCard: {
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    marginHorizontal: 20,
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sectionAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  recentItem: {
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  recentItemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#e5e5e5',
  },
  recentItemContent: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'space-between',
  },
  recentItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  recentItemDate: {
    fontSize: 12,
    marginBottom: 8,
  },
  severityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
    paddingHorizontal: 32,
    marginTop: 24,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  emptyStateButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  emptyStateButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  emptyStateButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});