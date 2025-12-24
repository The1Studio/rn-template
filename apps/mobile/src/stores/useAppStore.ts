import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface AppState {
  // State
  theme: Theme;
  isLoading: boolean;
  isOnline: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setLoading: (loading: boolean) => void;
  setOnline: (online: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Initial state
  theme: 'system',
  isLoading: false,
  isOnline: true,

  // Actions
  setTheme: (theme) => set({ theme }),
  setLoading: (isLoading) => set({ isLoading }),
  setOnline: (isOnline) => set({ isOnline }),
}));

// Selectors (optional - for performance optimization)
export const selectTheme = (state: AppState) => state.theme;
export const selectIsLoading = (state: AppState) => state.isLoading;
