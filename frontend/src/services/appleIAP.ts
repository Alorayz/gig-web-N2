import { Platform } from 'react-native';
import * as ExpoIAP from 'expo-iap';

// Product IDs - Must match App Store Connect
export const PRODUCT_IDS = {
  INSTACART_ZIP_CODES: 'com.gigzipfinder.app.instacart_codes',
  DOORDASH_ZIP_CODES: 'com.gigzipfinder.app.doordash_codes',
  SPARK_ZIP_CODES: 'com.gigzipfinder.app.spark_codes',
};

// Price in USD
export const PRODUCT_PRICE = 19.99;

interface IAPProduct {
  productId: string;
  title: string;
  description: string;
  price: string;
  localizedPrice: string;
  currency: string;
}

interface IAPPurchase {
  productId: string;
  transactionId: string;
  transactionReceipt: string;
  purchaseTime: number;
}

class AppleIAPService {
  private connected: boolean = false;
  private products: IAPProduct[] = [];

  async initialize(): Promise<boolean> {
    if (Platform.OS !== 'ios') {
      console.log('Apple IAP only available on iOS');
      return false;
    }

    try {
      const result = await ExpoIAP.initConnection();
      this.connected = result;
      
      if (result) {
        await this.fetchProducts();
      }
      
      return result;
    } catch (error) {
      console.error('Failed to initialize IAP connection:', error);
      return false;
    }
  }

  async fetchProducts(): Promise<IAPProduct[]> {
    if (!this.connected) {
      throw new Error('IAP not connected');
    }

    try {
      const productIds = Object.values(PRODUCT_IDS);
      const products = await ExpoIAP.getProducts({ skus: productIds });
      this.products = products as IAPProduct[];
      return this.products;
    } catch (error) {
      console.error('Failed to fetch products:', error);
      throw error;
    }
  }

  async purchaseProduct(productId: string): Promise<IAPPurchase | null> {
    if (!this.connected) {
      throw new Error('IAP not connected');
    }

    try {
      const purchase = await ExpoIAP.requestPurchase({ sku: productId });
      return purchase as IAPPurchase;
    } catch (error: any) {
      if (error.code === 'E_USER_CANCELLED') {
        console.log('User cancelled purchase');
        return null;
      }
      console.error('Purchase failed:', error);
      throw error;
    }
  }

  async finishTransaction(purchase: IAPPurchase): Promise<void> {
    try {
      await ExpoIAP.finishTransaction({
        purchase,
        isConsumable: true, // ZIP codes are consumable (one-time use per purchase)
      });
    } catch (error) {
      console.error('Failed to finish transaction:', error);
      throw error;
    }
  }

  async validateReceipt(receipt: string, productId: string): Promise<boolean> {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/iap/validate-receipt`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            receipt,
            product_id: productId,
            platform: 'ios',
          }),
        }
      );

      const data = await response.json();
      return data.is_valid === true;
    } catch (error) {
      console.error('Receipt validation failed:', error);
      return false;
    }
  }

  async restorePurchases(): Promise<IAPPurchase[]> {
    if (!this.connected) {
      throw new Error('IAP not connected');
    }

    try {
      const purchases = await ExpoIAP.getAvailablePurchases();
      return purchases as IAPPurchase[];
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    }
  }

  getProducts(): IAPProduct[] {
    return this.products;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async disconnect(): Promise<void> {
    if (this.connected) {
      await ExpoIAP.endConnection();
      this.connected = false;
    }
  }
}

export const appleIAPService = new AppleIAPService();
export default appleIAPService;
