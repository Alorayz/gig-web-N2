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
  Linking,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createCheckoutSession, verifyCheckoutSession, getZipCodesByApp, getGuidesByApp, searchZipCodesWithAI, validateIAPReceipt } from '../src/services/api';
import appleIAPService, { PRODUCT_IDS, ACCESS_DURATION_DAYS } from '../src/services/appleIAP';

const isIOS = Platform.OS === 'ios';

const getProductId = (appName: string): string => {
  switch (appName) {
    case 'instacart': return PRODUCT_IDS.INSTACART_ZIP_CODES;
    case 'doordash': return PRODUCT_IDS.DOORDASH_ZIP_CODES;
    case 'spark': return PRODUCT_IDS.SPARK_ZIP_CODES;
    default: return PRODUCT_IDS.INSTACART_ZIP_CODES;
  }
};

export default function PaymentScreen() {
  const router = useRouter();
  const { language, t } = useLanguageStore();
  const { 
    selectedApp, termsAccepted, deviceId,
    setPaymentComplete, setPaymentIntentId,
    setZipCodes, setGuides, setVoiceGuides,
    addPurchase, setLastSessionId,
  } = useAppStore();
  
  const userIdToUse = deviceId;
  const [isChecking, setIsChecking] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'loading' | 'ready' | 'processing' | 'success' | 'failed'>('idle');
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const processingRef = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!selectedApp || !termsAccepted) {
        router.replace('/select-app');
      } else {
        setIsChecking(false);
        initPayment();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [selectedApp, termsAccepted]);

  // Setup IAP listeners on mount (iOS only)
  useEffect(() => {
    if (!isIOS) return;

    appleIAPService.setupListeners(
      async (purchase) => {
        // Purchase completed successfully
        if (processingRef.current) return;
        processingRef.current = true;

        try {
          const receipt = purchase.transactionReceipt;
          const productId = purchase.productId || getProductId(selectedApp || 'instacart');

          // Validate receipt with backend
          const result = await validateIAPReceipt(receipt, productId, userIdToUse);

          if (result && result.is_valid) {
            await appleIAPService.finish(purchase);
            await completePayment();
          } else {
            // Even if backend validation fails, finish transaction to avoid duplicate charges
            await appleIAPService.finish(purchase);
            setPaymentStatus('failed');
            Alert.alert(
              'Error',
              language === 'en' 
                ? 'Purchase could not be verified. Please contact support.' 
                : 'La compra no pudo ser verificada. Contacte soporte.',
              [{ text: 'OK', onPress: () => { setPaymentStatus('ready'); processingRef.current = false; } }]
            );
          }
        } catch (error) {
          console.error('Purchase processing error:', error);
          try { await appleIAPService.finish(purchase); } catch (e) {}
          setPaymentStatus('failed');
          Alert.alert('Error', language === 'en' ? 'An error occurred.' : 'Ocurrio un error.',
            [{ text: 'OK', onPress: () => { setPaymentStatus('ready'); processingRef.current = false; } }]
          );
        }
      },
      (error) => {
        // Purchase error/cancellation
        console.log('Purchase error:', error);
        processingRef.current = false;
        if (error?.code === 'E_USER_CANCELLED' || error?.message?.includes('cancel')) {
          setPaymentStatus('ready');
        } else {
          setPaymentStatus('ready');
          // Don't show alert for cancellation, only for real errors
          if (error?.code !== 'E_USER_CANCELLED') {
            Alert.alert(
              language === 'en' ? 'Purchase Error' : 'Error de Compra',
              error?.message || (language === 'en' ? 'Could not complete purchase.' : 'No se pudo completar la compra.'),
              [{ text: 'OK' }]
            );
          }
        }
      }
    );

    return () => {
      appleIAPService.removeListeners();
    };
  }, [selectedApp, language]);

  const initPayment = async () => {
    if (!selectedApp) return;
    setPaymentStatus('loading');

    try {
      if (isIOS) {
        const ok = await appleIAPService.initialize();
        if (ok) {
          setPaymentStatus('ready');
        } else {
          throw new Error('Could not connect to App Store');
        }
      } else {
        const data = await createCheckoutSession(userIdToUse, selectedApp, termsAccepted);
        setCurrentSessionId(data.session_id);
        setCheckoutUrl(data.checkout_url);
        setLastSessionId(data.session_id);
        setPaymentStatus('ready');
      }
    } catch (error: any) {
      console.error('Init error:', error);
      setPaymentStatus('failed');
      Alert.alert('Error', error.message || 'Could not initialize payment');
    }
  };

  // iOS: Start purchase (result comes through listener)
  const handleApplePurchase = async () => {
    if (!selectedApp) return;
    setPaymentStatus('processing');
    processingRef.current = false;

    try {
      const productId = getProductId(selectedApp);
      await appleIAPService.purchase(productId);
      // Don't set any status here - the listener handles the result
    } catch (error: any) {
      console.error('Purchase request error:', error);
      setPaymentStatus('ready');
      if (!error?.message?.includes('cancel')) {
        Alert.alert('Error', error.message || 'Purchase failed');
      }
    }
  };

  // Android: Stripe checkout
  const handleStripePayment = async () => {
    if (!checkoutUrl || !currentSessionId) return;
    setPaymentStatus('processing');

    try {
      await Linking.openURL(checkoutUrl);
      setTimeout(() => {
        Alert.alert(
          language === 'en' ? 'Complete Payment' : 'Completar Pago',
          language === 'en' 
            ? 'After completing payment in Stripe, tap "I Already Paid".' 
            : 'Despues de completar el pago en Stripe, toque "Ya Pague".',
          [
            { text: language === 'en' ? 'I Already Paid' : 'Ya Pague', onPress: verifyStripe },
            { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel', onPress: () => setPaymentStatus('ready') },
          ]
        );
      }, 1000);
    } catch (error: any) {
      setPaymentStatus('failed');
      Alert.alert('Error', error.message || 'Could not open payment');
    }
  };

  const verifyStripe = async () => {
    if (!currentSessionId) return;
    setPaymentStatus('processing');
    try {
      const result = await verifyCheckoutSession(currentSessionId);
      if (result.status === 'succeeded') {
        await completePayment();
      } else {
        Alert.alert(
          language === 'en' ? 'Payment Not Found' : 'Pago No Encontrado',
          language === 'en' ? 'We could not verify your payment. Try again.' : 'No pudimos verificar su pago. Intente de nuevo.',
          [
            { text: language === 'en' ? 'Try Again' : 'Intentar', onPress: verifyStripe },
            { text: language === 'en' ? 'Cancel' : 'Cancelar', style: 'cancel', onPress: () => setPaymentStatus('ready') },
          ]
        );
      }
    } catch (error) {
      setPaymentStatus('ready');
      Alert.alert('Error', language === 'en' ? 'Verification failed.' : 'Verificacion fallida.');
    }
  };

  const handlePayment = () => {
    if (isIOS) handleApplePurchase();
    else handleStripePayment();
  };

  const completePayment = async () => {
    setPaymentStatus('success');
    setPaymentIntentId(currentSessionId || 'iap_purchase');
    setPaymentComplete(true);
    if (selectedApp) addPurchase(selectedApp);

    try {
      let zipData;
      try {
        const ai = await searchZipCodesWithAI(selectedApp!);
        zipData = ai.zip_codes;
      } catch { zipData = await getZipCodesByApp(selectedApp!); }

      const [guides, voice] = await Promise.all([
        getGuidesByApp(selectedApp!),
        getGuidesByApp('google_voice'),
      ]);
      setZipCodes(zipData);
      setGuides(guides);
      setVoiceGuides(voice);
    } catch (e) { console.error('Load content error:', e); }

    setTimeout(() => router.replace('/results'), 2500);
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
    return <SafeAreaView style={styles.container}><View style={styles.center}><ActivityIndicator size="large" color={COLORS.accent} /></View></SafeAreaView>;
  }

  if (paymentStatus === 'success') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <Ionicons name="checkmark-circle" size={100} color={COLORS.success} />
          <Text style={styles.successTitle}>{t('payment.success')}</Text>
          <Text style={styles.successSub}>{language === 'en' ? 'Payment confirmed!' : 'Pago confirmado!'}</Text>
          <Text style={styles.successMsg}>{language === 'en' ? 'Loading your content...' : 'Cargando su contenido...'}</Text>
          <ActivityIndicator size="large" color={COLORS.accent} style={{ marginTop: 30 }} />
        </View>
      </SafeAreaView>
    );
  }

  const durationText = isIOS 
    ? (language === 'en' ? `${ACCESS_DURATION_DAYS} days access` : `${ACCESS_DURATION_DAYS} dias de acceso`)
    : (language === 'en' ? '15 days access' : '15 días de acceso');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* App Badge */}
        <View style={[styles.badge, { backgroundColor: `${getAppColor()}20` }]}>
          <Ionicons name={getAppIcon() as any} size={30} color={getAppColor()} />
          <Text style={[styles.badgeText, { color: getAppColor() }]}>{selectedApp?.toUpperCase()}</Text>
        </View>

        {/* Price */}
        <View style={styles.priceBox}>
          <Text style={styles.priceLabel}>{t('payment.amount')}</Text>
          <Text style={styles.price}>$20.00</Text>
          <Text style={styles.duration}>{durationText}</Text>
          <Text style={styles.priceDesc}>{t('payment.description')}</Text>
        </View>

        {/* Includes */}
        <View style={styles.includes}>
          <Text style={styles.includesTitle}>{t('payment.includes')}</Text>
          {[
            { icon: 'location', text: t('payment.item1') },
            { icon: 'book', text: t('payment.item2') },
            { icon: 'call', text: t('payment.item3') },
          ].map((item, i) => (
            <View key={i} style={styles.includeRow}>
              <Ionicons name={item.icon as any} size={22} color={COLORS.accent} />
              <Text style={styles.includeText}>{item.text}</Text>
            </View>
          ))}
        </View>

        {/* Status notice */}
        {paymentStatus === 'ready' && (
          <View style={[styles.notice, { backgroundColor: `${COLORS.success}15`, borderColor: `${COLORS.success}50` }]}>
            <Ionicons name="checkmark-circle" size={18} color={COLORS.success} />
            <Text style={[styles.noticeText, { color: COLORS.success }]}>
              {isIOS
                ? (language === 'en' ? 'Ready! Tap below to purchase via App Store' : 'Listo! Toque abajo para comprar via App Store')
                : (language === 'en' ? 'Ready! Tap below to pay securely' : 'Listo! Toque abajo para pagar de forma segura')
              }
            </Text>
          </View>
        )}

        {paymentStatus === 'loading' && (
          <View style={[styles.notice, { backgroundColor: `${COLORS.accent}15`, borderColor: `${COLORS.accent}50` }]}>
            <ActivityIndicator size="small" color={COLORS.accent} />
            <Text style={[styles.noticeText, { color: COLORS.accent }]}>
              {isIOS ? (language === 'en' ? 'Connecting to App Store...' : 'Conectando con App Store...') : (language === 'en' ? 'Preparing payment...' : 'Preparando pago...')}
            </Text>
          </View>
        )}

        {/* Security badge */}
        <View style={styles.secBadge}>
          <Ionicons name="shield-checkmark" size={18} color={COLORS.accent} />
          <Text style={styles.secText}>
            {isIOS ? (language === 'en' ? 'Secure purchase via Apple' : 'Compra segura via Apple') : t('payment.secure')}
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          style={[styles.payBtn, (paymentStatus === 'loading' || paymentStatus === 'processing') && styles.payBtnDisabled]}
          onPress={handlePayment}
          disabled={paymentStatus === 'loading' || paymentStatus === 'processing'}
        >
          {(paymentStatus === 'loading' || paymentStatus === 'processing') ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.payBtnText}>{paymentStatus === 'loading' ? (language === 'en' ? 'Loading...' : 'Cargando...') : t('payment.processing')}</Text>
            </>
          ) : (
            <>
              <Ionicons name={isIOS ? "logo-apple" : "card"} size={24} color="#fff" />
              <Text style={styles.payBtnText}>
                {isIOS ? (language === 'en' ? 'Purchase $20.00' : 'Comprar $20.00') : (language === 'en' ? 'Pay $20.00' : 'Pagar $20.00')}
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Verify (Android) */}
        {!isIOS && (paymentStatus === 'ready' || paymentStatus === 'processing') && currentSessionId && (
          <TouchableOpacity style={styles.verifyBtn} onPress={verifyStripe}>
            <Ionicons name="checkmark-done" size={18} color={COLORS.accent} />
            <Text style={styles.verifyText}>{language === 'en' ? 'I Already Paid' : 'Ya Pague'}</Text>
          </TouchableOpacity>
        )}

        {/* Restore (iOS) */}
        {isIOS && paymentStatus === 'ready' && (
          <TouchableOpacity style={styles.restoreBtn} onPress={async () => {
            try {
              const p = await appleIAPService.restore();
              Alert.alert(
                p.length > 0 ? (language === 'en' ? 'Restored' : 'Restaurado') : (language === 'en' ? 'No Purchases' : 'Sin Compras'),
                p.length > 0 ? (language === 'en' ? 'Previous purchases restored.' : 'Compras anteriores restauradas.') : (language === 'en' ? 'No previous purchases found.' : 'No se encontraron compras previas.')
              );
            } catch { Alert.alert('Error'); }
          }}>
            <Ionicons name="refresh" size={16} color={COLORS.textMuted} />
            <Text style={styles.restoreText}>{language === 'en' ? 'Restore Purchases' : 'Restaurar Compras'}</Text>
          </TouchableOpacity>
        )}

        {/* Payment info */}
        <Text style={styles.infoText}>
          {isIOS
            ? (language === 'en' ? 'Payment processed securely by Apple. We never store your payment data.' : 'Pago procesado de forma segura por Apple. Nunca guardamos sus datos de pago.')
            : (language === 'en' ? 'Payment processed securely by Stripe. We never store your card data.' : 'Pago procesado de forma segura por Stripe. Nunca guardamos datos de su tarjeta.')}
        </Text>

        {/* Retry */}
        {paymentStatus === 'failed' && (
          <TouchableOpacity style={styles.retryBtn} onPress={initPayment}>
            <Ionicons name="refresh" size={18} color={COLORS.accent} />
            <Text style={styles.retryText}>{language === 'en' ? 'Try Again' : 'Intentar de Nuevo'}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  successTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: 20 },
  successSub: { fontSize: 18, color: COLORS.success, marginTop: 10 },
  successMsg: { fontSize: 14, color: COLORS.textSecondary, marginTop: 20 },
  scroll: { flexGrow: 1, padding: 20, alignItems: 'center' },
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 30, marginBottom: 24 },
  badgeText: { fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  priceBox: { alignItems: 'center', marginBottom: 24 },
  priceLabel: { fontSize: 16, color: COLORS.textMuted, marginBottom: 6 },
  price: { fontSize: 48, fontWeight: 'bold', color: COLORS.textPrimary },
  duration: { fontSize: 16, color: COLORS.accent, marginTop: 4, fontWeight: '600' },
  priceDesc: { fontSize: 13, color: COLORS.textSecondary, textAlign: 'center', marginTop: 6 },
  includes: { width: '100%', backgroundColor: COLORS.surface, borderRadius: 16, padding: 20, marginBottom: 20, borderWidth: 1, borderColor: COLORS.primaryLight },
  includesTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 14 },
  includeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  includeText: { fontSize: 14, color: COLORS.textSecondary, marginLeft: 14, flex: 1 },
  notice: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, padding: 14, marginBottom: 16, width: '100%', borderWidth: 1 },
  noticeText: { fontSize: 13, marginLeft: 10, flex: 1 },
  secBadge: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  secText: { fontSize: 14, color: COLORS.accent, marginLeft: 8 },
  payBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.accent, paddingVertical: 18, paddingHorizontal: 40, borderRadius: 30, width: '100%', marginBottom: 14, shadowColor: COLORS.accent, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  payBtnDisabled: { backgroundColor: COLORS.surface, shadowOpacity: 0, elevation: 0 },
  payBtnText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginLeft: 10 },
  verifyBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: `${COLORS.success}15`, paddingVertical: 14, borderRadius: 25, borderWidth: 2, borderColor: COLORS.success, marginBottom: 16, width: '100%' },
  verifyText: { color: COLORS.success, fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
  restoreBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginBottom: 16 },
  restoreText: { color: COLORS.textMuted, fontSize: 14, marginLeft: 6, textDecorationLine: 'underline' },
  infoText: { fontSize: 11, color: COLORS.textMuted, textAlign: 'center', lineHeight: 16, marginBottom: 16, paddingHorizontal: 10 },
  retryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderWidth: 1, borderColor: COLORS.accent, borderRadius: 20, paddingHorizontal: 24 },
  retryText: { color: COLORS.accent, fontSize: 14, fontWeight: '600', marginLeft: 8 },
});
