import { AppSettings, DEFAULT_SETTINGS } from '../types/settings';

const SETTINGS_STORAGE_KEY = 'hepa_cdss_settings_v1';

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      headerInfo: { ...DEFAULT_SETTINGS.headerInfo, ...parsed.headerInfo },
      customUln: { ...DEFAULT_SETTINGS.customUln, ...parsed.customUln },
      units: { ...DEFAULT_SETTINGS.units, ...parsed.units },
      clinicalOptions: { ...DEFAULT_SETTINGS.clinicalOptions, ...parsed.clinicalOptions }
    };
  } catch (e) {
    console.error('Failed to load settings from localStorage', e);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: AppSettings): void => {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    window.dispatchEvent(new CustomEvent('hepa_settings_changed', { detail: settings }));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
};

export const resetSettings = (): AppSettings => {
  try {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
    window.dispatchEvent(new CustomEvent('hepa_settings_changed', { detail: DEFAULT_SETTINGS }));
  } catch (e) {
    console.error('Failed to reset settings', e);
  }
  return DEFAULT_SETTINGS;
};
