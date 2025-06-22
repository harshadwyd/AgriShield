import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Animated, ScrollView, PanResponder } from 'react-native';
import { Calculator, Droplets, DollarSign, ShoppingCart, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

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
  
  const [fieldSize, setFieldSize] = useState(1); // in acres
  const [concentration, setConcentration] = useState(2); // percentage
  const [slideAnim] = useState(new Animated.Value(300));
  const [result, setResult] = useState<CalculationResult | null>(null);

  const isMetric = state.settings.units === 'metric';

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
  }, [fieldSize, concentration, isMetric]);

  const calculateTreatment = () => {
    // Mock calculation based on field size and concentration
    const baseAmount = fieldSize * (isMetric ? 2.5 : 1); // liters per acre or gallons per acre
    const treatmentAmount = (baseAmount * concentration) / 100;
    const waterAmount = baseAmount - treatmentAmount;
    const costPerUnit = 15; // cost per liter/gallon
    const totalCost = treatmentAmount * costPerUnit;
    const applications = Math.ceil(fieldSize / 0.5); // applications needed

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
        // Optional: Add haptic feedback here
      },
      onPanResponderMove: (evt, gestureState) => {
        const { dx } = gestureState;
        const sliderWidth = 200; // Approximate slider width
        const percentage = Math.max(0, Math.min(1, (dx + sliderWidth / 2) / sliderWidth));
        const newValue = min + (max - min) * percentage;
        const steppedValue = Math.round(newValue / step) * step;
        const clampedValue = Math.max(min, Math.min(max, steppedValue));
        onChange(clampedValue);
      },
      onPanResponderRelease: () => {
        // Optional: Add haptic feedback here
      },
    });
  };

  const fieldSizePanResponder = createSliderPanResponder(fieldSize, 0.1, 10, 0.1, setFieldSize);
  const concentrationPanResponder = createSliderPanResponder(concentration, 0.5, 10, 0.5, setConcentration);

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
              Measure {result.totalAmount.toFixed(1)} {isMetric ? 'L' : 'gal'} of {treatmentName}
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
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>{treatmentName}:</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>${result.cost.toFixed(2)}</Text>
          </View>
          <View style={styles.costItem}>
            <Text style={[styles.costLabel, { color: theme.textSecondary }]}>Water:</Text>
            <Text style={[styles.costValue, { color: theme.text }]}>$0.00</Text>
          </View>
          <View style={[styles.costItem, styles.totalCost, { borderTopColor: theme.border }]}>
            <Text style={[styles.costLabel, { color: theme.text, fontWeight: 'bold' }]}>Total:</Text>
            <Text style={[styles.costValue, { color: Colors.primary[600], fontWeight: 'bold' }]}>
              ${result.cost.toFixed(2)}
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
              <Text style={[styles.treatmentName, { color: Colors.primary[600] }]}>
                {treatmentName} Solution
              </Text>

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
    height: '85%',
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
  treatmentName: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
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