import { create } from 'zustand';

interface AppState {
  selectedApp: string | null;
  termsAccepted: boolean;
  paymentComplete: boolean;
  paymentIntentId: string | null;
  zipCodes: any[];
  guides: any[];
  voiceGuides: any[];
  userId: string;
  
  setSelectedApp: (app: string | null) => void;
  setTermsAccepted: (accepted: boolean) => void;
  setPaymentComplete: (complete: boolean) => void;
  setPaymentIntentId: (id: string | null) => void;
  setZipCodes: (codes: any[]) => void;
  setGuides: (guides: any[]) => void;
  setVoiceGuides: (guides: any[]) => void;
  reset: () => void;
}

// Generate a unique user ID for tracking
const generateUserId = () => {
  return 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
};

export const useAppStore = create<AppState>((set) => ({
  selectedApp: null,
  termsAccepted: false,
  paymentComplete: false,
  paymentIntentId: null,
  zipCodes: [],
  guides: [],
  voiceGuides: [],
  userId: generateUserId(),
  
  setSelectedApp: (app) => set({ selectedApp: app }),
  setTermsAccepted: (accepted) => set({ termsAccepted: accepted }),
  setPaymentComplete: (complete) => set({ paymentComplete: complete }),
  setPaymentIntentId: (id) => set({ paymentIntentId: id }),
  setZipCodes: (codes) => set({ zipCodes: codes }),
  setGuides: (guides) => set({ guides: guides }),
  setVoiceGuides: (guides) => set({ voiceGuides: guides }),
  reset: () => set({ 
    selectedApp: null, 
    termsAccepted: false, 
    paymentComplete: false,
    paymentIntentId: null,
    zipCodes: [],
    guides: [],
    voiceGuides: [],
  }),
}));
