import React from 'react';
import { useGoogleTranslate } from '../context/GoogleTranslateContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useGoogleTranslate();

  return (
    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
      <button
        onClick={() => setLanguage('en')}
        style={{
          padding: '8px 16px',
          backgroundColor: language === 'en' ? '#4CAF50' : '#f0f0f0',
          color: language === 'en' ? 'white' : '#333',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🇬🇧 English
      </button>
      <button
        onClick={() => setLanguage('ta')}
        style={{
          padding: '8px 16px',
          backgroundColor: language === 'ta' ? '#4CAF50' : '#f0f0f0',
          color: language === 'ta' ? 'white' : '#333',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🇮🇳 தமிழ்
      </button>
    </div>
  );
};

export default LanguageSwitcher;