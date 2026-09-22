import React from "react";
import { useLanguage } from "./LanguageContext";

function LanguageToggle() {
  const { language, toggleTo } = useLanguage();

  return (
    <div style={{
      display: "inline-flex",
      backgroundColor: "var(--slate-100)",
      padding: "4px",
      borderRadius: "12px",
      border: "1px solid var(--border)",
      gap: "4px"
    }} className="notranslate">
      <button
        onClick={() => toggleTo("en")}
        style={{
          padding: "6px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "700",
          backgroundColor: language === "en" ? "white" : "transparent",
          color: language === "en" ? "var(--primary)" : "var(--slate-500)",
          boxShadow: language === "en" ? "var(--shadow-sm)" : "none",
          transition: "var(--transition)"
        }}
      >
        English
      </button>
      <button
        onClick={() => toggleTo("ta")}
        style={{
          padding: "6px 16px",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "700",
          backgroundColor: language === "ta" ? "white" : "transparent",
          color: language === "ta" ? "var(--primary)" : "var(--slate-500)",
          boxShadow: language === "ta" ? "var(--shadow-sm)" : "none",
          transition: "var(--transition)"
        }}
      >
        தமிழ்
      </button>
    </div>
  );
}

export default LanguageToggle;