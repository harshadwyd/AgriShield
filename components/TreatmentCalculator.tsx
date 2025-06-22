import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Animated, 
  ScrollView, 
  PanResponder,
  Dimensions 
} from 'react-native';
import { Calculator, Droplets, DollarSign, ShoppingCart, X, ChevronDown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';
import { treatmentDatabase } from '../constants/mockData';

const { width } = Dimensions.get('window');

interface TreatmentCalculatorProps {
  visible: boolean;
  onClose: () => void;
  treatmentName?: string;
}

interface CalculationResult {
  totalAmount: number;
  waterAmount: number;
  cost: number;
  applications: number;
}

export const TreatmentCalculator: React.FC<TreatmentCalculatorProps> = ({
  visible,
  onClose,
  treatmentName = 'Neem Oil'
}) => {
  const { isDarkMode, state } = useAppContext();
  const { t } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  
  const [fieldSize, setFieldSize] = useState(1.1);
  const [concentration, setConcentration] = useState(2.0);
  const [selectedTreatment, setSelectedTreatment] = useState(treatmentName);
  const [showTreatmentPicker, setShowTreatmentPicker] = useState(false);
  const [slideAnim] = useState(new Animated.Value(300));
  const [result, setResult] = useState<CalculationResult | null>(null);

  const isMetric = state.settings.units === 'metric';
  const treatmentOptions = Object.keys(treatmentDatabase);
  const currentTreatment = treatmentDatabase[selectedTreatment] || treatmentDatabase['Neem Oil'];

  useEffect(() => {
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

  useEffect(() => {
    calculateTreatment();
  }, [fieldSize, concentration, selectedTreatment, isMetric]);

  const calculateTreatment = () => {
    const baseAmount = fieldSize * (isMetric ? 2.5 : 1); // liters per hectare or gallons per acre
    const treatmentAmount = (baseAmount * concentration) / 100;
    const waterAmount = baseAmount - treatmentAmount;
    const totalCost = treatmentAmount * currentTreatment.costPerLiter;
    const applications = Math.ceil(fieldSize / 0.5);

    setResult({
      totalAmount: treatmentAmount,
      waterAmount,
      cost: totalCost,
      applications
    });
  };

  const createSliderPanResponder = (
    value: number,
    min: number,
    max: number,
    step: number,
    onChange: (value: number) => void
  ) => {
    return PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        // Haptic feedback would go here for mobile
      },
      onPanResponderMove: (evt, gestureState) => {
        const { locationX } = evt.nativeEvent;
        const sliderWidth = width - 80; // Account for padding
        const percentage = Math.max(0, Math.min(1, locationX / sliderWidth));
        const newValue = min + (max - min) * percentage;
        const steppedValue = Math.round(newValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));
        onChange(clampedValue);
      },
      onPanResponderRelease: () => {
        // Haptic feedback would go here for mobile
      },
    });
  };

  const fieldSizePanResponder = createSliderPanResponder(fieldSize, 0.1, 10, 0.1, setFieldSize);
  const concentrationPanResponder = createSliderPanResponder(concentration, 0.5, 10, 0.5, setConcentration);

  const renderTreatmentPicker = () => (
    <View style={styles.treatmentPickerContainer}>
      <TouchableOpacity
        onPress={() => setShowTreatmentPicker(!showTreatmentPicker)}
        style={[styles.treatmentPicker, { backgroundColor: theme.surface, borderColor: theme.border }]}
      >
        <View style={styles.treatmentPickerContent}>
          <Text style={[styles.treatmentPickerText, { color: theme.text }]}>{selectedTreatment}</Text>
          <Text style={[styles.treatmentPickerType, { color: theme.textSecondary }]}>
            {currentTreatment.type} • ${currentTreatment.costPerLiter}/L
          </Text>
        </View>
        <ChevronDown 
          size={20} 
          color={theme.textSecondary} 
          style={{ transform: [{ rotate: showTreatmentPicker ? '180deg' : '0deg' }] }}
        />
      </TouchableOpacity>

      {showTreatmentPicker && (
        <View style={[styles.treatmentOptions, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <ScrollView style={styles.treatmentOptionsScroll} nestedScrollEnabled={true}>
            {treatmentOptions.map((treatment) => {
              const treatmentData = treatmentDatabase[treatment];
              return (
                <TouchableOpacity
                  key={treatment}
                  onPress={() => {
                    setSelectedTreatment(treatment);
                    setConcentration(treatmentData.baseConcentration);
                    setShowTreatmentPicker(false);
                  }}
                  style={[
                    styles.treatmentOption,
                    selectedTreatment === treatment && { backgroundColor: Colors.primary[50] }
                  ]}
                >
                  <View style={styles.treatmentOptionContent}>
                    <Text style={[styles.treatmentOptionName, { color: theme.text }]}>{treatment}</Text>
                    <Text style={[styles.treatmentOptionDesc, { color: theme.textSecondary }]}>
                      {treatmentData.description}
                    </Text>
                    <View style={styles.treatmentOptionMeta}>
                      <Text style={[styles.treatmentOptionType, { color: Colors.primary[600] }]}>
                        {treatmentData.type}
                      </Text>
                      <Text style={[styles.treatmentOptionCost, { color: theme.textSecondary }]}>
                        ${treatmentData.costPerLiter}/L
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}
    </View>
  );

  const renderSlider = (
    label: string,
    value: number,
    min: number,
    max: number,
    step: number,
    unit: string,
    onChange: (value: number) => void,
    panResponder: any
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={[styles.sliderLabel, { color: theme.text }]}>{label}</Text>
        <Text style={[styles.sliderValue, { color: Colors.primary[600] }]}>
          {value.toFixed(1)} {unit}
        </Text>
      </View>
      
      <View 
        style={[styles.sliderTrack, { backgroundColor: theme.border }]}
        {...panResponder.panHandlers}
      >
        <View 
          style={[
            styles.sliderFill, 
            { 
              width: `${((value - min) / (max - min)) * 100}%`,
              backgroundColor: Colors.primary[500]
            }
          ]} 
        />
        <View
          style={[
            styles.sliderThumb,
            { 
              left: `${((value - min) / (max - min)) * 100}%`,
              backgroundColor: Colors.primary[600]
            }
          ]}
        />
      </View>
      
      <View style={styles.sliderButtons}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, value - step))}
          style={[styles.sliderButton, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.sliderButtonText, { color: theme.text }]}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.sliderValueContainer}>
          <Text style={[styles.sliderCurrentValue, { color: theme.textSecondary }]}>
            {value.toFixed(1)} {unit}
          </Text>
        </View>
        
        <TouchableOpacity
          onPress={() => onChange(Math.min(max, value + step))}
          style={[styles.sliderButton, { backgroundColor: theme.surface }]}
        >
          <Text style={[styles.sliderButtonText, { color: theme.text }]}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderMixingGuide = () => {
    if (!result) return null;

    return (
      <View style={[styles.mixingGuide, { backgroundColor: theme.surface }]}>
        <Text style={[styles.mixingTitle, { color: theme.text }]}>📋 Mixing Instructions</Text>
        
        <View style={styles.mixingSteps}>
          <View style={styles.mixingStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.primary[500] }]}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.textSecondary }]}>
              Measure {result.totalAmount.toFixed(1)} {isMetric ? 'L' : 'gal'} of {selectedTreatment}
            </Text>
          </View>
          
          <View style={styles.mixingStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.secondary[500] }]}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.textSecondary }]}>
              Add {result.waterAmount.toFixed(1)} {isMetric ? 'L' : 'gal'} of clean water
            </Text>
          </View>
          
          <View style={styles.mixingStep}>
            <View style={[styles.stepNumber, { backgroundColor: Colors.accent.orange }]}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <Text style={[styles.stepText, { color: theme.textSecondary }]}>
              Mix thoroughly and apply within 2 hours
            </Text>
          </View>
        </View>

        <View style={[styles.safetyNote, { backgroundColor: theme.background }]}>
          <Text style={[styles.safetyTitle, { color: Colors.accent.orange }]}>⚠️ Safety Notes</Text>
          <Text style={[styles.safetyText, { color: theme.textSecondary }]}>{currentTreatment.safetyNotes}</Text>
        </View>
      </View>
    );
  };

  const renderCostBreakdown = () => {
    if (!result) return null;

    return (
      <View style={[styles.costBreakdown, { backgroundColor: theme.surface }]}>
        <View style={styles.costHeader}>
          <DollarSign size={20} color={Colors.accent.yellow} />
          <Text style={[styles.costTitle, { color: theme.text }]}>Cost Breakdown</Text>
        </View>
        
        <View style={styles.costItems}>
          <View style={styles.costItem}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>{selectedTreatment}:</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>${result.cost.toFixed(2)}</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Water:</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>$0.00</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Applications needed:</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>{result.applications}</Text>
          </View>
          <View style={[styles.costItem, styles.totalCost, { borderTopColor: theme.border }]}>
            <Text style={[styles.costLabel, { color: theme.text, fontWeight: 'bold' }]}>Total Cost:</Text>
            <Text style={[styles.costValue, { color: Colors.primary[600], fontWeight: 'bold' }]}>
              ${(result.cost * result.applications).toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
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
              <Calculator size={24} color={Colors.primary[500]} />
              <Text style={[styles.headerTitle, { color: theme.text }]}>Treatment Calculator</Text>
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
              {renderTreatmentPicker()}

              {renderSlider(
                'Field Size',
                fieldSize,
                0.1,
                10,
                0.1,
                isMetric ? 'hectares' : 'acres',
                setFieldSize,
                fieldSizePanResponder
              )}

              {renderSlider(
                'Concentration',
                concentration,
                0.5,
                10,
                0.5,
                '%',
                setConcentration,
                concentrationPanResponder
              )}

              {renderMixingGuide()}
              {renderCostBreakdown()}

              <TouchableOpacity style={styles.shoppingListButton}>
                <LinearGradient
                  colors={[Colors.secondary[500], Colors.secondary[600]]}
                  style={styles.shoppingListGradient}
                >
                  <ShoppingCart size={16} color="white" />
                  <Text style={styles.shoppingListText}>Generate Shopping List</Text>
                </LinearGradient>
              </TouchableOpacity>
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
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: '90%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
  treatmentPickerContainer: {
    marginBottom: 24,
    position: 'relative',
    zIndex: 1000,
  },
  treatmentPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  treatmentPickerContent: {
    flex: 1,
  },
  treatmentPickerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  treatmentPickerType: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  treatmentOptions: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    maxHeight: 300,
    zIndex: 1001,
  },
  treatmentOptionsScroll: {
    maxHeight: 280,
  },
  treatmentOption: {
    padding: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e5e5',
  },
  treatmentOptionContent: {
    flex: 1,
  },
  treatmentOptionName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  treatmentOptionDesc: {
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 6,
  },
  treatmentOptionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  treatmentOptionType: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  treatmentOptionCost: {
    fontSize: 11,
    fontWeight: '600',
  },
  sliderContainer: {
    marginBottom: 32,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  sliderValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
    position: 'relative',
    marginBottom: 20,
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  sliderThumb: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -8,
    marginLeft: -12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sliderButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  sliderValueContainer: {
    flex: 1,
    alignItems: 'center',
  },
  sliderCurrentValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  mixingGuide: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  mixingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  mixingSteps: {
    gap: 12,
    marginBottom: 16,
  },
  mixingStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  safetyNote: {
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent.orange,
  },
  safetyTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  safetyText: {
    fontSize: 12,
    lineHeight: 16,
  },
  costBreakdown: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  costHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  costTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  costItems: {
    gap: 8,
  },
  costItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalCost: {
    paddingTop: 8,
    borderTopWidth: 1,
    marginTop: 8,
  },
  costLabel: {
    fontSize: 14,
  },
  costValue: {
    fontSize: 14,
  },
  shoppingListButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  shoppingListGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  shoppingListText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});