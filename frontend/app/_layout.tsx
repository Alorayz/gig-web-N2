import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';

export default function RootLayout() {
  const { isLoading } = useLanguageStore();
  const router = useRouter();

  useEffect(() => {
    // Handle deep links
    const handleDeepLink = (event: { url: string }) => {
      const { url } = event;
      console.log('Deep link received:', url);
      
      // Parse the URL
      const parsed = Linking.parse(url);
      
      if (parsed.path === 'payment-success' && parsed.queryParams?.session_id) {
        // Navigate to payment success screen with params
        router.push({
          pathname: '/payment-success',
          params: {
            session_id: parsed.queryParams.session_id as string,
            app_name: parsed.queryParams.app_name as string,
          },
        });
      } else if (parsed.path === 'payment-cancel') {
        // Navigate back to payment screen
        router.push('/payment');
      }
    };

    // Get the initial URL if app was opened via deep link
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    // Listen for incoming deep links while app is open
    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  return (
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
          name="payment-success" 
          options={{ headerShown: false }} 
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
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
});
