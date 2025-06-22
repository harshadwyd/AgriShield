import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  Image, 
  PanResponder, 
  ScrollView, 
  Dimensions,
  Alert 
} from 'react-native';
import { ArrowLeftRight, X, Calendar, TrendingUp, Camera, Image as ImageIcon } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { width } = Dimensions.get('window');

interface PhotoComparisonProps {
  visible: boolean;
  onClose: () => void;
  beforeImage?: string;
  afterImage?: string;
}

export const PhotoComparison: React.FC<PhotoComparisonProps> = ({
  visible,
  onClose,
  beforeImage: initialBeforeImage,
  afterImage: initialAfterImage
}) => {
  const { isDarkMode } = useAppContext();
  const { t } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  
  const [sliderPosition, setSliderPosition] = useState(50);
  const [slideAnim] = useState(new Animated.Value(300));
  const [containerWidth, setContainerWidth] = useState(width - 80);
  const [beforeImage, setBeforeImage] = useState(
    initialBeforeImage || 'https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=800'
  );
  const [afterImage, setAfterImage] = useState(
    initialAfterImage || 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800'
  );

  React.useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(300);
    }
  }, [visible]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      // Optional: Add haptic feedback here
    },
    onPanResponderMove: (evt, gestureState) => {
      const { locationX } = evt.nativeEvent;
      const newPosition = Math.max(0, Math.min(100, (locationX / containerWidth) * 100));
      setSliderPosition(newPosition);
    },
    onPanResponderRelease: () => {
      // Optional: Add haptic feedback here
    },
  });

  const selectImage = async (type: 'before' | 'after') => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Media library permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        if (type === 'before') {
          setBeforeImage(result.assets[0].uri);
        } else {
          setAfterImage(result.assets[0].uri);
        }
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const calculateImprovement = () => {
    // Mock improvement calculation based on slider position and time
    const baseImprovement = Math.round(Math.random() * 40 + 30); // 30-70% improvement
    const positionBonus = Math.round((sliderPosition - 50) / 10); // Slight variation based on comparison
    return Math.max(10, Math.min(95, baseImprovement + positionBonus));
  };

  const improvement = calculateImprovement();

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
              <ArrowLeftRight size={24} color={Colors.primary[500]} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Photo Comparison</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            bounces={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
          >
            <View style={styles.content}>
              {/* Image Selection Controls */}
              <View style={styles.imageSelectionContainer}>
                <TouchableOpacity 
                  onPress={() => selectImage('before')}
                  style={[styles.imageSelectButton, { backgroundColor: theme.surface }]}
                >
                  <Camera size={16} color={Colors.primary[500]} />
                  <Text style={[styles.imageSelectText, { color: Colors.primary[500] }]}>
                    Select Before Image
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  onPress={() => selectImage('after')}
                  style={[styles.imageSelectButton, { backgroundColor: theme.surface }]}
                >
                  <ImageIcon size={16} color={Colors.secondary[500]} />
                  <Text style={[styles.imageSelectText, { color: Colors.secondary[500] }]}>
                    Select After Image
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.comparisonContainer}>
                <View 
                  style={styles.imageContainer}
                  onLayout={(event) => {
                    const { width: layoutWidth } = event.nativeEvent.layout;
                    setContainerWidth(layoutWidth);
                  }}
                  {...panResponder.panHandlers}
                >
                  {/* Before Image */}
                  <Image 
                    source={{ uri: beforeImage }} 
                    style={styles.beforeImage}
                    onError={(error) => {
                      console.warn('Before image failed to load:', error);
                      setBeforeImage('https://images.pexels.com/photos/1459339/pexels-photo-1459339.jpeg?auto=compress&cs=tinysrgb&w=800');
                    }}
                  />
                  
                  {/* After Image with Clip */}
                  <View 
                    style={[
                      styles.afterImageContainer,
                      { width: `${sliderPosition}%` }
                    ]}
                  >
                    <Image 
                      source={{ uri: afterImage }} 
                      style={[styles.afterImage, { width: containerWidth }]}
                      onError={(error) => {
                        console.warn('After image failed to load:', error);
                        setAfterImage('https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=800');
                      }}
                    />
                  </View>
                  
                  {/* Slider Line */}
                  <View 
                    style={[
                      styles.sliderLine,
                      { left: `${sliderPosition}%` }
                    ]}
                  >
                    <View style={styles.sliderHandle}>
                      <ArrowLeftRight size={16} color="white" />
                    </View>
                  </View>
                </View>

                {/* Labels */}
                <View style={styles.labelsContainer}>
                  <View style={styles.labelLeft}>
                    <Calendar size={16} color={theme.textSecondary} />
                    <Text style={[styles.labelText, { color: theme.textSecondary }]}>Before Treatment</Text>
                    <Text style={[styles.labelDate, { color: theme.textSecondary }]}>2 weeks ago</Text>
                  </View>
                  <View style={styles.labelRight}>
                    <TrendingUp size={16} color={Colors.success} />
                    <Text style={[styles.labelText, { color: theme.textSecondary }]}>After Treatment</Text>
                    <Text style={[styles.labelDate, { color: theme.textSecondary }]}>Today</Text>
                  </View>
                </View>

                {/* Slider Instructions */}
                <View style={[styles.instructionsContainer, { backgroundColor: theme.surface }]}>
                  <Text style={[styles.instructionsText, { color: theme.textSecondary }]}>
                    👆 Drag the slider to compare before and after photos
                  </Text>
                </View>
              </View>

              {/* Progress Analysis */}
              <View style={[styles.analysisCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.analysisTitle, { color: theme.text }]}>Treatment Progress</Text>
                
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={[styles.progressLabel, { color: theme.textSecondary }]}>Health Improvement</Text>
                    <Text style={[styles.progressValue, { color: Colors.success }]}>{improvement}%</Text>
                  </View>
                  <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                    <View 
                      style={[
                        styles.progressFill,
                        { 
                          width: `${improvement}%`,
                          backgroundColor: Colors.success
                        }
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.metricsGrid}>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: Colors.primary[600] }]}>85%</Text>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Leaf Health</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: Colors.secondary[600] }]}>92%</Text>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Color Recovery</Text>
                  </View>
                  <View style={styles.metric}>
                    <Text style={[styles.metricValue, { color: Colors.accent.orange }]}>78%</Text>
                    <Text style={[styles.metricLabel, { color: theme.textSecondary }]}>Growth Rate</Text>
                  </View>
                </View>
              </View>

              {/* Treatment Timeline */}
              <View style={[styles.timelineCard, { backgroundColor: theme.surface }]}>
                <Text style={[styles.timelineTitle, { color: theme.text }]}>Treatment Timeline</Text>
                
                <View style={styles.timeline}>
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: Colors.accent.red }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>Day 0</Text>
                      <Text style={[styles.timelineEvent, { color: theme.text }]}>Problem detected</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: Colors.primary[500] }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>Day 1</Text>
                      <Text style={[styles.timelineEvent, { color: theme.text }]}>Treatment applied</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: Colors.accent.orange }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>Day 7</Text>
                      <Text style={[styles.timelineEvent, { color: theme.text }]}>First improvement</Text>
                    </View>
                  </View>
                  
                  <View style={styles.timelineItem}>
                    <View style={[styles.timelineMarker, { backgroundColor: Colors.success }]} />
                    <View style={styles.timelineContent}>
                      <Text style={[styles.timelineDate, { color: theme.textSecondary }]}>Day 14</Text>
                      <Text style={[styles.timelineEvent, { color: theme.text }]}>Significant recovery</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '95%',
    maxHeight: '90%',
    borderRadius: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
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
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    padding: 20,
  },
  imageSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  imageSelectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    gap: 8,
  },
  imageSelectText: {
    fontSize: 12,
    fontWeight: '600',
  },
  comparisonContainer: {
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  beforeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  afterImageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    overflow: 'hidden',
  },
  afterImage: {
    height: '100%',
    resizeMode: 'cover',
  },
  sliderLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: 'white',
    marginLeft: -1,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sliderHandle: {
    position: 'absolute',
    top: '50%',
    left: -12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  labelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  labelLeft: {
    alignItems: 'flex-start',
  },
  labelRight: {
    alignItems: 'flex-end',
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  labelDate: {
    fontSize: 10,
    marginTop: 2,
  },
  instructionsContainer: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  instructionsText: {
    fontSize: 12,
    textAlign: 'center',
  },
  analysisCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  metric: {
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  metricLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  timelineCard: {
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  timeline: {
    gap: 12,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineMarker: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDate: {
    fontSize: 12,
    fontWeight: '600',
  },
  timelineEvent: {
    fontSize: 14,
    marginTop: 2,
  },
});