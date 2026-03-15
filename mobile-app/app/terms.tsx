import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { getTerms } from '../src/services/api';

export default function TermsScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { selectedApp, setTermsAccepted } = useAppStore();
  const [termsAccepted, setLocalTermsAccepted] = useState(false);
  const [terms, setTerms] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTerms();
  }, []);

  const loadTerms = async () => {
    try {
      const data = await getTerms();
      setTerms(data);
    } catch (error) {
      console.error('Error loading terms:', error);
      Alert.alert('Error', 'Could not load terms and conditions');
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!termsAccepted) {
      Alert.alert(
        language === 'en' ? 'Terms Required' : 'Términos Requeridos',
        t('terms.mustAccept')
      );
      return;
    }
    setTermsAccepted(true);
    router.push('/payment');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.accent} />
          <Text style={styles.loadingText}>{t('general.loading')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const termsContent = language === 'en' ? terms?.content_en : terms?.content_es;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="document-text" size={40} color={COLORS.accent} />
        <Text style={styles.title}>{t('terms.title')}</Text>
        <View style={styles.appBadge}>
          <Text style={styles.appBadgeText}>
            {selectedApp?.toUpperCase()}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.termsContainer}>
        <Text style={styles.termsText}>{termsContent}</Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.acceptContainer}>
          <Switch
            value={termsAccepted}
            onValueChange={setLocalTermsAccepted}
            trackColor={{ false: COLORS.surface, true: COLORS.accent }}
            thumbColor={termsAccepted ? '#fff' : '#f4f3f4'}
          />
          <Text style={styles.acceptText}>{t('terms.accept')}</Text>
        </View>

        <TouchableOpacity
          style={[styles.continueButton, !termsAccepted && styles.disabledButton]}
          onPress={handleContinue}
          disabled={!termsAccepted}
        >
          <Text style={styles.continueButtonText}>{t('terms.continue')}</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
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
  loadingText: {
    color: COLORS.textPrimary,
    marginTop: 16,
    fontSize: 16,
  },
  header: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primaryLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: 12,
  },
  appBadge: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  appBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  termsContainer: {
    flex: 1,
    padding: 20,
  },
  termsText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    lineHeight: 22,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.primaryLight,
  },
  acceptContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  acceptText: {
    color: COLORS.textPrimary,
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 16,
    borderRadius: 30,
  },
  disabledButton: {
    backgroundColor: COLORS.surface,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
});
