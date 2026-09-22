import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "./LanguageContext";
import {
  HiOutlineBell,
  HiOutlineSparkles,
  HiOutlineCloud,
  HiOutlineTrendingUp,
  HiOutlineDocumentReport,
  HiOutlineChartBar,
  HiOutlineArrowRightCircle,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineClipboardList
} from "react-icons/hi";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

function MetricCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ backgroundColor: accent }}>
        <Icon size={22} />
      </div>
      <div>
        <h4>{label}</h4>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, onClick }) {
  return (
    <div className="action-card" onClick={onClick}>
      <span>
        <Icon size={20} />
      </span>
      <div>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalFarmers: 0, totalCrops: 0, farmersByLocation: {}, cropsBySeason: {} });
  const [loading, setLoading] = useState(true);

  const marketData = [
    { date: "Apr 20", price: 21.8 },
    { date: "Apr 22", price: 22.3 },
    { date: "Apr 24", price: 22.1 },
    { date: "Apr 26", price: 22.9 },
    { date: "Apr 28", price: 23.4 },
    { date: "Apr 30", price: 23.1 }
  ];

  const actions = [
    { icon: HiOutlineSparkles, title: "Get crop advice", desc: "Find the best crop for your soil and season.", onClick: () => navigate('/dashboard') },
    { icon: HiOutlineCloud, title: "Check weather", desc: "View the latest local forecast and alerts.", onClick: () => navigate('/weather') },
    { icon: HiOutlineDocumentReport, title: "Generate report", desc: "Download farm performance reports.", onClick: () => navigate('/reports') },
    { icon: HiOutlineShieldCheck, title: "Detect pests", desc: "Upload a photo or describe symptoms.", onClick: () => navigate('/pest') }
  ];

  const alerts = [
    { title: "Heavy rain incoming", desc: "Secure stored harvest and plan irrigation accordingly." },
    { title: "Pest risk increased", desc: "Monitor maize fields for early pest activity." },
    { title: "Market price rising", desc: "Local corn price expected to improve by 5%." }
  ];

  const recentActivity = [
    { title: "Soil test added", desc: "Updated soil texture and moisture status." },
    { title: "Crop plan created", desc: "Maize sowing recommendation completed." },
    { title: "Pest alert issued", desc: "Potential blast disease detected in nearby region." }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmersRes, cropsRes] = await Promise.all([
          fetch("http://localhost:5000/api/farmers"),
          fetch("http://localhost:5000/api/crops")
        ]);
        const farmers = await farmersRes.json();
        const crops = await cropsRes.json();

        const locationCount = {};
        farmers.forEach((farmer) => {
          const loc = farmer.location || "Unknown";
          locationCount[loc] = (locationCount[loc] || 0) + 1;
        });

        const seasonCount = {};
        crops.forEach((crop) => {
          const season = crop.season || "Unknown";
          seasonCount[season] = (seasonCount[season] || 0) + 1;
        });

        setStats({
          totalFarmers: farmers.length,
          totalCrops: crops.length,
          farmersByLocation: locationCount,
          cropsBySeason: seasonCount
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <div className="card-premium" style={{ padding: 28, borderRadius: 22, boxShadow: "var(--shadow-lg)" }}>
          Loading dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="page-dashboard animate-fade" style={{ paddingBottom: 40 }}>
      <div className="dashboard-alert-banner">
        <HiOutlineBell size={28} />
        <div>
          <strong>Action recommended:</strong> Heavy rain is expected tomorrow in your area. Review irrigation and crop protection plans.
        </div>
      </div>

      <div className="dashboard-top-grid">
        <MetricCard icon={HiOutlineClipboardList} label="Farmers onboarded" value={stats.totalFarmers || "--"} accent="rgba(16, 185, 129, 0.18)" />
        <MetricCard icon={HiOutlineChartBar} label="Crop entries" value={stats.totalCrops || "--"} accent="rgba(249, 115, 22, 0.18)" />
        <MetricCard icon={HiOutlineTrendingUp} label="Crop categories" value={Object.keys(stats.cropsBySeason || {}).length || "--"} accent="rgba(14, 165, 233, 0.18)" />
        <MetricCard icon={HiOutlineLightningBolt} label="Alerts active" value="3" accent="rgba(245, 158, 11, 0.18)" />
      </div>

      <div className="dashboard-main-grid">
        <div className="card-premium dashboard-main-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <span style={{ fontSize: "0.85rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--slate-500)", fontWeight: 700 }}>
                Smart Advisory
              </span>
              <h2 style={{ margin: "12px 0 0", fontSize: "2rem" }}>Personalized crop guidance for your farm.</h2>
              <p style={{ color: "var(--slate-600)", maxWidth: 620, marginTop: 16 }}>
                Review the latest recommendations, risk alerts and market context from a single dashboard designed for fast farm decisions.
              </p>
            </div>
            <div style={{ minWidth: 220, background: "var(--slate-50)", padding: 20, borderRadius: 20, border: "1px solid var(--border)" }}>
              <div style={{ color: "var(--slate-500)", fontSize: "0.9rem", marginBottom: 10 }}>Next advisory</div>
              <strong style={{ display: "block", fontSize: "1.4rem", marginBottom: 10 }}>Irrigate today</strong>
              <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.75 }}>Rain is forecast for tomorrow — prepare the field and apply post-emergence protection.</p>
            </div>
          </div>

          <div className="insight-grid" style={{ marginTop: 28 }}>
            <div className="card-premium" style={{ padding: 22 }}>
              <span style={{ display: "block", marginBottom: 10, color: "var(--slate-500)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Crop suitability</span>
              <strong style={{ display: "block", fontSize: "1.4rem", marginBottom: 10 }}>Maize, Cotton, Groundnut</strong>
              <p style={{ margin: 0, color: "var(--slate-600)" }}>Recommended based on soil type and the upcoming season.</p>
            </div>
            <div className="card-premium" style={{ padding: 22 }}>
              <span style={{ display: "block", marginBottom: 10, color: "var(--slate-500)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pest risk</span>
              <strong style={{ display: "block", fontSize: "1.4rem", marginBottom: 10 }}>Moderate</strong>
              <p style={{ margin: 0, color: "var(--slate-600)" }}>Nearby reports show early pest activity. Inspect crops carefully today.</p>
            </div>
            <div className="card-premium" style={{ padding: 22 }}>
              <span style={{ display: "block", marginBottom: 10, color: "var(--slate-500)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>Market outlook</span>
              <strong style={{ display: "block", fontSize: "1.4rem", marginBottom: 10 }}>Corn +4%</strong>
              <p style={{ margin: 0, color: "var(--slate-600)" }}>Local price momentum is positive for the coming week.</p>
            </div>
          </div>

          <div className="chart-card" style={{ marginTop: 20 }}>
            <h3>Local maize price trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={marketData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: "var(--slate-500)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`₹${value}`, "Price"]} />
                <Area type="monotone" dataKey="price" stroke="#10b981" fillOpacity={1} fill="url(#priceGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <aside className="dashboard-side-panel">
          <div className="card-premium">
            <h3 style={{ marginTop: 0 }}>Quick actions</h3>
            <div className="quick-action-grid" style={{ marginTop: 18 }}>
              {actions.map((item) => (
                <ActionCard key={item.title} icon={item.icon} title={item.title} desc={item.desc} onClick={item.onClick} />
              ))}
            </div>
          </div>

          <div className="card-premium">
            <h3 style={{ marginTop: 0 }}>Recent alerts</h3>
            <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
              {alerts.map((alert) => (
                <div key={alert.title} className="alert-item">
                  <span>!</span>
                  <div>
                    <strong>{alert.title}</strong>
                    <p style={{ margin: 0, color: "var(--slate-600)" }}>{alert.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium">
            <h3 style={{ marginTop: 0 }}>Recent activity</h3>
            <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
              {recentActivity.map((item) => (
                <div key={item.title} className="activity-item">
                  <span>›</span>
                  <div>
                    <strong>{item.title}</strong>
                    <p style={{ margin: 0, color: "var(--slate-600)" }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
