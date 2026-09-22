import { useState, useEffect } from 'react';
import { useGoogleTranslate } from '../context/GoogleTranslateContext';

export const useTranslation = () => {
  const { language, setLanguage, translate } = useGoogleTranslate();
  const [translations, setTranslations] = useState({});

  const t = async (text) => {
    if (translations[text]) return translations[text];
    
    const translated = await translate(text);
    setTranslations(prev => ({ ...prev, [text]: translated }));
    return translated;
  };

  return { language, setLanguage, t };
};