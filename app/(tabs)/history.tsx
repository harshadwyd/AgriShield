import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Filter, Calendar, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, ChartBar as BarChart3, Bug, Shield } from 'lucide-react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';
import { DetectionService } from '../../services/detectionService';

const { width } = Dimensions.get('window');

export default function HistoryScreen() {
  const { state, isDarkMode } = useAppContext();
  const { t, formatNumber, formatDate } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [filter, setFilter] = useState<'all' | 'pest' | 'disease'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'severity'>('date');

  const filteredDetections = state.detections.filter(detection => {
    if (filter === 'all') return true;
    return detection.type === filter;
  });

  const sortedDetections = [...filteredDetections].sort((a, b) => {
    if (sortBy === 'date') {
      return b.timestamp - a.timestamp;
    } else {
      const severityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return severityOrder[b.result.severity] - severityOrder[a.result.severity];
    }
  });

  const getAnalytics = () => {
    const total = state.detections.length;
    const highSeverity = state.detections.filter(d => d.result.severity === 'High').length;
    const mediumSeverity = state.detections.filter(d => d.result.severity === 'Medium').length;
    const lowSeverity = state.detections.filter(d => d.result.severity === 'Low').length;
    const pests = state.detections.filter(d => d.type === 'pest').length;
    const diseases = state.detections.filter(d => d.type === 'disease').length;
    
    return { total, highSeverity, mediumSeverity, lowSeverity, pests, diseases };
  };

  const analytics = getAnalytics();

  const renderFilterButtons = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        onPress={() => setFilter('all')}
        style={[
          styles.filterButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          filter === 'all' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
        ]}
      >
        <Text style={[
          styles.filterButtonText,
          { color: theme.textSecondary },
          filter === 'all' && { color: 'white' }
        ]}>
          {t('history.filters.all')} ({formatNumber(analytics.total)})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setFilter('pest')}
        style={[
          styles.filterButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          filter === 'pest' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
        ]}
      >
        <Bug size={10} color={filter === 'pest' ? 'white' : theme.textSecondary} />
        <Text style={[
          styles.filterButtonText,
          { color: theme.textSecondary },
          filter === 'pest' && { color: 'white' }
        ]}>
          {t('history.filters.pests')} ({formatNumber(analytics.pests)})
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        onPress={() => setFilter('disease')}
        style={[
          styles.filterButton,
          { backgroundColor: theme.surface, borderColor: theme.border },
          filter === 'disease' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
        ]}
      >
        <Shield size={10} color={filter === 'disease' ? 'white' : theme.textSecondary} />
        <Text style={[
          styles.filterButtonText,
          { color: theme.textSecondary },
          filter === 'disease' && { color: 'white' }
        ]}>
          {t('history.filters.diseases')} ({formatNumber(analytics.diseases)})
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderAnalyticsCard = () => (
    <View style={[styles.analyticsCard, { backgroundColor: theme.surface }]}>
      <View style={styles.analyticsHeader}>
        <BarChart3 size={16} color={colorScheme.primary[600]} />
        <Text style={[styles.analyticsTitle, { color: theme.text }]}>{t('history.summary')}</Text>
      </View>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsItem}>
          <View style={[styles.severityIndicator, { backgroundColor: colorScheme.accent.red }]} />
          <Text style={[styles.analyticsNumber, { color: theme.text }]}>{formatNumber(analytics.highSeverity)}</Text>
          <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>{t('history.highRisk')}</Text>
        </View>
        
        <View style={styles.analyticsItem}>
          <View style={[styles.severityIndicator, { backgroundColor: colorScheme.accent.orange }]} />
          <Text style={[styles.analyticsNumber, { color: theme.text }]}>{formatNumber(analytics.mediumSeverity)}</Text>
          <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>{t('history.mediumRisk')}</Text>
        </View>
        
        <View style={styles.analyticsItem}>
          <View style={[styles.severityIndicator, { backgroundColor: colorScheme.success }]} />
          <Text style={[styles.analyticsNumber, { color: theme.text }]}>{formatNumber(analytics.lowSeverity)}</Text>
          <Text style={[styles.analyticsLabel, { color: theme.textSecondary }]}>{t('history.lowRisk')}</Text>
        </View>
      </View>
    </View>
  );

  const renderDetectionItem = (detection: any, index: number) => {
    const severityColor = DetectionService.getSeverityColor(detection.result.severity);
    
    return (
      <TouchableOpacity key={detection.id} style={[styles.detectionItem, { backgroundColor: theme.surface }]}>
        <Image
          source={{ uri: detection.image }}
          style={styles.detectionImage}
        />
        
        <View style={styles.detectionContent}>
          <View style={styles.detectionHeader}>
            <Text style={[styles.detectionName, { color: theme.text }]} numberOfLines={1}>{detection.result.name}</Text>
            <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
              <Text style={styles.severityText}>{t(`severity.${detection.result.severity.toLowerCase()}`)}</Text>
            </View>
          </View>
          
          <Text style={[styles.detectionDate, { color: theme.textSecondary }]}>
            {formatDate(detection.timestamp)}
          </Text>
          
          <View style={styles.detectionMeta}>
            <View style={styles.detectionMetaItem}>
              {detection.type === 'pest' ? (
                <Bug size={10} color={theme.textSecondary} />
              ) : (
                <Shield size={10} color={theme.textSecondary} />
              )}
              <Text style={[styles.detectionMetaText, { color: theme.textSecondary }]}>
                {detection.type === 'pest' ? t('history.filters.pests') : t('history.filters.diseases')}
              </Text>
            </View>
            
            <View style={styles.detectionMetaItem}>
              <TrendingUp size={10} color={theme.textSecondary} />
              <Text style={[styles.detectionMetaText, { color: theme.textSecondary }]}>
                {detection.result.confidence}% {t('detect.confidence').toLowerCase()}
              </Text>
            </View>
          </View>
          
          <View style={styles.treatmentStatus}>
            {detection.treatmentApplied ? (
              <View style={styles.treatmentApplied}>
                <CheckCircle size={10} color={colorScheme.success} />
                <Text style={[styles.treatmentAppliedText, { color: colorScheme.success }]}>{t('history.treatmentStatus.applied')}</Text>
              </View>
            ) : (
              <View style={styles.treatmentPending}>
                <AlertTriangle size={10} color={colorScheme.accent.orange} />
                <Text style={[styles.treatmentPendingText, { color: colorScheme.accent.orange }]}>{t('history.treatmentStatus.pending')}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('history.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {formatNumber(analytics.total)} {t('history.subtitle')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollContainer}>
        {analytics.total > 0 && renderAnalyticsCard()}
        
        {renderFilterButtons()}
        
        <View style={styles.sortContainer}>
          <Text style={[styles.sortLabel, { color: theme.textSecondary }]}>{t('history.sortBy')}</Text>
          <TouchableOpacity
            onPress={() => setSortBy('date')}
            style={[
              styles.sortButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
              sortBy === 'date' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
            ]}
          >
            <Calendar size={10} color={sortBy === 'date' ? 'white' : theme.textSecondary} />
            <Text style={[
              styles.sortButtonText,
              { color: theme.textSecondary },
              sortBy === 'date' && { color: 'white' }
            ]}>
              {t('history.sortOptions.date')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setSortBy('severity')}
            style={[
              styles.sortButton,
              { backgroundColor: theme.surface, borderColor: theme.border },
              sortBy === 'severity' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
            ]}
          >
            <AlertTriangle size={10} color={sortBy === 'severity' ? 'white' : theme.textSecondary} />
            <Text style={[
              styles.sortButtonText,
              { color: theme.textSecondary },
              sortBy === 'severity' && { color: 'white' }
            ]}>
              {t('history.sortOptions.severity')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.detectionsList}>
          {sortedDetections.length > 0 ? (
            sortedDetections.map(renderDetectionItem)
          ) : (
            <View style={styles.emptyState}>
              <BarChart3 size={50} color={theme.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>{t('history.empty.title')}</Text>
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                {t('history.empty.description')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 12,
  },
  analyticsCard: {
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 10,
    padding: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  analyticsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  analyticsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  analyticsItem: {
    alignItems: 'center',
  },
  severityIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 5,
  },
  analyticsNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  analyticsLabel: {
    fontSize: 9,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 6,
    gap: 6,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
  },
  filterButtonText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 2,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  sortLabel: {
    fontSize: 10,
    marginRight: 6,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    borderWidth: 1,
  },
  sortButtonText: {
    fontSize: 9,
    fontWeight: '600',
    marginLeft: 2,
  },
  detectionsList: {
    paddingHorizontal: 16,
  },
  detectionItem: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    flexDirection: 'row',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  detectionImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    backgroundColor: '#e5e5e5',
  },
  detectionContent: {
    flex: 1,
    marginLeft: 10,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  detectionName: {
    fontSize: 12,
    fontWeight: 'bold',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 5,
  },
  severityText: {
    fontSize: 8,
    fontWeight: '600',
    color: 'white',
  },
  detectionDate: {
    fontSize: 9,
    marginBottom: 5,
  },
  detectionMeta: {
    flexDirection: 'row',
    marginBottom: 5,
    gap: 10,
  },
  detectionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detectionMetaText: {
    fontSize: 8,
    marginLeft: 2,
  },
  treatmentStatus: {
    marginTop: 1,
  },
  treatmentApplied: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treatmentAppliedText: {
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 2,
  },
  treatmentPending: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  treatmentPendingText: {
    fontSize: 8,
    fontWeight: '600',
    marginLeft: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 14,
    marginBottom: 5,
  },
  emptyStateText: {
    fontSize: 12,
    textAlign: 'center',
    maxWidth: 180,
    lineHeight: 18,
  },
});