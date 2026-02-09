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
import { useLanguageStore } from '../src/stores/languageStore';
import { useAppStore } from '../src/stores/appStore';
import { createPaymentIntent, getZipCodesByApp, getGuidesByApp } from '../src/services/api';

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
  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if terms are accepted
  useEffect(() => {
    // Small delay to allow state to be read
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
      default: return '#4CAF50';
    }
  };

  const handlePayment = async () => {
    if (!selectedApp) {
      Alert.alert('Error', 'No app selected');
      return;
    }

    setProcessingPayment(true);

    try {
      // Create payment intent
      const paymentData = await createPaymentIntent(userId, selectedApp, termsAccepted);
      
      // For demo purposes, we'll simulate a successful payment
      // In production, you would use Stripe's PaymentSheet here
      
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mark payment as complete (in demo mode)
      setPaymentIntentId(paymentData.payment_intent_id);
      setPaymentComplete(true);

      // Load zip codes and guides
      const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
        getZipCodesByApp(selectedApp),
        getGuidesByApp(selectedApp),
        getGuidesByApp('google_voice'),
      ]);

      setZipCodes(zipCodesData);
      setGuides(guidesData);
      setVoiceGuides(voiceGuidesData);

      // Navigate to results
      router.replace('/results');

    } catch (error: any) {
      console.error('Payment error:', error);
      
      // For demo, still proceed to show results
      try {
        const [zipCodesData, guidesData, voiceGuidesData] = await Promise.all([
          getZipCodesByApp(selectedApp),
          getGuidesByApp(selectedApp),
          getGuidesByApp('google_voice'),
        ]);

        setZipCodes(zipCodesData);
        setGuides(guidesData);
        setVoiceGuides(voiceGuidesData);
        setPaymentComplete(true);
        
        Alert.alert(
          language === 'en' ? 'Demo Mode' : 'Modo Demo',
          language === 'en' 
            ? 'Stripe payment simulation. In production, real payment would be processed.' 
            : 'Simulación de pago Stripe. En producción, se procesaría el pago real.',
          [{ text: 'OK', onPress: () => router.replace('/results') }]
        );
      } catch (loadError) {
        Alert.alert(
          language === 'en' ? 'Error' : 'Error',
          language === 'en' 
            ? 'Could not process payment. Please try again.' 
            : 'No se pudo procesar el pago. Por favor intente de nuevo.'
        );
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  // Show loading while checking state
  if (isChecking) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
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
            <Ionicons name="location" size={24} color="#4CAF50" />
            <Text style={styles.includeText}>{t('payment.item1')}</Text>
          </View>
          
          <View style={styles.includeItem}>
            <Ionicons name="book" size={24} color="#4CAF50" />
            <Text style={styles.includeText}>{t('payment.item2')}</Text>
          </View>
          
          <View style={styles.includeItem}>
            <Ionicons name="call" size={24} color="#4CAF50" />
            <Text style={styles.includeText}>{t('payment.item3')}</Text>
          </View>
        </View>

        {/* Security Badge */}
        <View style={styles.securityBadge}>
          <Ionicons name="shield-checkmark" size={20} color="#4CAF50" />
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
              <Text style={styles.payButtonText}>{t('payment.processing')}</Text>
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
          <Ionicons name="card-outline" size={32} color="#888" />
          <Ionicons name="logo-apple" size={32} color="#888" style={{ marginLeft: 16 }} />
          <Ionicons name="logo-google" size={32} color="#888" style={{ marginLeft: 16 }} />
        </View>

        {/* Note */}
        <Text style={styles.note}>
          {language === 'en' 
            ? 'Note: This is a demo. In production, you will need to provide your Stripe API keys.' 
            : 'Nota: Esto es una demo. En producción, necesitará proporcionar sus claves API de Stripe.'}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

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
    color: '#888',
    marginBottom: 8,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  priceDescription: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  includesContainer: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  includesTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  includeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  includeText: {
    fontSize: 14,
    color: '#ddd',
    marginLeft: 16,
    flex: 1,
  },
  securityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  securityText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    width: '100%',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  payButtonDisabled: {
    backgroundColor: '#333',
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
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
