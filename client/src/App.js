import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider, useLanguage } from "./LanguageContext";
import { ThemeProvider } from "./context/ThemeContext";
import { NotificationProvider } from "./context/NotificationContext";
import Login from "./Login";
import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import CropAdvice from "./CropAdvice";
import Weather from "./Weather";
import MarketPrice from "./MarketPrice";
import PestDetection from "./PestDetection";
import ExportReports from "./ExportReports";
import AdminPanel from "./AdminPanel";
import About from "./About";

function AppContent() {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    try {
      return (token && user) ? { token, user: JSON.parse(user) } : null;
    } catch (e) {
      return null;
    }
  });

  if (!auth) {
    return <Login onLogin={(token, user) => setAuth({ token, user })} />;
  }

  return (
    <Layout user={auth.user} onLogout={() => setAuth(null)}>
      <Routes>
        <Route path="/" element={<HomePage onLogout={() => setAuth(null)} />} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<Profile user={auth.user} />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/crop-advice" element={<CropAdvice />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/market" element={<MarketPrice />} />
        <Route path="/pest" element={<PestDetection />} />
        <Route path="/reports" element={<ExportReports />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <NotificationProvider>
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
