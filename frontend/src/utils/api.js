const API_BASE = process.env.REACT_APP_BACKEND_URL || '';

export const api = {
  async createCheckoutSession(userId, appName, termsAccepted, returnUrl) {
    const res = await fetch(`${API_BASE}/api/web/create-checkout-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, app_name: appName, terms_accepted: termsAccepted, return_url: returnUrl }),
    });
    if (!res.ok) throw new Error((await res.json()).detail || 'Payment error');
    return res.json();
  },

  async verifyCheckout(sessionId) {
    const res = await fetch(`${API_BASE}/api/stripe/verify-checkout/${sessionId}`, { method: 'POST' });
    if (!res.ok) throw new Error('Verification failed');
    return res.json();
  },

  async searchZipCodes(appName) {
    const res = await fetch(`${API_BASE}/api/search-zip-codes/${appName}`, { method: 'POST' });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  async getZipCodes(appName) {
    const res = await fetch(`${API_BASE}/api/zip-codes/${appName}`);
    if (!res.ok) throw new Error('Failed to fetch zip codes');
    return res.json();
  },

  async checkPayment(userId, appName) {
    const res = await fetch(`${API_BASE}/api/stripe/check-payment-by-user/${userId}?app_name=${appName}`);
    if (!res.ok) throw new Error('Check failed');
    return res.json();
  },

  async getPaidApps(userId) {
    const res = await fetch(`${API_BASE}/api/stripe/paid-apps/${userId}`);
    if (!res.ok) throw new Error('Failed to get paid apps');
    return res.json();
  },

  async getGuidesList() {
    const res = await fetch(`${API_BASE}/api/guides-list`);
    if (!res.ok) throw new Error('Failed to get guides');
    return res.json();
  },

  async getTerms() {
    const res = await fetch(`${API_BASE}/api/terms`);
    if (!res.ok) throw new Error('Failed to get terms');
    return res.json();
  },

  getGuideDownloadUrl(appName, language) {
    return `${API_BASE}/api/download-guide/${appName}/${language}`;
  }
};

export function getUserId() {
  let userId = localStorage.getItem('gig_user_id');
  if (!userId) {
    userId = 'web_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('gig_user_id', userId);
  }
  return userId;
}
