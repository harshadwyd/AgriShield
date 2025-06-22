import React, { useState } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Scan, History, Video, FileText, Wheat, Phone, Cloud, Thermometer, Droplets, TrendingUp, TriangleAlert as AlertTriangle, Trophy, Zap, Calculator, ArrowLeftRight } from 'lucide-react-native';
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
import { useTranslation } from '../../hooks/useTranslation';
import { mockWeatherData } from '../../constants/mockData';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { state, isDarkMode } = useAppContext();
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [showAchievements, setShowAchievements] = useState(false);
  const [showVoiceCommands, setShowVoiceCommands] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [showComparison, setShowComparison] = useState(false);
  
  const recentDetections = state.detections.slice(0, 3);
  const totalDetections = state.detections.length;
  const issuesDetected = state.detections.filter(d => d.result.severity === 'High' || d.result.severity === 'Medium').length;

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
    Alert.alert('Voice Note', 'Voice note recording would start here. This feature uses device microphone to record field observations.');
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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {/* Dynamic Greeting */}
        <AdvancedAnimations animationType="slideUp" delay={0}>
          <DynamicGreeting />
        </AdvancedAnimations>

        {/* Stats Cards */}
        <AdvancedAnimations animationType="scaleIn" delay={200}>
          <View style={styles.statsContainer}>
            <View style={[styles.statsCard, { backgroundColor: theme.surface }]}>
              <View style={styles.statItem}>
                <TrendingUp size={18} color={colorScheme.primary[500]} />
                <Text style={[styles.statNumber, { color: theme.text }]}>{formatNumber(totalDetections)}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('home.totalScans')}</Text>
              </View>
              <View style={[styles.statDivider, { backgroundColor: theme.border }]} />
              <View style={styles.statItem}>
                <AlertTriangle size={18} color={colorScheme.accent.orange} />
                <Text style={[styles.statNumber, { color: theme.text }]}>{formatNumber(issuesDetected)}</Text>
                <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{t('home.issuesFound')}</Text>
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
            <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.quickActions')}</Text>
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
            <View style={[styles.section, { paddingBottom: 100 }]}>
              <View style={styles.sectionHeader}>
                <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('home.recentActivity')}</Text>
                <TouchableOpacity onPress={() => router.push('/history')}>
                  <Text style={[styles.sectionAction, { color: colorScheme.primary[600] }]}>{t('home.viewAll')}</Text>
                </TouchableOpacity>
              </View>
              {recentDetections.map((detection, index) => (
                <AdvancedAnimations key={detection.id} animationType="slideUp" delay={index * 100}>
                  <MicroInteraction>
                    <TouchableOpacity style={[styles.recentItem, { backgroundColor: theme.surface }]}>
                      <Image
                        source={{ uri: detection.image }}
                        style={styles.recentItemImage}
                      />
                      <View style={styles.recentItemContent}>
                        <Text style={[styles.recentItemTitle, { color: theme.text }]} numberOfLines={1}>{detection.result.name}</Text>
                        <Text style={[styles.recentItemDate, { color: theme.textSecondary }]}>
                          {new Date(detection.timestamp).toLocaleDateString()}
                        </Text>
                        <View style={[
                          styles.severityBadge,
                          { backgroundColor: getSeverityColor(detection.result.severity) }
                        ]}>
                          <Text style={styles.severityText}>{t(`severity.${detection.result.severity.toLowerCase()}`)}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </MicroInteraction>
                </AdvancedAnimations>
              ))}
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
  statsContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
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
});