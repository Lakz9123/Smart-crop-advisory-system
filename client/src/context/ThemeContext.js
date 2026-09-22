import React, { createContext, useState, useContext, useEffect } from "react";

// Create Context
const ThemeContext = createContext();

// Custom hook to use theme
export const useTheme = () => useContext(ThemeContext);

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  // Get saved theme from localStorage, default to false (light mode)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved === "true";
  });

  // Save to localStorage when theme changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  // Toggle function
  const toggleDarkMode = () => setDarkMode(prev => !prev);

  // Theme colors based on mode
  const theme = darkMode ? {
    background: "#121212",
    surface: "#1e1e1e",
    text: "#ffffff",
    textSecondary: "#aaaaaa",
    border: "#333333",
    cardBg: "#2d2d2d",
    primary: "#3a6ea5"
  } : {
    background: "#f5f5f5",
    surface: "#ffffff",
    text: "#333333",
    textSecondary: "#666666",
    border: "#e0e0e0",
    cardBg: "#ffffff",
    primary: "#4CAF50"
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};