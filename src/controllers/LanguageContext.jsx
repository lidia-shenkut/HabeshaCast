import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: "Good Morning,",
    categories: "Categories",
    trending: "Trending Now",
    seeAll: "See all",
    nowPlaying: "Now Playing",
    downloads: "Downloads",
    history: "History",
    profile: "Profile",
    admin: "Admin",
    upload: "Upload",
    search: "Search podcast...",
    language: "Language",
    amharic: "Amharic",
    english: "English",
    home: "Home",
    settings: "Settings"
  },
  am: {
    welcome: "እንደምን አደሩ፣",
    categories: "ምድቦች",
    trending: "አሁን በመታየት ላይ ያሉ 🔥",
    seeAll: "ሁሉንም ይመልከቱ",
    nowPlaying: "አሁን በመጫወት ላይ",
    downloads: "የወረዱ",
    history: "ታሪክ",
    profile: "መገለጫ",
    admin: "አስተዳዳሪ",
    upload: "ጫን",
    search: "ፖድካስት ፈልግ...",
    language: "ቋንቋ",
    amharic: "አማርኛ",
    english: "እንግሊዝኛ",
    home: "መነሻ",
    settings: "ቅንብሮች"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hc_lang') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('hc_lang', language);
  }, [language]);

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
