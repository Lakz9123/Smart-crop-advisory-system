import React, { useState, useEffect } from "react";
import { useLanguage } from "../LanguageContext";

function LiveClock() {
  const [time, setTime] = useState(new Date());
  const { language } = useLanguage();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  };
  
  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  return (
    <div style={{
      textAlign: "center",
      padding: "8px 15px",
      backgroundColor: "rgba(0,0,0,0.05)",
      borderRadius: "20px",
      display: "inline-block"
    }}>
      <span style={{ fontSize: "14px", fontWeight: "bold" }}>
        {time.toLocaleTimeString(language === "ta" ? "ta-IN" : "en-IN", timeOptions)}
      </span>
      <span style={{ fontSize: "12px", opacity: 0.7, marginLeft: "8px" }}>
        {time.toLocaleDateString(language === "ta" ? "ta-IN" : "en-IN", dateOptions)}
      </span>
    </div>
  );
}

export default LiveClock;