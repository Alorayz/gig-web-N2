import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet, Platform } from 'react-native';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import { getStripeConfig } from '../src/services/api';

// Conditionally import StripeProvider only for native
let StripeProvider: any = null;
if (Platform.OS !== 'web') {
  try {
    StripeProvider = require('@stripe/stripe-react-native').StripeProvider;
  } catch (e) {
    console.log('Stripe native not available');
  }
}

// Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51Sz8H72STw3g54WACbPaL387dozfL7vQRaf5puX5DolEoVdM16B27RMfOlCC8NNOtXc2yXBeAA2G4QG5aXOqgeyc00WNUE0AhH';

export default function RootLayout() {
  const { isLoading } = useLanguageStore();
  const [stripeKey, setStripeKey] = useState<string>(STRIPE_PUBLISHABLE_KEY);

  useEffect(() => {
    // Fetch Stripe config from backend
    const fetchStripeConfig = async () => {
      try {
        const config = await getStripeConfig();
        if (config.publishable_key) {
          setStripeKey(config.publishable_key);
        }
      } catch (error) {
        console.log('Using default Stripe key');
      }
    };
    fetchStripeConfig();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  const navigationContent = (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.backgroundLight,
          },
          headerTintColor: COLORS.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="terms" 
          options={{ title: 'Terms & Conditions' }} 
        />
        <Stack.Screen 
          name="select-app" 
          options={{ title: 'Select App' }} 
        />
        <Stack.Screen 
          name="payment" 
          options={{ title: 'Payment' }} 
        />
        <Stack.Screen 
          name="results" 
          options={{ title: 'Your Results' }} 
        />
        <Stack.Screen 
          name="admin/login" 
          options={{ title: 'Admin Login' }} 
        />
        <Stack.Screen 
          name="admin/dashboard" 
          options={{ title: 'Admin Dashboard' }} 
        />
      </Stack>
    </>
  );

  // On native platforms, wrap with StripeProvider
  if (Platform.OS !== 'web' && StripeProvider) {
    return (
      <StripeProvider
        publishableKey={stripeKey}
        merchantIdentifier="merchant.com.gigzipfinder"
        urlScheme="gigzipfinder"
      >
        {navigationContent}
      </StripeProvider>
    );
  }

  // On web, just return navigation (Stripe will be handled differently in payment screen)
  return navigationContent;
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
