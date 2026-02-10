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
  paidApps: string[]; // Apps the user has paid for
  
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
  reset: () => void;
  resetForNewPurchase: () => void;
}

// Generate a unique user ID for tracking
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
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
      userId: generateUserId(),
      paidApps: [],
      
      setSelectedApp: (app) => set({ selectedApp: app }),
      setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
      setPaymentComplete: (complete) => set({ paymentComplete: complete }),
      setPaymentIntentId: (id) => set({ paymentIntentId: id }),
      setZipCodes: (codes) => set({ zipCodes: codes }),
      setGuides: (guides) => set({ guides: guides }),
      setVoiceGuides: (guides) => set({ voiceGuides: guides }),
      setPaidApps: (apps) => set({ paidApps: apps }),
      addPaidApp: (app) => {
        const currentPaidApps = get().paidApps;
        if (!currentPaidApps.includes(app.toLowerCase())) {
          set({ paidApps: [...currentPaidApps, app.toLowerCase()] });
        }
      },
      isAppPaid: (app) => {
        return get().paidApps.includes(app.toLowerCase());
      },
      reset: () => set({ 
        selectedApp: null, 
        termsAccepted: false, 
        paymentComplete: false,
        paymentIntentId: null,
        zipCodes: [],
        guides: [],
        voiceGuides: [],
        // Keep userId and paidApps on reset
      }),
      resetForNewPurchase: () => set({
        selectedApp: null,
        termsAccepted: false,
        paymentComplete: false,
        paymentIntentId: null,
        zipCodes: [],
        guides: [],
        voiceGuides: [],
      }),
    }),
    {
      name: 'gig-zipfinder-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        userId: state.userId,
        paidApps: state.paidApps,
      }),
    }
  )
);
