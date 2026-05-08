import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    welcome: "Good Evening,",
    categories: "Categories",
    trending: "Trending Universe",
    seeAll: "DISCOVER ALL",
    nowPlaying: "Now Playing",
    downloads: "Downloads",
    history: "History",
    profile: "Profile",
    admin: "Admin",
    upload: "Publish",
    search: "Ask HabeshaCast anything...",
    language: "Language",
    amharic: "Amharic",
    english: "English",
    oromiffa: "Oromiffa",
    tigrinya: "Tigrinya",
    home: "Home",
    explore: "Explore",
    settings: "Settings",
    myUploads: "My Uploads",
    favorites: "Favorites",
    logout: "Log Out",
    adminDashboard: "Admin Dashboard",
    needsReview: "Needs Review",
    approve: "Approve",
    reject: "Reject",
    blockUser: "Block User",
    uploadStudio: "Create & Upload Audio",
    aiRecommended: "AI RECOMMENDED",
    neuralPicks: "For You – Neural Picks",
    soundOcean: "Live Sound Ocean"
  },
  am: {
    welcome: "እንደምን አመሹ፣",
    categories: "ምድቦች",
    trending: "አሁን በመታየት ላይ ያሉ 🔥",
    seeAll: "ሁሉንም ይመልከቱ",
    nowPlaying: "አሁን በመጫወት ላይ",
    downloads: "የወረዱ",
    history: "ታሪክ",
    profile: "መገለጫ",
    admin: "አስተዳዳሪ",
    upload: "አዲስ ጫን",
    search: "HabeshaCast ን ይጠይቁ...",
    language: "ቋንቋ",
    amharic: "አማርኛ",
    english: "እንግሊዝኛ",
    oromiffa: "ኦሮምኛ",
    tigrinya: "ትግርኛ",
    home: "መነሻ",
    explore: "አስስ",
    settings: "ቅንብሮች",
    myUploads: "የጫንኳቸው",
    favorites: "ተወዳጆች",
    logout: "ውጣ",
    adminDashboard: "የአስተዳዳሪ ሰሌዳ",
    needsReview: "ግምገማ የሚጠብቁ",
    approve: "አጽድቅ",
    reject: "አትቀበል",
    blockUser: "ተጠቃሚውን እገድ",
    uploadStudio: "ድምጽ ይፍጠሩ እና ይጫኑ",
    aiRecommended: "በአርቲፊሻል ኢንተለጀንስ የተመከረ",
    neuralPicks: "ለእርስዎ የተመረጡ",
    soundOcean: "የቀጥታ ድምጽ ውቅያኖስ"
  },
  om: {
    welcome: "Akkam bultan,",
    categories: "Ramaddiiwwan",
    trending: "Amma kan jaallataman",
    seeAll: "Hundumaa ilaali",
    nowPlaying: "Amma kan taphatu",
    downloads: "Kan buufaman",
    history: "Seenaa",
    profile: "Eenyummeessaa",
    admin: "Bulchaa",
    upload: "Ol fe'i",
    search: "HabeshaCast gaafadhu...",
    language: "Afaan",
    amharic: "Amaariffa",
    english: "Ingiliffa",
    oromiffa: "Afaan Oromoo",
    tigrinya: "Tigriffa",
    home: "Mana",
    explore: "Barbaadi",
    settings: "Sirna",
    myUploads: "Fe'iinsa koo",
    favorites: "Filatamaa",
    logout: "Ba'i",
    adminDashboard: "Dallaa Bulchaa",
    needsReview: "Milaa deebii barbaadu",
    approve: "Mirkaneessi",
    reject: "Kufisi",
    blockUser: "Nama kana ittisi",
    uploadStudio: "Sagalee uumi ol fe'i",
    aiRecommended: "AI kan gorsa kennu",
    neuralPicks: "Siif kan filataman",
    soundOcean: "Garba Sagalee Kallattii"
  },
  ti: {
    welcome: "ከመይ ኣምሲኹም፣",
    categories: "ዓይነታት",
    trending: "ሕጂ ዝርአዩ ዘለዉ",
    seeAll: "ኩሉ ርአ",
    nowPlaying: "ሕጂ ዝጻወት ዘሎ",
    downloads: "ዝወረዱ",
    history: "ታሪኽ",
    profile: "ፕሮፋይል",
    admin: "ኣመሓዳሪ",
    upload: "ፅዓን",
    search: "ን HabeshaCast ሕተቱ...",
    language: "ቋንቋ",
    amharic: "ኣምሓርኛ",
    english: "እንግሊዝኛ",
    oromiffa: "ኦሮምኛ",
    tigrinya: "ትግርኛ",
    home: "መበገሲ",
    explore: "ኣለሽ",
    settings: "ቅንጅት",
    myUploads: "ዝጸዓንኩዎም",
    favorites: "ዝተመርጹ",
    logout: "ውጻእ",
    adminDashboard: "ቦርድ ኣመሓዳሪ",
    needsReview: "ክግምገሙ ዝግበኦም",
    approve: "ኣጽድቕ",
    reject: "ኣይትቀበል",
    blockUser: "ንተጠቃሚ ዕጾ",
    uploadStudio: "ድምጺ ፈጢርካ ፅዓን",
    aiRecommended: "ብ AI ዝተመከረ",
    neuralPicks: "ንዓኻ ዝተመርጹ",
    soundOcean: "ውቅያኖስ ድምጺ"
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('hc_lang') || 'am';
  });

  useEffect(() => {
    localStorage.setItem('hc_lang', language);
  }, [language]);

  const t = (key) => translations[language][key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
