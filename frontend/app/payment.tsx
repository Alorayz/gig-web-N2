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
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createPaymentIntent, confirmPayment, getZipCodesByApp, getGuidesByApp } from '../src/services/api';

// Stripe configuration
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Sz8H72STw3g54WACbPaL387dozfL7vQRaf5puX5DolEoVdM16B27RMfOlCC8NNOtXc2yXBeAA2G4QG5aXOqgeyc00WNUE0AhH';

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
  
  // Card input state for web
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);

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

  const handleOpenStripeCheckout = async () => {
    if (!clientSecret) {
      Alert.alert(
        language === 'en' ? 'Please Wait' : 'Por Favor Espere',
        language === 'en' ? 'Payment is still loading...' : 'El pago aún está cargando...'
      );
      return;
    }

    // For web, we'll use Stripe.js via script or redirect to Stripe Checkout
    if (Platform.OS === 'web') {
      setShowCardForm(true);
      return;
    }

    // For native apps, this would use the PaymentSheet
    // Since we can't import the native module here, we simulate
    setPaymentStatus('processing');
    handleCardPayment();
  };

  const handleCardPayment = async () => {
    if (!clientSecret || !currentPaymentIntentId) return;
    
    setPaymentStatus('processing');

    try {
      // For web: Use Stripe.js directly
      if (Platform.OS === 'web') {
        // Load Stripe.js
        const stripeJs = await loadStripeJs();
        if (!stripeJs) {
          throw new Error('Failed to load Stripe');
        }

        // Confirm the payment with Stripe
        const { error, paymentIntent } = await stripeJs.confirmCardPayment(clientSecret, {
          payment_method: {
            card: {
              // In production, this would use Stripe Elements
              // For now, we'll use the card data from the form
            },
            billing_details: {
              name: cardholderName || 'Customer',
            },
          },
        });

        if (error) {
          throw error;
        }

        if (paymentIntent?.status === 'succeeded') {
          await completePayment();
        } else {
          throw new Error('Payment not completed');
        }
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.failed'),
        error.message || t('payment.tryAgain'),
        [{ text: 'OK', onPress: () => {
          setPaymentStatus('ready');
          setShowCardForm(false);
        }}]
      );
    }
  };

  // Load Stripe.js for web
  const loadStripeJs = (): Promise<any> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve(null);
        return;
      }

      // Check if Stripe is already loaded
      if ((window as any).Stripe) {
        resolve((window as any).Stripe(STRIPE_PUBLISHABLE_KEY));
        return;
      }

      // Load Stripe.js script
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        resolve((window as any).Stripe(STRIPE_PUBLISHABLE_KEY));
      };
      script.onerror = () => {
        resolve(null);
      };
      document.head.appendChild(script);
    });
  };

  const handleWebPayment = async () => {
    if (!clientSecret || !currentPaymentIntentId) return;
    
    setPaymentStatus('processing');

    try {
      // Load Stripe.js
      const stripeJs = await loadStripeJs();
      if (!stripeJs) {
        throw new Error(language === 'en' ? 'Failed to load payment system' : 'Error al cargar el sistema de pago');
      }

      // Open Stripe Checkout in a new window for better compatibility
      const checkoutUrl = `https://checkout.stripe.com/pay/${currentPaymentIntentId}`;
      
      // For web, we'll redirect to complete payment
      // Or use Stripe Elements inline
      
      // Verify payment after user returns
      const result = await confirmPayment(currentPaymentIntentId);
      
      if (result.status === 'succeeded') {
        await completePayment();
      } else if (result.status === 'requires_payment_method') {
        // Payment not yet made - this is expected before user pays
        // We need to use Stripe Elements or redirect
        openStripePaymentLink();
      } else {
        throw new Error(language === 'en' ? 'Payment not completed' : 'Pago no completado');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      // If payment requires action, open Stripe link
      openStripePaymentLink();
    }
  };

  const openStripePaymentLink = () => {
    // For web, we'll open Stripe's hosted payment page
    // This requires setting up a Checkout Session on the backend
    // For now, show the card form
    setShowCardForm(true);
    setPaymentStatus('ready');
  };

  const completePayment = async () => {
    if (!currentPaymentIntentId) return;

    try {
      setPaymentStatus('success');
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
      }, 2500);
    } catch (error) {
      console.error('Error loading content:', error);
      // Still navigate - payment was successful
      setTimeout(() => {
        router.replace('/results');
      }, 2500);
    }
  };

  const handlePayNow = async () => {
    if (!clientSecret || !currentPaymentIntentId) {
      Alert.alert(
        language === 'en' ? 'Please Wait' : 'Por Favor Espere',
        language === 'en' ? 'Payment is still loading...' : 'El pago aún está cargando...'
      );
      return;
    }

    setPaymentStatus('processing');

    try {
      // Load Stripe.js
      const stripeJs = await loadStripeJs();
      if (!stripeJs) {
        throw new Error('Stripe not loaded');
      }

      // Parse expiry date
      const [expMonth, expYear] = expiryDate.split('/').map(s => s.trim());
      
      // Create payment method
      const { error: pmError, paymentMethod } = await stripeJs.createPaymentMethod({
        type: 'card',
        card: {
          number: cardNumber.replace(/\s/g, ''),
          exp_month: parseInt(expMonth, 10),
          exp_year: parseInt(expYear.length === 2 ? `20${expYear}` : expYear, 10),
          cvc: cvc,
        },
        billing_details: {
          name: cardholderName || 'Customer',
        },
      });

      if (pmError) {
        throw pmError;
      }

      // Confirm the payment
      const { error, paymentIntent } = await stripeJs.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (error) {
        throw error;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Verify with backend
        await confirmPayment(currentPaymentIntentId);
        await completePayment();
      } else if (paymentIntent?.status === 'requires_action') {
        // 3D Secure or other action required - Stripe will handle this
        throw new Error(language === 'en' ? 'Additional verification required' : 'Se requiere verificación adicional');
      } else {
        throw new Error(language === 'en' ? 'Payment not completed' : 'Pago no completado');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      Alert.alert(
        t('payment.failed'),
        error.message || t('payment.tryAgain'),
        [{ text: 'OK', onPress: () => setPaymentStatus('ready') }]
      );
    }
  };

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted.substring(0, 19); // 16 digits + 3 spaces
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`;
    }
    return cleaned;
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
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
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

          {/* Card Form (for web) */}
          {showCardForm && (
            <View style={styles.cardFormContainer}>
              <Text style={styles.cardFormTitle}>
                {language === 'en' ? 'Enter Card Details' : 'Ingrese los Datos de la Tarjeta'}
              </Text>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'en' ? 'Cardholder Name' : 'Nombre del Titular'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={language === 'en' ? 'John Doe' : 'Juan Pérez'}
                  placeholderTextColor={COLORS.textMuted}
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'en' ? 'Card Number' : 'Número de Tarjeta'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="4242 4242 4242 4242"
                  placeholderTextColor={COLORS.textMuted}
                  value={cardNumber}
                  onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                  keyboardType="numeric"
                  maxLength={19}
                />
              </View>

              <View style={styles.inputRow}>
                <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                  <Text style={styles.inputLabel}>
                    {language === 'en' ? 'Expiry' : 'Vencimiento'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder="MM/YY"
                    placeholderTextColor={COLORS.textMuted}
                    value={expiryDate}
                    onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVC</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="123"
                    placeholderTextColor={COLORS.textMuted}
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>

              {/* Pay Now Button */}
              <TouchableOpacity
                style={[
                  styles.payButton, 
                  paymentStatus === 'processing' && styles.payButtonDisabled
                ]}
                onPress={handlePayNow}
                disabled={paymentStatus === 'processing' || !cardNumber || !expiryDate || !cvc}
              >
                {paymentStatus === 'processing' ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.payButtonText}>{t('payment.processing')}</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="lock-closed" size={20} color="#fff" />
                    <Text style={styles.payButtonText}>
                      {language === 'en' ? 'Pay $5.00 Now' : 'Pagar $5.00 Ahora'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowCardForm(false)}
              >
                <Text style={styles.cancelButtonText}>
                  {language === 'en' ? 'Cancel' : 'Cancelar'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Main Pay Button (before showing card form) */}
          {!showCardForm && (
            <>
              {/* Payment Ready Notice */}
              {paymentStatus === 'ready' && (
                <View style={styles.readyNotice}>
                  <Ionicons name="checkmark-circle" size={20} color={COLORS.success} />
                  <Text style={styles.readyNoticeText}>
                    {language === 'en' 
                      ? 'Ready to pay - Tap the button below to enter your card details' 
                      : 'Listo para pagar - Toque el botón para ingresar los datos de su tarjeta'}
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
                  (paymentStatus === 'loading' || paymentStatus === 'failed') && styles.payButtonDisabled
                ]}
                onPress={handleOpenStripeCheckout}
                disabled={paymentStatus === 'loading'}
              >
                {paymentStatus === 'loading' ? (
                  <>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.payButtonText}>
                      {language === 'en' ? 'Loading...' : 'Cargando...'}
                    </Text>
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
            </>
          )}

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
      </KeyboardAvoidingView>
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
  cardFormContainer: {
    width: '100%',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.accent,
  },
  cardFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
  },
  inputRow: {
    flexDirection: 'row',
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
  cancelButton: {
    alignItems: 'center',
    padding: 12,
  },
  cancelButtonText: {
    color: COLORS.textMuted,
    fontSize: 14,
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
