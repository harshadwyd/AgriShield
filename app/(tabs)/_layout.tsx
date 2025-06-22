import { Tabs } from 'expo-router';
import { Chrome as Home, Scan, History, BookOpen, Settings } from 'lucide-react-native';
import { Platform, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';

const { height: screenHeight } = Dimensions.get('window');

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  const insets = useSafeAreaInsets();

  // Calculate proper tab bar height and position
  const getTabBarConfig = () => {
    if (Platform.OS === 'ios') {
      // For iOS, ensure we're above the home indicator
      const bottomInset = Math.max(insets.bottom, 20); // Minimum 20px clearance
      return {
        height: 100,
        paddingBottom: bottomInset,
        bottom: 0,
      };
    } else {
      // For Android, handle both gesture and button navigation
      const hasGestureNav = screenHeight > 800 && insets.bottom > 0;
      const systemNavHeight = hasGestureNav ? insets.bottom : 0;
      
      return {
        height: 100,
        paddingBottom: Math.max(systemNavHeight + 8, 12), // Ensure minimum padding
        bottom: 0,
      };
    }
  };

  const tabBarConfig = getTabBarConfig();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme.primary[600],
        tabBarInactiveTintColor: isDarkMode ? colorScheme.neutral[400] : Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0.5,
          borderTopColor: theme.border,
          height: tabBarConfig.height + tabBarConfig.paddingBottom,
          position: 'absolute',
          bottom: tabBarConfig.bottom,
          left: 0,
          right: 0,
          elevation: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: isDarkMode ? 0.5 : 0.2,
          shadowRadius: 16,
          paddingBottom: tabBarConfig.paddingBottom,
          paddingTop: 12,
          paddingHorizontal: 8,
          // Ensure proper z-index
          zIndex: 1000,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
          marginBottom: 2,
          textAlign: 'center',
        },
        tabBarIconStyle: {
          marginTop: 8,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 6,
          height: 52,
          // Better visual feedback
          borderRadius: 12,
          marginHorizontal: 2,
        },
        // Improve interaction feedback
        tabBarPressColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        tabBarPressOpacity: 0.7,
        // Ensure accessibility
        tabBarAccessibilityLabel: 'Main navigation',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ size, color, focused }) => (
            <Home 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: t('tabs.detect'),
          tabBarIcon: ({ size, color, focused }) => (
            <Scan 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ size, color, focused }) => (
            <History 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: ({ size, color, focused }) => (
            <BookOpen 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ size, color, focused }) => (
            <Settings 
              size={focused ? size + 1 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}