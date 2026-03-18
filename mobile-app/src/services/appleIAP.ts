import { Platform } from 'react-native';
import * as ExpoIAP from 'expo-iap';

// Product IDs - Must match App Store Connect
export const PRODUCT_IDS = {
  INSTACART_ZIP_CODES: 'com.gigzipfinder.app.instacart_codes',
  DOORDASH_ZIP_CODES: 'com.gigzipfinder.app.doordash_codes',
  SPARK_ZIP_CODES: 'com.gigzipfinder.app.spark_codes',
};

export const PRODUCT_PRICE = 20.00;
export const ACCESS_DURATION_DAYS = 15;

class AppleIAPService {
  private connected: boolean = false;
  private products: any[] = [];
  private purchaseListener: any = null;
  private errorListener: any = null;

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') return false;

    try {
      await ExpoIAP.initConnection();
      this.connected = true;
      await this.loadProducts();
      return true;
    } catch (error) {
      console.error('IAP init error:', error);
      this.connected = false;
      return false;
    }
  }

  async loadProducts(): Promise<any[]> {
    if (!this.connected) return [];

    try {
      const skus = Object.values(PRODUCT_IDS);
      const products = await ExpoIAP.fetchProducts({ skus });
      this.products = products || [];
      return this.products;
    } catch (error) {
      console.error('Fetch products error:', error);
      return [];
    }
  }

  setupListeners(
    onPurchase: (purchase: any) => void,
    onError: (error: any) => void,
  ) {
    this.removeListeners();
    this.purchaseListener = ExpoIAP.purchaseUpdatedListener((purchase) => {
      onPurchase(purchase);
    });
    this.errorListener = ExpoIAP.purchaseErrorListener((error) => {
      onError(error);
    });
  }

  removeListeners() {
    if (this.purchaseListener) {
      this.purchaseListener.remove();
      this.purchaseListener = null;
    }
    if (this.errorListener) {
      this.errorListener.remove();
      this.errorListener = null;
    }
  }

  async purchase(productId: string): Promise<void> {
    if (!this.connected) throw new Error('IAP not connected');

    await ExpoIAP.requestPurchase({
      request: {
        apple: { sku: productId },
      },
    });
    // Result comes through purchaseUpdatedListener, not here
  }

  async finish(purchase: any): Promise<void> {
    await ExpoIAP.finishTransaction({
      purchase,
      isConsumable: true,
    });
  }

  async restore(): Promise<any[]> {
    if (!this.connected) return [];
    try {
      const purchases = await ExpoIAP.getAvailablePurchases();
      return purchases || [];
    } catch (error) {
      console.error('Restore error:', error);
      return [];
    }
  }

  getProducts() { return this.products; }
  isConnected() { return this.connected; }

  async disconnect() {
    this.removeListeners();
    if (this.connected) {
      await ExpoIAP.endConnection();
      this.connected = false;
    }
  }
}

export const appleIAPService = new AppleIAPService();
export default appleIAPService;
