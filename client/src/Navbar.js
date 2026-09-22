import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import { useNotification } from "./context/NotificationContext";
import LanguageToggle from "./LanguageToggle";

function Navbar({ user, setToken, setUser }) {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    showNotification("Logged out successfully. See you soon!", "info");
    navigate("/");
  };

  return (
    <nav style={{
      backgroundColor: "#1976d2",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "white",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      position: "sticky",
      top: 0,
      zIndex: 1000
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
        <Link to="/" style={{
          color: "white",
          textDecoration: "none",
          fontSize: "20px",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <span style={{ letterSpacing: "1px" }}>AgriIntel.Ai</span>
        </Link>
        <div style={{ display: "flex", gap: "20px" }}>
          <Link to="/dashboard" style={linkStyle}>{t("farmerDashboard")}</Link>
          <Link to="/weather" style={linkStyle}>{t("weatherTitle")}</Link>
          <Link to="/market" style={linkStyle}>{t("marketTitle")}</Link>
          <Link to="/pest" style={linkStyle}>{t("pestTitle")}</Link>
          <Link to="/reports" style={linkStyle}>{t("exportReports")}</Link>
          {user?.role === "admin" && (
            <Link to="/admin" style={{ ...linkStyle, color: "#ffeb3b" }}>{t("adminPanel")}</Link>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: "12px", opacity: 0.8, display: "block" }}>{t("welcome")}</span>
          <span style={{ fontSize: "14px", fontWeight: "bold" }}>{user?.name}</span>
        </div>
        <LanguageToggle />
        <button onClick={handleLogout} style={{
          backgroundColor: "#f44336",
          color: "white",
          border: "none",
          padding: "8px 18px",
          borderRadius: "5px",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px"
        }}>
          {t("logout")}
        </button>
      </div>
    </nav>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "15px",
  fontWeight: "500",
  opacity: 0.9,
  transition: "opacity 0.2s"
};

export default Navbar;
