import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Globe, Ruler, Bell, Palette, Wifi, Trash2, CircleHelp as HelpCircle, Mail, Shield, ChevronRight, Download, ChartBar as BarChart3 } from 'lucide-react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

export default function SettingsScreen() {
  const { state, dispatch, isDarkMode } = useAppContext();
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [localSettings, setLocalSettings] = useState(state.settings);

  const updateSetting = (key: string, value: any) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    dispatch({ type: 'UPDATE_SETTINGS', payload: { [key]: value } });
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
              `${formatNumber(state.detections.length)} ${t('settings.detectionHistoryDesc')}`,
              null,
              () => {
                Alert.alert(
                  t('settings.detectionHistory'),
                  `You have ${formatNumber(state.detections.length)} detections in your history.\n\nThis data is stored locally on your device and helps track your crop health over time.`,
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
                  'AgriShield respects your privacy:\n\n• Your photos are processed securely\n• Detection history stays on your device\n• We don\'t share personal data\n• You control your information\n\nView full policy at agrishield.com/privacy',
                  [{ text: t('ok') }]
                );
              }
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