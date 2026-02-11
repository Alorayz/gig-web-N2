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
  setLastSessionId: (id: string | null) => void;
  setHydrated: (hydrated: boolean) => void;
  reset: () => void;
  resetForNewPurchase: () => void;
}

// Generate a unique user ID
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
      userId: '', // Will be set on first hydration or generated if empty
      paidApps: [],
      lastSessionId: null,
      isHydrated: false,
      
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
        return isPaid;
      },
      setLastSessionId: (id) => set({ lastSessionId: id }),
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
      name: 'gig-zipfinder-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Persist these fields
      partialize: (state) => ({
        userId: state.userId,
        paidApps: state.paidApps,
        lastSessionId: state.lastSessionId,
      }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.log('Error rehydrating storage:', error);
          return;
        }
        
        console.log('Storage rehydrated - userId:', state?.userId, 'paidApps:', state?.paidApps);
        
        // If no userId exists after rehydration, generate one
        if (!state?.userId) {
          const newUserId = generateUserId();
          console.log('Generated new userId:', newUserId);
          useAppStore.setState({ userId: newUserId, isHydrated: true });
        } else {
          useAppStore.setState({ isHydrated: true });
        }
      },
    }
  )
);

// Initialize userId if not set (for first run)
const initializeUserId = () => {
  const state = useAppStore.getState();
  if (!state.userId) {
    const newUserId = generateUserId();
    console.log('Initial userId generation:', newUserId);
    useAppStore.setState({ userId: newUserId });
  }
};

// Call this after a short delay to ensure hydration has happened
setTimeout(initializeUserId, 100);
