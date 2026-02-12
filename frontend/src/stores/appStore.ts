import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

interface AppState {
  selectedApp: string | null;
  termsAccepted: boolean;
  paymentComplete: boolean;
  paymentIntentId: string | null;
  zipCodes: any[];
  guides: any[];
  voiceGuides: any[];
  deviceId: string;
  paidApps: string[];
  lastSessionId: string | null;
  
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
  setLastSessionId: (id: string | null) => void;
  setDeviceId: (id: string) => void;
  reset: () => void;
  resetForNewPurchase: () => void;
}

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
      paidApps: [],
      lastSessionId: null,
      
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
        const appLower = app.toLowerCase();
        if (!currentPaidApps.includes(appLower)) {
          set({ paidApps: [...currentPaidApps, appLower] });
        }
      },
      isAppPaid: (app) => {
        const paidApps = get().paidApps || [];
        return paidApps.includes(app.toLowerCase());
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
        paidApps: state.paidApps,
        lastSessionId: state.lastSessionId,
      }),
    }
  )
);

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
