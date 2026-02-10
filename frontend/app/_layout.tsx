import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useLanguageStore, COLORS } from '../src/stores/languageStore';

export default function RootLayout() {
  const { isLoading } = useLanguageStore();

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
