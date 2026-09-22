import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "./LanguageContext";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { HiOutlineDocumentReport, HiOutlineDownload, HiOutlineSearch, HiOutlineSparkles, HiOutlineChartBar, HiOutlineEye, HiOutlineDocumentText } from "react-icons/hi";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";


const chartColors = ["#2f6fff", "#7c90ff", "#1b95ff", "#1db5a7", "#ff9f1c", "#f35e5e"];

function FieldScanAnimation() {
  return (
    <div className="field-scan-container">
      <div className="scan-surface">
        <div className="scan-grid"></div>
        <div className="scan-line"></div>
        <div className="isometric-map">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="map-tile" style={{ "--delay": `${i * 0.1}s` }}>
              {i === 4 && <div className="map-marker"></div>}
            </div>
          ))}
        </div>
        <div className="hologram-circles">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
        <div className="data-points">
          {[...Array(5)].map((_, i) => (
            <div key={i} className={`point point-${i + 1}`}></div>
          ))}
        </div>
      </div>
      <div className="scan-label">
        <HiOutlineSparkles className="scan-icon" />
        <span>AI Intelligence Field Scan Active</span>
      </div>
      <style>{`
        .field-scan-container {
          position: relative;
          width: 100%;
          height: 400px;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          border-radius: 32px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(16, 185, 129, 0.1);
        }
        .scan-surface {
          position: relative;
          width: 300px;
          height: 200px;
          transform: rotateX(60deg) rotateZ(-45deg);
          transform-style: preserve-3d;
        }
        .scan-grid {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(16, 185, 129, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.1) 1px, transparent 1px);
          background-size: 20px 20px;
          border: 2px solid rgba(16, 185, 129, 0.2);
        }
        .scan-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: var(--primary);
          box-shadow: 0 0 15px var(--primary);
          top: 0;
          animation: scanMove 4s linear infinite;
        }
        .isometric-map {
          position: absolute;
          inset: 10px;
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
        }
        .map-tile {
          background: rgba(16, 185, 129, 0.05);
          border: 1px solid rgba(16, 185, 129, 0.1);
          animation: tilePulse 3s ease-in-out infinite;
          animation-delay: var(--delay);
        }
        .map-marker {
          width: 8px;
          height: 8px;
          background: var(--secondary);
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          box-shadow: 0 0 10px var(--secondary);
        }
        .hologram-circles {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) translateZ(40px);
        }
        .circle {
          position: absolute;
          border: 1px solid rgba(16, 185, 129, 0.3);
          border-radius: 50%;
          animation: circleSpin 8s linear infinite;
        }
        .circle-1 { width: 100px; height: 100px; }
        .circle-2 { width: 140px; height: 140px; animation-direction: reverse; border-style: dashed; }
        .circle-3 { width: 180px; height: 180px; }
        
        .data-points .point {
          position: absolute;
          width: 4px;
          height: 4px;
          background: var(--primary);
          border-radius: 50%;
          animation: pointFloat 3s ease-in-out infinite;
        }
        .point-1 { top: 20%; left: 30%; transform: translateZ(20px); }
        .point-2 { top: 50%; left: 70%; transform: translateZ(50px); animation-delay: 0.5s; }
        .point-3 { top: 80%; left: 40%; transform: translateZ(30px); animation-delay: 1s; }
        
        .scan-label {
          margin-top: 40px;
          display: flex;
          align-items: center;
          gap: 12px;
          color: var(--slate-600);
          font-weight: 600;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          font-size: 0.85rem;
        }
        .scan-icon {
          color: var(--primary);
          animation: spinSoft 4s linear infinite;
        }

        @keyframes scanMove {
          0% { top: 0; opacity: 0; }
          10%, 90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes tilePulse {
          0%, 100% { background: rgba(16, 185, 129, 0.05); }
          50% { background: rgba(16, 185, 129, 0.15); }
        }
        @keyframes circleSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes pointFloat {
          0%, 100% { transform: translateZ(20px); opacity: 0.5; }
          50% { transform: translateZ(60px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function ExportReports() {
  const { t, language } = useLanguage();

  const reportTabs = useMemo(() => [
    { key: "farmers", label: t("farmers"), subtitle: "Grower profiles & field records" },
    { key: "crops", label: t("crops"), subtitle: "Crop plans and soil summaries" },
    { key: "pests", label: t("pests"), subtitle: "Threat database and prevention" }
  ], [t]);

  const reportConfig = useMemo(() => ({
    farmers: {
      title: `${t("farmers")} ${t("exportReports")}`,
      headers: [t("name"), t("email"), t("location"), t("soilType"), t("landSize")],
      fields: ["name", "email", "location", "soilType", "landSize"],
      rowExtractor: (item) => [
        item.name, 
        item.email, 
        item.location, 
        t((item.soilType || "").toLowerCase()), 
        item.landSize ? `${item.landSize} ${t("acres")}` : "-"
      ],
      dataLabel: (item) => `${item.name} • ${item.location}`
    },
    crops: {
      title: `${t("crops")} ${t("exportReports")}`,
      headers: [t("cropName"), t("soilType"), t("location"), t("season"), t("fertilizer")],
      fields: ["cropName", "soilType", "location", "season", "fertilizer"],
      rowExtractor: (item) => [
        item.cropName, 
        t((item.soilType || "").toLowerCase()), 
        item.location, 
        t((item.season || "").toLowerCase()), 
        item.fertilizer
      ],
      dataLabel: (item) => `${item.cropName} • ${item.location}`
    },
    pests: {
      title: `${t("pests")} ${t("exportReports")}`,
      headers: [t("pestName"), t("cropAffected"), t("symptoms"), t("organic"), t("chemical")],
      fields: ["pestName", "cropAffected", "symptoms", "organicSolution", "chemicalSolution"],
      rowExtractor: (item) => [
        item.pestName, 
        item.cropAffected, 
        (item.symptoms || "").substring(0, 40) + "...", 
        (item.organicSolution || "").substring(0, 40) + "...", 
        (item.chemicalSolution || "").substring(0, 40) + "..."
      ],
      dataLabel: (item) => `${item.pestName} • ${item.cropAffected}`
    }
  }), [t]);

  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [pests, setPests] = useState([]);
  const [activeTab, setActiveTab] = useState("farmers");
  const [filterQuery, setFilterQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exportHistory, setExportHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [dataNotes] = useState([
    "Compare export files regularly to spot crop trends faster.",
    "Use the seasonal chart when planning planting or harvest windows.",
    "Share the summary PDF with extension officers and agronomists.",
  ]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError("");
      try {
        const [farmersRes, cropsRes, pestsRes] = await Promise.all([
          fetch("http://localhost:5000/api/farmers"),
          fetch("http://localhost:5000/api/crops"),
          fetch("http://localhost:5000/api/pests")
        ]);

        const [farmersData, cropsData, pestsData] = await Promise.all([
          farmersRes.json(),
          cropsRes.json(),
          pestsRes.json()
        ]);

        setFarmers(farmersData || []);
        setCrops(cropsData || []);
        setPests(pestsData || []);
        setLastUpdated(new Date());
      } catch (err) {
        console.error("Report loading error", err);
        setError("Unable to load reports. Please make sure the backend is running.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const dataSource = useMemo(() => {
    if (activeTab === "crops") return crops;
    if (activeTab === "pests") return pests;
    return farmers;
  }, [activeTab, farmers, crops, pests]);

  const refreshData = async () => {
    setLoading(true);
    setError("");
    try {
      const [farmersRes, cropsRes, pestsRes] = await Promise.all([
        fetch("http://localhost:5000/api/farmers"),
        fetch("http://localhost:5000/api/crops"),
        fetch("http://localhost:5000/api/pests")
      ]);
      const [farmersData, cropsData, pestsData] = await Promise.all([
        farmersRes.json(),
        cropsRes.json(),
        pestsRes.json()
      ]);
      setFarmers(farmersData || []);
      setCrops(cropsData || []);
      setPests(pestsData || []);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Refresh error", err);
      setError("Unable to refresh data at this time.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    const query = filterQuery.toLowerCase().trim();
    if (!query) return dataSource;

    return dataSource.filter((item) =>
      Object.values(item).some((value) =>
        typeof value === "string" && value.toLowerCase().includes(query)
      )
    );
  }, [dataSource, filterQuery]);

  useEffect(() => {
    if (filteredData.length === 0) {
      setSelectedItem(null);
      return;
    }
    if (!selectedItem || !filteredData.some((item) => item._id === selectedItem._id)) {
      setSelectedItem(filteredData[0]);
    }
  }, [filteredData, selectedItem]);

  const counts = useMemo(() => ({
    farmers: farmers.length,
    crops: crops.length,
    pests: pests.length
  }), [farmers.length, crops.length, pests.length]);

  const dataHealthScore = useMemo(() => {
    const filledSources = [counts.farmers, counts.crops, counts.pests].filter((value) => value > 0).length;
    return Math.round((filledSources / 3) * 100);
  }, [counts]);

  const formattedLastUpdated = useMemo(() => {
    return lastUpdated ? lastUpdated.toLocaleString() : "-";
  }, [lastUpdated]);

  const topPestCrops = useMemo(() => {
    const counts = pests.reduce((acc, item) => {
      const key = item.cropAffected || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 3);
  }, [pests]);

  const topCropSoils = useMemo(() => {
    const counts = crops.reduce((acc, item) => {
      const key = item.soilType || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).sort(([, a], [, b]) => b - a).slice(0, 3);
  }, [crops]);

  const pestCropChartData = useMemo(() => {
    const counts = pests.reduce((acc, item) => {
      const key = item.cropAffected || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [pests]);

  const soilTypeChartData = useMemo(() => {
    const counts = crops.reduce((acc, item) => {
      const key = item.soilType || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [crops]);

  const seasonChartData = useMemo(() => {
    const counts = crops.reduce((acc, item) => {
      const key = item.season || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [crops]);

  const reportMeta = useMemo(() => reportConfig[activeTab], [reportConfig, activeTab]);
  const exportRows = filteredData.map((item) => reportMeta.rowExtractor(item));

  const addExportHistory = (type) => {
    const entry = { type, date: new Date().toLocaleString(), target: reportMeta.title };
    setExportHistory((current) => [entry, ...current].slice(0, 5));
  };

  const exportCurrentViewToExcel = () => {
    if (filteredData.length === 0) return alert("No records available to export.");
    const sheetData = [reportMeta.headers, ...exportRows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, reportMeta.title);
    XLSX.writeFile(workbook, `${activeTab}_report.xlsx`);
    addExportHistory("Excel export");
  };

  const exportCurrentViewToPDF = () => {
    if (filteredData.length === 0) return alert("No records available to export.");
    const doc = new jsPDF({ orientation: "landscape" });
    doc.setFontSize(20);
    doc.setTextColor("#1d3b8f");
    doc.text(reportMeta.title, 14, 22);
    doc.setFontSize(10);
    doc.setTextColor("#334e68");
    doc.text(`Generated on ${new Date().toLocaleString()}`, 14, 30);
    autoTable(doc, {
      head: [reportMeta.headers],
      body: exportRows,
      startY: 36,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 3 },
      headStyles: { fillColor: [24, 79, 255], textColor: 255 }
    });
    doc.save(`${activeTab}_report.pdf`);
    addExportHistory("PDF export");
  };

  const exportSummaryToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor("#1e325a");
    doc.text("AgriIntel.Ai Report Summary", 14, 24);
    doc.setFontSize(11);
    doc.setTextColor("#343a40");
    doc.text(`Updated: ${new Date().toLocaleString()}`, 14, 34);
    autoTable(doc, {
      head: [[t("metric"), t("value")]],
      body: [
        [t("registeredFarmers"), counts.farmers],
        [t("cropEntries"), counts.crops],
        [t("pestRecords"), counts.pests],
        [t("resultsMatchingFilter"), filteredData.length],
        [t("mostReferencedPestCrop"), topPestCrops[0] ? `${topPestCrops[0][0]} (${topPestCrops[0][1]})` : "N/A"],
        [t("leadingSoilType"), topCropSoils[0] ? `${t((topCropSoils[0][0] || "").toLowerCase())} (${topCropSoils[0][1]})` : "N/A"]
      ],
      startY: 42,
      theme: "striped",
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [76, 175, 80], textColor: 255 }
    });
    doc.save("report_summary.pdf");
    addExportHistory("Summary export");
  };

  const renderTableRow = (item) => {
    const rowData = reportMeta.rowExtractor(item);
    return (
      <tr key={item._id} className={`report-table-row ${selectedItem?._id === item._id ? "active" : ""}`} onClick={() => setSelectedItem(item)}>
        {rowData.map((cell, index) => <td key={`${item._id}-${index}`}>{cell}</td>)}
      </tr>
    );
  };

  return (
    <div className="reports-page">
      <div className="reports-hero">
        <div className="reports-hero-copy">
          <span className="reports-pill">{t("premiumReports")}</span>
          <h1 className="reports-title">{t("dynamicFarmReporting")}</h1>
          <p className="reports-copy">{t("reportDescription")}</p>
          <div className="report-status-grid">
            <div className="report-card fade-up"><h3>{counts.farmers}</h3><p>{t("registeredFarmers")}</p></div>
            <div className="report-card fade-up delay-1"><h3>{counts.crops}</h3><p>{t("cropEntries")}</p></div>
            <div className="report-card fade-up delay-2"><h3>{counts.pests}</h3><p>{t("pestRecords")}</p></div>
          </div>
        </div>
        <div className="reports-hero-panel fade-up delay-3">
          <div className="report-metrics-panel">
            <div><span className="report-small-title">{t("liveSnapshot")}</span><h2>{reportMeta.title}</h2></div>
            <div className="report-chip">Interactive</div>
          </div>
          <div className="report-metrics-list">
            <div><strong>{topPestCrops[0]?.[0] || "N/A"}</strong><p>{t("mostReferencedPestCrop")}</p></div>
            <div><strong>{t((topCropSoils[0]?.[0] || "").toLowerCase()) || "N/A"}</strong><p>{t("leadingSoilType")}</p></div>
            <div><strong>{filteredData.length}</strong><p>{t("resultsMatchingFilter")}</p></div>
            <div><strong>{dataHealthScore}%</strong><p>{t("dataHealthScore")}</p></div>
            <div><strong>{formattedLastUpdated}</strong><p>{t("lastRefreshed")}</p></div>
          </div>
        </div>
      </div>

      <div className="report-tabs fade-up delay-4">
        {reportTabs.map((tab) => (
          <button key={tab.key} className={`report-tab ${activeTab === tab.key ? "active" : ""}`} onClick={() => setActiveTab(tab.key)}>
            <strong>{tab.label}</strong><span>{tab.subtitle}</span>
          </button>
        ))}
      </div>

      <div className="report-controls fade-up delay-5">
        <div className="report-filter-panel">
          <div className="report-search-box">
            <HiOutlineSearch className="report-input-icon" />
            <input value={filterQuery} onChange={(e) => setFilterQuery(e.target.value)} placeholder={`Search ${reportMeta.title.toLowerCase()}...`} className="report-input" />
          </div>
          <div className="report-actions">
            <button className="report-secondary-btn" onClick={refreshData}><HiOutlineSparkles /> {t("refreshData")}</button>
            <button className="report-primary-btn" onClick={exportCurrentViewToExcel}><HiOutlineDownload /> {t("exportExcel")}</button>
            <button className="report-secondary-btn" onClick={exportCurrentViewToPDF}><HiOutlineDocumentText /> {t("exportPDF")}</button>
            <button className="report-secondary-btn" onClick={exportSummaryToPDF}><HiOutlineChartBar /> {t("exportSummary")}</button>
          </div>
        </div>
      </div>

      <div className="report-analytics-grid fade-up delay-6">
        <div className="report-card report-chart-card">
          <div className="report-card-header"><div><span className="report-small-title">{t("pestAnalytics")}</span><h2>{t("threatsByCrop")}</h2></div><div className="report-chip">Live update</div></div>
          {pestCropChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={pestCropChartData} margin={{ top: 20, right: 8, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip /><Bar dataKey="value" fill="#2f6fff" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="report-empty-preview"><HiOutlineDocumentReport size={48} /><p>There is no pest distribution data available yet.</p></div>}
        </div>
        <div className="report-card report-chart-card">
          <div className="report-card-header"><div><span className="report-small-title">{t("soilInsights")}</span><h2>{t("cropSoilMix")}</h2></div><div className="report-chip">Distribution</div></div>
          {soilTypeChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={soilTypeChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={96} paddingAngle={4} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {soilTypeChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />)}
                </Pie>
                <Tooltip /><Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div className="report-empty-preview"><HiOutlineDocumentReport size={48} /><p>There is no soil type distribution data available yet.</p></div>}
        </div>
        <div className="report-card report-chart-card">
          <div className="report-card-header"><div><span className="report-small-title">{t("seasonalInsight")}</span><h2>{t("cropDistributionBySeason")}</h2></div><div className="report-chip">Trend</div></div>
          {seasonChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={seasonChartData} margin={{ top: 18, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8eef9" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
                <Tooltip /><Bar dataKey="value" fill="#1db5a7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="report-empty-preview"><HiOutlineDocumentReport size={48} /><p>No seasonal crop data available yet.</p></div>}
        </div>
      </div>

      {error ? <div className="report-error">{error}</div> : (
        <div className="report-content-grid fade-up delay-6">
          <section className="report-table-section">
            {filteredData.length === 0 && !loading ? (
              <div className="report-card" style={{ padding: 0, overflow: "hidden" }}>
                <FieldScanAnimation />
                <div style={{ padding: 32, textAlign: "center" }}>
                  <h3 style={{ fontSize: "1.5rem", marginBottom: 12 }}>No records found</h3>
                  <p style={{ color: "var(--slate-600)", margin: 0 }}>Try adjusting your search or filters to find specific farm records.</p>
                </div>
              </div>
            ) : (
              <div className="report-card report-table-card">
                <div className="report-card-header">
                  <div><span className="report-small-title">Data overview</span><h2>{reportMeta.title} ({filteredData.length})</h2></div>
                  <div className="report-pill-light">{activeTab.toUpperCase()}</div>
                </div>
                {loading ? <div className="report-loading">Loading report data…</div> : (
                  <div className="report-table-wrapper">
                    <table className="report-table">
                      <thead><tr>{reportMeta.headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
                      <tbody>{filteredData.map(renderTableRow)}</tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </section>

          <aside className="report-preview-panel">
            <div className="report-preview-card fade-up delay-7">
              <div className="report-card-header">
                <div><span className="report-small-title">{t("quickPreview")}</span><h2>{t("selectedRecord")}</h2></div>
                <div className="report-chip">Tap row to select</div>
              </div>
              {selectedItem ? (
                <dl className="report-details-list">
                  {reportMeta.fields.map((field) => (
                    <div key={field} className="report-detail-row">
                      <dt>{field.replace(/([A-Z])/g, " $1").replace(/^[a-z]/, (c) => c.toUpperCase())}</dt>
                      <dd>{selectedItem[field] || "N/A"}</dd>
                    </div>
                  ))}
                </dl>
              ) : <div className="report-empty-preview"><HiOutlineEye size={56} /><p>Select a row from the table to inspect details instantly.</p></div>}
            </div>
            <div className="report-insights-grid">
              <div className="report-card insights-card fade-up delay-8">
                <span className="report-small-title">Insight</span>
                <h3>{counts.farmers > counts.crops ? "Farmer growth is ahead" : "Crop plan coverage is strong"}</h3>
                <p>Use the export buttons above to share filtered reports with partners or extension officers.</p>
              </div>
              <div className="report-card insights-card fade-up delay-9">
                <span className="report-small-title">{t("topAnalytics")}</span>
                <ul className="report-insight-list">
                  <li>{topPestCrops[0] ? `${topPestCrops[0][0]} is the most documented crop for pests.` : "No pest crop data yet."}</li>
                  <li>{topCropSoils[0] ? `${t((topCropSoils[0][0] || "").toLowerCase())} is the most common soil type in crop reports.` : "No soil type data yet."}</li>
                </ul>
              </div>
            </div>
            <div className="report-card report-history-card fade-up delay-10">
              <div className="report-card-header"><div><span className="report-small-title">{t("exportHistory")}</span><h2>{t("recentActivity")}</h2></div><div className="report-chip">Latest</div></div>
              {exportHistory.length === 0 ? (
                <div className="report-empty-preview"><HiOutlineDocumentText size={48} /><p>No exports recorded yet. Start exporting to build a track record.</p></div>
              ) : (
                <ul className="report-history-list">
                  {exportHistory.map((entry, index) => (
                    <li key={`${entry.type}-${index}`}><span>{entry.type}</span><strong>{entry.target}</strong><small>{entry.date}</small></li>
                  ))}
                </ul>
              )}
            </div>
            <div className="report-card report-note-card fade-up delay-11">
              <span className="report-small-title">{t("reportGuide")}</span><h3>{t("useReportsDriveDecisions")}</h3>
              <ul className="report-note-list">{dataNotes.map((note, idx) => <li key={idx}>{note}</li>)}</ul>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

export default ExportReports;
