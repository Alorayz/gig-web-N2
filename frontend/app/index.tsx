import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore } from '../src/stores/languageStore';
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
    // Reset app state when returning to home
    reset();
    // Seed initial data
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
          <Ionicons name="language" size={20} color="#fff" />
          <Text style={styles.languageText}>
            {language === 'en' ? 'English' : 'Español'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#fff" />
        </TouchableOpacity>

        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="location" size={60} color="#4CAF50" />
          </View>
          <Text style={styles.title}>{t('app.title')}</Text>
          <Text style={styles.subtitle}>{t('app.subtitle')}</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.description}>{t('app.description')}</Text>
        </View>

        {/* Features */}
        <View style={styles.featuresContainer}>
          <FeatureItem
            icon="car"
            text={language === 'en' ? 'Spark Driver' : 'Spark Driver'}
          />
          <FeatureItem
            icon="fast-food"
            text={language === 'en' ? 'DoorDash' : 'DoorDash'}
          />
          <FeatureItem
            icon="cart"
            text={language === 'en' ? 'Instacart' : 'Instacart'}
          />
          <FeatureItem
            icon="call"
            text={language === 'en' ? 'Free Google Voice Number' : 'Número Google Voice Gratis'}
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
          <Ionicons name="shield-checkmark" size={16} color="#888" />
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
              {language === 'en' && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.languageOption, language === 'es' && styles.selectedLanguage]}
              onPress={() => {
                setLanguage('es');
                setShowLanguageModal(false);
              }}
            >
              <Text style={styles.languageOptionText}>🇪🇸 Español</Text>
              {language === 'es' && <Ionicons name="checkmark" size={20} color="#4CAF50" />}
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const FeatureItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIconContainer}>
      <Ionicons name={icon as any} size={24} color="#4CAF50" />
    </View>
    <Text style={styles.featureText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  languageText: {
    color: '#fff',
    marginHorizontal: 8,
    fontSize: 14,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  descriptionContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    width: '100%',
  },
  description: {
    fontSize: 16,
    color: '#ddd',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    marginBottom: 10,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#fff',
    flex: 1,
  },
  mainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: '100%',
    marginBottom: 12,
    shadowColor: '#4CAF50',
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
    color: '#888',
    marginBottom: 30,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  adminButtonText: {
    color: '#888',
    fontSize: 14,
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
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
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  selectedLanguage: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  languageOptionText: {
    fontSize: 16,
    color: '#fff',
  },
});
