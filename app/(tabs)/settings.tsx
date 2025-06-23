import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Globe, Ruler, Bell, Palette, Wifi, Trash2, CircleHelp as HelpCircle, Mail, Shield, ChevronRight, Download, ChartBar as BarChart3, LogOut, Edit3, Save } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import { useAuthContext } from '../../components/AuthProvider';
import { useDetections } from '../../hooks/useDetections';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsScreen() {
  const { state, dispatch, isDarkMode } = useAppContext();
  const { user, profile, signOut, updateProfile } = useAuthContext();
  const { detections } = useDetections();
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [localSettings, setLocalSettings] = useState(state.settings);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    farm_name: profile?.farm_name || '',
    location: profile?.location || '',
    farm_size: profile?.farm_size?.toString() || '',
  });

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile({
        full_name: profileData.full_name,
        farm_name: profileData.farm_name,
        location: profileData.location,
        farm_size: profileData.farm_size ? parseFloat(profileData.farm_size) : null,
      });
      setIsEditingProfile(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
            } catch (error) {
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleClearHistory = () => {
    Alert.alert(
      t('settings.clearHistoryDialog.title'),
      t('settings.clearHistoryDialog.message'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('settings.clearHistoryDialog.clear'),
          style: 'destructive',
          onPress: () => {
            dispatch({ type: 'CLEAR_HISTORY' });
            Alert.alert(t('success'), 'Detection history has been cleared.');
          },
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: React.ReactNode,
    title: string,
    subtitle?: string,
    rightElement?: React.ReactNode,
    onPress?: () => void
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: theme.border }]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>{icon}</View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        {subtitle && <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{subtitle}</Text>}
      </View>
      <View style={styles.settingRight}>
        {rightElement}
        {onPress && <ChevronRight size={16} color={theme.textSecondary} />}
      </View>
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { backgroundColor: theme.surface }]}>{children}</View>
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.section}>
      <View style={styles.profileHeader}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity
          onPress={() => {
            if (isEditingProfile) {
              handleSaveProfile();
            } else {
              setIsEditingProfile(true);
            }
          }}
          style={[styles.editButton, { backgroundColor: colorScheme.primary[500] }]}
        >
          {isEditingProfile ? (
            <Save size={16} color="white" />
          ) : (
            <Edit3 size={16} color="white" />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={[styles.sectionContent, { backgroundColor: theme.surface }]}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarPlaceholder, { backgroundColor: colorScheme.primary[500] }]}>
                <User size={32} color="white" />
              </View>
            )}
          </View>
          
          <View style={styles.profileDetails}>
            {isEditingProfile ? (
              <>
                <TextInput
                  style={[styles.profileInput, { backgroundColor: theme.background, color: theme.text }]}
                  value={profileData.full_name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, full_name: text }))}
                  placeholder="Full Name"
                  placeholderTextColor={theme.textSecondary}
                />
                <TextInput
                  style={[styles.profileInput, { backgroundColor: theme.background, color: theme.text }]}
                  value={profileData.farm_name}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, farm_name: text }))}
                  placeholder="Farm Name"
                  placeholderTextColor={theme.textSecondary}
                />
                <TextInput
                  style={[styles.profileInput, { backgroundColor: theme.background, color: theme.text }]}
                  value={profileData.location}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, location: text }))}
                  placeholder="Location"
                  placeholderTextColor={theme.textSecondary}
                />
                <TextInput
                  style={[styles.profileInput, { backgroundColor: theme.background, color: theme.text }]}
                  value={profileData.farm_size}
                  onChangeText={(text) => setProfileData(prev => ({ ...prev, farm_size: text }))}
                  placeholder="Farm Size (hectares)"
                  placeholderTextColor={theme.textSecondary}
                  keyboardType="numeric"
                />
              </>
            ) : (
              <>
                <Text style={[styles.profileName, { color: theme.text }]}>
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </Text>
                <Text style={[styles.profileEmail, { color: theme.textSecondary }]}>
                  {user?.email}
                </Text>
                {profile?.farm_name && (
                  <Text style={[styles.profileFarm, { color: theme.textSecondary }]}>
                    🚜 {profile.farm_name}
                  </Text>
                )}
                {profile?.location && (
                  <Text style={[styles.profileLocation, { color: theme.textSecondary }]}>
                    📍 {profile.location}
                  </Text>
                )}
                {profile?.farm_size && (
                  <Text style={[styles.profileSize, { color: theme.textSecondary }]}>
                    🌾 {profile.farm_size} hectares
                  </Text>
                )}
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );

  const getLanguageName = (code: string) => {
    switch (code) {
      case 'en': return t('settings.languages.english');
      case 'hi': return t('settings.languages.hindi');
      case 'mr': return t('settings.languages.marathi');
      default: return t('settings.languages.english');
    }
  };

  const getUnitsName = (units: string) => {
    return units === 'metric' ? t('settings.units.metric') : t('settings.units.imperial');
  };

  const getThemeName = (theme: string) => {
    switch (theme) {
      case 'light': return t('settings.themes.light');
      case 'dark': return t('settings.themes.dark');
      case 'auto': return t('settings.themes.auto');
      default: return t('settings.themes.auto');
    }
  };

  const getDataUsageName = (usage: string) => {
    switch (usage) {
      case 'low': return t('settings.dataUsageOptions.low');
      case 'medium': return t('settings.dataUsageOptions.medium');
      case 'high': return t('settings.dataUsageOptions.high');
      default: return t('settings.dataUsageOptions.medium');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('settings.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {t('settings.subtitle')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProfileSection()}

        {renderSection(
          t('settings.sections.userPreferences'),
          <>
            {renderSettingItem(
              <Globe size={20} color={colorScheme.primary[500]} />,
              t('settings.language'),
              getLanguageName(localSettings.language),
              null,
              () => {
                Alert.alert(
                  t('settings.language'),
                  'Choose your preferred language',
                  [
                    { text: t('settings.languages.english'), onPress: () => updateSetting('language', 'en') },
                    { text: t('settings.languages.hindi'), onPress: () => updateSetting('language', 'hi') },
                    { text: t('settings.languages.marathi'), onPress: () => updateSetting('language', 'mr') },
                    { text: t('cancel'), style: 'cancel' },
                  ]
                );
              }
            )}
            {renderSettingItem(
              <Ruler size={20} color={colorScheme.secondary[500]} />,
              t('settings.units'),
              getUnitsName(localSettings.units),
              null,
              () => {
                Alert.alert(
                  t('settings.units'),
                  'Choose your preferred measurement system',
                  [
                    { text: t('settings.units.metric'), onPress: () => updateSetting('units', 'metric') },
                    { text: t('settings.units.imperial'), onPress: () => updateSetting('units', 'imperial') },
                    { text: t('cancel'), style: 'cancel' },
                  ]
                );
              }
            )}
            {renderSettingItem(
              <Bell size={20} color={colorScheme.accent.orange} />,
              t('settings.notifications'),
              t('settings.notificationsDesc'),
              <Switch
                value={localSettings.notifications}
                onValueChange={(value) => updateSetting('notifications', value)}
                trackColor={{ false: theme.border, true: colorScheme.primary[200] }}
                thumbColor={localSettings.notifications ? colorScheme.primary[500] : theme.textSecondary}
              />
            )}
          </>
        )}

        {renderSection(
          t('settings.sections.appSettings'),
          <>
            {renderSettingItem(
              <Palette size={20} color={colorScheme.accent.yellow} />,
              t('settings.theme'),
              getThemeName(localSettings.theme),
              null,
              () => {
                Alert.alert(
                  t('settings.theme'),
                  'Choose your preferred app appearance',
                  [
                    { text: t('settings.themes.light'), onPress: () => updateSetting('theme', 'light') },
                    { text: t('settings.themes.dark'), onPress: () => updateSetting('theme', 'dark') },
                    { text: t('settings.themes.auto'), onPress: () => updateSetting('theme', 'auto') },
                    { text: t('cancel'), style: 'cancel' },
                  ]
                );
              }
            )}
            {renderSettingItem(
              <Wifi size={20} color={colorScheme.secondary[600]} />,
              t('settings.dataUsage'),
              getDataUsageName(localSettings.dataUsage),
              null,
              () => {
                Alert.alert(
                  t('settings.dataUsage'),
                  'Choose your data usage preference',
                  [
                    { text: t('settings.dataUsageOptions.low'), onPress: () => updateSetting('dataUsage', 'low') },
                    { text: t('settings.dataUsageOptions.medium'), onPress: () => updateSetting('dataUsage', 'medium') },
                    { text: t('settings.dataUsageOptions.high'), onPress: () => updateSetting('dataUsage', 'high') },
                    { text: t('cancel'), style: 'cancel' },
                  ]
                );
              }
            )}
          </>
        )}

        {renderSection(
          t('settings.sections.dataManagement'),
          <>
            {renderSettingItem(
              <BarChart3 size={20} color={colorScheme.primary[600]} />,
              t('settings.detectionHistory'),
              `${formatNumber(detections.length)} ${t('settings.detectionHistoryDesc')}`,
              null,
              () => {
                Alert.alert(
                  t('settings.detectionHistory'),
                  `You have ${formatNumber(detections.length)} detections in your history.\n\nThis data is stored securely in the cloud and helps track your crop health over time.`,
                  [{ text: t('ok') }]
                );
              }
            )}
            {renderSettingItem(
              <Download size={20} color={colorScheme.accent.orange} />,
              t('settings.downloadedContent'),
              t('settings.downloadedContentDesc'),
              null,
              () => {
                Alert.alert(
                  t('settings.downloadedContent'),
                  'Feature coming soon! You will be able to manage your downloaded educational content here.',
                  [{ text: t('ok') }]
                );
              }
            )}
            {renderSettingItem(
              <Trash2 size={20} color={colorScheme.accent.red} />,
              t('settings.clearData'),
              t('settings.clearDataDesc'),
              null,
              handleClearHistory
            )}
          </>
        )}

        {renderSection(
          t('settings.sections.support'),
          <>
            {renderSettingItem(
              <HelpCircle size={20} color={colorScheme.secondary[500]} />,
              t('settings.help'),
              t('settings.helpDesc'),
              null,
              () => {
                Alert.alert(
                  t('settings.help'),
                  'Common questions:\n\n• How accurate is the AI detection?\n• Can I use the app offline?\n• How do I interpret results?\n\nFor more help, contact our support team.',
                  [{ text: t('ok') }]
                );
              }
            )}
            {renderSettingItem(
              <Mail size={20} color={colorScheme.primary[500]} />,
              t('settings.contact'),
              t('settings.contactDesc'),
              null,
              () => {
                Alert.alert(
                  t('settings.contact'),
                  'Need help? Contact us at:\n\nsupport@agrishield.com\n\nOr call: +1-800-AGRI-HELP\n\nWe typically respond within 24 hours.',
                  [{ text: t('ok') }]
                );
              }
            )}
            {renderSettingItem(
              <Shield size={20} color={colorScheme.accent.orange} />,
              t('settings.privacy'),
              t('settings.privacyDesc'),
              null,
              () => {
                Alert.alert(
                  t('settings.privacy'),
                  'AgriShield respects your privacy:\n\n• Your photos are processed securely\n• Detection history is encrypted\n• We don\'t share personal data\n• You control your information\n\nView full policy at agrishield.com/privacy',
                  [{ text: t('ok') }]
                );
              }
            )}
          </>
        )}

        {renderSection(
          'Account',
          <>
            {renderSettingItem(
              <LogOut size={20} color={colorScheme.accent.red} />,
              'Sign Out',
              'Sign out of your account',
              null,
              handleSignOut
            )}
          </>
        )}

        <View style={styles.appInfo}>
          <Text style={[styles.appInfoTitle, { color: colorScheme.primary[600] }]}>AgriShield 2.0</Text>
          <Text style={[styles.appInfoVersion, { color: theme.textSecondary }]}>{t('settings.version')} 2.0.0</Text>
          <Text style={[styles.appInfoCopyright, { color: theme.textSecondary }]}>
            {t('settings.copyright')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  headerSubtitle: {
    fontSize: 14,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionContent: {
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileDetails: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 4,
  },
  profileFarm: {
    fontSize: 12,
    marginBottom: 2,
  },
  profileLocation: {
    fontSize: 12,
    marginBottom: 2,
  },
  profileSize: {
    fontSize: 12,
  },
  profileInput: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIcon: {
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 1,
  },
  settingSubtitle: {
    fontSize: 12,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  appInfoVersion: {
    fontSize: 12,
    marginBottom: 6,
  },
  appInfoCopyright: {
    fontSize: 10,
    textAlign: 'center',
  },
});