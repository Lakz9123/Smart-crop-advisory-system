import React from "react";
import { useTheme } from "../context/ThemeContext";

function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <button
      onClick={toggleDarkMode}
      style={{
        padding: "8px 16px",
        backgroundColor: darkMode ? "#f39c12" : "#2c3e50",
        color: "white",
        border: "none",
        borderRadius: "20px",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "bold",
        transition: "all 0.3s ease"
      }}
    >
      {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </button>
  );
}

export default DarkModeToggle;