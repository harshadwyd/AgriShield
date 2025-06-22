import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableOpacity,
  ScrollView,
  Image
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Scan, Shield, BookOpen, ChevronRight, Check } from 'lucide-react-native';
import { Colors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

const { width, height } = Dimensions.get('window');

interface OnboardingSlide {
  id: number;
  titleKey: string;
  subtitleKey: string;
  descriptionKey: string;
  icon: React.ReactNode;
  color: string;
}

export const OnboardingScreen: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const { dispatch } = useAppContext();
  const { t } = useTranslation();

  const slides: OnboardingSlide[] = [
    {
      id: 1,
      titleKey: 'onboarding.slide1.title',
      subtitleKey: 'onboarding.slide1.subtitle',
      descriptionKey: 'onboarding.slide1.description',
      icon: <Scan size={80} color="white" />,
      color: Colors.primary[500]
    },
    {
      id: 2,
      titleKey: 'onboarding.slide2.title',
      subtitleKey: 'onboarding.slide2.subtitle',
      descriptionKey: 'onboarding.slide2.description',
      icon: <Shield size={80} color="white" />,
      color: Colors.secondary[500]
    },
    {
      id: 3,
      titleKey: 'onboarding.slide3.title',
      subtitleKey: 'onboarding.slide3.subtitle',
      descriptionKey: 'onboarding.slide3.description',
      icon: <BookOpen size={80} color="white" />,
      color: Colors.accent.orange
    }
  ];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      setCurrentSlide(nextSlide);
      scrollViewRef.current?.scrollTo({ x: nextSlide * width, animated: true });
    } else {
      completeOnboarding();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
  };

  const completeOnboarding = () => {
    dispatch({ type: 'SET_ONBOARDED', payload: true });
  };

  const onScroll = (event: any) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentSlide(slideIndex);
  };

  const renderSlide = (slide: OnboardingSlide, index: number) => (
    <View key={slide.id} style={styles.slide}>
      <LinearGradient
        colors={[slide.color, `${slide.color}CC`]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {slide.icon}
          </View>
          
          <Text style={styles.title}>{t(slide.titleKey)}</Text>
          <Text style={styles.subtitle}>{t(slide.subtitleKey)}</Text>
          <Text style={styles.description}>{t(slide.descriptionKey)}</Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderPagination = () => (
    <View style={styles.pagination}>
      {slides.map((_, index) => (
        <View
          key={index}
          style={[
            styles.paginationDot,
            index === currentSlide && styles.paginationDotActive
          ]}
        />
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        {slides.map(renderSlide)}
      </ScrollView>

      {renderPagination()}

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>{t('skip')}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <LinearGradient
            colors={[Colors.primary[500], Colors.primary[600]]}
            style={styles.nextButtonGradient}
          >
            {currentSlide === slides.length - 1 ? (
              <>
                <Check size={20} color="white" />
                <Text style={styles.nextButtonText}>{t('onboarding.getStarted')}</Text>
              </>
            ) : (
              <>
                <Text style={styles.nextButtonText}>{t('next')}</Text>
                <ChevronRight size={20} color="white" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral[50],
  },
  slide: {
    width,
    height,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  iconContainer: {
    marginBottom: 40,
    padding: 20,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 30,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: 'white',
    width: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    color: Colors.neutral[600],
    fontWeight: '600',
  },
  nextButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    marginHorizontal: 8,
  },
});