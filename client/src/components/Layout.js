import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import LanguageToggle from "../LanguageToggle";
import { 
  HiOutlineHome,
  HiOutlineViewGrid, 
  HiOutlineSparkles,
  HiOutlineCloud, 
  HiOutlineTrendingUp, 
  HiOutlineBeaker, 
  HiOutlineDocumentReport, 
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineInformationCircle
} from "react-icons/hi";

function TopNavItem({ icon: Icon, label, path, active, onClick, asButton }) {
  if (asButton) {
    return (
      <button 
        onClick={onClick}
        className={`top-nav-item ${active ? "active" : ""} notranslate`}
        style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit', outline: 'none' }}
      >
        <Icon className="nav-icon" />
        <span>{label}</span>
      </button>
    );
  }

  return (
    <Link 
      to={path} 
      onClick={onClick}
      className={`top-nav-item ${active ? "active" : ""} notranslate`}
    >
      <Icon className="nav-icon" />
      <span>{label}</span>
    </Link>
  );
}

function Layout({ children, user, onLogout }) {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    onLogout();
    navigate("/");
  };

  const navLinks = [
    { icon: HiOutlineHome, label: t("home"), path: "/" },
    { icon: HiOutlineInformationCircle, label: "About", path: "/about" },
    { icon: HiOutlineUserCircle, label: "Profile", path: "/profile" },
    { icon: HiOutlineViewGrid, label: t("farmerDashboard"), path: "/dashboard" },
    { icon: HiOutlineSparkles, label: "Crop Advice", path: "/crop-advice" },
    { icon: HiOutlineCloud, label: t("weatherTitle"), path: "/weather" },
    { icon: HiOutlineTrendingUp, label: t("marketTitle"), path: "/market" },
    { icon: HiOutlineBeaker, label: t("pestTitle"), path: "/pest" },
    { icon: HiOutlineDocumentReport, label: t("exportReports"), path: "/reports" },
  ];

  if (user?.role === "admin") {
    navLinks.push({ icon: HiOutlineShieldCheck, label: t("adminPanel"), path: "/admin" });
  }

  return (
    <div className="app-layout">
      {/* Top Header / Navigation Bar */}
      <header className={`app-header ${scrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          {/* Left: Brand / Logo */}
          <div className="header-brand">
            <img src="/logo edited.jpeg" alt="AgriIntel Logo" className="logo-image" />
            <span className="logo-text">AgriIntel.Ai</span>
          </div>

          {/* Center: Desktop Navigation */}
          <nav className="desktop-nav">
            {navLinks.map((link) => (
              <TopNavItem 
                key={link.path}
                icon={link.icon}
                label={link.label}
                path={link.path}
                active={location.pathname === link.path}
              />
            ))}
            <TopNavItem 
              icon={HiOutlineLogout}
              label={t("logout")}
              onClick={handleLogout}
              asButton={true}
            />
          </nav>

          {/* Right: Actions */}
          <div className="header-actions">
            <div className="notranslate desktop-only">
              <LanguageToggle />
            </div>

            <div className="user-profile notranslate desktop-only">
              <div className="user-info">
                <div className="user-name">{user?.name}</div>
                <div className="user-role">{user?.role === "admin" ? t("administrator") : t("farmer")}</div>
              </div>
              <div className="user-avatar">
                {user?.name?.charAt(0)}
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <HiOutlineX size={28} /> : <HiOutlineMenu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <div className={`mobile-nav-dropdown ${mobileMenuOpen ? "open" : ""}`}>
          <div className="mobile-nav-user notranslate">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-info">
              <div className="user-name">{user?.name}</div>
              <div className="user-role">{user?.role === "admin" ? t("administrator") : t("farmer")}</div>
            </div>
            <LanguageToggle />
          </div>
          
          <nav className="mobile-nav-links">
            {navLinks.map((link) => (
              <TopNavItem 
                key={link.path}
                icon={link.icon}
                label={link.label}
                path={link.path}
                active={location.pathname === link.path}
                onClick={() => setMobileMenuOpen(false)}
              />
            ))}
            <TopNavItem 
              icon={HiOutlineLogout}
              label={t("logout")}
              onClick={handleLogout}
              asButton={true}
            />
          </nav>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="app-main">
        <div className="page-content">
          <div className="content-container">
            {children}
          </div>
        </div>
      </main>

      {/* Styles */}
      <style>{`
        /* Global Layout */
        .app-layout {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: var(--bg-main);
        }

        /* Top Header */
        .app-header {
          position: sticky;
          top: 0;
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.85); /* Glass effect */
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0,0,0,0.05);
          transition: all 0.3s ease;
        }

        .app-header.scrolled {
          box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.1);
          background-color: rgba(255, 255, 255, 0.95);
        }

        .header-container {
          max-width: 1600px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-xl);
          height: 80px;
        }

        /* Brand */
        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          transition: transform 0.2s ease;
        }
        
        .header-brand:hover {
          transform: scale(1.02);
        }

        .logo-image {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          border: 2px solid white;
          background-color: white;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--slate-900);
        }

        /* Desktop Navigation */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .top-nav-item {
          position: relative;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          text-decoration: none;
          color: var(--slate-500);
          font-weight: 600;
          font-size: 0.95rem;
          transition: all 0.3s ease;
        }

        /* Animated Underline */
        .top-nav-item::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 50%;
          width: 0;
          height: 3px;
          background: var(--primary);
          border-radius: 4px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateX(-50%);
          opacity: 0;
        }

        .top-nav-item:hover {
          color: var(--slate-900);
          transform: translateY(-1px);
        }

        .top-nav-item:hover::after {
          width: 80%;
          opacity: 1;
        }

        .top-nav-item.active {
          color: var(--primary);
        }

        .top-nav-item.active::after {
          width: 100%;
          opacity: 1;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
        }

        .nav-icon {
          font-size: 1.2rem;
          transition: transform 0.2s ease;
        }
        
        .top-nav-item:hover .nav-icon {
          transform: scale(1.1);
        }

        /* Actions */
        .header-actions {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-left: var(--space-lg);
          border-left: 1px solid var(--border);
        }

        .user-info {
          text-align: right;
        }

        .user-name {
          font-size: 14px;
          font-weight: 700;
          color: var(--slate-900);
        }

        .user-role {
          font-size: 12px;
          color: var(--slate-500);
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          background-color: var(--primary-light-bg);
          color: var(--primary);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          border: 1px solid rgba(16, 185, 129, 0.2);
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: var(--slate-700);
          cursor: pointer;
          padding: 4px;
        }

        /* Main Content */
        .app-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .page-content {
          padding: var(--space-xl);
          flex: 1;
        }

        .content-container {
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        /* Mobile Dropdown Menu */
        .mobile-nav-dropdown {
          display: none;
        }

        @media (max-width: 1280px) {
          .desktop-nav { gap: 0px; }
          .top-nav-item { padding: 10px 12px; font-size: 0.9rem; }
          .nav-icon { display: none; } /* Hide icons on medium screens to fit links */
        }

        @media (max-width: 1024px) {
          .desktop-nav, .desktop-only {
            display: none;
          }
          
          .mobile-menu-btn {
            display: block;
          }

          .mobile-nav-dropdown {
            display: block;
            position: absolute;
            top: 80px;
            left: 0;
            width: 100%;
            background: white;
            border-bottom: 1px solid var(--border);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            transform-origin: top;
            transform: scaleY(0);
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .mobile-nav-dropdown.open {
            transform: scaleY(1);
            opacity: 1;
            visibility: visible;
          }

          .mobile-nav-user {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 20px;
            background: var(--slate-50);
            border-bottom: 1px solid var(--border);
          }

          .mobile-nav-user .user-info {
            text-align: left;
            flex: 1;
          }

          .mobile-nav-links {
            padding: 12px;
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .mobile-nav-links .top-nav-item {
            padding: 14px 20px;
            font-size: 1rem;
          }

          .mobile-nav-links .nav-icon {
            display: block;
            margin-right: 8px;
            font-size: 1.4rem;
          }


          .page-content {
            padding: var(--space-md);
          }
        }
      `}</style>
    </div>
  );
}

export default Layout;
