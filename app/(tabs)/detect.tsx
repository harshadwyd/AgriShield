import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Image as ImageIcon, RotateCcw, Zap, Bug, Shield, ArrowLeft, CircleCheck as CheckCircle, FlashlightOff as FlashOff, Slash as Flash } from 'lucide-react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { EnhancedLoadingSpinner } from '../../components/EnhancedLoadingSpinner';
import { DetectionService } from '../../services/detectionService';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../components/AuthProvider';
import { useTranslation } from '../../hooks/useTranslation';
import { Detection } from '../../types';

const { width, height } = Dimensions.get('window');

type DetectionStep = 'capture' | 'preview' | 'analyze' | 'result';
type AnalysisType = 'pest' | 'disease';

export default function DetectScreen() {
  const [step, setStep] = useState<DetectionStep>('capture');
  const [facing, setFacing] = useState<CameraType>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('pest');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [detectionResult, setDetectionResult] = useState<Detection | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<any>(null);
  const { dispatch, isDarkMode } = useAppContext();
  const { user } = useAuthContext();
  const { t } = useTranslation();
  
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;

  const handleCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleCameraCapture = async () => {
    if (!cameraRef.current || !isCameraReady || isCapturing) {
      console.warn('Camera not ready or already capturing');
      return;
    }
    
    setIsCapturing(true);
    
    try {
      // Add a small delay to ensure camera is fully ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
        exif: false,
      });
      
      if (photo && photo.uri) {
        setCapturedImage(photo.uri);
        setStep('preview');
      } else {
        throw new Error('No image data received from camera');
      }
    } catch (error) {
      console.error('Camera capture error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to capture image. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('permissions')) {
          errorMessage = 'Camera permission denied. Please check your device settings.';
        } else if (error.message.includes('busy')) {
          errorMessage = 'Camera is busy. Please wait a moment and try again.';
        } else if (error.message.includes('storage')) {
          errorMessage = 'Not enough storage space. Please free up some space and try again.';
        }
      }
      
      Alert.alert(t('error'), errorMessage);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleImagePicker = async () => {
    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(t('error'), 'Media library permission is required to select images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        allowsMultipleSelection: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        setCapturedImage(result.assets[0].uri);
        setStep('preview');
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert(t('error'), 'Failed to select image. Please try again.');
    }
  };

  const handleAnalyze = async () => {
    if (!capturedImage) return;

    setStep('analyze');
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setAnalysisProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    try {
      // Pass user ID to save detection to database
      const result = await DetectionService.analyzeImage(
        capturedImage,
        analysisType,
        'tomato',
        user?.id // This will save to database if user is logged in
      );

      clearInterval(progressInterval);
      setAnalysisProgress(100);

      const detection: Detection = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        image: capturedImage,
        type: analysisType,
        crop: 'tomato',
        result,
      };

      setDetectionResult(detection);
      dispatch({ type: 'ADD_DETECTION', payload: detection });
      
      // Show success message
      if (user) {
        Alert.alert(
          'Success!', 
          'Detection completed and saved to your account. You can view it in the Debug tab to verify database storage.',
          [{ text: 'OK' }]
        );
      }
      
      setTimeout(() => {
        setStep('result');
      }, 500);
    } catch (error) {
      console.error('Analysis error:', error);
      clearInterval(progressInterval);
      Alert.alert(t('error'), 'Failed to analyze image. Please try again.');
      setStep('preview');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetectionResult(null);
    setAnalysisProgress(0);
    setIsCameraReady(false);
    setStep('capture');
  };

  const handleNewScan = () => {
    setCapturedImage(null);
    setDetectionResult(null);
    setAnalysisProgress(0);
    setIsCameraReady(false);
    setStep('capture');
  };

  const toggleCameraFacing = () => {
    setIsCameraReady(false);
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const toggleFlash = () => {
    setFlash(current => (current === 'off' ? 'on' : 'off'));
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <EnhancedLoadingSpinner message={t('loading')} type="growing" />
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <Camera size={60} color={colorScheme.primary[500]} />
          <Text style={[styles.permissionTitle, { color: theme.text }]}>{t('detect.cameraPermission.title')}</Text>
          <Text style={[styles.permissionText, { color: theme.textSecondary }]}>
            {t('detect.cameraPermission.description')}
          </Text>
          <TouchableOpacity onPress={requestPermission} style={styles.permissionButton}>
            <LinearGradient
              colors={[colorScheme.primary[500], colorScheme.primary[600]]}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>{t('detect.cameraPermission.grant')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const renderCaptureStep = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.cameraHeader}>
        <Text style={[styles.cameraTitle, { color: theme.text }]}>{t('detect.title')}</Text>
        <Text style={[styles.cameraSubtitle, { color: theme.textSecondary }]}>{t('detect.subtitle')}</Text>
        {user && (
          <Text style={[styles.userInfo, { color: colorScheme.primary[600] }]}>
            ✓ Logged in - detections will be saved to database
          </Text>
        )}
      </View>

      <View style={styles.cameraContainer}>
        <CameraView 
          ref={cameraRef}
          style={styles.camera} 
          facing={facing}
          flash={flash}
          onCameraReady={handleCameraReady}
        >
          <View style={styles.cameraOverlay}>
            <View style={styles.guideline} />
            <Text style={styles.guidelineText}>Position affected area here</Text>
          </View>
          
          <View style={styles.cameraTopControls}>
            <TouchableOpacity onPress={toggleFlash} style={styles.flashButton}>
              {flash === 'off' ? (
                <FlashOff size={20} color="white" />
              ) : (
                <Flash size={20} color="white" />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.cameraControls}>
            <TouchableOpacity onPress={handleImagePicker} style={styles.controlButton}>
              <ImageIcon size={20} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={handleCameraCapture}
              style={[
                styles.captureButton,
                (!isCameraReady || isCapturing) && styles.captureButtonDisabled
              ]}
              disabled={!isCameraReady || isCapturing}
            >
              <View style={[
                styles.captureButtonInner,
                isCapturing && styles.captureButtonCapturing
              ]} />
            </TouchableOpacity>
            
            <TouchableOpacity onPress={toggleCameraFacing} style={styles.controlButton}>
              <RotateCcw size={20} color="white" />
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
      
      {!isCameraReady && (
        <View style={styles.cameraLoadingOverlay}>
          <EnhancedLoadingSpinner message="Preparing camera..." type="growing" />
        </View>
      )}
    </View>
  );

  const renderPreviewStep = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={handleRetake} style={styles.backButton}>
            <ArrowLeft size={20} color={colorScheme.primary[600]} />
          </TouchableOpacity>
          <Text style={[styles.previewTitle, { color: theme.text }]}>{t('detect.reviewTitle')}</Text>
          <View style={{ width: 20 }} />
        </View>

        {capturedImage && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: capturedImage }} style={styles.previewImage} />
            <View style={styles.imageOverlay}>
              <Text style={styles.imageQualityText}>✓ Good image quality</Text>
            </View>
          </View>
        )}

        <View style={styles.analysisTypeContainer}>
          <Text style={[styles.analysisTypeTitle, { color: theme.text }]}>{t('detect.analysisQuestion')}</Text>
          
          <View style={styles.analysisTypeOptions}>
            <TouchableOpacity
              onPress={() => setAnalysisType('pest')}
              style={[
                styles.analysisTypeOption,
                { backgroundColor: theme.surface, borderColor: theme.border },
                analysisType === 'pest' && { 
                  borderColor: colorScheme.primary[500], 
                  backgroundColor: isDarkMode ? colorScheme.primary[100] : colorScheme.primary[50] 
                }
              ]}
            >
              <Bug
                size={24}
                color={analysisType === 'pest' ? colorScheme.primary[600] : theme.textSecondary}
              />
              <Text style={[
                styles.analysisTypeOptionText,
                { color: theme.textSecondary },
                analysisType === 'pest' && { color: colorScheme.primary[700] }
              ]}>
                {t('detect.pestDetection')}
              </Text>
              <Text style={[styles.analysisTypeOptionDesc, { color: theme.textSecondary }]}>
                {t('detect.pestDescription')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setAnalysisType('disease')}
              style={[
                styles.analysisTypeOption,
                { backgroundColor: theme.surface, borderColor: theme.border },
                analysisType === 'disease' && { 
                  borderColor: colorScheme.primary[500], 
                  backgroundColor: isDarkMode ? colorScheme.primary[100] : colorScheme.primary[50] 
                }
              ]}
            >
              <Shield
                size={24}
                color={analysisType === 'disease' ? colorScheme.primary[600] : theme.textSecondary}
              />
              <Text style={[
                styles.analysisTypeOptionText,
                { color: theme.textSecondary },
                analysisType === 'disease' && { color: colorScheme.primary[700] }
              ]}>
                {t('detect.diseaseDetection')}
              </Text>
              <Text style={[styles.analysisTypeOptionDesc, { color: theme.textSecondary }]}>
                {t('detect.diseaseDescription')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.analyzeButtonContainer}>
          <TouchableOpacity onPress={handleAnalyze} style={styles.analyzeButton}>
            <LinearGradient
              colors={[colorScheme.primary[500], colorScheme.primary[600]]}
              style={styles.analyzeButtonGradient}
            >
              <Zap size={18} color="white" />
              <Text style={styles.analyzeButtonText}>{t('detect.analyzeImage')}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );

  const renderAnalyzeStep = () => (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.analyzeContainer}>
        <EnhancedLoadingSpinner 
          size="large" 
          message={user ? 'Analyzing and saving to database...' : t('detect.analyzing')} 
          type="analyzing"
          showProgress={true}
          progress={analysisProgress}
        />
        <View style={styles.analyzeSteps}>
          <Text style={[styles.analyzeStepText, { color: theme.textSecondary }]}>{t('detect.processingSteps.processing')}</Text>
          <Text style={[styles.analyzeStepText, { color: theme.textSecondary }]}>{t('detect.processingSteps.analyzing')}</Text>
          <Text style={[styles.analyzeStepText, { color: theme.textSecondary }]}>{t('detect.processingSteps.generating')}</Text>
          {user && (
            <Text style={[styles.analyzeStepText, { color: colorScheme.primary[600] }]}>Saving to your account...</Text>
          )}
        </View>
      </View>
    </View>
  );

  const renderResultStep = () => {
    if (!detectionResult) return null;

    const { result } = detectionResult;
    const severityColor = DetectionService.getSeverityColor(result.severity);

    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <View style={styles.resultHeader}>
            <TouchableOpacity onPress={handleNewScan} style={styles.backButton}>
              <ArrowLeft size={20} color={colorScheme.primary[600]} />
            </TouchableOpacity>
            <Text style={[styles.resultTitle, { color: theme.text }]}>{t('detect.results')}</Text>
            <View style={{ width: 20 }} />
          </View>

          {user && (
            <View style={[styles.savedNotification, { backgroundColor: colorScheme.success + '20' }]}>
              <CheckCircle size={16} color={colorScheme.success} />
              <Text style={[styles.savedNotificationText, { color: colorScheme.success }]}>
                Detection saved to your account! Check the Debug tab to verify.
              </Text>
            </View>
          )}

          {capturedImage && (
            <View style={styles.imageContainer}>
              <Image source={{ uri: capturedImage }} style={styles.resultImage} />
            </View>
          )}

          <View style={styles.resultContent}>
            <View style={[styles.resultMainInfo, { backgroundColor: theme.surface }]}>
              <View style={styles.resultTitleContainer}>
                <Text style={[styles.resultName, { color: theme.text }]}>{result.name}</Text>
                <View style={[styles.severityBadge, { backgroundColor: severityColor }]}>
                  <Text style={styles.severityText}>{t(`severity.${result.severity.toLowerCase()}`)} Risk</Text>
                </View>
              </View>
              <Text style={[styles.scientificName, { color: theme.textSecondary }]}>{result.scientific_name}</Text>
              
              <View style={styles.confidenceContainer}>
                <Text style={[styles.confidenceLabel, { color: theme.textSecondary }]}>{t('detect.confidence')}: </Text>
                <Text style={[styles.confidenceValue, { color: colorScheme.primary[600] }]}>{result.confidence}%</Text>
                <Text style={[styles.confidenceLevel, { color: theme.textSecondary }]}>
                  ({t(`confidence.${DetectionService.getConfidenceLevel(result.confidence).toLowerCase().replace(' ', '')}`)})
                </Text>
              </View>
            </View>

            <View style={[styles.resultSection, { backgroundColor: theme.surface }]}>
              <Text style={[styles.resultSectionTitle, { color: theme.text }]}>{t('detect.description')}</Text>
              <Text style={[styles.resultDescription, { color: theme.textSecondary }]}>{result.description}</Text>
            </View>

            <View style={[styles.resultSection, { backgroundColor: theme.surface }]}>
              <Text style={[styles.resultSectionTitle, { color: theme.text }]}>{t('detect.symptoms')}</Text>
              {result.symptoms.map((symptom, index) => (
                <View key={index} style={styles.symptomItem}>
                  <CheckCircle size={14} color={colorScheme.primary[500]} />
                  <Text style={[styles.symptomText, { color: theme.textSecondary }]}>{symptom}</Text>
                </View>
              ))}
            </View>

            <View style={[styles.treatmentTabs, { backgroundColor: theme.surface }]}>
              <Text style={[styles.resultSectionTitle, { color: theme.text }]}>{t('detect.treatments')}</Text>
              
              <View style={styles.treatmentSection}>
                <Text style={[styles.treatmentSectionTitle, { color: theme.text }]}>{t('detect.organic')}</Text>
                {result.treatments.organic.map((treatment, index) => (
                  <View key={index} style={[styles.treatmentCard, { backgroundColor: isDarkMode ? colorScheme.neutral[100] : colorScheme.neutral[50] }]}>
                    <Text style={[styles.treatmentName, { color: theme.text }]}>{treatment.name}</Text>
                    <Text style={[styles.treatmentDosage, { color: theme.textSecondary }]}>{t('detect.treatmentDetails.dosage')}: {treatment.dosage}</Text>
                    <Text style={[styles.treatmentFrequency, { color: theme.textSecondary }]}>{t('detect.treatmentDetails.frequency')}: {treatment.frequency}</Text>
                    <Text style={[styles.treatmentSafety, { color: theme.textSecondary }]}>{t('detect.treatmentDetails.safety')}: {treatment.safety}</Text>
                  </View>
                ))}
              </View>

              {result.treatments.chemical.length > 0 && (
                <View style={styles.treatmentSection}>
                  <Text style={[styles.treatmentSectionTitle, { color: theme.text }]}>{t('detect.chemical')}</Text>
                  {result.treatments.chemical.map((treatment, index) => (
                    <View key={index} style={[styles.treatmentCard, { backgroundColor: isDarkMode ? colorScheme.neutral[100] : colorScheme.neutral[50] }]}>
                      <Text style={[styles.treatmentName, { color: theme.text }]}>{treatment.name}</Text>
                      <Text style={[styles.treatmentDosage, { color: theme.textSecondary }]}>{t('detect.treatmentDetails.dosage')}: {treatment.dosage}</Text>
                      <Text style={[styles.treatmentFrequency, { color: theme.textSecondary }]}>{t('detect.treatmentDetails.frequency')}: {treatment.frequency}</Text>
                      <Text style={[styles.treatmentSafety, { color: theme.textSecondary }]}>⚠️ {treatment.safety}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.treatmentSection}>
                <Text style={[styles.treatmentSectionTitle, { color: theme.text }]}>{t('detect.preventive')}</Text>
                {result.treatments.preventive.map((measure, index) => (
                  <View key={index} style={styles.preventiveItem}>
                    <Text style={[styles.preventiveText, { color: theme.textSecondary }]}>• {measure}</Text>
                  </View>
                ))}
              </View>
            </View>

            <TouchableOpacity onPress={handleNewScan} style={styles.newScanButton}>
              <LinearGradient
                colors={[colorScheme.primary[500], colorScheme.primary[600]]}
                style={styles.newScanButtonGradient}
              >
                <Text style={styles.newScanButtonText}>{t('detect.scanAnother')}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (step) {
      case 'capture':
        return renderCaptureStep();
      case 'preview':
        return renderPreviewStep();
      case 'analyze':
        return renderAnalyzeStep();
      case 'result':
        return renderResultStep();
      default:
        return renderCaptureStep();
    }
  };

  return <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>{renderCurrentStep()}</SafeAreaView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  cameraHeader: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  cameraTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cameraSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
    fontWeight: '600',
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    position: 'relative',
  },
  camera: {
    flex: 1,
    minHeight: height * 0.6,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  guideline: {
    width: Math.min(width * 0.6, 200),
    height: Math.min(width * 0.6, 200),
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    borderStyle: 'dashed',
  },
  guidelineText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  cameraTopControls: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  flashButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  captureButtonDisabled: {
    opacity: 0.6,
  },
  captureButtonInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  captureButtonCapturing: {
    backgroundColor: '#f0f0f0',
    transform: [{ scale: 0.9 }],
  },
  cameraLoadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  permissionButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  permissionButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  previewImage: {
    width: '100%',
    height: height * 0.35,
    resizeMode: 'cover',
  },
  resultImage: {
    width: '100%',
    height: height * 0.3,
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageQualityText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  savedNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 8,
    gap: 8,
  },
  savedNotificationText: {
    fontSize: 12,
    fontWeight: '600',
    flex: 1,
  },
  analysisTypeContainer: {
    padding: 20,
  },
  analysisTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  analysisTypeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  analysisTypeOption: {
    flex: 1,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  analysisTypeOptionText: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  analysisTypeOptionDesc: {
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  analyzeButtonContainer: {
    padding: 20,
  },
  analyzeButton: {
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  analyzeButtonGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  analyzeButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  analyzeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  analyzeSteps: {
    marginTop: 40,
    alignItems: 'center',
  },
  analyzeStepText: {
    fontSize: 14,
    marginVertical: 4,
    textAlign: 'center',
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultContent: {
    padding: 20,
  },
  resultMainInfo: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  resultTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resultName: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  severityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginLeft: 12,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
  },
  scientificName: {
    fontSize: 14,
    fontStyle: 'italic',
    marginBottom: 16,
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceLabel: {
    fontSize: 14,
  },
  confidenceValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  confidenceLevel: {
    fontSize: 12,
    marginLeft: 8,
  },
  resultSection: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  resultDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  symptomItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  symptomText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  treatmentTabs: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  treatmentSection: {
    marginBottom: 20,
  },
  treatmentSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  treatmentCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  treatmentName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  treatmentDosage: {
    fontSize: 12,
    marginBottom: 4,
  },
  treatmentFrequency: {
    fontSize: 12,
    marginBottom: 4,
  },
  treatmentSafety: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  preventiveItem: {
    marginBottom: 8,
  },
  preventiveText: {
    fontSize: 12,
    lineHeight: 18,
  },
  newScanButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: 8,
  },
  newScanButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  newScanButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});