import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

interface AdminState {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  
  setToken: (token: string | null) => Promise<void>;
  loadToken: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAdminStore = create<AdminState>((set, get) => ({
  isAuthenticated: false,
  token: null,
  loading: true,
  
  setToken: async (token) => {
    if (token) {
      await SecureStore.setItemAsync('admin_token', token);
      set({ token, isAuthenticated: true });
    } else {
      await SecureStore.deleteItemAsync('admin_token');
      set({ token: null, isAuthenticated: false });
    }
  },
  
  loadToken: async () => {
    try {
      const token = await SecureStore.getItemAsync('admin_token');
      set({ token, isAuthenticated: !!token, loading: false });
    } catch (error) {
      set({ loading: false });
    }
  },
  
  logout: async () => {
    await SecureStore.deleteItemAsync('admin_token');
    set({ token: null, isAuthenticated: false });
  },
}));
