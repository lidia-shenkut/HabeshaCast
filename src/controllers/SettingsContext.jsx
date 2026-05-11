import { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext();

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('hc_settings');
    return saved ? JSON.parse(saved) : {
      audioQuality: 'high',
      skipInterval: '15',
      pushNotifications: true,
      newEpisodeAlerts: true,
      downloadWifiOnly: true,
      twoFactorEnabled: false
    };
  });

  useEffect(() => {
    localStorage.setItem('hc_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
