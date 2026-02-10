import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Modal,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { seedData } from '../src/services/api';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const { language, setLanguage, t } = useLanguageStore();
  const { reset } = useAppStore();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [isSeeding, setIsSeeding] = useState(false);

  useEffect(() => {
    reset();
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      setIsSeeding(true);
      await seedData();
    } catch (error) {
      console.log('Data may already be seeded:', error);
    } finally {
      setIsSeeding(false);
    }
  };

  const handleGetStarted = () => {
    router.push('/select-app');
  };

  const handleAdminAccess = () => {
    router.push('/admin/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Language Selector */}
        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => setShowLanguageModal(true)}
        >
          <Ionicons name="language" size={20} color={COLORS.accent} />
          <Text style={styles.languageText}>
            {language === 'en' ? 'English' : 'Español'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.accent} />
        </TouchableOpacity>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.jpeg')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{t('app.description')}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="car"
            text={t('select.spark')}
            color="#FFC107"
          />
          <FeatureItem
            icon="fast-food"
            text={t('select.doordash')}
            color="#FF5722"
          />
          <FeatureItem
            icon="cart"
            text={t('select.instacart')}
            color="#4CAF50"
          />
          <FeatureItem
            icon="call"
            text={language === 'en' ? 'Free Google Voice Number' : 'Número Google Voice Gratis'}
            color={COLORS.accent}
          />
        </View>

        {/* Main Button */}
        <TouchableOpacity
          style={styles.mainButton}
          onPress={handleGetStarted}
          disabled={isSeeding}
        >
          <Ionicons name="rocket" size={24} color="#fff" />
          <Text style={styles.mainButtonText}>{t('app.getStarted')}</Text>
        </TouchableOpacity>

        {/* Price Info */}
        <Text style={styles.priceInfo}>
          {language === 'en' 
            ? '$5.00 per app • Guides + Zip Codes' 
            : '$5.00 por app • Guías + Códigos Postales'}
        </Text>

        {/* Admin Access */}
        <TouchableOpacity
          style={styles.adminButton}
          onPress={handleAdminAccess}
        >
          <Ionicons name="shield-checkmark" size={16} color={COLORS.textMuted} />
          <Text style={styles.adminButtonText}>{t('app.adminAccess')}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('app.selectLanguage')}</Text>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'en' && styles.selectedLanguage]}
              onPress={() => {
                setLanguage('en');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>🇺🇸 English</Text>
              {language === 'en' && <Ionicons name="checkmark" size={20} color={COLORS.accent} />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'es' && styles.selectedLanguage]}
              onPress={() => {
                setLanguage('es');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>🇪🇸 Español</Text>
              {language === 'es' && <Ionicons name="checkmark" size={20} color={COLORS.accent} />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, text, color }: { icon: string; text: string; color: string }) => (
  <View style={styles.featureItem}>
    <View style={[styles.featureIconContainer, { backgroundColor: `${color}20` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  languageText: {
    color: COLORS.textPrimary,
    marginHorizontal: 8,
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: width * 0.7,
    height: 180,
  },
  descriptionContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  description: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 30,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: COLORS.textPrimary,
    flex: 1,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    marginBottom: 12,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  mainButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  priceInfo: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 30,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  adminButtonText: {
    color: COLORS.textMuted,
    fontSize: 14,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    maxWidth: 300,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: COLORS.surface,
  },
  selectedLanguage: {
    backgroundColor: `${COLORS.accent}20`,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  languageOptionText: {
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
