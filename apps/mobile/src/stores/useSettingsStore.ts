import { create } from 'zustand';

type Language = 'en' | 'vi';

interface SettingsState {
  // State
  language: Language;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;

  // Actions
  setLanguage: (language: Language) => void;
  toggleNotifications: () => void;
  toggleBiometric: () => void;
  resetSettings: () => void;
}

const initialState = {
  language: 'en' as Language,
  notificationsEnabled: true,
  biometricEnabled: false,
};

export const useSettingsStore = create<SettingsState>()((set) => ({
  ...initialState,

  // Actions
  setLanguage: (language) => set({ language }),

  toggleNotifications: () =>
    set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),

  toggleBiometric: () =>
    set((state) => ({ biometricEnabled: !state.biometricEnabled })),

  resetSettings: () => set(initialState),
}));

// Selectors
export const selectLanguage = (state: SettingsState) => state.language;
export const selectNotificationsEnabled = (state: SettingsState) =>
  state.notificationsEnabled;
