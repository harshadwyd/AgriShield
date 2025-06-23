import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { Database, CheckCircle, AlertCircle, RefreshCw, Eye } from 'lucide-react-native';
import { Colors, getThemeColors } from '../constants/colors';
import { useAuthContext } from './AuthProvider';
import { useAppContext } from '../context/AppContext';
import { DetectionService } from '../lib/detections';

export const DetectionVerifier: React.FC = () => {
  const { user } = useAuthContext();
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);
  
  const [detections, setDetections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkDetections = async () => {
    if (!user) {
      setError('No user logged in');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Method 1: Using our DetectionService
      const userDetections = await DetectionService.getUserDetections(user.id, {
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc',
      });

      setDetections(userDetections);
      setLastCheck(new Date());

      if (userDetections.length === 0) {
        setError('No detections found in database');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch detections');
    } finally {
      setLoading(false);
    }
  };

  const checkViaAPI = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/verify-detection?userId=${user.id}`);
      const data = await response.json();

      if (data.success) {
        Alert.alert(
          'Database Check',
          `Found ${data.count} detections in database.\n\nLatest detection: ${
            data.detections[0] 
              ? new Date(data.detections[0].created_at).toLocaleString()
              : 'None'
          }`
        );
      } else {
        Alert.alert('Error', data.error || 'Failed to check database');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to connect to API');
    }
  };

  useEffect(() => {
    if (user) {
      checkDetections();
    }
  }, [user]);

  const formatDetectionData = (detection: any) => {
    return {
      id: detection.id,
      type: detection.detection_type,
      crop: detection.crop_type,
      confidence: detection.confidence_score,
      severity: detection.severity_level,
      created: new Date(detection.created_at).toLocaleString(),
      hasImage: !!detection.image_url,
      isPublic: detection.is_public,
      treatmentApplied: detection.treatment_applied,
    };
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      <View style={styles.header}>
        <Database size={24} color={Colors.primary[500]} />
        <Text style={[styles.title, { color: theme.text }]}>Detection Verification</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={checkDetections}
          style={[styles.button, { backgroundColor: Colors.primary[500] }]}
          disabled={loading}
        >
          <RefreshCw size={16} color="white" />
          <Text style={styles.buttonText}>
            {loading ? 'Checking...' : 'Check Database'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={checkViaAPI}
          style={[styles.button, { backgroundColor: Colors.secondary[500] }]}
          disabled={loading || !user}
        >
          <Eye size={16} color="white" />
          <Text style={styles.buttonText}>API Check</Text>
        </TouchableOpacity>
      </View>

      {lastCheck && (
        <Text style={[styles.lastCheck, { color: theme.textSecondary }]}>
          Last checked: {lastCheck.toLocaleTimeString()}
        </Text>
      )}

      {error && (
        <View style={[styles.errorContainer, { backgroundColor: Colors.accent.red + '20' }]}>
          <AlertCircle size={16} color={Colors.accent.red} />
          <Text style={[styles.errorText, { color: Colors.accent.red }]}>{error}</Text>
        </View>
      )}

      <ScrollView
        style={styles.detectionsList}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={checkDetections} />
        }
      >
        {detections.length > 0 ? (
          <>
            <View style={[styles.successContainer, { backgroundColor: Colors.success + '20' }]}>
              <CheckCircle size={16} color={Colors.success} />
              <Text style={[styles.successText, { color: Colors.success }]}>
                Found {detections.length} detection(s) in database
              </Text>
            </View>

            {detections.map((detection, index) => {
              const formatted = formatDetectionData(detection);
              return (
                <View key={detection.id} style={[styles.detectionCard, { backgroundColor: theme.background }]}>
                  <View style={styles.detectionHeader}>
                    <Text style={[styles.detectionTitle, { color: theme.text }]}>
                      Detection #{index + 1}
                    </Text>
                    <View style={[
                      styles.severityBadge,
                      { backgroundColor: 
                        formatted.severity === 'High' ? Colors.accent.red :
                        formatted.severity === 'Medium' ? Colors.accent.orange :
                        Colors.success
                      }
                    ]}>
                      <Text style={styles.severityText}>{formatted.severity}</Text>
                    </View>
                  </View>

                  <View style={styles.detectionDetails}>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>ID:</Text> {formatted.id.slice(0, 8)}...
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Type:</Text> {formatted.type}
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Crop:</Text> {formatted.crop}
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Confidence:</Text> {formatted.confidence}%
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Created:</Text> {formatted.created}
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Has Image:</Text> {formatted.hasImage ? 'Yes' : 'No'}
                    </Text>
                    <Text style={[styles.detectionField, { color: theme.textSecondary }]}>
                      <Text style={{ fontWeight: 'bold' }}>Treatment Applied:</Text> {formatted.treatmentApplied ? 'Yes' : 'No'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </>
        ) : !loading && !error && (
          <View style={styles.emptyState}>
            <Database size={48} color={theme.textSecondary} />
            <Text style={[styles.emptyStateText, { color: theme.text }]}>
              No detections found
            </Text>
            <Text style={[styles.emptyStateSubtext, { color: theme.textSecondary }]}>
              Try performing a detection first
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  controls: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  lastCheck: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  errorText: {
    fontSize: 14,
    flex: 1,
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    gap: 8,
  },
  successText: {
    fontSize: 14,
    fontWeight: '600',
  },
  detectionsList: {
    flex: 1,
  },
  detectionCard: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  detectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  severityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  severityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detectionDetails: {
    gap: 4,
  },
  detectionField: {
    fontSize: 12,
    lineHeight: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
  },
});