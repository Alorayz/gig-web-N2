import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';

const { width } = Dimensions.get('window');

type TabType = 'zipcodes' | 'guide' | 'voice';

export default function ResultsScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { selectedApp, zipCodes, guides, voiceGuides, paymentComplete, isAppActive, reset } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('zipcodes');
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Verify payment was completed before showing results
    // Check both transient paymentComplete AND persistent purchases
    const timer = setTimeout(() => {
      const hasActiveAccess = selectedApp && isAppActive(selectedApp);
      if ((!paymentComplete && !hasActiveAccess) || !selectedApp) {
        Alert.alert(
          language === 'en' ? 'Access Denied' : 'Acceso Denegado',
          language === 'en' 
            ? 'You must complete payment to access this content.' 
            : 'Debe completar el pago para acceder a este contenido.',
          [{ text: 'OK', onPress: () => router.replace('/') }]
        );
        return;
      }
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [paymentComplete, selectedApp]);

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
      default: return COLORS.accent;
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

  const handleDownloadPdf = async (appName: string) => {
    const baseUrl = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://alorayz-gigzipfinder-production.up.railway.app';
    const url = `${baseUrl}/api/download-guide/${appName}/${language}`;
    
    try {
      await Linking.openURL(url);
    } catch (error) {
      Alert.alert('Error', language === 'en' ? 'Could not open PDF' : 'No se pudo abrir el PDF');
    }
  };

  if (isChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
        </View>
      </SafeAreaView>
    );
  }

  const renderZipCodes = () => (
    <View style={styles.contentContainer}>
      {zipCodes.length > 0 ? (
        zipCodes.map((zip: any, index: number) => (
          <View key={zip.id || index} style={styles.zipCard}>
            <View style={styles.zipHeader}>
              <View style={styles.zipCodeBadge}>
                <Ionicons name="location" size={20} color={COLORS.accent} />
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
          <Ionicons name="sad-outline" size={60} color={COLORS.textMuted} />
          <Text style={styles.emptyText}>{t('results.noZipCodes')}</Text>
        </View>
      )}
      
      {/* Download PDF Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownloadPdf(selectedApp || 'spark')}
      >
        <Ionicons name="download" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>{t('results.downloadPdf')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderGuide = () => (
    <View style={styles.contentContainer}>
      {guides.map((guide: any, index: number) => (
        <View key={guide.id || index} style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={[styles.stepBadge, { backgroundColor: getAppColor() }]}>
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
      
      {/* Download PDF Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownloadPdf(selectedApp || 'spark')}
      >
        <Ionicons name="download" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>{t('results.downloadPdf')}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderVoiceGuide = () => (
    <View style={styles.contentContainer}>
      <View style={styles.voiceHeader}>
        <Ionicons name="call" size={40} color={COLORS.accent} />
        <Text style={styles.voiceTitle}>{language === 'en' ? 'Free Phone Number' : 'Número de Teléfono Gratis'}</Text>
        <Text style={styles.voiceSubtitle}>
          {language === 'en' ? 'Get a FREE second phone number' : 'Obtén un segundo número de teléfono GRATIS'}
        </Text>
      </View>
      
      {voiceGuides.map((guide: any, index: number) => (
        <View key={guide.id || index} style={styles.guideCard}>
          <View style={styles.guideHeader}>
            <View style={[styles.stepBadge, { backgroundColor: COLORS.accent }]}>
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
      
      {/* Download PDF Button */}
      <TouchableOpacity
        style={styles.downloadButton}
        onPress={() => handleDownloadPdf('google_voice')}
      >
        <Ionicons name="download" size={20} color="#fff" />
        <Text style={styles.downloadButtonText}>{t('results.downloadPdf')}</Text>
      </TouchableOpacity>
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
            color={activeTab === 'zipcodes' ? COLORS.accent : COLORS.textMuted} 
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
            color={activeTab === 'guide' ? COLORS.accent : COLORS.textMuted} 
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
            color={activeTab === 'voice' ? COLORS.accent : COLORS.textMuted} 
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
          <Ionicons name="refresh" size={20} color={COLORS.accent} />
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
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
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
    borderBottomColor: COLORS.accent,
  },
  tabText: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: 8,
  },
  activeTabText: {
    color: COLORS.accent,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  zipCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
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
    backgroundColor: `${COLORS.accent}20`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  zipCodeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginLeft: 8,
  },
  scoreBadge: {
    backgroundColor: COLORS.accent,
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
    color: COLORS.textPrimary,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginTop: 16,
  },
  guideCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
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
    color: COLORS.textPrimary,
    flex: 1,
  },
  guideContent: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  voiceHeader: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: `${COLORS.accent}10`,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  voiceTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: 12,
  },
  voiceSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 8,
    textAlign: 'center',
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    borderRadius: 25,
    marginTop: 10,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: `${COLORS.accent}10`,
    paddingVertical: 14,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  secondaryButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
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
