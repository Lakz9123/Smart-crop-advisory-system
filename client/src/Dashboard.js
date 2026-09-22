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
  HiOutlineArrowRight,
  HiOutlineShieldCheck,
  HiOutlineLightningBolt,
  HiOutlineClipboardList,
  HiOutlineBeaker,
  HiOutlineCalendar,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineMap,
  HiOutlineScale,
  HiOutlineSun
} from "react-icons/hi";
import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function MetricCard({ icon: Icon, label, value, accent, iconColor }) {
  return (
    <div className="metric-card">
      <div className="metric-icon" style={{ backgroundColor: accent, color: iconColor || "white" }}>
        <Icon size={26} />
      </div>
      <div>
        <h4>{label}</h4>
        <strong>{value}</strong>
      </div>
    </div>
  );
}

function WorkflowStep({ step, title }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 140 }}>
      <span style={{ display: "grid", placeItems: "center", width: 36, height: 36, borderRadius: "50%", background: "var(--primary)", color: "white", fontWeight: 800, fontSize: "0.9rem", boxShadow: "0 4px 10px rgba(5, 150, 105, 0.2)" }}>
        {step}
      </span>
      <strong style={{ fontSize: "0.95rem", color: "var(--slate-800)" }}>{title}</strong>
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, onClick }) {
  return (
    <button type="button" className="action-card" onClick={onClick}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16, 185, 129, 0.1)", display: "grid", placeItems: "center", color: "var(--primary)", flexShrink: 0 }}>
        <Icon size={24} />
      </div>
      <div style={{ flex: 1 }}>
        <h4>{title}</h4>
        <p>{desc}</p>
      </div>
      <HiOutlineArrowRight size={18} style={{ color: "var(--slate-300)" }} />
    </button>
  );
}

function RecommendationTile({ icon: Icon, title, value, detail, accent }) {
  return (
    <div className="recommendation-tile">
      <span className="recommendation-icon" style={{ background: accent }}>
        <Icon size={22} />
      </span>
      <div>
        <h4>{title}</h4>
        <strong>{value}</strong>
        <p>{detail}</p>
      </div>
    </div>
  );
}

function ProgressBar({ label, value, color }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
        <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--slate-600)" }}>{label}</span>
        <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--slate-900)" }}>{value}%</span>
      </div>
      <div style={{ height: 8, background: "var(--slate-100)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ width: `${value}%`, height: "100%", background: color, borderRadius: 8 }}></div>
      </div>
    </div>
  );
}

function Dashboard() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ totalFarmers: 0, totalCrops: 0, farmersByLocation: {}, cropsBySeason: {} });
  const [loading, setLoading] = useState(true);
  const [userName] = useState(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user).name || "Farmer" : "Farmer";
  });

  const marketData = [
    { date: "Apr 20", price: 21.8 }, { date: "Apr 22", price: 22.3 }, { date: "Apr 24", price: 22.1 },
    { date: "Apr 26", price: 22.9 }, { date: "Apr 28", price: 23.4 }, { date: "Apr 30", price: 23.1 }
  ];

  const pieData = [
    { name: "Maize", value: 42 }, { name: "Cotton", value: 24 }, { name: "Groundnut", value: 18 }, { name: "Others", value: 16 }
  ];
  const pieColors = ["#10b981", "#f59e0b", "#8b5cf6", "#3b82f6"];

  const actions = [
    { icon: HiOutlineSparkles, title: "Get crop advice", desc: "AI-powered suitability recommendations.", onClick: () => navigate('/crop-advice') },
    { icon: HiOutlineCloud, title: "Check weather", desc: "Localized forecasts and field alerts.", onClick: () => navigate('/weather') },
    { icon: HiOutlineDocumentReport, title: "Generate report", desc: "Export farm performance data.", onClick: () => navigate('/reports') },
    { icon: HiOutlineShieldCheck, title: "Detect pests", desc: "Diagnosis for crop diseases & pests.", onClick: () => navigate('/pest') }
  ];

  const fieldRecommendations = [
    { icon: HiOutlineSun, title: "Irrigation window", value: "6:00 - 8:00 AM", detail: "Low evaporation period for Maize Block A.", accent: "rgba(14, 165, 233, 0.1)" },
    { icon: HiOutlineBeaker, title: "Nutrient focus", value: "Add nitrogen", detail: "Apply 42 kg/acre after light rain.", accent: "rgba(16, 185, 129, 0.1)" },
    { icon: HiOutlineCalendar, title: "Best sowing slot", value: "Next 5 days", detail: "Soil moisture and temp are optimal.", accent: "rgba(245, 158, 11, 0.1)" },
    { icon: HiOutlineExclamationCircle, title: "Disease watch", value: "Leaf spot", detail: "Scout cotton leaves twice this week.", accent: "rgba(248, 113, 113, 0.1)" }
  ];

  const fieldTasks = [
    { day: "Today", task: "Inspect pest traps in maize fields", priority: "High" },
    { day: "Tomorrow", task: "Delay fertilizer if rainfall exceeds forecast", priority: "Med" },
    { day: "Fri", task: "Update crop stage after field visit", priority: "Low" }
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
        farmers.forEach(f => locationCount[f.location || "Unknown"] = (locationCount[f.location || "Unknown"] || 0) + 1);
        const seasonCount = {};
        crops.forEach(c => seasonCount[c.season || "Unknown"] = (seasonCount[c.season || "Unknown"] || 0) + 1);
        setStats({ totalFarmers: farmers.length, totalCrops: crops.length, farmersByLocation: locationCount, cropsBySeason: seasonCount });
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}><div className="card-premium">Loading workspace...</div></div>;

  return (
    <div className="page-dashboard animate-fade">
      <header style={{ marginBottom: 40, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: "0.95rem", color: "var(--primary)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Overview Dashboard</div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--slate-900)", margin: 0 }}>Good Morning, {userName}</h1>
        </div>
        <div style={{ padding: "12px 24px", background: "white", borderRadius: 16, border: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12, boxShadow: "var(--shadow-sm)" }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)" }}></div>
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--slate-700)" }}>System Online</span>
        </div>
      </header>

      <div className="dashboard-top-grid">
        <MetricCard icon={HiOutlineClipboardList} label="Farmers" value={stats.totalFarmers} accent="#ecfdf5" iconColor="#059669" />
        <MetricCard icon={HiOutlineChartBar} label="Crop Entries" value={stats.totalCrops} accent="#fffbeb" iconColor="#d97706" />
        <MetricCard icon={HiOutlineTrendingUp} label="Categories" value={Object.keys(stats.cropsBySeason).length} accent="#f0f9ff" iconColor="#0284c7" />
        <MetricCard icon={HiOutlineLightningBolt} label="Active Alerts" value="3" accent="#fef2f2" iconColor="#dc2626" />
      </div>

      <div className="dashboard-alert-banner">
        <HiOutlineBell size={24} />
        <div><strong>Advisory Alert:</strong> Heavy rain predicted for tomorrow. Adjust irrigation schedules for Maize Block A immediately.</div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-left-panel">
          <div className="insight-grid">
            <div className="card-premium" style={{ border: "none", background: "linear-gradient(135deg, #064e3b, #059669)", color: "white" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Recommendation</span>
              <h3 style={{ fontSize: "1.4rem", margin: "12px 0", color: "white" }}>Maize Suitability: High</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>Current soil pH and moisture are optimal for sowing in the next 48 hours.</p>
            </div>
            <div className="card-premium" style={{ border: "none", background: "var(--slate-900)", color: "white" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.8 }}>Pest Warning</span>
              <h3 style={{ fontSize: "1.4rem", margin: "12px 0", color: "white" }}>Risk Level: Moderate</h3>
              <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.9 }}>Fall Armyworm activity detected in nearby regions. Monitor fields daily.</p>
            </div>
          </div>

          <div className="chart-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <h3>Price Trends: Local Maize</h3>
              <div style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 700 }}>+4.2% this week</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={marketData}>
                <defs><linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: "var(--slate-400)", fontSize: 12}} dy={10} />
                <Tooltip />
                <Area type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-card">
            <h3>Field Intelligence Recommendations</h3>
            <div className="recommendation-grid">
              {fieldRecommendations.map(item => <RecommendationTile key={item.title} {...item} />)}
            </div>
          </div>

          <div className="card-premium" style={{ padding: 32 }}>
            <h3 style={{ margin: "0 0 24px" }}>Operational Workflow</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, alignItems: "center", justifyContent: "space-between" }}>
              <WorkflowStep step="1" title="Soil Analysis" />
              <HiOutlineArrowRight size={20} color="var(--slate-300)" />
              <WorkflowStep step="2" title="Weather Sync" />
              <HiOutlineArrowRight size={20} color="var(--slate-300)" />
              <WorkflowStep step="3" title="AI Advisory" />
              <HiOutlineArrowRight size={20} color="var(--slate-300)" />
              <WorkflowStep step="4" title="Field Action" />
            </div>
          </div>
        </div>

        <aside className="dashboard-side-panel">
          <div className="card-premium">
            <h3>Quick Actions</h3>
            <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
              {actions.map(action => <ActionCard key={action.title} {...action} />)}
            </div>
          </div>

          <div className="card-premium">
            <h3>Crop Distribution</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card-premium">
            <h3>Critical Tasks</h3>
            <div style={{ display: "grid", gap: 16, marginTop: 20 }}>
              {fieldTasks.map((task, idx) => (
                <div key={idx} style={{ display: "flex", gap: 16, padding: 16, background: "var(--slate-50)", borderRadius: 16, border: "1px solid var(--border)" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: "white", display: "grid", placeItems: "center", fontWeight: 800, color: "var(--primary)", fontSize: "0.8rem", border: "1px solid var(--border)" }}>{task.day}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--slate-800)" }}>{task.task}</div>
                    <div style={{ fontSize: "0.75rem", color: task.priority === "High" ? "#ef4444" : "var(--slate-500)", fontWeight: 700 }}>Priority: {task.priority}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card-premium" style={{ background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)", border: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <HiOutlineMap size={24} color="#0369a1" />
              <h3 style={{ margin: 0, color: "#0369a1" }}>Farm Profile</h3>
            </div>
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#0c4a6e", fontWeight: 600 }}>Region</span>
                <span style={{ color: "#0369a1", fontWeight: 800 }}>{Object.keys(stats.farmersByLocation)[0] || "Not Set"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#0c4a6e", fontWeight: 600 }}>Soil Type</span>
                <span style={{ color: "#0369a1", fontWeight: 800 }}>Loamy</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#0c4a6e", fontWeight: 600 }}>Avg Yield</span>
                <span style={{ color: "#0369a1", fontWeight: 800 }}>+12%</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Dashboard;
