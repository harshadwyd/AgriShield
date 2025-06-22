import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Video, FileText, Download, BookOpen, Play, Filter, Clock, Languages, CircleCheck as CheckCircle } from 'lucide-react-native';
import { Colors, DarkColors, getThemeColors } from '../../constants/colors';
import { mockEducationalContent } from '../../constants/mockData';
import { EducationalContent } from '../../types';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from '../../hooks/useTranslation';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const { isDarkMode } = useAppContext();
  const { t, formatNumber } = useTranslation();
  const theme = getThemeColors(isDarkMode);
  const colorScheme = isDarkMode ? DarkColors : Colors;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [contentType, setContentType] = useState<'all' | 'video' | 'pdf'>('all');

  const categories = [
    'all',
    'Pest Management',
    'Disease Prevention',
    'Organic Farming',
    'Seasonal Care',
  ];

  const filteredContent = mockEducationalContent.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesType = contentType === 'all' || item.type === contentType;
    
    return matchesSearch && matchesCategory && matchesType;
  });

  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
        <Search size={16} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder={t('learn.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={theme.textSecondary}
        />
      </View>
    </View>
  );

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.filterRow}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                styles.filterChip,
                { backgroundColor: theme.surface, borderColor: theme.border },
                selectedCategory === category && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
              ]}
            >
              <Text style={[
                styles.filterChipText,
                { color: theme.textSecondary },
                selectedCategory === category && { color: 'white' }
              ]}>
                {category === 'all' ? t('learn.categories.all') : 
                 category === 'Pest Management' ? t('learn.categories.pestManagement') :
                 category === 'Disease Prevention' ? t('learn.categories.diseasePrevention') :
                 category === 'Organic Farming' ? t('learn.categories.organicFarming') :
                 category === 'Seasonal Care' ? t('learn.categories.seasonalCare') : category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      <View style={styles.typeFilters}>
        <TouchableOpacity
          onPress={() => setContentType('all')}
          style={[
            styles.typeFilter,
            { backgroundColor: theme.surface, borderColor: theme.border },
            contentType === 'all' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
          ]}
        >
          <BookOpen size={12} color={contentType === 'all' ? 'white' : theme.textSecondary} />
          <Text style={[
            styles.typeFilterText,
            { color: theme.textSecondary },
            contentType === 'all' && { color: 'white' }
          ]}>{t('learn.contentTypes.all')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setContentType('video')}
          style={[
            styles.typeFilter,
            { backgroundColor: theme.surface, borderColor: theme.border },
            contentType === 'video' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
          ]}
        >
          <Video size={12} color={contentType === 'video' ? 'white' : theme.textSecondary} />
          <Text style={[
            styles.typeFilterText,
            { color: theme.textSecondary },
            contentType === 'video' && { color: 'white' }
          ]}>{t('learn.contentTypes.videos')}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => setContentType('pdf')}
          style={[
            styles.typeFilter,
            { backgroundColor: theme.surface, borderColor: theme.border },
            contentType === 'pdf' && { backgroundColor: colorScheme.primary[500], borderColor: colorScheme.primary[500] }
          ]}
        >
          <FileText size={12} color={contentType === 'pdf' ? 'white' : theme.textSecondary} />
          <Text style={[
            styles.typeFilterText,
            { color: theme.textSecondary },
            contentType === 'pdf' && { color: 'white' }
          ]}>{t('learn.contentTypes.guides')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContentItem = (item: EducationalContent) => (
    <TouchableOpacity key={item.id} style={[styles.contentItem, { backgroundColor: theme.surface }]}>
      {item.type === 'video' && item.thumbnail && (
        <View style={styles.thumbnailContainer}>
          <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
          <View style={styles.playButton}>
            <Play size={18} color="white" />
          </View>
          {item.duration && (
            <View style={styles.durationBadge}>
              <Text style={styles.durationText}>
                {Math.floor(item.duration / 60)}:{String(item.duration % 60).padStart(2, '0')}
              </Text>
            </View>
          )}
        </View>
      )}
      
      {item.type === 'pdf' && (
        <View style={[styles.pdfIcon, { backgroundColor: isDarkMode ? colorScheme.primary[100] : colorScheme.primary[50] }]}>
          <FileText size={32} color={colorScheme.primary[500]} />
        </View>
      )}
      
      <View style={styles.contentInfo}>
        <View style={styles.contentHeader}>
          <Text style={[styles.contentTitle, { color: theme.text }]}>{item.title}</Text>
          <View style={styles.typeIndicator}>
            {item.type === 'video' ? (
              <Video size={12} color={colorScheme.secondary[500]} />
            ) : (
              <FileText size={12} color={colorScheme.accent.orange} />
            )}
          </View>
        </View>
        
        <Text style={[styles.contentCategory, { color: colorScheme.primary[600] }]}>{item.category}</Text>
        <Text style={[styles.contentDescription, { color: theme.textSecondary }]}>{item.description}</Text>
        
        <View style={styles.contentMeta}>
          <View style={styles.languageInfo}>
            <Languages size={10} color={theme.textSecondary} />
            <Text style={[styles.languageText, { color: theme.textSecondary }]}>
              {formatNumber(item.languages.length)} {t('learn.languages')}
            </Text>
          </View>
          
          {item.downloadable && (
            <View style={styles.downloadInfo}>
              {item.downloaded ? (
                <View style={styles.downloadedBadge}>
                  <CheckCircle size={10} color={colorScheme.success} />
                  <Text style={[styles.downloadedText, { color: colorScheme.success }]}>{t('learn.downloaded')}</Text>
                </View>
              ) : (
                <TouchableOpacity style={[styles.downloadButton, { backgroundColor: isDarkMode ? colorScheme.primary[100] : colorScheme.primary[50] }]}>
                  <Download size={10} color={colorScheme.primary[600]} />
                  <Text style={[styles.downloadButtonText, { color: colorScheme.primary[600] }]}>{t('learn.download')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFeaturedSection = () => {
    const featuredContent = mockEducationalContent.slice(0, 2);
    
    return (
      <View style={styles.featuredSection}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>{t('learn.featured')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {featuredContent.map((item) => (
            <TouchableOpacity key={item.id} style={styles.featuredCard}>
              <LinearGradient
                colors={[colorScheme.primary[500], colorScheme.primary[600]]}
                style={styles.featuredGradient}
              >
                <View style={styles.featuredContent}>
                  <View style={styles.featuredIcon}>
                    {item.type === 'video' ? (
                      <Video size={24} color="white" />
                    ) : (
                      <FileText size={24} color="white" />
                    )}
                  </View>
                  <Text style={styles.featuredTitle}>{item.title}</Text>
                  <Text style={styles.featuredCategory}>{item.category}</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{t('learn.title')}</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          {t('learn.subtitle')}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {renderFeaturedSection()}
        {renderSearchBar()}
        {renderFilters()}
        
        <View style={styles.contentList}>
          <View style={styles.contentHeader}>
            <Text style={[styles.contentListTitle, { color: theme.text }]}>
              {formatNumber(filteredContent.length)} {t('learn.resources')}
            </Text>
          </View>
          
          {filteredContent.length > 0 ? (
            filteredContent.map(renderContentItem)
          ) : (
            <View style={styles.emptyState}>
              <BookOpen size={60} color={theme.textSecondary} />
              <Text style={[styles.emptyStateTitle, { color: theme.text }]}>{t('learn.empty.title')}</Text>
              <Text style={[styles.emptyStateText, { color: theme.textSecondary }]}>
                {t('learn.empty.description')}
              </Text>
            </View>
          )}
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
  featuredSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  featuredCard: {
    width: width * 0.65,
    marginLeft: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  featuredGradient: {
    padding: 16,
    minHeight: 120,
    justifyContent: 'center',
  },
  featuredContent: {
    alignItems: 'center',
  },
  featuredIcon: {
    marginBottom: 10,
  },
  featuredTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 3,
  },
  featuredCategory: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
  },
  filtersContainer: {
    paddingBottom: 12,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  typeFilters: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginTop: 12,
  },
  typeFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
  },
  typeFilterText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  contentList: {
    paddingHorizontal: 16,
  },
  contentHeader: {
    marginBottom: 12,
  },
  contentListTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  thumbnailContainer: {
    position: 'relative',
    height: 140,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -20,
    marginLeft: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 3,
  },
  durationText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  pdfIcon: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInfo: {
    padding: 12,
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  contentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  typeIndicator: {
    padding: 3,
  },
  contentCategory: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  contentDescription: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 10,
  },
  contentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 10,
    marginLeft: 3,
  },
  downloadInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  downloadButtonText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  downloadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  downloadedText: {
    fontSize: 10,
    fontWeight: '600',
    marginLeft: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 6,
  },
  emptyStateText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 200,
    lineHeight: 20,
  },
});