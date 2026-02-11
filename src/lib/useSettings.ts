'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserProfile, Platform, NotificationFrequency, DelegationPreference } from '@/data/types';
import { defaultUserProfile } from '@/data/mockData';

const STORAGE_KEY = 'watchmen-lite-settings';

export function useSettings() {
  const [settings, setSettings] = useState<UserProfile>(defaultUserProfile);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultUserProfile, ...parsed });
      }
    } catch (e) {
      console.error('Failed to load settings:', e);
    }
    setIsLoaded(true);
  }, []);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: Partial<UserProfile>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save settings:', e);
    }
  }, [settings]);

  // Update specific fields
  const updateDisplayName = useCallback((name: string) => {
    saveSettings({ displayName: name });
  }, [saveSettings]);

  const updateKeywords = useCallback((keywords: string[]) => {
    saveSettings({ monitoredKeywords: keywords });
  }, [saveSettings]);

  const updatePlatforms = useCallback((platforms: Platform[]) => {
    saveSettings({ platforms });
  }, [saveSettings]);

  const updateNotificationFrequency = useCallback((frequency: NotificationFrequency) => {
    saveSettings({ notificationFrequency: frequency });
  }, [saveSettings]);

  const updateChineseName = useCallback((name: string) => {
    saveSettings({ chineseName: name });
  }, [saveSettings]);

  const updateEnglishName = useCallback((name: string) => {
    saveSettings({ englishName: name });
  }, [saveSettings]);

  const updateBrandNames = useCallback((brands: string[]) => {
    saveSettings({ brandNames: brands });
  }, [saveSettings]);

  const updateDelegationPreference = useCallback((preference: DelegationPreference) => {
    saveSettings({ delegationPreference: preference });
  }, [saveSettings]);

  const resetSettings = useCallback(() => {
    setSettings(defaultUserProfile);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Failed to reset settings:', e);
    }
  }, []);

  return {
    settings,
    isLoaded,
    saveSettings,
    updateDisplayName,
    updateKeywords,
    updatePlatforms,
    updateNotificationFrequency,
    updateChineseName,
    updateEnglishName,
    updateBrandNames,
    updateDelegationPreference,
    resetSettings,
  };
}
