import { Tabs } from 'expo-router';
import { Home, Scan, History, BookOpen, Settings } from 'lucide-react-native';
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

  // Calculate proper tab bar height based on device
  const getTabBarHeight = () => {
    if (Platform.OS === 'ios') {
      // For iOS, account for home indicator
      return 65 + Math.max(insets.bottom, 0);
    } else {
      // For Android, check if we have gesture navigation
      const hasGestureNav = screenHeight > 800 && insets.bottom > 0;
      return hasGestureNav ? 65 + insets.bottom : 60;
    }
  };

  const tabBarHeight = getTabBarHeight();

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
          height: tabBarHeight,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: 12,
          // Prevent conflicts with system navigation
          paddingBottom: Platform.OS === 'ios' ? Math.max(insets.bottom, 8) : Math.max(insets.bottom, 8),
          paddingTop: 8,
          paddingHorizontal: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 2,
          marginBottom: Platform.OS === 'ios' ? 2 : 4,
          textAlign: 'center',
        },
        tabBarIconStyle: {
          marginTop: 6,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 4,
          // Better spacing for icons and labels
          height: Platform.OS === 'ios' ? 50 : 48,
        },
        // Improve tap targets
        tabBarPressColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        tabBarPressOpacity: 0.8,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ size, color, focused }) => (
            <Home 
              size={focused ? size + 2 : size} 
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
              size={focused ? size + 2 : size} 
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
              size={focused ? size + 2 : size} 
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
              size={focused ? size + 2 : size} 
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
              size={focused ? size + 2 : size} 
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}