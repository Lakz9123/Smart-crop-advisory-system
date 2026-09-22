import React, { createContext, useState, useContext, useEffect } from 'react';

const GoogleTranslateContext = createContext();

export const useGoogleTranslate = () => useContext(GoogleTranslateContext);

export const GoogleTranslateProvider = ({ children }) => {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('app_language');
    return saved || 'en';
  });

  // Save language preference
  useEffect(() => {
    localStorage.setItem('app_language', language);
  }, [language]);

  // Simple translate function (will use Google Translate API later)
  const translate = async (text) => {
    if (language === 'en') return text;
    
    try {
      // Using Google Translate API without key
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${language}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await response.json();
      return data[0][0][0];
    } catch (error) {
      console.error('Translation error:', error);
      return text;
    }
  };

  return (
    <GoogleTranslateContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </GoogleTranslateContext.Provider>
  );
};