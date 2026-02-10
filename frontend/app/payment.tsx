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
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useStripe, usePaymentSheet, PaymentSheetError } from '@stripe/stripe-react-native';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createPaymentIntent, confirmPayment, getZipCodesByApp, getGuidesByApp } from '../src/services/api';

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
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSheetReady, setPaymentSheetReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'failed'>('idle');
  const [currentPaymentIntentId, setCurrentPaymentIntentId] = useState<string | null>(null);
  
  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedApp || !termsAccepted) {
        router.replace('/select-app');
      } else {
        setIsChecking(false);
        // Initialize payment sheet when screen loads
        initializePayment();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedApp, termsAccepted]);

  const initializePayment = async () => {
    if (!selectedApp) return;
    
    setPaymentStatus('loading');
    setIsLoading(true);
    
    try {
      // Step 1: Create payment intent on backend
      const paymentData = await createPaymentIntent(userId, selectedApp, termsAccepted);
      setCurrentPaymentIntentId(paymentData.payment_intent_id);
      
      // Step 2: Initialize the Payment Sheet with the client secret
      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentData.client_secret,
        merchantDisplayName: 'GIG ZipFinder',
        style: 'automatic',
        allowsDelayedPaymentMethods: false,
        returnURL: 'gigzipfinder://payment-complete',
        defaultBillingDetails: {
          name: '',
        },
        appearance: {
          colors: {
            primary: COLORS.accent,
            background: COLORS.background,
            componentBackground: COLORS.surface,
            componentText: COLORS.textPrimary,
            secondaryText: COLORS.textSecondary,
            componentDivider: COLORS.primaryLight,
            icon: COLORS.accent,
          },
          shapes: {
            borderRadius: 12,
          },
        },
      });

      if (error) {
        console.error('PaymentSheet init error:', error);
        setPaymentStatus('failed');
        Alert.alert(
          language === 'en' ? 'Error' : 'Error',
          error.message || (language === 'en' ? 'Could not initialize payment' : 'No se pudo inicializar el pago')
        );
      } else {
        setPaymentSheetReady(true);
        setPaymentStatus('ready');
      }
    } catch (error: any) {
      console.error('Payment initialization error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        language === 'en' ? 'Error' : 'Error',
        error.response?.data?.detail || (language === 'en' ? 'Could not initialize payment' : 'No se pudo inicializar el pago')
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!paymentSheetReady || !currentPaymentIntentId) {
      Alert.alert(
        language === 'en' ? 'Please Wait' : 'Por Favor Espere',
        language === 'en' ? 'Payment is still loading...' : 'El pago aún está cargando...'
      );
      return;
    }

    setPaymentStatus('processing');

    try {
      // Present the Payment Sheet to collect payment details
      const { error } = await presentPaymentSheet();

      if (error) {
        if (error.code === PaymentSheetError.Canceled) {
          // User canceled - don't show error
          setPaymentStatus('ready');
          return;
        }
        
        console.error('Payment error:', error);
        setPaymentStatus('failed');
        Alert.alert(
          t('payment.failed'),
          error.message || t('payment.tryAgain'),
          [{ 
            text: 'OK', 
            onPress: () => {
              setPaymentStatus('ready');
              // Reinitialize for retry
              initializePayment();
            } 
          }]
        );
        return;
      }

      // Payment successful! Now verify on backend
      setPaymentStatus('success');
      
      try {
        // Verify payment status with backend
        const verifyResult = await confirmPayment(currentPaymentIntentId);
        
        if (verifyResult.status === 'succeeded') {
          setPaymentIntentId(currentPaymentIntentId);
          setPaymentComplete(true);
          
          // Load the content after confirmed payment
          const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
            getZipCodesByApp(selectedApp!),
            getGuidesByApp(selectedApp!),
            getGuidesByApp('google_voice'),
          ]);

          setZipCodes(zipCodesData);
          setGuides(guidesData);
          setVoiceGuides(voiceGuidesData);

          // Navigate to results after short delay
          setTimeout(() => {
            router.replace('/results');
          }, 2000);
        } else {
          // Payment verification failed
          setPaymentStatus('failed');
          Alert.alert(
            t('payment.failed'),
            language === 'en' 
              ? 'Payment verification failed. Please contact support.' 
              : 'La verificación del pago falló. Por favor contacte soporte.',
            [{ text: 'OK', onPress: () => initializePayment() }]
          );
        }
      } catch (verifyError) {
        console.error('Verification error:', verifyError);
        // Payment was made but verification failed - still navigate
        setPaymentIntentId(currentPaymentIntentId);
        setPaymentComplete(true);
        
        const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
          getZipCodesByApp(selectedApp!),
          getGuidesByApp(selectedApp!),
          getGuidesByApp('google_voice'),
        ]);

        setZipCodes(zipCodesData);
        setGuides(guidesData);
        setVoiceGuides(voiceGuidesData);

        setTimeout(() => {
          router.replace('/results');
        }, 2000);
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.failed'),
        error.message || t('payment.tryAgain'),
        [{ text: 'OK', onPress: () => initializePayment() }]
      );
    }
  };

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
          <View style={styles.successIconContainer}>
            <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
          </View>
          <Text style={styles.successTitle}>{t('payment.success')}</Text>
          <Text style={styles.successSubtitle}>
            {language === 'en' 
              ? 'Your payment has been confirmed!' 
              : '¡Su pago ha sido confirmado!'}
          </Text>
          <Text style={styles.successMessage}>
            {language === 'en' 
              ? 'Loading your zip codes and guides...' 
              : 'Cargando sus códigos postales y guías...'}
          </Text>
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 30 }} />
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

        {/* Payment Ready Notice */}
        {paymentStatus === 'ready' && (
          <View style={styles.readyNotice}>
            <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
            <Text style={styles.readyNoticeText}>
              {language === 'en' 
                ? 'Payment ready - Tap the button below to enter your card details' 
                : 'Pago listo - Toque el botón de abajo para ingresar los datos de su tarjeta'}
            </Text>
          </View>
        )}

        {/* Loading Notice */}
        {paymentStatus === 'loading' && (
          <View style={styles.loadingNotice}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={styles.loadingNoticeText}>
              {language === 'en' 
                ? 'Preparing secure payment...' 
                : 'Preparando pago seguro...'}
            </Text>
          </View>
        )}

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark" size={20} color={COLORS.accent} />
          <Text style={styles.securityText}>{t('payment.secure')}</Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[
            styles.payButton, 
            (!paymentSheetReady || paymentStatus === 'processing') && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={!paymentSheetReady || paymentStatus === 'processing'}
        >
          {paymentStatus === 'loading' ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payButtonText}>
                {language === 'en' ? 'Loading...' : 'Cargando...'}
              </Text>
            </>
          ) : paymentStatus === 'processing' ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payButtonText}>{t('payment.processing')}</Text>
            </>
          ) : (
            <>
              <Ionicons name="card" size={24} color="#fff" />
              <Text style={styles.payButtonText}>
                {language === 'en' ? 'Pay $5.00 with Card' : 'Pagar $5.00 con Tarjeta'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <View style={styles.paymentMethodItem}>
            <Ionicons name="card-outline" size={28} color={COLORS.textMuted} />
          </View>
          <View style={styles.paymentMethodItem}>
            <Text style={styles.paymentMethodText}>VISA</Text>
          </View>
          <View style={styles.paymentMethodItem}>
            <Text style={styles.paymentMethodText}>MC</Text>
          </View>
          <View style={styles.paymentMethodItem}>
            <Text style={styles.paymentMethodText}>AMEX</Text>
          </View>
        </View>

        {/* Stripe Logo */}
        <View style={styles.stripeInfo}>
          <Text style={styles.stripeText}>
            {language === 'en' ? 'Secure payments by' : 'Pagos seguros por'} 
          </Text>
          <Text style={styles.stripeBrand}>Stripe</Text>
        </View>

        {/* Retry Button if failed */}
        {paymentStatus === 'failed' && (
          <TouchableOpacity
            style={styles.retryButton}
            onPress={initializePayment}
          >
            <Ionicons name="refresh" size={20} color={COLORS.accent} />
            <Text style={styles.retryButtonText}>
              {language === 'en' ? 'Try Again' : 'Intentar de Nuevo'}
            </Text>
          </TouchableOpacity>
        )}
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
  successIconContainer: {
    marginBottom: 20,
    backgroundColor: `${COLORS.success}20`,
    borderRadius: 60,
    padding: 10,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 18,
    color: COLORS.success,
    marginTop: 10,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 20,
    textAlign: 'center',
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
  readyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.success}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: `${COLORS.success}50`,
  },
  readyNoticeText: {
    fontSize: 13,
    color: COLORS.success,
    marginLeft: 12,
    flex: 1,
  },
  loadingNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.accent}15`,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: `${COLORS.accent}50`,
  },
  loadingNoticeText: {
    fontSize: 13,
    color: COLORS.accent,
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
    shadowOpacity: 0,
    elevation: 0,
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
    justifyContent: 'center',
    marginBottom: 20,
    gap: 16,
  },
  paymentMethodItem: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  paymentMethodText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textMuted,
  },
  stripeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stripeText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  stripeBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 20,
  },
  retryButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
});
