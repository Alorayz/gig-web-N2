import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';

const { width } = Dimensions.get('window');

type TabType = 'zipcodes' | 'guide' | 'voice';

export default function ResultsScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { selectedApp, zipCodes, guides, voiceGuides, reset } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('zipcodes');

  const getAppIcon = () => {
    switch (selectedApp) {
      case 'spark': return 'car';
      case 'doordash': return 'fast-food';
      case 'instacart': return 'cart';
      default: return 'apps';
    }
  };

  const getAppColor = () => {
    switch (selectedApp) {
      case 'spark': return '#FFC107';
      case 'doordash': return '#FF5722';
      case 'instacart': return '#4CAF50';
      default: return '#4CAF50';
    }
  };

  const handleTryAnother = () => {
    reset();
    router.replace('/select-app');
  };

  const handleBackHome = () => {
    reset();
    router.replace('/');
  };

  const renderZipCodes = () => (
    <View style={styles.contentContainer}>
      {zipCodes.length > 0 ? (
        zipCodes.map((zip: any, index: number) => (
          <View key={zip.id || index} style={styles.zipCard}>
            <View style={styles.zipHeader}>
              <View style={styles.zipCodeBadge}>
                <Ionicons name="location" size={20} color="#4CAF50" />
                <Text style={styles.zipCodeText}>{zip.zip_code}</Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{zip.availability_score}%</Text>
              </View>
            </View>
            <View style={styles.zipDetails}>
              <Text style={styles.cityText}>{zip.city}, {zip.state}</Text>
              <Text style={styles.scoreLabel}>{t('results.score')}</Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="sad-outline" size={60} color="#888" />
          <Text style={styles.emptyText}>{t('results.noZipCodes')}</Text>
        </View>
      )}
    </View>
  );

  const renderGuide = () => (
    <View style={styles.contentContainer}>
      {guides.map((guide: any, index: number) => (
        <View key={guide.id || index} style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={styles.stepBadge}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.guideTitle}>
              {language === 'en' ? guide.title_en : guide.title_es}
            </Text>
          </View>
          <Text style={styles.guideContent}>
            {language === 'en' ? guide.content_en : guide.content_es}
          </Text>
        </View>
      ))}
    </View>
  );

  const renderVoiceGuide = () => (
    <View style={styles.contentContainer}>
      <View style={styles.voiceHeader}>
        <Ionicons name="call" size={40} color="#4CAF50" />
        <Text style={styles.voiceTitle}>Google Voice</Text>
        <Text style={styles.voiceSubtitle}>
          {language === 'en' ? 'Get a FREE second phone number' : 'Obtén un segundo número de teléfono GRATIS'}
        </Text>
      </View>
      
      {voiceGuides.map((guide: any, index: number) => (
        <View key={guide.id || index} style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={[styles.stepBadge, { backgroundColor: '#4CAF50' }]}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
            </View>
            <Text style={styles.guideTitle}>
              {language === 'en' ? guide.title_en : guide.title_es}
            </Text>
          </View>
          <Text style={styles.guideContent}>
            {language === 'en' ? guide.content_en : guide.content_es}
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.appBadge, { backgroundColor: `${getAppColor()}20` }]}>
          <Ionicons name={getAppIcon() as any} size={24} color={getAppColor()} />
          <Text style={[styles.appName, { color: getAppColor() }]}>
            {selectedApp?.toUpperCase()}
          </Text>
        </View>
        <Text style={styles.title}>{t('results.title')}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'zipcodes' && styles.activeTab]}
          onPress={() => setActiveTab('zipcodes')}
        >
          <Ionicons 
            name="location" 
            size={20} 
            color={activeTab === 'zipcodes' ? '#4CAF50' : '#888'} 
          />
          <Text style={[styles.tabText, activeTab === 'zipcodes' && styles.activeTabText]}>
            {language === 'en' ? 'Zip Codes' : 'Códigos'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'guide' && styles.activeTab]}
          onPress={() => setActiveTab('guide')}
        >
          <Ionicons 
            name="book" 
            size={20} 
            color={activeTab === 'guide' ? '#4CAF50' : '#888'} 
          />
          <Text style={[styles.tabText, activeTab === 'guide' && styles.activeTabText]}>
            {language === 'en' ? 'Guide' : 'Guía'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'voice' && styles.activeTab]}
          onPress={() => setActiveTab('voice')}
        >
          <Ionicons 
            name="call" 
            size={20} 
            color={activeTab === 'voice' ? '#4CAF50' : '#888'} 
          />
          <Text style={[styles.tabText, activeTab === 'voice' && styles.activeTabText]}>
            {language === 'en' ? 'Voice' : 'Voice'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView style={styles.scrollView}>
        {activeTab === 'zipcodes' && renderZipCodes()}
        {activeTab === 'guide' && renderGuide()}
        {activeTab === 'voice' && renderVoiceGuide()}
      </ScrollView>

      {/* Footer Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleTryAnother}
        >
          <Ionicons name="refresh" size={20} color="#4CAF50" />
          <Text style={styles.secondaryButtonText}>{t('results.tryAnother')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBackHome}
        >
          <Ionicons name="home" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>{t('results.backHome')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 12,
  },
  appName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  zipCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  zipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  zipCodeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zipCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 8,
  },
  scoreBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  zipDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cityText: {
    fontSize: 16,
    color: '#fff',
  },
  scoreLabel: {
    fontSize: 12,
    color: '#888',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 16,
  },
  guideCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FF5722',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  guideTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  guideContent: {
    fontSize: 14,
    color: '#ddd',
    lineHeight: 22,
  },
  voiceHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    padding: 20,
  },
  voiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 12,
  },
  voiceSubtitle: {
    fontSize: 14,
    color: '#aaa',
    marginTop: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  secondaryButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 14,
    borderRadius: 25,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});
