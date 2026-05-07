import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://alorayz-gigzipfinder-production.up.railway.app';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Stripe API
export const getStripeConfig = async () => {
  const response = await api.get('/stripe/config');
  return response.data;
};

export const createPaymentIntent = async (userId: string, appName: string, termsAccepted: boolean) => {
  const response = await api.post('/stripe/create-payment-intent', {
    user_id: userId,
    app_name: appName,
    terms_accepted: termsAccepted,
  });
  return response.data;
};

export const confirmPayment = async (paymentIntentId: string) => {
  const response = await api.post(`/stripe/confirm-payment/${paymentIntentId}`);
  return response.data;
};

export const verifyCheckoutSession = async (sessionId: string) => {
  const response = await api.post(`/stripe/verify-checkout/${sessionId}`);
  return response.data;
};

export const getPaidApps = async (userId: string) => {
  const response = await api.get(`/stripe/paid-apps/${userId}`);
  return response.data;
};

export const createCheckoutSession = async (userId: string, appName: string, termsAccepted: boolean) => {
  const response = await api.post('/stripe/create-checkout-session', {
    user_id: userId,
    app_name: appName,
    terms_accepted: termsAccepted,
  });
  return response.data;
};

// Zip Codes API
export const getZipCodesByApp = async (appName: string) => {
  const response = await api.get(`/zip-codes/${appName}`);
  return response.data;
};

// AI Search for Zip Codes - called after purchase
export const searchZipCodesWithAI = async (appName: string) => {
  const response = await api.post(`/search-zip-codes/${appName}`);
  return response.data;
};

// Guides API
export const getGuidesByApp = async (appName: string) => {
  const response = await api.get(`/guides/${appName}`);
  return response.data;
};

// Terms API
export const getTerms = async () => {
  const response = await api.get('/terms');
  return response.data;
};

// Seed Data
export const seedData = async () => {
  const response = await api.post('/seed-data');
  return response.data;
};

// Apple In-App Purchase API
export const validateIAPReceipt = async (receipt: string, productId: string, deviceId: string) => {
  const response = await api.post('/iap/validate-receipt', {
    receipt,
    product_id: productId,
    platform: 'ios',
    device_id: deviceId,
  });
  return response.data;
};

export const getIAPProducts = async () => {
  const response = await api.get('/iap/products');
  return response.data;
};

// Price constant
export const PRODUCT_PRICE_USD = 20.00;

export default api;
