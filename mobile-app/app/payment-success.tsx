import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { verifyCheckoutSession, getZipCodesByApp, getGuidesByApp } from '../src/services/api';

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { language, t } = useLanguageStore();
  const {
    setSelectedApp,
    setPaymentComplete,
    setPaymentIntentId,
    setZipCodes,
    setGuides,
    setVoiceGuides,
    addPaidApp,
  } = useAppStore();
  
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    verifyPaymentAndLoadContent();
  }, []);

  const verifyPaymentAndLoadContent = async () => {
    const sessionId = params.session_id as string;
    const appName = params.app_name as string;

    if (!sessionId) {
      setStatus('error');
      setErrorMessage(language === 'en' ? 'No session ID provided' : 'No se proporcionó ID de sesión');
      setTimeout(() => router.replace('/'), 3000);
      return;
    }

    try {
      // Verify the checkout session
      const result = await verifyCheckoutSession(sessionId);
      
      if (result.status === 'succeeded') {
        setStatus('success');
        
        // Save payment info
        if (appName) {
          setSelectedApp(appName);
          addPaidApp(appName);
        }
        setPaymentComplete(true);
        setPaymentIntentId(sessionId);

        // Load content
        if (appName) {
          try {
            const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
              getZipCodesByApp(appName),
              getGuidesByApp(appName),
              getGuidesByApp('google_voice'),
            ]);

            setZipCodes(zipCodesData);
            setGuides(guidesData);
            setVoiceGuides(voiceGuidesData);
          } catch (error) {
            console.error('Error loading content:', error);
          }
        }

        // Navigate to results after showing success
        setTimeout(() => {
          router.replace('/results');
        }, 2000);
      } else {
        setStatus('error');
        setErrorMessage(language === 'en' ? 'Payment not completed' : 'Pago no completado');
        setTimeout(() => router.replace('/payment'), 3000);
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      setStatus('error');
      setErrorMessage(error.message || (language === 'en' ? 'Verification failed' : 'Verificación fallida'));
      setTimeout(() => router.replace('/'), 3000);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {status === 'verifying' && (
          <>
            <ActivityIndicator size="large" color={COLORS.accent} />
            <Text style={styles.title}>
              {language === 'en' ? 'Verifying Payment...' : 'Verificando Pago...'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'en' ? 'Please wait' : 'Por favor espere'}
            </Text>
          </>
        )}

        {status === 'success' && (
          <>
            <View style={styles.successIconContainer}>
              <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
            </View>
            <Text style={styles.title}>
              {language === 'en' ? 'Payment Successful!' : '¡Pago Exitoso!'}
            </Text>
            <Text style={styles.subtitle}>
              {language === 'en' 
                ? 'Loading your content...' 
                : 'Cargando tu contenido...'}
            </Text>
            <ActivityIndicator size="small" color={COLORS.accent} style={{ marginTop: 20 }} />
          </>
        )}

        {status === 'error' && (
          <>
            <View style={styles.errorIconContainer}>
              <Ionicons name="close-circle" size={100} color={COLORS.error} />
            </View>
            <Text style={styles.title}>
              {language === 'en' ? 'Error' : 'Error'}
            </Text>
            <Text style={styles.subtitle}>{errorMessage}</Text>
            <Text style={styles.redirectText}>
              {language === 'en' ? 'Redirecting...' : 'Redirigiendo...'}
            </Text>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIconContainer: {
    marginBottom: 20,
    backgroundColor: `${COLORS.success}20`,
    borderRadius: 60,
    padding: 10,
  },
  errorIconContainer: {
    marginBottom: 20,
    backgroundColor: `${COLORS.error}20`,
    borderRadius: 60,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 10,
  },
  redirectText: {
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 20,
  },
});
