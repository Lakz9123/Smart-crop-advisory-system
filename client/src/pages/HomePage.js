import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../LanguageContext";
import {
  HiOutlineArrowRight,
  HiOutlineSparkles,
  HiOutlineCloud,
  HiOutlineShieldCheck,
  HiOutlineTrendingUp,
  HiOutlineLibrary,
  HiOutlineCheckCircle,
  HiOutlineGlobe,
  HiOutlineUserGroup,
  HiOutlineChartBar,
  HiOutlineBadgeCheck,
  HiOutlinePlay,
  HiOutlineQuestionMarkCircle,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineCash,
  HiOutlineBeaker,
  HiOutlineLogout
} from "react-icons/hi";

function FeatureCard({ icon: Icon, title, desc, color, delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimeout(() => setIsVisible(true), delay);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <button
      ref={ref}
      type="button"
      className={`card-premium feature-card-interactive ${expanded ? "is-expanded" : ""}`}
      onClick={() => setExpanded((current) => !current)}
      style={{
        transform: isVisible ? "translateY(0)" : "translateY(20px)",
        opacity: isVisible ? 1 : 0,
        transition: "all 0.6s ease-out",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        minHeight: 220,
        textAlign: "left"
      }}
    >
      <div style={{ width: 56, height: 56, borderRadius: 18, backgroundColor: `${color}15`, display: "grid", placeItems: "center", color, fontSize: 24 }}>
        <Icon size={26} />
      </div>
      <div style={{ flex: 1 }}>
        <h3 style={{ margin: 0, fontSize: "1.2rem", color: "var(--slate-900)" }}>{title}</h3>
        <p style={{ marginTop: 12, color: "var(--slate-600)", lineHeight: 1.7, margin: "12px 0 0" }}>{desc}</p>
      </div>
      <span className="feature-card-cue">{expanded ? "Hide details" : "Tap to expand"}</span>
    </button>
  );
}

function TrustBadge({ icon: Icon, title, desc }) {
  return (
    <div className="trust-badge-interactive" style={{ display: "flex", alignItems: "center", gap: 12, padding: 20, borderRadius: 16, background: "white", border: "1px solid var(--border)", boxShadow: "var(--shadow-sm)" }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "var(--primary)", display: "grid", placeItems: "center", color: "white" }}>
        <Icon size={22} />
      </div>
      <div>
        <div style={{ fontWeight: 700, color: "var(--slate-900)", fontSize: "1rem" }}>{title}</div>
        <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", marginTop: 2 }}>{desc}</div>
      </div>
    </div>
  );
}

function StepCard({ number, title, desc }) {
  return (
    <div className="card-premium step-card-interactive" style={{ textAlign: "center", padding: 40 }}>
      <div className="step-orb" style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--slate-100)", display: "grid", placeItems: "center", margin: "0 auto 24px", color: "var(--primary)", border: "2px solid white", boxShadow: "var(--shadow-md)" }}>
        <span style={{ fontSize: "1.75rem", fontWeight: 800 }}>{number}</span>
      </div>
      <h3 style={{ marginBottom: 16, fontSize: "1.3rem" }}>{title}</h3>
      <p style={{ color: "var(--slate-600)", lineHeight: 1.6 }}>{desc}</p>
    </div>
  );
}

function FAQItem({ question, answer, open, onToggle }) {
  return (
    <div className={`card-premium faq-item ${open ? "is-open" : ""}`} style={{ padding: 0, overflow: "hidden" }}>
      <button 
        type="button" 
        className="faq-question" 
        onClick={onToggle}
        style={{ 
          width: "100%", 
          padding: 24, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between",
          background: "none",
          border: "none",
          textAlign: "left",
          cursor: "pointer",
          fontWeight: 600,
          color: open ? "var(--primary)" : "var(--slate-800)",
          transition: "var(--transition)"
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <HiOutlineQuestionMarkCircle size={24} color={open ? "var(--primary)" : "var(--slate-400)"} />
          {question}
        </span>
        <span className="faq-toggle" style={{ fontSize: "1.5rem", color: "var(--slate-300)" }}>{open ? "−" : "+"}</span>
      </button>
      <div className="faq-answer" style={{ 
        maxHeight: open ? "200px" : "0", 
        padding: open ? "0 24px 24px 60px" : "0 24px", 
        overflow: "hidden", 
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        opacity: open ? 1 : 0
      }}>
        <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.7 }}>{answer}</p>
      </div>
    </div>
  );
}

function InteractiveDemo() {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const videoRef = useRef(null);

  const isTamil = language === "ta";
  const videoSource = isTamil ? "/Video for agricultural farmers-ta.mp4" : "/Video for agricultural farmers.mp4";

  const handlePlay = () => {
    setIsPlaying(true);
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleVideoError = () => {
    if (isTamil && !fallbackUsed && videoRef.current) {
      setFallbackUsed(true);
      videoRef.current.src = "/Video for agricultural farmers.mp4";
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  return (
    <div className="card-premium" style={{ padding: 0, overflow: "hidden", position: "relative", border: "none", boxShadow: "var(--shadow-premium)" }}>
      <div style={{ padding: "40px 40px 80px", background: "linear-gradient(135deg, var(--primary-dark), var(--primary))", color: "white" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "grid", placeItems: "center" }}>
            <HiOutlinePlay size={18} />
          </div>
          <span style={{ fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>Interactive Preview</span>
        </div>
        <h3 style={{ margin: 0, fontSize: "2rem", marginBottom: 16, fontWeight: 800 }}>{isTamil ? "எதிர்கால விவசாய வழிகாட்டல்" : "Future-ready farm guidance"}</h3>
        <p style={{ margin: 0, opacity: 0.9, fontSize: "1.1rem", maxWidth: "600px", lineHeight: 1.6 }}>
          {isTamil
            ? "தமிழ் மொழி திறன் செயல்படுத்தப்பட்டுள்ளது. எதிர்கால விவசாயத் தீர்வுகளுக்காக நம்பிக்கையுடன் தயார்." 
            : "Preview the platform experience now, with Tamil video ready when selected."}
        </p>
      </div>
      <div style={{ marginTop: "-40px", padding: "0 40px 40px" }}>
        <div style={{ minHeight: 480, background: "white", borderRadius: 24, overflow: "hidden", position: "relative", boxShadow: "0 30px 60px -12px rgba(0,0,0,0.15)", border: "1px solid var(--border)" }}>
          {!isPlaying ? (
            <div style={{ height: "100%", position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", background: "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1200') center/cover" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}></div>
              <div style={{ position: "relative", zIndex: 1 }}>
                <button
                  onClick={handlePlay}
                  style={{
                    width: 96,
                    height: 96,
                    borderRadius: "50%",
                    background: "var(--primary)",
                    border: "8px solid rgba(255,255,255,0.2)",
                    display: "grid",
                    placeItems: "center",
                    color: "white",
                    cursor: "pointer",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                    marginBottom: 24,
                    transition: "var(--transition)"
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                >
                  <HiOutlinePlay size={40} />
                </button>
                <p style={{ color: "white", margin: 0, fontWeight: 700, fontSize: "1.2rem", textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}>
                  {isTamil ? "தமிழ் காணொளி தொடங்க" : "Play the demo video"}
                </p>
              </div>
            </div>
          ) : (
            <div style={{ height: "100%", position: "relative", background: "black" }}>
              <video
                ref={videoRef}
                width="100%"
                height="100%"
                controls
                style={{ objectFit: "contain", minHeight: 480 }}
                onEnded={() => setIsPlaying(false)}
                onError={handleVideoError}
                autoPlay
              >
                <source src={videoSource} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <button
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: 20,
                  right: 20,
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(0,0,0,0.5)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "20px",
                  zIndex: 10
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HomePage({ onLogout }) {
  const navigate = useNavigate();
  const [activeHeroStat, setActiveHeroStat] = useState("Crop stage");
  const [openFaq, setOpenFaq] = useState(0);

  const handleLogout = () => {
    localStorage.clear();
    if (onLogout) onLogout();
    navigate("/");
  };

  const features = [
    { icon: HiOutlineCloud, title: "Weather Intelligence", desc: "Receive localized forecast and actionable irrigation alerts for your region.", color: "var(--primary)", delay: 0 },
    { icon: HiOutlineTrendingUp, title: "Market Signals", desc: "Track local commodity prices and choose the best time to sell your harvest.", color: "var(--secondary)", delay: 100 },
    { icon: HiOutlineShieldCheck, title: "Pest & Disease Guard", desc: "Detect problems early with symptom or image-based pest diagnosis.", color: "var(--primary-dark)", delay: 200 },
    { icon: HiOutlineLibrary, title: "Knowledge Hub", desc: "Access simple farming guides, crop calendars and best practice tips.", color: "var(--slate-700)", delay: 300 },
    { icon: HiOutlineChartBar, title: "Farm Analytics", desc: "Monitor crop performance, yield predictions, and farm health metrics.", color: "#3b82f6", delay: 400 },
    { icon: HiOutlineGlobe, title: "Regional Insights", desc: "Get location-specific advice tailored to your area's climate and soil.", color: "#8b5cf6", delay: 500 }
  ];

  const metrics = [
    { label: "Active Farmers", value: "15K+", color: "var(--primary)" },
    { label: "Crop Varieties", value: "60+", color: "var(--secondary)" },
    { label: "Districts Covered", value: "32", color: "var(--primary-dark)" },
    { label: "Satisfaction", value: "99.9%", color: "var(--primary)" }
  ];

  const trustBadges = [
    { icon: HiOutlineBadgeCheck, title: "Government Certified", desc: "Approved by agricultural authorities" },
    { icon: HiOutlineUserGroup, title: "15,000+ Farmers", desc: "Trusted by farming communities" },
    { icon: HiOutlineShieldCheck, title: "Data Secure", desc: "Your information is protected" },
    { icon: HiOutlineGlobe, title: "Multi-Language", desc: "Available in Tamil & English" }
  ];

  const heroStats = [
    { label: "Crop stage", value: "Vegetative" },
    { label: "Soil texture", value: "Loam" },
    { label: "Next activity", value: "Irrigation due" },
    { label: "Risk level", value: "Moderate" }
  ];

  const faqs = [
    { question: "Is the platform free to use?", answer: "Yes, basic features are free. Premium analytics and advanced recommendations are available with a subscription." },
    { question: "How accurate are the recommendations?", answer: "Our AI is trained on years of agricultural data and local conditions, providing highly accurate, location-specific advice." },
    { question: "Can I use it offline?", answer: "Basic features work offline. Weather and market data require internet connectivity for real-time updates." }
  ];

  return (
    <div className="page-home animate-fade">
      <div className="container-premium">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-copy">
            <span className="hero-badge">AI-Powered Farm Advisory</span>
            <h1>Smarter crop decisions for safer harvests.</h1>
            <p>Transform your farm with a modern advisory platform built for farmers. Get personalized crop advice, weather alerts, pest detection and market insights in one place.</p>
            <div className="hero-actions">
              <button className="btn-premium btn-primary" onClick={() => navigate('/dashboard')}>Start Advisory <HiOutlineArrowRight /></button>
              <button className="btn-premium btn-secondary" onClick={() => navigate('/weather')}>Check Weather</button>
              <button className="btn-premium btn-secondary" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#fca5a5', background: '#fee2e2', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlineLogout size={18} /> Logout
              </button>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 40, paddingTop: 40, borderTop: "1px solid var(--border)" }}>
              {metrics.slice(0, 2).map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--slate-900)" }}>{m.value}</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-panel-wrapper" style={{ position: "relative" }}>
            <div className="card-premium" style={{ padding: 40, boxShadow: "var(--shadow-premium)", border: "none", position: "relative", zIndex: 2 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--primary)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Live Snapshot</span>
                  <h3 style={{ margin: "4px 0 0", fontSize: "1.5rem", fontWeight: 800 }}>Maize Block A12</h3>
                </div>
                <div style={{ padding: "6px 12px", background: "rgba(16, 185, 129, 0.1)", color: "var(--primary)", borderRadius: "100px", fontSize: "0.75rem", fontWeight: 700 }}>Healthy</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
                {heroStats.map((stat) => (
                  <div key={stat.label} style={{ padding: 20, background: "var(--slate-50)", borderRadius: 16, border: "1px solid var(--border)" }}>
                    <div style={{ fontSize: "0.75rem", color: "var(--slate-500)", marginBottom: 4 }}>{stat.label}</div>
                    <div style={{ fontWeight: 700, color: "var(--slate-900)" }}>{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="farm-progress">
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--slate-700)" }}>Crop lifecycle</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>68%</span>
                </div>
                <div style={{ height: 10, background: "var(--slate-100)", borderRadius: 10, overflow: "hidden" }}>
                  <div style={{ width: "68%", height: "100%", background: "var(--primary)", borderRadius: 10 }}></div>
                </div>
                <div style={{ marginTop: 12, fontSize: "0.75rem", color: "var(--slate-500)" }}>Next update: In 2 days</div>
              </div>
            </div>
            {/* Decorative background element */}
            <div style={{ position: "absolute", top: "20%", right: "-10%", width: "120%", height: "80%", background: "var(--primary)", opacity: 0.05, borderRadius: "50%", filter: "blur(60px)", zIndex: 1 }}></div>
          </div>
        </section>

        {/* Features Grid */}
        <section style={{ padding: "100px 0" }}>
          <div className="section-heading" style={{ textAlign: "center", maxWidth: "700px", margin: "0 auto 64px" }}>
            <span className="hero-badge">Our Capabilities</span>
            <h2>Complete farming intelligence</h2>
            <p>From soil analysis to market timing—AgriIntel.Ai provides comprehensive support for every farming decision.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => (
              <FeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        {/* Interactive Demo */}
        <section style={{ padding: "60px 0 100px" }}>
          <InteractiveDemo />
        </section>

        {/* Trust & Stats */}
        <section style={{ padding: "100px 0", background: "var(--slate-50)", margin: "0 calc(-1 * var(--space-xl))", paddingLeft: "var(--space-xl)", paddingRight: "var(--space-xl)" }}>
          <div className="container-premium">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
              <div>
                <div className="section-heading" style={{ textAlign: "left", marginBottom: 40 }}>
                  <span className="hero-badge" style={{ background: "white" }}>Why Trust Us</span>
                  <h2>Built for reliability, powered by local insight</h2>
                  <p>Secure, certified, and built for the real challenges farmers face in the field.</p>
                </div>
                <div style={{ display: "grid", gap: 16 }}>
                  {trustBadges.map((badge) => (
                    <TrustBadge key={badge.title} {...badge} />
                  ))}
                </div>
              </div>
              <div className="card-premium" style={{ padding: 48, background: "white", border: "none", boxShadow: "var(--shadow-premium)" }}>
                <h3 style={{ fontSize: "1.75rem", marginBottom: 24, fontWeight: 800 }}>Trusted by thousands of farmers.</h3>
                <p style={{ color: "var(--slate-600)", lineHeight: 1.7, marginBottom: 40 }}>Our platform combines secure data handling with easy-to-use tools so farmers can trust every recommendation.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div style={{ padding: 24, background: "var(--slate-50)", borderRadius: 20 }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", marginBottom: 4 }}>99.9%</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 600 }}>Satisfaction</div>
                  </div>
                  <div style={{ padding: 24, background: "var(--slate-50)", borderRadius: 20 }}>
                    <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--primary)", marginBottom: 4 }}>24/7</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--slate-500)", fontWeight: 600 }}>Support</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section style={{ padding: "100px 0" }}>
          <div className="section-heading" style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 64px" }}>
            <span className="hero-badge">Onboarding</span>
            <h2>How it works</h2>
            <p>Getting started is simple. Follow these steps to transform your farming with data-driven insights.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }}>
            <StepCard number="1" title="Sign Up" desc="Create your account with basic farm details and location." />
            <StepCard number="2" title="Get Advice" desc="Receive personalized recommendations based on real-time data." />
            <StepCard number="3" title="Monitor" desc="Track progress and implement actions for better results." />
          </div>
        </section>

        {/* FAQ Section */}
        <section style={{ padding: "100px 0", background: "white", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: 80 }}>
            <div>
              <div className="section-heading" style={{ textAlign: "left" }}>
                <span className="hero-badge">FAQ</span>
                <h2>Frequently asked questions</h2>
                <p>Quick answers to common questions about AgriIntel.Ai and how we help farmers.</p>
              </div>
              <button className="btn-premium btn-secondary" style={{ marginTop: 24 }}>Contact Support</button>
            </div>
            <div style={{ display: "grid", gap: 16 }}>
              {faqs.map((faq, index) => (
                <FAQItem key={faq.question} question={faq.question} answer={faq.answer} open={openFaq === index} onToggle={() => setOpenFaq(openFaq === index ? -1 : index)} />
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="cta-section">
          <h2>Ready to transform your farming?</h2>
          <p>Join thousands of farmers who are already making smarter decisions with AgriIntel.Ai. Start your journey to better harvests today.</p>
          <div className="hero-actions" style={{ justifyContent: "center", marginBottom: 0 }}>
            <button className="btn-premium btn-primary" onClick={() => navigate('/dashboard')} style={{ background: "white", color: "var(--primary)" }}>Get Started Free</button>
            <button className="btn-premium btn-secondary" onClick={() => navigate('/weather')} style={{ background: "rgba(255,255,255,0.1)", color: "white", border: "1px solid rgba(255,255,255,0.2)" }}>Explore Features</button>
          </div>
        </section>
      </div>
      <div style={{ height: 100 }}></div>
    </div>
  );
}

export default HomePage;
