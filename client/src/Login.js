import React, { useState } from "react";
import axios from "axios";
import { useLanguage } from "./LanguageContext";
import { useNotification } from "./context/NotificationContext";
import LanguageToggle from "./LanguageToggle";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlineMap, HiOutlineScale, HiOutlineGlobeAlt } from "react-icons/hi";

function Login({ onLogin }) {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    soilType: "",
    landSize: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isLogin 
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

      const res = await axios.post(url, formData);
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      showNotification(
        isLogin ? "Welcome back! Login successful." : "Account created successfully! Welcome to AgriIntel.Ai.",
        "success"
      );

      onLogin(res.data.token, res.data.user);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Invalid credentials. Please try again.";
      showNotification(errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "white" }}>
      {/* Left Side - Hero Image */}
      <div style={{
        flex: 1,
        backgroundImage: `linear-gradient(rgba(6, 95, 70, 0.4), rgba(6, 95, 70, 0.4)), url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px",
        color: "white"
      }} className="login-hero">
        <div style={{ maxWidth: "500px" }}>
          <div style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.2)", 
            backdropFilter: "blur(8px)", 
            padding: "8px 16px", 
            borderRadius: "20px", 
            width: "fit-content",
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "20px"
          }}>
            State-of-the-art Agriculture
          </div>
          <h1 style={{ fontSize: "3.5rem", lineHeight: "1.1", marginBottom: "24px" }}>
            Revolutionizing Farm Advisory for the Modern World.
          </h1>
          <p style={{ fontSize: "1.25rem", opacity: 0.9 }}>
            Empowering Indian farmers with data-driven insights and AI-powered recommendations for better yields.
          </p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div style={{
        width: "550px",
        padding: "60px 80px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "white"
      }}>
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
            <div style={{ display: "flex", alignItems: "center" }} className="notranslate">
              <span style={{ fontWeight: "800", color: "var(--slate-900)", fontSize: "20px" }}>AgriIntel.Ai</span>
            </div>
            <LanguageToggle />
          </div>
          
          <h2 style={{ fontSize: "2rem", color: "var(--slate-900)", marginBottom: "8px" }} className="notranslate">
            {isLogin ? t("login") : t("register")}
          </h2>
          <p style={{ color: "var(--text-muted)" }}>
            {isLogin ? "Please enter your details to sign in." : "Enter your farm details to get started."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <label className="input-label notranslate">{t("name")}</label>
                <div className="input-wrapper">
                  <HiOutlineUser className="input-icon" />
                  <input name="name" placeholder="John Doe" onChange={handleChange} required />
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div className="input-group">
                  <label className="input-label notranslate">{t("location")}</label>
                  <div className="input-wrapper">
                    <HiOutlineMap className="input-icon" />
                    <input name="location" placeholder="Salem" onChange={handleChange} required />
                  </div>
                </div>
                <div className="input-group">
                  <label className="input-label notranslate">{t("soilType")}</label>
                  <div className="input-wrapper">
                    <HiOutlineGlobeAlt className="input-icon" />
                    <select name="soilType" onChange={handleChange} required>
                      <option value="">Select...</option>
                      <option value="Clay">Clay</option>
                      <option value="Sandy">Sandy</option>
                      <option value="Loamy">Loamy</option>
                      <option value="Black">Black</option>
                      <option value="Red">Red</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label notranslate">{t("landSize")}</label>
                <div className="input-wrapper">
                  <HiOutlineScale className="input-icon" />
                  <input name="landSize" type="number" placeholder="2.5" onChange={handleChange} required />
                </div>
              </div>
            </>
          )}

          <div className="input-group">
            <label className="input-label notranslate">{t("email")}</label>
            <div className="input-wrapper">
              <HiOutlineMail className="input-icon" />
              <input name="email" type="email" placeholder="farmer@example.com" onChange={handleChange} required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label notranslate">{t("password")}</label>
            <div className="input-wrapper">
              <HiOutlineLockClosed className="input-icon" />
              <input name="password" type="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-premium btn-primary notranslate" 
            style={{ width: "100%", height: "48px", marginTop: "16px" }}
          >
            {loading ? "Processing..." : (isLogin ? t("login") : t("register"))}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px", paddingTop: "32px", borderTop: "1px solid var(--border)" }}>
          <span style={{ color: "var(--text-muted)", fontSize: "14px" }}>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
          </span>
          <button 
            onClick={() => setIsLogin(!isLogin)} 
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--primary)", 
              fontWeight: "700", 
              cursor: "pointer", 
              marginLeft: "8px",
              fontSize: "14px"
            }}
          >
            {isLogin ? "Register Now" : "Sign In Instead"}
          </button>
        </div>
      </div>

      <style>{`
        .input-group { margin-bottom: 20px; }
        .input-label { display: block; font-size: 13px; font-weight: 700; color: var(--slate-700); margin-bottom: 8px; }
        .input-wrapper { position: relative; }
        .input-icon { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: var(--slate-400); }
        .input-wrapper input, .input-wrapper select { padding-left: 48px; }
        @media (max-width: 1024px) {
          .login-hero { display: none !important; }
          div { width: 100% !important; padding: 40px !important; }
        }
      `}</style>
    </div>
  );
}

export default Login;
