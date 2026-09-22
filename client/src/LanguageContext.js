import React, { createContext, useState, useContext, useEffect, useRef } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("preferred_language");
    return saved === "ta" ? "ta" : "en";
  });

  const translationCache = useRef({});

  // High-performance translation fetcher using Google's public API
  const fetchTranslate = async (text, target) => {
    if (target === 'en') return text;
    const cacheKey = `${target}:${text}`;
    if (translationCache.current[cacheKey]) return translationCache.current[cacheKey];

    try {
      const res = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`
      );
      const data = await res.json();
      const translated = data[0].map(item => item[0]).join('');
      translationCache.current[cacheKey] = translated;
      return translated;
    } catch (err) {
      console.error("Translation error:", err);
      return text;
    }
  };

  // Aggressive DOM translator that finds all text nodes
  const translateDOM = async (rootElement, targetLang) => {
    if (!rootElement || targetLang === 'en') return;

    const walk = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToTranslate = [];

    while ((node = walk.nextNode())) {
      const text = node.nodeValue.trim();
      // Only translate if it looks like English and isn't already translated
      if (text.length > 1 && /[a-zA-Z]/.test(text)) {
        // Skip elements with 'notranslate' class
        if (!node.parentElement.closest('.notranslate')) {
          nodesToTranslate.push(node);
        }
      }
    }

    // Process in batches for performance
    for (const textNode of nodesToTranslate) {
      const originalText = textNode.nodeValue;
      const translated = await fetchTranslate(originalText, targetLang);
      if (translated) textNode.nodeValue = translated;
    }
  };

  // Effect to handle state and persistent storage
  useEffect(() => {
    localStorage.setItem("preferred_language", language);
    
    if (language === 'ta') {
      // Initial translation of the whole body
      translateDOM(document.body, 'ta');

      // Observe DOM changes to translate dynamic content
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) translateDOM(node, 'ta');
            else if (node.nodeType === 3) translateDOM(node.parentElement, 'ta');
          });
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
      return () => observer.disconnect();
    }
  }, [language]);

  const toggleTo = (lang) => {
    if (language === lang) return;
    setLanguage(lang);
    if (lang === 'en') window.location.reload(); // Quickest way to revert to original English
  };

  const t = (key) => {
    const coreTranslations = {
      en: {
        home: "Home",
        farmerDashboard: "Dashboard",
        weatherTitle: "Weather",
        marketTitle: "Market Price",
        pestTitle: "Pest Detection",
        exportReports: "Reports",
        adminPanel: "Admin Panel",
        logout: "Logout",
        login: "Login",
        register: "Register",
        searchCrop: "Search",
        showAll: "Show all",
        price: "Price",
        noPricesFound: "No prices found for",
        cropRice: "Rice",
        cropWheat: "Wheat",
        cropCotton: "Cotton",
        cropMaize: "Maize",
        cropGroundnut: "Groundnut",
        cropSugarcane: "Sugarcane",
        cropBanana: "Banana",
        cropTomato: "Tomato",
        cropOnion: "Onion",
        cropPotato: "Potato",
        cropChilli: "Chilli",
        cropBrinjal: "Brinjal",
        cropMango: "Mango",
        cropGrapes: "Grapes",
        cropPomegranate: "Pomegranate",
        cropSunflower: "Sunflower",
        cropSoybean: "Soybean",
        cropRagi: "Ragi",
        cropJowar: "Jowar",
        cropBajra: "Bajra",
        cropGreenGram: "Green Gram",
        cropBlackGram: "Black Gram",
        cropRedGram: "Red Gram",
        cropHorseGram: "Horse Gram",
        name: "Name",
        location: "Location",
        soilType: "Soil Type",
        landSize: "Land Size",
        email: "Email",
        password: "Password",
        welcome: "Welcome",
        administrator: "Administrator",
        farmer: "Farmer",
        farmers: "Farmers",
        crops: "Crops",
        users: "Users",
        addCrop: "Add Crop",
        addNewCrop: "Add New Crop",
        cropName: "Crop Name",
        fertilizer: "Fertilizer",
        tips: "Tips",
        season: "Season",
        pests: "Pests",
        addPest: "Add Pest",
        winter: "Winter",
        summer: "Summer",
        rainy: "Rainy",
        spring: "Spring",
        alluvial: "Alluvial",
        red: "Red",
        black: "Black",
        laterite: "Laterite",
        desert: "Desert",
        clayey: "Clayey",
        sandy: "Sandy",
        loamy: "Loamy",
        acres: "acres",
        premiumReports: "Premium Reports",
        dynamicFarmReporting: "Smart, dynamic farm reporting for every season.",
        reportDescription: "Review the latest farmer records, crop plans, and pest intelligence in one premium report workspace. Filter, preview, and export with one click.",
        registeredFarmers: "Registered farmers",
        cropEntries: "Crop entries",
        pestRecords: "Pest records",
        liveSnapshot: "Live snapshot",
        mostReferencedPestCrop: "Most referenced pest crop",
        leadingSoilType: "Leading soil type",
        resultsMatchingFilter: "Results matching filter",
        dataHealthScore: "Data health score",
        lastRefreshed: "Last refreshed",
        refreshData: "Refresh data",
        exportExcel: "Export view to Excel",
        exportPDF: "Export view to PDF",
        exportSummary: "Export summary PDF",
        pestAnalytics: "Pest analytics",
        threatsByCrop: "Pest threats by crop",
        soilInsights: "Soil insights",
        cropSoilMix: "Crop soil type mix",
        seasonalInsight: "Seasonal insight",
        cropDistributionBySeason: "Crop distribution by season",
        quickPreview: "Quick preview",
        selectedRecord: "Selected record",
        exportHistory: "Export history",
        recentActivity: "Recent activity",
        reportGuide: "Report guide",
        useReportsDriveDecisions: "Use reports to drive smarter field decisions",
        pestName: "Pest Name",
        cropAffected: "Crop Affected",
        symptoms: "Symptoms",
        organic: "Organic",
        chemical: "Chemical",
        metric: "Metric",
        value: "Value"
      },
      ta: {
        home: "முகப்பு",
        farmerDashboard: "டாஷ்போர்டு",
        weatherTitle: "வானிலை",
        marketTitle: "சந்தை விலை",
        pestTitle: "பூச்சி கண்டறிதல்",
        exportReports: "அறிக்கைகள்",
        adminPanel: "நிர்வாகக் குழு",
        logout: "வெளியேறு",
        login: "உள்நுழை",
        register: "பதிவு",
        name: "பெயர்",
        location: "இடம்",
        soilType: "மண் வகை",
        landSize: "நில அளவு",
        email: "மின்னஞ்சல்",
        password: "கடவுச்சொல்",
        welcome: "வரவேற்கிறோம்",
        administrator: "நிர்வாகி",
        farmer: "விவசாயி",
        farmers: "விவசாயிகள்",
        crops: "பயிர்கள்",
        users: "பயனர்கள்",
        addCrop: "பயிரைச் சேர்க்கவும்",
        addNewCrop: "புதிய பயிரைச் சேர்க்கவும்",
        cropName: "பயிரின் பெயர்",
        fertilizer: "உரம்",
        tips: "குறிப்புகள்",
        season: "பருவம்",
        pests: "பூச்சிகள்",
        addPest: "பூச்சியைச் சேர்க்கவும்",
        winter: "குளிர்காலம்",
        summer: "கோடைகாலம்",
        rainy: "மழைக்காலம்",
        spring: "வசந்த காலம்",
        alluvial: "வண்டல் மண்",
        red: "செம்மண்",
        black: "கரிசல் மண்",
        laterite: "சரளை மண்",
        desert: "பாலைவன மண்",
        clayey: "களிமண்",
        sandy: "மணல் மண்",
        loamy: "வண்டல் மண்",
        acres: "ஏக்கர்",
        premiumReports: "பிரீமியம் அறிக்கைகள்",
        dynamicFarmReporting: "ஒவ்வொரு பருவத்திற்கும் ஏற்ற ஸ்மார்ட், டைனமிக் பண்ணை அறிக்கை.",
        reportDescription: "சமீபத்திய விவசாயிகளின் பதிவுகள், பயிர் திட்டங்கள் மற்றும் பூச்சி பற்றிய தகவல்களை ஒரே இடத்தில் மதிப்பாய்வு செய்யவும். வடிகட்டவும், மாதிரியைப் பார்க்கவும் மற்றும் ஒரே கிளிக்கில் ஏற்றுமதி செய்யவும்.",
        registeredFarmers: "பதிவு செய்யப்பட்ட விவசாயிகள்",
        cropEntries: "பயிர் பதிவுகள்",
        pestRecords: "பூச்சி பதிவுகள்",
        liveSnapshot: "நேரடி நிலை",
        mostReferencedPestCrop: "அதிகம் குறிப்பிடப்பட்ட பூச்சி பயிர்",
        leadingSoilType: "முதன்மையான மண் வகை",
        resultsMatchingFilter: "பொருத்தமான முடிவுகள்",
        dataHealthScore: "தரவு ஆரோக்கிய மதிப்பெண்",
        lastRefreshed: "கடைசியாக புதுப்பிக்கப்பட்டது",
        refreshData: "தரவைப் புதுப்பிக்கவும்",
        exportExcel: "எக்செல் ஆக ஏற்றுமதி செய்",
        exportPDF: "PDF ஆக ஏற்றுமதி செய்",
        exportSummary: "சுருக்கமான PDF ஆக ஏற்றுமதி செய்",
        pestAnalytics: "பூச்சி பகுப்பாய்வு",
        threatsByCrop: "பயிர் வாரியான பூச்சி அச்சுறுத்தல்கள்",
        soilInsights: "மண் பற்றிய நுண்ணறிவு",
        cropSoilMix: "பயிர் மண் வகை கலவை",
        seasonalInsight: "பருவகால நுண்ணறிவு",
        cropDistributionBySeason: "பருவ வாரியான பயிர் விநியோகம்",
        quickPreview: "விரைவான முன்னோட்டம்",
        selectedRecord: "தேர்ந்தெடுக்கப்பட்ட பதிவு",
        exportHistory: "ஏற்றுமதி வரலாறு",
        recentActivity: "சமீபத்திய செயல்பாடு",
        reportGuide: "அறிக்கை வழிகாட்டி",
        useReportsDriveDecisions: "சிறந்த முடிவுகளை எடுக்க அறிக்கைகளைப் பயன்படுத்தவும்",
        pestName: "பூச்சியின் பெயர்",
        cropAffected: "பாதிக்கப்பட்ட பயிர்",
        symptoms: "அறிகுறிகள்",
        organic: "இயற்கை முறை",
        chemical: "ரசாயன முறை",
        metric: "அளவீடு",
        value: "மதிப்பு"
      }
    };
    return coreTranslations[language][key] || coreTranslations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleTo }}>
      {children}
    </LanguageContext.Provider>
  );
};
