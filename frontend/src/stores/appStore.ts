import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

// Interface for paid app with expiration
interface PaidAppInfo {
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
  userId: string; // Added userId for API calls
  paidApps: string[]; // Keep for backward compatibility
  paidAppsInfo: PaidAppInfo[]; // New: paid apps with expiration info
  lastSessionId: string | null;
  isHydrated: boolean;
  
  setSelectedApp: (app: string | null) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setPaymentComplete: (complete: boolean) => void;
  setPaymentIntentId: (id: string | null) => void;
  setZipCodes: (codes: any[]) => void;
  setGuides: (guides: any[]) => void;
  setVoiceGuides: (guides: any[]) => void;
  setPaidApps: (apps: string[]) => void;
  addPaidApp: (app: string) => void;
  isAppPaid: (app: string) => boolean;
  isAppValid: (app: string) => boolean; // New: check if app is paid AND not expired
  getAppExpiration: (app: string) => number | null; // New: get expiration timestamp
  getRemainingTime: (app: string) => string; // New: get human readable remaining time
  setLastSessionId: (id: string | null) => void;
  setDeviceId: (id: string) => void;
  setUserId: (id: string) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
  resetForNewPurchase: () => void;
}

// 48 hours in milliseconds
const PURCHASE_VALIDITY_MS = 48 * 60 * 60 * 1000;

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
      deviceId: '',
      userId: '',
      paidApps: [],
      paidAppsInfo: [],
      lastSessionId: null,
      isHydrated: false,
      
      setSelectedApp: (app) => set({ selectedApp: app }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setPaymentComplete: (complete) => set({ paymentComplete: complete }),
      setPaymentIntentId: (id) => set({ paymentIntentId: id }),
      setZipCodes: (codes) => set({ zipCodes: codes }),
      setGuides: (guides) => set({ guides: guides }),
      setVoiceGuides: (guides) => set({ voiceGuides: guides }),
      setPaidApps: (apps) => set({ paidApps: apps }),
      addPaidApp: (app) => {
        const currentPaidApps = get().paidApps || [];
        const currentPaidAppsInfo = get().paidAppsInfo || [];
        const appLower = app.toLowerCase();
        const now = Date.now();
        
        // Add to simple list for backward compatibility
        if (!currentPaidApps.includes(appLower)) {
          set({ paidApps: [...currentPaidApps, appLower] });
        }
        
        // Add or update expiration info
        const existingIndex = currentPaidAppsInfo.findIndex(p => p.appName === appLower);
        const newPaidAppInfo: PaidAppInfo = {
          appName: appLower,
          purchasedAt: now,
          expiresAt: now + PURCHASE_VALIDITY_MS,
        };
        
        if (existingIndex >= 0) {
          // Update existing entry with new expiration
          const updatedInfo = [...currentPaidAppsInfo];
          updatedInfo[existingIndex] = newPaidAppInfo;
          set({ paidAppsInfo: updatedInfo });
        } else {
          // Add new entry
          set({ paidAppsInfo: [...currentPaidAppsInfo, newPaidAppInfo] });
        }
      },
      isAppPaid: (app) => {
        const paidApps = get().paidApps || [];
        return paidApps.includes(app.toLowerCase());
      },
      isAppValid: (app) => {
        const paidAppsInfo = get().paidAppsInfo || [];
        const appLower = app.toLowerCase();
        const appInfo = paidAppsInfo.find(p => p.appName === appLower);
        
        if (!appInfo) return false;
        
        const now = Date.now();
        return now < appInfo.expiresAt;
      },
      getAppExpiration: (app) => {
        const paidAppsInfo = get().paidAppsInfo || [];
        const appLower = app.toLowerCase();
        const appInfo = paidAppsInfo.find(p => p.appName === appLower);
        
        if (!appInfo) return null;
        return appInfo.expiresAt;
      },
      getRemainingTime: (app) => {
        const paidAppsInfo = get().paidAppsInfo || [];
        const appLower = app.toLowerCase();
        const appInfo = paidAppsInfo.find(p => p.appName === appLower);
        
        if (!appInfo) return '';
        
        const now = Date.now();
        const remaining = appInfo.expiresAt - now;
        
        if (remaining <= 0) return 'Expirado';
        
        const hours = Math.floor(remaining / (1000 * 60 * 60));
        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        
        if (hours > 0) {
          return `${hours}h ${minutes}m`;
        }
        return `${minutes}m`;
      },
      setLastSessionId: (id) => set({ lastSessionId: id }),
      setDeviceId: (id) => set({ deviceId: id }),
      setUserId: (id) => set({ userId: id }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
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
      name: 'gig-zipfinder-storage-v3', // Updated version
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        deviceId: state.deviceId,
        userId: state.userId,
        paidApps: state.paidApps,
        paidAppsInfo: state.paidAppsInfo,
        lastSessionId: state.lastSessionId,
      }),
      onRehydrateStorage: () => (state) => {
        // Set hydrated immediately when rehydration completes
        setTimeout(() => {
          const currentState = useAppStore.getState();
          if (!currentState.isHydrated) {
            currentState.setHydrated(true);
          }
        }, 100);
        
        if (state) {
          state.setHydrated(true);
          // Generate device ID if not present
          if (!state.deviceId || state.deviceId.length === 0) {
            Crypto.getRandomBytesAsync(16).then((randomBytes) => {
              const newId = 'device_' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 24);
              state.setDeviceId(newId);
              // Also use deviceId as userId if not set
              if (!state.userId || state.userId.length === 0) {
                state.setUserId(newId);
              }
            });
          } else if (!state.userId || state.userId.length === 0) {
            // Use existing deviceId as userId
            state.setUserId(state.deviceId);
          }
        }
      },
    }
  )
);

// Initialize hydration after a timeout (for cases when onRehydrateStorage doesn't fire)
if (typeof window !== 'undefined') {
  setTimeout(() => {
    const state = useAppStore.getState();
    if (!state.isHydrated) {
      state.setHydrated(true);
      // Generate device ID if not set
      if (!state.deviceId || state.deviceId.length === 0) {
        Crypto.getRandomBytesAsync(16).then((randomBytes) => {
          const newId = 'device_' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 24);
          state.setDeviceId(newId);
          state.setUserId(newId);
        });
      }
    }
  }, 500);
}

// Helper function to get or create device ID
export const getDeviceId = async (): Promise<string> => {
  const state = useAppStore.getState();
  
  if (state.deviceId && state.deviceId.length > 0) {
    return state.deviceId;
  }
  
  // Generate a new device ID
  const randomBytes = await Crypto.getRandomBytesAsync(16);
  const newId = 'device_' + Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 24);
  
  useAppStore.getState().setDeviceId(newId);
  return newId;
};
