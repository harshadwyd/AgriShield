import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Sun, Cloud, CloudRain, Sunrise, Sunset, Moon } from 'lucide-react-native';
import { Colors, getThemeColors } from '../constants/colors';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from '../hooks/useTranslation';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  icon: string;
  recommendation: string;
}

export const DynamicGreeting: React.FC = () => {
  const { isDarkMode } = useAppContext();
  const { t } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-50));

  const mockWeather: WeatherData = {
    temperature: 28,
    humidity: 65,
    condition: 'Partly Cloudy',
    icon: '⛅',
    recommendation: 'Perfect conditions for spraying treatments. Low wind and moderate humidity make it ideal for applying organic solutions.'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();

    return () => clearInterval(timer);
  }, []);

  const getTimeBasedGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 6) return { text: t('home.greeting.night'), icon: Moon, color: '#4c1d95' };
    if (hour < 12) return { text: t('home.greeting.morning'), icon: Sunrise, color: '#ea580c' };
    if (hour < 17) return { text: t('home.greeting.afternoon'), icon: Sun, color: '#eab308' };
    if (hour < 20) return { text: t('home.greeting.evening'), icon: Sunset, color: '#dc2626' };
    return { text: t('home.greeting.night'), icon: Moon, color: '#4c1d95' };
  };

  const getWeatherIcon = () => {
    switch (mockWeather.condition.toLowerCase()) {
      case 'sunny': return Sun;
      case 'cloudy': return Cloud;
      case 'rainy': return CloudRain;
      default: return Cloud;
    }
  };

  const greeting = getTimeBasedGreeting();
  const WeatherIcon = getWeatherIcon();
  const GreetingIcon = greeting.icon;

  const getMotivationalQuote = () => {
    const quotes = [
      "Every seed planted is a step toward abundance! 🌱",
      "Your dedication to your crops shows in every harvest! 🌾",
      "Smart farming today, bountiful tomorrow! 🚜",
      "Technology and tradition - the perfect farming blend! 📱",
      "Your crops are thriving because of your care! 🌿"
    ];
    const dayOfYear = Math.floor((currentTime.getTime() - new Date(currentTime.getFullYear(), 0, 0).getTime()) / 86400000);
    return quotes[dayOfYear % quotes.length];
  };

  return (
    <Animated.View 
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={[Colors.primary[500], Colors.primary[600], greeting.color]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.greetingSection}>
            <View style={styles.greetingHeader}>
              <GreetingIcon size={24} color="white" />
              <Text style={styles.greetingText}>{greeting.text}</Text>
            </View>
            <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
            <Text style={styles.motivationalQuote}>{getMotivationalQuote()}</Text>
          </View>

          <View style={styles.weatherSection}>
            <View style={styles.weatherCard}>
              <WeatherIcon size={20} color="white" />
              <Text style={styles.temperature}>{mockWeather.temperature}°C</Text>
              <Text style={styles.condition}>{mockWeather.condition}</Text>
              <Text style={styles.humidity}>{mockWeather.humidity}% humidity</Text>
            </View>
          </View>
        </View>

        <View style={styles.recommendationCard}>
          <Text style={styles.recommendationTitle}>🌤️ Today's Farming Tip</Text>
          <Text style={styles.recommendationText}>{mockWeather.recommendation}</Text>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  gradient: {
    padding: 20,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greetingSection: {
    flex: 1,
  },
  greetingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    lineHeight: 20,
  },
  motivationalQuote: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    lineHeight: 16,
  },
  weatherSection: {
    alignItems: 'flex-end',
  },
  weatherCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  temperature: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
  },
  condition: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  humidity: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  recommendationCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recommendationTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    marginBottom: 4,
  },
  recommendationText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 16,
  },
});