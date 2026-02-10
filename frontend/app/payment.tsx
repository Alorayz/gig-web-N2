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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createPaymentIntent, confirmPayment, getZipCodesByApp, getGuidesByApp, getStripeConfig } from '../src/services/api';

export default function PaymentScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { 
    selectedApp, 
    termsAccepted, 
    userId,
    setPaymentComplete,
    setPaymentIntentId,
    setZipCodes,
    setGuides,
    setVoiceGuides,
  } = useAppStore();
  
  const [isChecking, setIsChecking] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'verifying' | 'success' | 'failed'>('idle');
  const [currentPaymentIntentId, setCurrentPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedApp || !termsAccepted) {
        router.replace('/select-app');
      }
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedApp, termsAccepted]);

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

  const handlePayment = async () => {
    if (!selectedApp) {
      Alert.alert('Error', 'No app selected');
      return;
    }

    setProcessingPayment(true);
    setPaymentStatus('processing');

    try {
      // Step 1: Create payment intent
      const paymentData = await createPaymentIntent(userId, selectedApp, termsAccepted);
      setCurrentPaymentIntentId(paymentData.payment_intent_id);
      
      // Step 2: In production, this would open Stripe's payment sheet
      // For now, we simulate the payment process with the real Stripe intent
      setPaymentStatus('verifying');
      
      // Step 3: Verify payment status with Stripe
      // In a real implementation, you would use Stripe's PaymentSheet
      // and the confirmation would happen automatically
      
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Step 4: Confirm payment and get results
      const result = await confirmPayment(paymentData.payment_intent_id);
      
      if (result.status === 'succeeded') {
        setPaymentStatus('success');
        setPaymentIntentId(paymentData.payment_intent_id);
        setPaymentComplete(true);
        
        // Load the content only after confirmed payment
        const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
          getZipCodesByApp(selectedApp),
          getGuidesByApp(selectedApp),
          getGuidesByApp('google_voice'),
        ]);

        setZipCodes(zipCodesData);
        setGuides(guidesData);
        setVoiceGuides(voiceGuidesData);

        // Show success message then navigate
        setTimeout(() => {
          router.replace('/results');
        }, 1500);
        
      } else {
        // Payment requires additional action or failed
        setPaymentStatus('failed');
        Alert.alert(
          t('payment.failed'),
          language === 'en' 
            ? 'Your payment could not be processed. Please try again.' 
            : 'Su pago no pudo ser procesado. Por favor intente de nuevo.',
          [{ text: 'OK', onPress: () => setPaymentStatus('idle') }]
        );
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.failed'),
        error.response?.data?.detail || t('payment.tryAgain'),
        [{ text: 'OK', onPress: () => setPaymentStatus('idle') }]
      );
    } finally {
      setProcessingPayment(false);
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

  // Success screen
  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={100} color={COLORS.accent} />
          </View>
          <Text style={styles.successTitle}>{t('payment.success')}</Text>
          <Text style={styles.successSubtitle}>
            {language === 'en' ? 'Loading your content...' : 'Cargando su contenido...'}
          </Text>
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 20 }} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* App Badge */}
        <View style={[styles.appBadge, { backgroundColor: `${getAppColor()}20` }]}>
          <Ionicons name={getAppIcon() as any} size={30} color={getAppColor()} />
          <Text style={[styles.appName, { color: getAppColor() }]}>
            {selectedApp?.toUpperCase()}
          </Text>
        </View>

        {/* Price Display */}
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>{t('payment.amount')}</Text>
          <Text style={styles.price}>$5.00</Text>
          <Text style={styles.priceDescription}>{t('payment.description')}</Text>
        </View>

        {/* What's Included */}
        <View style={styles.includesContainer}>
          <Text style={styles.includesTitle}>{t('payment.includes')}</Text>
          
          <View style={styles.includeItem}>
            <Ionicons name="location" size={24} color={COLORS.accent} />
            <Text style={styles.includeText}>{t('payment.item1')}</Text>
          </View>
          
          <View style={styles.includeItem}>
            <Ionicons name="book" size={24} color={COLORS.accent} />
            <Text style={styles.includeText}>{t('payment.item2')}</Text>
          </View>
          
          <View style={styles.includeItem}>
            <Ionicons name="call" size={24} color={COLORS.accent} />
            <Text style={styles.includeText}>{t('payment.item3')}</Text>
          </View>
        </View>

        {/* Important Notice */}
        <View style={styles.noticeContainer}>
          <Ionicons name="information-circle" size={24} color={COLORS.warning} />
          <Text style={styles.noticeText}>
            {language === 'en' 
              ? 'Content will be unlocked only after successful payment verification.' 
              : 'El contenido se desbloqueará solo después de la verificación exitosa del pago.'}
          </Text>
        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
          <Text style={styles.securityText}>{t('payment.secure')}</Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payButton, processingPayment && styles.payButtonDisabled]}
          onPress={handlePayment}
          disabled={processingPayment}
        >
          {processingPayment ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payButtonText}>
                {paymentStatus === 'verifying' ? t('payment.verifying') : t('payment.processing')}
              </Text>
            </>
          ) : (
            <>
              <Ionicons name="card" size={24} color="#fff" />
              <Text style={styles.payButtonText}>{t('payment.pay')}</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Ionicons name="card-outline" size={32} color={COLORS.textMuted} />
          <Ionicons name="logo-apple" size={32} color={COLORS.textMuted} style={{ marginLeft: 16 }} />
          <Ionicons name="logo-google" size={32} color={COLORS.textMuted} style={{ marginLeft: 16 }} />
        </View>

        {/* Stripe Logo */}
        <View style={styles.stripeInfo}>
          <Text style={styles.stripeText}>
            {language === 'en' ? 'Payments processed by' : 'Pagos procesados por'} Stripe
          </Text>
        </View>
      </ScrollView>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  successIcon: {
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  appBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
    marginBottom: 30,
  },
  appName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  priceLabel: {
    fontSize: 16,
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  priceDescription: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  includesContainer: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  includesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  includeText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 16,
    flex: 1,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.warning}20`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.warning,
  },
  noticeText: {
    fontSize: 13,
    color: COLORS.warning,
    marginLeft: 12,
    flex: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: COLORS.accent,
    marginLeft: 8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.accent,
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: COLORS.surface,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stripeInfo: {
    alignItems: 'center',
  },
  stripeText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
});
