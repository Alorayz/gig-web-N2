import * as ExpoIAP from 'expo-iap';
import { Platform } from 'react-native';

const APPLE_PRODUCT_IDS = [
  'com.gigzipfinder.app.instacart_codes',
  'com.gigzipfinder.app.doordash_codes',
  'com.gigzipfinder.app.spark_codes',
];

const ACCESS_DURATION_DAYS = 15;

class AppleIAPService {
  private products: any[] = [];
  private purchaseUpdateSub: { remove: () => void } | null = null;
  private purchaseErrorSub: { remove: () => void } | null = null;
  private isConnected = false;

  /**
   * Set up purchase listeners. Call this BEFORE initialize().
   * The success callback receives the purchase object.
   * The error callback receives the error object.
   */
  setupListeners(
    onSuccess: (purchase: any) => void,
    onError: (error: any) => void
  ) {
    // Clean up existing listeners first
    this.removeListeners();

    try {
      this.purchaseUpdateSub = ExpoIAP.purchaseUpdatedListener(
        (purchase: any) => {
          console.log('[IAP] Purchase updated:', purchase?.productId);
          onSuccess(purchase);
        }
      );

      this.purchaseErrorSub = ExpoIAP.purchaseErrorListener(
        (error: any) => {
          console.warn('[IAP] Purchase error event:', error?.code, error?.message);
          onError(error);
        }
      );
      console.log('[IAP] Listeners set up successfully');
    } catch (err) {
      console.error('[IAP] Error setting up listeners:', err);
    }
  }

  removeListeners() {
    try {
      this.purchaseUpdateSub?.remove();
      this.purchaseErrorSub?.remove();
    } catch (err) {
      console.warn('[IAP] Error removing listeners:', err);
    }
    this.purchaseUpdateSub = null;
    this.purchaseErrorSub = null;
  }

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;

    try {
      console.log('[IAP] Initializing connection...');
      const result = await ExpoIAP.initConnection();
      this.isConnected = !!result;
      console.log('[IAP] Connection result:', this.isConnected);

      // Fetch products
      try {
        this.products = await ExpoIAP.fetchProducts({
          skus: APPLE_PRODUCT_IDS,
          type: 'in-app',
        });
        console.log('[IAP] Products fetched:', this.products?.length || 0);
      } catch (fetchErr) {
        console.warn('[IAP] Fetch products error (non-fatal):', fetchErr);
        this.products = [];
      }

      return this.isConnected;
    } catch (error) {
      console.error('[IAP] Initialize error:', error);
      this.isConnected = false;
      return false;
    }
  }

  async purchase(productId: string): Promise<void> {
    if (!this.isConnected) {
      console.log('[IAP] Not connected, reconnecting...');
      const ok = await this.initialize();
      if (!ok) {
        throw new Error('Could not connect to the App Store. Please try again.');
      }
    }

    console.log('[IAP] Requesting purchase:', productId);

    // Use try-catch to prevent native crash from propagating
    try {
      await ExpoIAP.requestPurchase({
        request: {
          apple: { sku: productId },
        },
        type: 'in-app',
      });
      // Result comes through purchaseUpdatedListener
    } catch (error: any) {
      console.error('[IAP] requestPurchase error:', error);
      if (error?.code === 'E_USER_CANCELLED' || error?.message?.includes('cancel')) {
        throw new Error('Purchase cancelled');
      }
      throw new Error(error?.message || 'Purchase failed. Please try again.');
    }
  }

  /**
   * Finish a transaction. REQUIRED for consumable products to prevent duplicate charges.
   */
  async finish(purchase: any): Promise<void> {
    try {
      if (purchase) {
        await ExpoIAP.finishTransaction({
          purchase,
          isConsumable: true,
        });
        console.log('[IAP] Transaction finished for:', purchase?.productId);
      }
    } catch (error) {
      console.warn('[IAP] Finish transaction error (non-fatal):', error);
    }
  }

  async restorePurchases(): Promise<any[]> {
    if (!this.isConnected) {
      await this.initialize();
    }

    try {
      const purchases = await ExpoIAP.getAvailablePurchases();
      console.log('[IAP] Restored purchases:', purchases?.length || 0);
      return purchases || [];
    } catch (error) {
      console.warn('[IAP] Restore purchases error:', error);
      return [];
    }
  }

  getProducts() {
    return this.products;
  }

  getAccessDurationDays() {
    return ACCESS_DURATION_DAYS;
  }

  async cleanup(): Promise<void> {
    this.removeListeners();
    try {
      if (this.isConnected) {
        await ExpoIAP.endConnection();
        this.isConnected = false;
        console.log('[IAP] Connection ended');
      }
    } catch (error) {
      console.warn('[IAP] Cleanup error:', error);
    }
  }
}

const appleIAPService = new AppleIAPService();
export default appleIAPService;
