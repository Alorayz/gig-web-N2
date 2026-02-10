import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AppState {
  selectedApp: string | null;
  termsAccepted: boolean;
  paymentComplete: boolean;
  paymentIntentId: string | null;
  zipCodes: any[];
  guides: any[];
  voiceGuides: any[];
  userId: string;
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
  reset: () => void;
  resetForNewPurchase: () => void;
}

// Generate a unique user ID
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

// Get or create user ID
const getOrCreateUserId = () => {
  return generateUserId();
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
      userId: getOrCreateUserId(),
      paidApps: [],
      lastSessionId: null,
      
      setSelectedApp: (app) => set({ selectedApp: app }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setPaymentComplete: (complete) => set({ paymentComplete: complete }),
      setPaymentIntentId: (id) => set({ paymentIntentId: id }),
      setZipCodes: (codes) => set({ zipCodes: codes }),
      setGuides: (guides) => set({ guides: guides }),
      setVoiceGuides: (guides) => set({ voiceGuides: guides }),
      setPaidApps: (apps) => {
        console.log('Setting paid apps:', apps);
        set({ paidApps: apps });
      },
      addPaidApp: (app) => {
        const currentPaidApps = get().paidApps;
        const appLower = app.toLowerCase();
        if (!currentPaidApps.includes(appLower)) {
          const newPaidApps = [...currentPaidApps, appLower];
          console.log('Adding paid app:', appLower, 'New list:', newPaidApps);
          set({ paidApps: newPaidApps });
        }
      },
      isAppPaid: (app) => {
        const isPaid = get().paidApps.includes(app.toLowerCase());
        console.log('Checking if app is paid:', app, isPaid);
        return isPaid;
      },
      setLastSessionId: (id) => set({ lastSessionId: id }),
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
      name: 'gig-zipfinder-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist these fields
      partialize: (state) => ({
        userId: state.userId,
        paidApps: state.paidApps,
        lastSessionId: state.lastSessionId,
      }),
      onRehydrateStorage: () => (state) => {
        console.log('Storage rehydrated:', state?.paidApps);
      },
    }
  )
);
