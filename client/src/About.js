import React, { useEffect, useState } from "react";
import { 
  HiOutlineSparkles, 
  HiOutlineLightBulb, 
  HiOutlineTrendingUp, 
  HiOutlineGlobe, 
  HiOutlineShieldCheck,
  HiOutlineSupport,
  HiOutlineCloud,
  HiOutlineBeaker,
  HiOutlineChartBar,
  HiOutlineSearch,
  HiOutlineDatabase,
  HiOutlineChip
} from "react-icons/hi";

function About() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    // Generate random particles for the wow effect
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="about-page wow-container">
      {/* Background Particles */}
      <div className="floating-particles">
        {particles.map(p => (
          <span 
            key={p.id} 
            className="particle" 
            style={{ left: p.left, animationDuration: p.animationDuration, animationDelay: p.animationDelay }}
          ></span>
        ))}
      </div>

      {/* Hero Section */}
      <section className="about-hero animate-fade">
        <div className="about-hero-content">
          <span className="hero-badge animate-float glass-premium">
            <HiOutlineSparkles /> The Future of Farming
          </span>
          <h1>AgriIntel.Ai:<br/><span style={{ color: "var(--primary)"}}>Intelligence for Every Acre</span></h1>
          <p>
            Bridging the gap between traditional agricultural wisdom and 
            cutting-edge Artificial Intelligence to empower farmers with data-driven 
            decisions that drive productivity and sustainability.
          </p>
        </div>
        <div className="about-hero-visual tilt-card">
          <div className="visual-circle circle-1"></div>
          <div className="visual-circle circle-2"></div>
          <div className="visual-icon animate-pulse-glow glass-premium">
            <HiOutlineGlobe size={80} color="var(--primary-dark)" />
          </div>
        </div>
      </section>

      {/* Feature Infographic Section */}
      <section className="about-features">
        <div className="section-header">
          <span className="small-title">Our Ecosystem</span>
          <h2>A Comprehensive Digital Agriculture Suite</h2>
        </div>
        <div className="feature-infographic">
          <div className="infographic-card card-premium tilt-card glass-premium fade-up">
            <div className="card-icon emerald">
              <HiOutlineCloud size={32} />
            </div>
            <h3>Smart Weather</h3>
            <p>Real-time localized forecasting integrated with crop-specific advisory models.</p>
          </div>
          <div className="infographic-card card-premium tilt-card glass-premium fade-up delay-1">
            <div className="card-icon amber">
              <HiOutlineBeaker size={32} />
            </div>
            <h3>AI Soil Analysis</h3>
            <p>Precision nutrient tracking and custom fertilizer recommendations for optimal yield.</p>
          </div>
          <div className="infographic-card card-premium tilt-card glass-premium fade-up delay-2">
            <div className="card-icon blue">
              <HiOutlineSearch size={32} />
            </div>
            <h3>Pest Detection</h3>
            <p>Computer vision algorithms that identify threats before they spread through your fields.</p>
          </div>
          <div className="infographic-card card-premium tilt-card glass-premium fade-up delay-3">
            <div className="card-icon indigo">
              <HiOutlineChartBar size={32} />
            </div>
            <h3>Market Intelligence</h3>
            <p>Predictive analytics for market prices to help you choose the best time to trade.</p>
          </div>
        </div>
      </section>

      {/* WOW Data Pipeline Section */}
      <section className="about-pipeline fade-up">
        <div className="section-header">
          <span className="small-title">Intelligence Flow</span>
          <h2>The AgriIntel Architecture</h2>
        </div>
        
        <div className="pipeline-container">
          {/* Inputs */}
          <div className="pipeline-column">
            <div className="pipeline-card tilt-card glass-premium">
              <div className="icon-wrapper"><HiOutlineCloud size={28} /></div>
              <div className="card-info">
                <h4>Climate Data</h4>
                <p>Real-time weather APIs & sensors</p>
              </div>
            </div>
            <div className="pipeline-card tilt-card glass-premium">
              <div className="icon-wrapper"><HiOutlineBeaker size={28} /></div>
              <div className="card-info">
                <h4>Soil Health</h4>
                <p>IoT moisture & nutrient tracking</p>
              </div>
            </div>
          </div>

          {/* Flow Arrow */}
          <div className="pipeline-flow">
            <div className="flow-dots"></div>
          </div>

          {/* Center AI Engine */}
          <div className="pipeline-center node-pulse tilt-card">
            <div className="engine-core">
              <HiOutlineChip size={64} color="var(--primary-light)" />
              <h3>AI ENGINE</h3>
              <p>Deep Learning Models</p>
            </div>
            <div className="orbit-ring"></div>
            <div className="orbit-ring delay"></div>
          </div>

          {/* Flow Arrow */}
          <div className="pipeline-flow">
            <div className="flow-dots"></div>
          </div>

          {/* Outputs */}
          <div className="pipeline-column">
            <div className="pipeline-card tilt-card glass-premium">
              <div className="icon-wrapper output"><HiOutlineLightBulb size={28} /></div>
              <div className="card-info">
                <h4>Smart Insights</h4>
                <p>Actionable farming advice</p>
              </div>
            </div>
            <div className="pipeline-card tilt-card glass-premium">
              <div className="icon-wrapper output"><HiOutlineTrendingUp size={28} /></div>
              <div className="card-info">
                <h4>Market Trends</h4>
                <p>Predictive pricing & demand</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Full-width WOW Banner */}
      <section className="infographic-banner fade-up">
        <h2>Cultivating a Greener, Smarter World</h2>
        <p>Join thousands of farmers who are transforming their agricultural practices with our certified, enterprise-grade AI intelligence platform.</p>
        <button className="btn-premium btn-primary" style={{ marginTop: 30, padding: "16px 32px", fontSize: "1.1rem" }}>Join the Network</button>
      </section>

      {/* Storytelling Journey Section */}
      <section className="about-story fade-up">
        <div className="story-layout">
          <div className="story-content">
            <span className="small-title">Our Vision</span>
            <h2>The Three Pillars of Modern Farming</h2>
            
            <div style={{ marginTop: 40 }}>
              <div className="journey-step tilt-card">
                <div className="story-number">01</div>
                <div className="story-text">
                  <h3>Empowerment</h3>
                  <p>Putting advanced tools in the hands of small and large scale farmers alike, democratizing access to agronomic data.</p>
                </div>
              </div>
              <div className="journey-step tilt-card">
                <div className="story-number">02</div>
                <div className="story-text">
                  <h3>Sustainability</h3>
                  <p>Reducing input waste and optimizing resources through precision agriculture, protecting our planet's future.</p>
                </div>
              </div>
              <div className="journey-step tilt-card" style={{ borderLeftColor: "transparent" }}>
                <div className="story-number">03</div>
                <div className="story-text">
                  <h3>Resilience</h3>
                  <p>Building agricultural systems that can adapt to changing climatic patterns and unpredictable market fluctuations.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="story-banner card-premium tilt-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--slate-900)' }}>
            <div className="banner-content" style={{ padding: 40 }}>
              <HiOutlineShieldCheck size={64} color="var(--primary-light)" style={{ marginBottom: 20 }} />
              <h3 style={{ fontSize: "2rem", color: "white", marginBottom: 16 }}>Certified Security</h3>
              <p style={{ color: "var(--slate-400)", fontSize: "1.1rem", lineHeight: 1.6 }}>Your farm data is your most valuable asset. It is fully encrypted and protected with enterprise-grade security protocols. We never sell your data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Info / Vision */}
      <footer className="about-footer" style={{ textAlign: "center", padding: "60px 0", color: "var(--slate-500)" }}>
        <div className="footer-visual tilt-card">
          <HiOutlineSupport size={60} color="var(--primary)" style={{ marginBottom: 16 }} />
          <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>Always here for your growth.</p>
        </div>
      </footer>
    </div>
  );
}

export default About;
