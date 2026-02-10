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
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createPaymentIntent, confirmPayment, getZipCodesByApp, getGuidesByApp, createCheckoutSession } from '../src/services/api';

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
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'failed'>('idle');
  const [currentPaymentIntentId, setCurrentPaymentIntentId] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedApp || !termsAccepted) {
        router.replace('/select-app');
      } else {
        setIsChecking(false);
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
      // Create payment intent on backend
      const paymentData = await createPaymentIntent(userId, selectedApp, termsAccepted);
      setCurrentPaymentIntentId(paymentData.payment_intent_id);
      setClientSecret(paymentData.client_secret);
      setPaymentStatus('ready');
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
    if (!clientSecret || !currentPaymentIntentId || !selectedApp) {
      Alert.alert(
        language === 'en' ? 'Please Wait' : 'Por Favor Espere',
        language === 'en' ? 'Payment is still loading...' : 'El pago aún está cargando...'
      );
      return;
    }

    setPaymentStatus('processing');

    try {
      // Create a Stripe Checkout session and redirect
      const checkoutData = await createCheckoutSession(userId, selectedApp, termsAccepted);
      
      if (checkoutData.checkout_url) {
        // Open Stripe Checkout in browser
        const canOpen = await Linking.canOpenURL(checkoutData.checkout_url);
        if (canOpen) {
          await Linking.openURL(checkoutData.checkout_url);
          
          // Show instructions to user
          Alert.alert(
            language === 'en' ? 'Complete Payment' : 'Completar Pago',
            language === 'en' 
              ? 'A secure payment page has opened. After completing the payment, return here and tap "Verify Payment".' 
              : 'Se ha abierto una página de pago segura. Después de completar el pago, regrese aquí y toque "Verificar Pago".',
            [
              { 
                text: language === 'en' ? 'Verify Payment' : 'Verificar Pago', 
                onPress: () => checkPaymentStatus() 
              },
              { 
                text: language === 'en' ? 'Cancel' : 'Cancelar', 
                style: 'cancel',
                onPress: () => setPaymentStatus('ready')
              }
            ]
          );
        } else {
          throw new Error(language === 'en' ? 'Could not open payment page' : 'No se pudo abrir la página de pago');
        }
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.failed'),
        error.message || t('payment.tryAgain'),
        [{ text: 'OK', onPress: () => setPaymentStatus('ready') }]
      );
    }
  };

  const checkPaymentStatus = async () => {
    if (!currentPaymentIntentId) return;

    setPaymentStatus('processing');

    try {
      const result = await confirmPayment(currentPaymentIntentId);
      
      if (result.status === 'succeeded') {
        await verifyAndComplete();
      } else {
        Alert.alert(
          language === 'en' ? 'Payment Pending' : 'Pago Pendiente',
          language === 'en' 
            ? 'Payment not yet completed. Please complete the payment and try again.' 
            : 'El pago aún no se ha completado. Por favor complete el pago e intente de nuevo.',
          [
            { 
              text: language === 'en' ? 'Check Again' : 'Verificar de Nuevo', 
              onPress: () => checkPaymentStatus() 
            },
            { 
              text: language === 'en' ? 'Cancel' : 'Cancelar', 
              style: 'cancel',
              onPress: () => setPaymentStatus('ready')
            }
          ]
        );
      }
    } catch (error) {
      setPaymentStatus('ready');
      Alert.alert(
        language === 'en' ? 'Error' : 'Error',
        language === 'en' ? 'Could not verify payment status' : 'No se pudo verificar el estado del pago'
      );
    }
  };

  const verifyAndComplete = async () => {
    if (!currentPaymentIntentId) return;

    try {
      setPaymentStatus('success');
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
      }, 2500);
    } catch (error) {
      console.error('Error loading content:', error);
      setTimeout(() => {
        router.replace('/results');
      }, 2500);
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
                ? 'Ready! Tap below to open secure Stripe payment page' 
                : '¡Listo! Toque abajo para abrir la página de pago seguro de Stripe'}
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
            (paymentStatus === 'loading' || paymentStatus === 'processing') && styles.payButtonDisabled
          ]}
          onPress={handlePayment}
          disabled={paymentStatus === 'loading' || paymentStatus === 'processing'}
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
                {language === 'en' ? 'Pay $5.00 Securely' : 'Pagar $5.00 de Forma Segura'}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Verify Payment Button */}
        {paymentStatus === 'ready' && currentPaymentIntentId && (
          <TouchableOpacity
            style={styles.verifyButton}
            onPress={checkPaymentStatus}
          >
            <Ionicons name="refresh" size={20} color={COLORS.accent} />
            <Text style={styles.verifyButtonText}>
              {language === 'en' ? 'Already Paid? Verify Payment' : '¿Ya Pagó? Verificar Pago'}
            </Text>
          </TouchableOpacity>
        )}

        {/* Supported Cards */}
        <View style={styles.supportedCards}>
          <Text style={styles.supportedCardsTitle}>
            {language === 'en' ? 'Accepted Cards' : 'Tarjetas Aceptadas'}
          </Text>
          <View style={styles.cardLogos}>
            <View style={[styles.cardLogo, { backgroundColor: '#1A1F71' }]}>
              <Text style={styles.cardLogoText}>VISA</Text>
            </View>
            <View style={[styles.cardLogo, { backgroundColor: '#EB001B' }]}>
              <Text style={styles.cardLogoText}>MC</Text>
            </View>
            <View style={[styles.cardLogo, { backgroundColor: '#006FCF' }]}>
              <Text style={styles.cardLogoText}>AMEX</Text>
            </View>
            <View style={[styles.cardLogo, { backgroundColor: '#FF6000' }]}>
              <Text style={styles.cardLogoText}>DISC</Text>
            </View>
          </View>
        </View>

        {/* Stripe Logo */}
        <View style={styles.stripeInfo}>
          <Ionicons name="lock-closed" size={14} color={COLORS.textMuted} />
          <Text style={styles.stripeText}>
            {language === 'en' ? 'Secure payments by' : 'Pagos seguros por'} 
          </Text>
          <Text style={styles.stripeBrand}>Stripe</Text>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityNoticeText}>
            {language === 'en' 
              ? 'Your payment is processed securely by Stripe. We never see or store your card information.' 
              : 'Su pago es procesado de forma segura por Stripe. Nunca vemos ni guardamos la información de su tarjeta.'}
          </Text>
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
    marginBottom: 16,
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
  verifyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
    marginBottom: 20,
  },
  verifyButtonText: {
    color: COLORS.accent,
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  supportedCards: {
    alignItems: 'center',
    marginBottom: 20,
  },
  supportedCardsTitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 10,
  },
  cardLogos: {
    flexDirection: 'row',
    gap: 8,
  },
  cardLogo: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
  },
  cardLogoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stripeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stripeText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  stripeBrand: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  securityNotice: {
    backgroundColor: COLORS.surface,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  securityNoticeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
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
