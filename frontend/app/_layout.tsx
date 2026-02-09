import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useLanguageStore } from '../src/stores/languageStore';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootLayout() {
  const { isLoading } = useLanguageStore();

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          contentStyle: {
            backgroundColor: '#0f0f1a',
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
    backgroundColor: '#0f0f1a',
  },
});
