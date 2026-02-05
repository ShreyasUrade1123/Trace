import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Detect system color scheme preference
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'NOIR' : 'SAMBA';
  }
  return 'NOIR'; // Fallback to dark theme
};

const useThemeStore = create(
  persist(
    (set) => ({
      currentTheme: getSystemTheme(), // Default based on system preference
      setCurrentTheme: (theme) => set({ currentTheme: theme }),
    }),
    {
      name: 'theme-storage', // name of the item in the storage (must be unique)
    }
  )
);

export default useThemeStore;
