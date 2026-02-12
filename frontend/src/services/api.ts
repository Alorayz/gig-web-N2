import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_URL || 'https://gigmap-zones.preview.emergentagent.com';

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

// Admin API
export const adminLogin = async (username: string, password: string, totpCode: string) => {
  const response = await api.post('/admin/login', {
    username,
    password,
    totp_code: totpCode,
  });
  return response.data;
};

export const adminRegister = async (username: string, password: string) => {
  const response = await api.post('/admin/register', {
    username,
    password,
  });
  return response.data;
};

export const getAdminPayments = async (token: string, page: number = 1) => {
  const response = await api.get('/admin/payments', {
    headers: { Authorization: `Bearer ${token}` },
    params: { page },
  });
  return response.data;
};

export const getAdminStats = async (token: string) => {
  const response = await api.get('/admin/stats', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getAllZipCodes = async (token: string) => {
  const response = await api.get('/zip-codes', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createZipCode = async (token: string, zipData: any) => {
  const response = await api.post('/zip-codes', zipData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteZipCode = async (token: string, zipId: string) => {
  const response = await api.delete(`/zip-codes/${zipId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const triggerAISearch = async (token: string, appName: string) => {
  const response = await api.post(`/admin/ai-search?app_name=${appName}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const adminLogout = async (token: string) => {
  const response = await api.post('/admin/logout', null, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const rotateZipCodes = async (token: string) => {
  const response = await api.post('/admin/rotate-zip-codes', null, {
    headers: { Authorization: token },
  });
  return response.data;
};

export const checkRotationStatus = async () => {
  const response = await api.get('/admin/check-rotation');
  return response.data;
};

export default api;
