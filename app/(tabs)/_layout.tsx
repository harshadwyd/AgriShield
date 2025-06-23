import { Tabs } from 'expo-router';
import { Chrome as Home, Scan, History, BookOpen, Settings, Bug } from 'lucide-react-native';
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
      const bottomInset = Math.max(insets.bottom, 8);
      return {
        height: 55,
        paddingBottom: bottomInset,
        bottom: 0,
      };
    } else {
      // For Android, handle both gesture and button navigation
      const hasGestureNav = screenHeight > 800 && insets.bottom > 0;
      const systemNavHeight = hasGestureNav ? insets.bottom : 0;
      
      return {
        height: 55,
        paddingBottom: Math.max(systemNavHeight + 4, 6),
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
          backgroundColor: isDarkMode ? colorScheme.neutral[100] : '#ffffff',
          borderTopWidth: 0.5,
          borderTopColor: isDarkMode ? colorScheme.neutral[200] : Colors.neutral[200],
          height: tabBarConfig.height + tabBarConfig.paddingBottom,
          position: 'absolute',
          bottom: tabBarConfig.bottom,
          left: 0,
          right: 0,
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDarkMode ? 0.4 : 0.15,
          shadowRadius: 12,
          paddingBottom: tabBarConfig.paddingBottom,
          paddingTop: 4,
          paddingHorizontal: 6,
          zIndex: 1000,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 1,
          marginBottom: 0,
          textAlign: 'center',
        },
        tabBarIconStyle: {
          marginTop: 2,
          marginBottom: 0,
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 2,
          height: 40,
          borderRadius: 10,
          marginHorizontal: 1,
        },
        tabBarPressColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        tabBarPressOpacity: 0.7,
        tabBarAccessibilityLabel: 'Main navigation',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ size, color, focused }) => (
            <Home 
              size={focused ? 20 : 18}
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
              size={focused ? 20 : 18}
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
              size={focused ? 20 : 18}
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
              size={focused ? 20 : 18}
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
              size={focused ? 20 : 18}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="debug"
        options={{
          title: 'Debug',
          tabBarIcon: ({ size, color, focused }) => (
            <Bug 
              size={focused ? 20 : 18}
              color={color}
              strokeWidth={focused ? 2.5 : 2}
            />
          ),
        }}
      />
    </Tabs>
  );
}