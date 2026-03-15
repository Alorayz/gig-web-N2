import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Purchase info with expiration
interface PurchaseInfo {
  appName: string;
  purchasedAt: number; // timestamp
  expiresAt: number; // timestamp (48 hours after purchase)
}

interface AppState {
  selectedApp: string | null;
  termsAccepted: boolean;
  paymentComplete: boolean;
  paymentIntentId: string | null;
  zipCodes: any[];
  guides: any[];
  voiceGuides: any[];
  deviceId: string;
  purchases: PurchaseInfo[]; // New: purchases with expiration
  lastSessionId: string | null;
  
  setSelectedApp: (app: string | null) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setPaymentComplete: (complete: boolean) => void;
  setPaymentIntentId: (id: string | null) => void;
  setZipCodes: (codes: any[]) => void;
  setGuides: (guides: any[]) => void;
  setVoiceGuides: (guides: any[]) => void;
  addPurchase: (app: string) => void;
  isAppActive: (app: string) => boolean;
  getPurchaseInfo: (app: string) => PurchaseInfo | null;
  getActivePurchases: () => PurchaseInfo[];
  getExpiredPurchases: () => PurchaseInfo[];
  getRemainingTime: (app: string) => { hours: number; minutes: number } | null;
  setLastSessionId: (id: string | null) => void;
  setDeviceId: (id: string) => void;
  reset: () => void;
  resetForNewPurchase: () => void;
}

// 48 hours in milliseconds
const PURCHASE_DURATION_MS = 48 * 60 * 60 * 1000;

// Generate a simple device ID
const generateDeviceId = () => {
  return 'device_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      selectedApp: null,
      termsAccepted: false,
      paymentComplete: false,
      paymentIntentId: null,
      zipCodes: [],
      guides: [],
      voiceGuides: [],
      deviceId: generateDeviceId(),
      purchases: [],
      lastSessionId: null,
      
      setSelectedApp: (app) => set({ selectedApp: app }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setPaymentComplete: (complete) => set({ paymentComplete: complete }),
      setPaymentIntentId: (id) => set({ paymentIntentId: id }),
      setZipCodes: (codes) => set({ zipCodes: codes }),
      setGuides: (guides) => set({ guides: guides }),
      setVoiceGuides: (guides) => set({ voiceGuides: guides }),
      
      addPurchase: (app) => {
        const purchases = get().purchases || [];
        const appLower = app.toLowerCase();
        const now = Date.now();
        
        // Check if already purchased (update expiration)
        const existingIndex = purchases.findIndex(p => p.appName === appLower);
        
        const newPurchase: PurchaseInfo = {
          appName: appLower,
          purchasedAt: now,
          expiresAt: now + PURCHASE_DURATION_MS,
        };
        
        if (existingIndex >= 0) {
          // Update existing purchase with new expiration
          const updated = [...purchases];
          updated[existingIndex] = newPurchase;
          set({ purchases: updated });
        } else {
          // Add new purchase
          set({ purchases: [...purchases, newPurchase] });
        }
      },
      
      isAppActive: (app) => {
        const purchases = get().purchases || [];
        const appLower = app.toLowerCase();
        const purchase = purchases.find(p => p.appName === appLower);
        
        if (!purchase) return false;
        return Date.now() < purchase.expiresAt;
      },
      
      getPurchaseInfo: (app) => {
        const purchases = get().purchases || [];
        const appLower = app.toLowerCase();
        return purchases.find(p => p.appName === appLower) || null;
      },
      
      getActivePurchases: () => {
        const purchases = get().purchases || [];
        const now = Date.now();
        return purchases.filter(p => now < p.expiresAt);
      },
      
      getExpiredPurchases: () => {
        const purchases = get().purchases || [];
        const now = Date.now();
        return purchases.filter(p => now >= p.expiresAt);
      },
      
      getRemainingTime: (app) => {
        const purchases = get().purchases || [];
        const appLower = app.toLowerCase();
        const purchase = purchases.find(p => p.appName === appLower);
        
        if (!purchase) return null;
        
        const remaining = purchase.expiresAt - Date.now();
        if (remaining <= 0) return null;
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        
        return { hours, minutes };
      },
      
      setLastSessionId: (id) => set({ lastSessionId: id }),
      setDeviceId: (id) => set({ deviceId: id }),
      
      reset: () => set({ 
        selectedApp: null, 
        termsAccepted: false, 
        paymentComplete: false,
        paymentIntentId: null,
        zipCodes: [],
        guides: [],
        voiceGuides: [],
        lastSessionId: null,
      }),
      
      resetForNewPurchase: () => set({
        selectedApp: null,
        termsAccepted: false,
        paymentComplete: false,
        paymentIntentId: null,
        zipCodes: [],
        guides: [],
        voiceGuides: [],
        lastSessionId: null,
      }),
    }),
    {
      name: 'gig-zipfinder-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
        purchases: state.purchases,
        lastSessionId: state.lastSessionId,
      }),
    }
  )
);

// Helper function to get device ID
export const getDeviceId = (): string => {
  return useAppStore.getState().deviceId;
};
