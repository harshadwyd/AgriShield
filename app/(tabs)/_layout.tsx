import { Tabs } from 'expo-router';
import { Chrome as Home, Scan, History, BookOpen, Settings } from 'lucide-react-native';
import { Platform } from 'react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { useTranslation } from '../../hooks/useTranslation';
import { useAppContext } from '../../context/AppContext';

export default function TabLayout() {
  const { t } = useTranslation();
  const { isDarkMode } = useAppContext();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colorScheme.primary[600],
        tabBarInactiveTintColor: isDarkMode ? colorScheme.neutral[400] : Colors.neutral[400],
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          paddingBottom: Platform.OS === 'ios' ? 25 : 8, // Extra padding for iOS home indicator
          paddingTop: 12, // Increased top padding to move icons up
          height: Platform.OS === 'ios' ? 90 : 70, // Slightly taller to accommodate icon movement
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: isDarkMode ? 0.3 : 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: Platform.OS === 'ios' ? 2 : 6, // Adjusted for better spacing
          marginTop: 2, // Small gap between icon and label
        },
        tabBarIconStyle: {
          marginTop: Platform.OS === 'ios' ? 6 : 8, // Move icons up more
          marginBottom: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="detect"
        options={{
          title: t('tabs.detect'),
          tabBarIcon: ({ size, color }) => (
            <Scan size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('tabs.history'),
          tabBarIcon: ({ size, color }) => (
            <History size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('tabs.learn'),
          tabBarIcon: ({ size, color }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}