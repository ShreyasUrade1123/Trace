import { create } from 'zustand';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Configure axios to send cookies with every request
axios.defaults.withCredentials = true;

interface User {
  id: string;
  email: string;
  name?: string;
  [key: string]: any;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  checkAuth: () => Promise<{ success: boolean }>;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check auth on mount

  // Check if user is authenticated by calling /api/auth/me
  checkAuth: async () => {
    try {
      const response = await axios.get(`${API_URL}/auth/me`);
      set({
        user: response.data.user,
        isAuthenticated: true,
        isLoading: false
      });
      return { success: true };
    } catch (error) {
      // Not authenticated or cookie expired
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false
      });
      return { success: false };
    }
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      const { user } = response.data;

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Login failed' };
    }
  },

  signup: async (email, password, name) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { email, password, name });
      const { user } = response.data;

      set({ user, isAuthenticated: true });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Signup failed' };
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      // Even if the request fails, clear local state
      console.error('Logout error:', error);
    }
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
