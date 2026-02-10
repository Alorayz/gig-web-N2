import React, { useState, useEffect, useRef } from 'react';
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

// Card type detection based on BIN (Bank Identification Number)
const detectCardType = (cardNumber: string): { type: string; icon: string; color: string } | null => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  
  if (!cleanNumber) return null;
  
  // Visa: Starts with 4
  if (/^4/.test(cleanNumber)) {
    return { type: 'VISA', icon: 'card', color: '#1A1F71' };
  }
  
  // Mastercard: Starts with 51-55 or 2221-2720
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return { type: 'Mastercard', icon: 'card', color: '#EB001B' };
  }
  
  // American Express: Starts with 34 or 37
  if (/^3[47]/.test(cleanNumber)) {
    return { type: 'AMEX', icon: 'card', color: '#006FCF' };
  }
  
  // Discover: Starts with 6011, 622126-622925, 644-649, 65
  if (/^6011/.test(cleanNumber) || /^64[4-9]/.test(cleanNumber) || /^65/.test(cleanNumber) || /^622/.test(cleanNumber)) {
    return { type: 'Discover', icon: 'card', color: '#FF6000' };
  }
  
  // JCB: Starts with 3528-3589
  if (/^35[2-8]/.test(cleanNumber)) {
    return { type: 'JCB', icon: 'card', color: '#0B4EA2' };
  }
  
  // Diners Club: Starts with 300-305, 36, 38-39
  if (/^3(?:0[0-5]|[68])/.test(cleanNumber)) {
    return { type: 'Diners', icon: 'card', color: '#004A97' };
  }
  
  // UnionPay: Starts with 62
  if (/^62/.test(cleanNumber)) {
    return { type: 'UnionPay', icon: 'card', color: '#D81E06' };
  }
  
  return null;
};

// Luhn algorithm to validate card number
const isValidCardNumber = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanNumber)) return false;
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

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
  
  // Card input state - TEMPORARY only for UI, sent directly to Stripe
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardType, setCardType] = useState<{ type: string; icon: string; color: string } | null>(null);
  const [cardError, setCardError] = useState<string | null>(null);
  
  // Refs for stripe instance
  const stripeRef = useRef<any>(null);

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

  // Detect card type when card number changes
  useEffect(() => {
    const detected = detectCardType(cardNumber);
    setCardType(detected);
    setCardError(null);
  }, [cardNumber]);

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
      
      // Pre-load Stripe.js
      await loadStripeJs();
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

  // Load Stripe.js for web - card data goes DIRECTLY to Stripe, never stored in app
  const loadStripeJs = (): Promise<any> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve(null);
        return;
      }

      if (stripeRef.current) {
        resolve(stripeRef.current);
        return;
      }

      if ((window as any).Stripe) {
        stripeRef.current = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
        resolve(stripeRef.current);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/';
      script.onload = () => {
        stripeRef.current = (window as any).Stripe(STRIPE_PUBLISHABLE_KEY);
        resolve(stripeRef.current);
      };
      script.onerror = () => resolve(null);
      document.head.appendChild(script);
    });
  };

  const handleOpenPaymentForm = () => {
    if (!clientSecret) {
      Alert.alert(
        language === 'en' ? 'Please Wait' : 'Por Favor Espere',
        language === 'en' ? 'Payment is still loading...' : 'El pago aún está cargando...'
      );
      return;
    }
    setShowCardForm(true);
  };

  const handlePayNow = async () => {
    if (!clientSecret || !currentPaymentIntentId) return;
    
    // Validate card number
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!isValidCardNumber(cleanCardNumber)) {
      setCardError(language === 'en' ? 'Invalid card number' : 'Número de tarjeta inválido');
      return;
    }
    
    // Validate expiry
    const [expMonth, expYear] = expiryDate.split('/').map(s => s.trim());
    if (!expMonth || !expYear || parseInt(expMonth) < 1 || parseInt(expMonth) > 12) {
      setCardError(language === 'en' ? 'Invalid expiry date' : 'Fecha de vencimiento inválida');
      return;
    }
    
    // Validate CVC
    const cvcLength = cardType?.type === 'AMEX' ? 4 : 3;
    if (cvc.length < cvcLength) {
      setCardError(language === 'en' ? 'Invalid CVC' : 'CVC inválido');
      return;
    }

    setPaymentStatus('processing');
    setCardError(null);

    try {
      const stripeJs = await loadStripeJs();
      if (!stripeJs) {
        throw new Error(language === 'en' ? 'Payment system not available' : 'Sistema de pago no disponible');
      }

      // Create payment method - card data sent DIRECTLY to Stripe's servers
      // Data is NOT stored in our app or backend
      const { error: pmError, paymentMethod } = await stripeJs.createPaymentMethod({
        type: 'card',
        card: {
          number: cleanCardNumber,
          exp_month: parseInt(expMonth, 10),
          exp_year: parseInt(expYear.length === 2 ? `20${expYear}` : expYear, 10),
          cvc: cvc,
        },
        billing_details: {
          name: cardholderName || undefined,
        },
      });

      if (pmError) {
        throw pmError;
      }

      // IMPORTANT: Clear card data from memory immediately after sending to Stripe
      setCardNumber('');
      setExpiryDate('');
      setCvc('');
      setCardholderName('');

      // Confirm the payment with Stripe using the secure payment method
      const { error, paymentIntent } = await stripeJs.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (error) {
        throw error;
      }

      if (paymentIntent?.status === 'succeeded') {
        // Verify with our backend (only sends payment_intent_id, NOT card data)
        await confirmPayment(currentPaymentIntentId);
        await completePayment();
      } else if (paymentIntent?.status === 'requires_action') {
        // 3D Secure authentication required - Stripe handles this automatically
        Alert.alert(
          language === 'en' ? 'Authentication Required' : 'Autenticación Requerida',
          language === 'en' 
            ? 'Please complete the authentication in the popup window' 
            : 'Por favor complete la autenticación en la ventana emergente'
        );
      } else {
        throw new Error(language === 'en' ? 'Payment not completed' : 'Pago no completado');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
      
      // Clear sensitive data on error too
      setCvc('');
      
      const errorMessage = error.message || error.decline_code || t('payment.tryAgain');
      setCardError(errorMessage);
      
      Alert.alert(
        t('payment.failed'),
        errorMessage,
        [{ text: 'OK', onPress: () => setPaymentStatus('ready') }]
      );
    }
  };

  const completePayment = async () => {
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

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    const isAmex = /^3[47]/.test(cleaned);
    
    if (isAmex) {
      // AMEX format: XXXX XXXXXX XXXXX
      const part1 = cleaned.substring(0, 4);
      const part2 = cleaned.substring(4, 10);
      const part3 = cleaned.substring(10, 15);
      return [part1, part2, part3].filter(Boolean).join(' ');
    } else {
      // Standard format: XXXX XXXX XXXX XXXX
      const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
      return formatted.substring(0, 19);
    }
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

  const getMaxCvcLength = () => {
    return cardType?.type === 'AMEX' ? 4 : 3;
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

          {/* Card Form */}
          {showCardForm && (
            <View style={styles.cardFormContainer}>
              <View style={styles.cardFormHeader}>
                <Text style={styles.cardFormTitle}>
                  {language === 'en' ? 'Card Details' : 'Datos de Tarjeta'}
                </Text>
                <View style={styles.secureIndicator}>
                  <Ionicons name="lock-closed" size={14} color={COLORS.success} />
                  <Text style={styles.secureText}>
                    {language === 'en' ? 'Secure' : 'Seguro'}
                  </Text>
                </View>
              </View>

              {/* Cardholder Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'en' ? 'Cardholder Name' : 'Nombre del Titular'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={language === 'en' ? 'JOHN DOE' : 'JUAN PÉREZ'}
                  placeholderTextColor={COLORS.textMuted}
                  value={cardholderName}
                  onChangeText={setCardholderName}
                  autoCapitalize="characters"
                  autoCorrect={false}
                />
              </View>

              {/* Card Number with Type Detection */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>
                  {language === 'en' ? 'Card Number' : 'Número de Tarjeta'}
                </Text>
                <View style={styles.cardInputContainer}>
                  <TextInput
                    style={[styles.input, styles.cardInput]}
                    placeholder="0000 0000 0000 0000"
                    placeholderTextColor={COLORS.textMuted}
                    value={cardNumber}
                    onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                    keyboardType="numeric"
                    maxLength={cardType?.type === 'AMEX' ? 17 : 19}
                    autoCorrect={false}
                  />
                  {/* Card Type Indicator */}
                  {cardType && (
                    <View style={[styles.cardTypeIndicator, { backgroundColor: cardType.color }]}>
                      <Text style={styles.cardTypeText}>{cardType.type}</Text>
                    </View>
                  )}
                </View>
              </View>

              {/* Expiry and CVC Row */}
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
                    autoCorrect={false}
                  />
                </View>

                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>
                    CVC {cardType?.type === 'AMEX' ? '(4 digits)' : '(3 digits)'}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={cardType?.type === 'AMEX' ? '0000' : '000'}
                    placeholderTextColor={COLORS.textMuted}
                    value={cvc}
                    onChangeText={setCvc}
                    keyboardType="numeric"
                    maxLength={getMaxCvcLength()}
                    secureTextEntry
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Error Message */}
              {cardError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={COLORS.error} />
                  <Text style={styles.errorText}>{cardError}</Text>
                </View>
              )}

              {/* Security Notice */}
              <View style={styles.securityNotice}>
                <Ionicons name="shield-checkmark" size={16} color={COLORS.textMuted} />
                <Text style={styles.securityNoticeText}>
                  {language === 'en' 
                    ? 'Your card data is sent directly to Stripe and is never stored in this app.' 
                    : 'Los datos de su tarjeta se envían directamente a Stripe y nunca se guardan en esta app.'}
                </Text>
              </View>

              {/* Pay Now Button */}
              <TouchableOpacity
                style={[
                  styles.payButton, 
                  paymentStatus === 'processing' && styles.payButtonDisabled,
                  (!cardNumber || !expiryDate || !cvc) && styles.payButtonDisabled
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
                      {language === 'en' ? 'Pay $5.00 Securely' : 'Pagar $5.00 de Forma Segura'}
                    </Text>
                  </>
                )}
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  // Clear all card data when canceling
                  setCardNumber('');
                  setExpiryDate('');
                  setCvc('');
                  setCardholderName('');
                  setCardError(null);
                  setShowCardForm(false);
                }}
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
                      ? 'Ready to pay - Tap the button below' 
                      : 'Listo para pagar - Toque el botón'}
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
                onPress={handleOpenPaymentForm}
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
            <Text style={styles.stripeText}>
              {language === 'en' ? 'Powered by' : 'Procesado por'} 
            </Text>
            <Text style={styles.stripeBrand}>Stripe</Text>
          </View>

          {/* Retry Button if failed */}
          {paymentStatus === 'failed' && !showCardForm && (
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
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  cardFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardFormTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  secureIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.success}20`,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  secureText: {
    fontSize: 12,
    color: COLORS.success,
    marginLeft: 4,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.textPrimary,
    borderWidth: 1,
    borderColor: COLORS.primaryLight,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  cardInputContainer: {
    position: 'relative',
  },
  cardInput: {
    paddingRight: 80,
  },
  cardTypeIndicator: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  cardTypeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  inputRow: {
    flexDirection: 'row',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${COLORS.error}15`,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  securityNoticeText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginLeft: 8,
    flex: 1,
    lineHeight: 16,
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
