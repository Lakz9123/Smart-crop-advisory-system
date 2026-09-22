import React, { useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import { 
  HiOutlineUserGroup, 
  HiOutlineCube, 
  HiOutlineBeaker, 
  HiOutlineUsers,
  HiOutlineSearch,
  HiOutlinePlusCircle,
  HiOutlineTrash,
  HiOutlineFilter
} from "react-icons/hi";

function AdminPanel() {
  const { t } = useLanguage();
  const [farmers, setFarmers] = useState([]);
  const [crops, setCrops] = useState([]);
  const [pests, setPests] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("farmers");
  const [searchTerm, setSearchTerm] = useState("");
  const [newCrop, setNewCrop] = useState({
    soilType: "",
    location: "",
    season: "",
    cropName: "",
    fertilizer: "",
    tips: ""
  });
  const [newPest, setNewPest] = useState({
    pestName: "",
    cropAffected: "",
    symptoms: "",
    treatment: "",
    organicSolution: "",
    chemicalSolution: "",
    prevention: "",
    imageUrl: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const farmersRes = await fetch("http://localhost:5000/api/farmers");
        const cropsRes = await fetch("http://localhost:5000/api/crops");
        const pestsRes = await fetch("http://localhost:5000/api/pests");
        const usersRes = await fetch("http://localhost:5000/api/auth/users");
        
        setFarmers(await farmersRes.json());
        setCrops(await cropsRes.json());
        setPests(await pestsRes.json());
        setUsers(await usersRes.json());
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddCrop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/crops", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCrop)
      });
      const data = await res.json();
      alert(data.message);
      const cropsRes = await fetch("http://localhost:5000/api/crops");
      setCrops(await cropsRes.json());
      setNewCrop({ soilType: "", location: "", season: "", cropName: "", fertilizer: "", tips: "" });
    } catch (error) {
      alert("Error adding crop");
    }
  };

  const handleAddPest = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/pests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPest)
      });
      const data = await res.json();
      alert("Pest added successfully");
      const pestsRes = await fetch("http://localhost:5000/api/pests");
      setPests(await pestsRes.json());
      setNewPest({ pestName: "", cropAffected: "", symptoms: "", treatment: "", organicSolution: "", chemicalSolution: "", prevention: "", imageUrl: "" });
    } catch (error) {
      alert("Error adding pest");
    }
  };

  const deleteCrop = async (id) => {
    if (window.confirm("Delete this crop?")) {
      await fetch(`http://localhost:5000/api/crops/${id}`, { method: "DELETE" });
      setCrops(crops.filter(crop => crop._id !== id));
      alert("Crop deleted");
    }
  };

  const deletePest = async (id) => {
    if (window.confirm("Delete this pest?")) {
      await fetch(`http://localhost:5000/api/pests/${id}`, { method: "DELETE" });
      setPests(pests.filter(pest => pest._id !== id));
      alert("Pest deleted");
    }
  };

  const deleteFarmer = async (id) => {
    if (window.confirm("Delete this farmer?")) {
      await fetch(`http://localhost:5000/api/farmers/${id}`, { method: "DELETE" });
      setFarmers(farmers.filter(farmer => farmer._id !== id));
      alert("Farmer deleted");
    }
  };

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh", flexDirection: "column", gap: "20px" }}>
      <div style={{ width: "50px", height: "50px", border: "5px solid var(--emerald-100)", borderTopColor: "var(--primary)", borderRadius: "50%", animation: "spinSoft 1s linear infinite" }}></div>
      <p style={{ color: "var(--slate-500)", fontWeight: "600" }}>{t("loading")}...</p>
    </div>
  );

  const filteredFarmers = farmers.filter(f => 
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredCrops = crops.filter(c => 
    c.cropName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.soilType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPests = pests.filter(p => 
    p.pestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.cropAffected.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="animate-fade" style={{ display: "grid", gap: "32px" }}>
      {/* Stats Overview */}
      <div className="dashboard-top-grid">
        <div className="metric-card card-premium">
          <div className="metric-icon" style={{ background: "linear-gradient(135deg, var(--emerald-600), var(--emerald-800))" }}>
            <HiOutlineUserGroup size={24} />
          </div>
          <div>
            <h4>{t("farmers")}</h4>
            <strong>{farmers.length}</strong>
          </div>
        </div>
        <div className="metric-card card-premium">
          <div className="metric-icon" style={{ background: "linear-gradient(135deg, var(--primary-light), var(--primary))" }}>
            <HiOutlineCube size={24} />
          </div>
          <div>
            <h4>{t("crops")}</h4>
            <strong>{crops.length}</strong>
          </div>
        </div>
        <div className="metric-card card-premium">
          <div className="metric-icon" style={{ background: "linear-gradient(135deg, var(--amber-500), var(--amber-600))" }}>
            <HiOutlineBeaker size={24} />
          </div>
          <div>
            <h4>{t("pests")}</h4>
            <strong>{pests.length}</strong>
          </div>
        </div>
        <div className="metric-card card-premium">
          <div className="metric-icon" style={{ background: "linear-gradient(135deg, var(--slate-700), var(--slate-900))" }}>
            <HiOutlineUsers size={24} />
          </div>
          <div>
            <h4>{t("users")}</h4>
            <strong>{users.length}</strong>
          </div>
        </div>
      </div>

      {/* Navigation and Search */}
      <div className="card-premium" style={{ padding: "16px", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "20px" }}>
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
          {[
            { id: "farmers", label: t("farmers"), icon: HiOutlineUserGroup },
            { id: "crops", label: t("crops"), icon: HiOutlineCube },
            { id: "pests", label: t("pests"), icon: HiOutlineBeaker },
            { id: "users", label: t("users"), icon: HiOutlineUsers },
            { id: "addCrop", label: t("addCrop"), icon: HiOutlinePlusCircle },
            { id: "addPest", label: t("addPest"), icon: HiOutlinePlusCircle },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchTerm(""); }}
              className={`btn-premium ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
              style={{ padding: "8px 16px", fontSize: "0.9rem", whiteSpace: "nowrap" }}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
        
        {["farmers", "crops", "pests", "users"].includes(activeTab) && (
          <div style={{ position: "relative", minWidth: "280px" }}>
            <HiOutlineSearch style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--slate-400)" }} />
            <input 
              placeholder={`Search ${activeTab}...`} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: "40px", borderRadius: "12px", height: "42px" }}
            />
          </div>
        )}
      </div>

      {/* Main Content Areas */}
      <div className="animate-fade" key={activeTab}>
        {activeTab === "farmers" && (
          <div className="card-premium" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{t("farmers")} List</h3>
              <span className="hero-badge" style={{ margin: 0 }}>{filteredFarmers.length} found</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "var(--slate-50)" }}>
                  <tr>
                    <th style={tableHeaderStyle}>{t("name")}</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>{t("location")}</th>
                    <th style={tableHeaderStyle}>{t("soilType")}</th>
                    <th style={tableHeaderStyle}>{t("landSize")}</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFarmers.map(farmer => (
                    <tr key={farmer._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={tableRowStyle}>{farmer.name}</td>
                      <td style={tableRowStyle}>{farmer.email}</td>
                      <td style={tableRowStyle}>{farmer.location}</td>
                      <td style={tableRowStyle}>{farmer.soilType}</td>
                      <td style={tableRowStyle}>{farmer.landSize} acres</td>
                      <td style={tableRowStyle}>
                        <button onClick={() => deleteFarmer(farmer._id)} className="btn-premium" style={{ padding: "6px", color: "#f87171", background: "rgba(248, 113, 113, 0.1)", border: "none" }}>
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredFarmers.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--slate-400)" }}>No farmers found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "crops" && (
          <div className="card-premium" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{t("crops")} List</h3>
              <span className="hero-badge" style={{ margin: 0 }}>{filteredCrops.length} found</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "var(--slate-50)" }}>
                  <tr>
                    <th style={tableHeaderStyle}>{t("cropName")}</th>
                    <th style={tableHeaderStyle}>{t("soilType")}</th>
                    <th style={tableHeaderStyle}>{t("location")}</th>
                    <th style={tableHeaderStyle}>{t("season")}</th>
                    <th style={tableHeaderStyle}>{t("fertilizer")}</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCrops.map(crop => (
                    <tr key={crop._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={tableRowStyle}><strong>{crop.cropName}</strong></td>
                      <td style={tableRowStyle}>{crop.soilType}</td>
                      <td style={tableRowStyle}>{crop.location}</td>
                      <td style={tableRowStyle}>
                        <span style={{ padding: "4px 12px", borderRadius: "999px", backgroundColor: "var(--emerald-100)", color: "var(--emerald-900)", fontSize: "0.8rem", fontWeight: "700" }}>
                          {crop.season}
                        </span>
                      </td>
                      <td style={tableRowStyle}>{crop.fertilizer}</td>
                      <td style={tableRowStyle}>
                        <button onClick={() => deleteCrop(crop._id)} className="btn-premium" style={{ padding: "6px", color: "#f87171", background: "rgba(248, 113, 113, 0.1)", border: "none" }}>
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCrops.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "var(--slate-400)" }}>No crops found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "pests" && (
          <div className="card-premium" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{t("pests")} List</h3>
              <span className="hero-badge" style={{ margin: 0 }}>{filteredPests.length} found</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "var(--slate-50)" }}>
                  <tr>
                    <th style={tableHeaderStyle}>{t("pests")} Name</th>
                    <th style={tableHeaderStyle}>Crop Affected</th>
                    <th style={tableHeaderStyle}>Symptoms</th>
                    <th style={tableHeaderStyle}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPests.map(pest => (
                    <tr key={pest._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={tableRowStyle}><strong>{pest.pestName}</strong></td>
                      <td style={tableRowStyle}>{pest.cropAffected}</td>
                      <td style={tableRowStyle}><span style={{ fontSize: "0.9rem", color: "var(--slate-600)" }}>{pest.symptoms.substring(0, 80)}...</span></td>
                      <td style={tableRowStyle}>
                        <button onClick={() => deletePest(pest._id)} className="btn-premium" style={{ padding: "6px", color: "#f87171", background: "rgba(248, 113, 113, 0.1)", border: "none" }}>
                          <HiOutlineTrash size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPests.length === 0 && (
                    <tr>
                      <td colSpan="4" style={{ padding: "40px", textAlign: "center", color: "var(--slate-400)" }}>No pests found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div className="card-premium" style={{ padding: "0", overflow: "hidden" }}>
            <div style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{t("users")} List</h3>
              <span className="hero-badge" style={{ margin: 0 }}>{filteredUsers.length} found</span>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "var(--slate-50)" }}>
                  <tr>
                    <th style={tableHeaderStyle}>{t("name")}</th>
                    <th style={tableHeaderStyle}>Email</th>
                    <th style={tableHeaderStyle}>{t("role")}</th>
                    <th style={tableHeaderStyle}>{t("location")}</th>
                    <th style={tableHeaderStyle}>{t("landSize")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id} style={{ borderBottom: "1px solid var(--border)" }}>
                      <td style={tableRowStyle}><strong>{user.name}</strong></td>
                      <td style={tableRowStyle}>{user.email}</td>
                      <td style={tableRowStyle}>
                        <span style={{ 
                          padding: "4px 12px", 
                          borderRadius: "999px", 
                          backgroundColor: user.role === "admin" ? "var(--amber-100)" : "var(--slate-100)", 
                          color: user.role === "admin" ? "var(--amber-600)" : "var(--slate-600)", 
                          fontSize: "0.8rem", 
                          fontWeight: "700",
                          textTransform: "capitalize"
                        }}>
                          {user.role || "farmer"}
                        </span>
                      </td>
                      <td style={tableRowStyle}>{user.location}</td>
                      <td style={tableRowStyle}>{user.landSize} acres</td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: "var(--slate-400)" }}>No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "addCrop" && (
          <div className="card-premium animate-fade" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "8px" }}>{t("addNewCrop")}</h3>
              <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>Add a new crop variety to the database with specific soil and seasonal requirements.</p>
            </div>
            <form onSubmit={handleAddCrop} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{t("cropName")}</label>
                <input placeholder="e.g. Basmati Rice" value={newCrop.cropName} onChange={(e) => setNewCrop({...newCrop, cropName: e.target.value})} required />
              </div>
              <div>
                <label style={labelStyle}>{t("soilType")}</label>
                <input placeholder="e.g. Alluvial" value={newCrop.soilType} onChange={(e) => setNewCrop({...newCrop, soilType: e.target.value})} required />
              </div>
              <div>
                <label style={labelStyle}>{t("location")}</label>
                <input placeholder="e.g. North India" value={newCrop.location} onChange={(e) => setNewCrop({...newCrop, location: e.target.value})} required />
              </div>
              <div>
                <label style={labelStyle}>{t("season")}</label>
                <select value={newCrop.season} onChange={(e) => setNewCrop({...newCrop, season: e.target.value})} required>
                  <option value="">Select Season</option>
                  <option>Winter</option><option>Summer</option><option>Rainy</option><option>Spring</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>{t("fertilizer")}</label>
                <input placeholder="e.g. Urea, NPK" value={newCrop.fertilizer} onChange={(e) => setNewCrop({...newCrop, fertilizer: e.target.value})} required />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>{t("tips")}</label>
                <textarea placeholder="Cultivation tips and advice..." value={newCrop.tips} onChange={(e) => setNewCrop({...newCrop, tips: e.target.value})} required rows="4" />
              </div>
              <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
                <button type="submit" className="btn-premium btn-primary" style={{ width: "100%", padding: "14px" }}>
                  <HiOutlinePlusCircle size={20} />
                  {t("addCrop")}
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "addPest" && (
          <div className="card-premium animate-fade" style={{ maxWidth: "800px", margin: "0 auto" }}>
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ marginBottom: "8px" }}>{t("addPest")} Information</h3>
              <p style={{ color: "var(--slate-500)", fontSize: "0.95rem" }}>Identify and document new pest species, their symptoms, and recommended treatments.</p>
            </div>
            <form onSubmit={handleAddPest} style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px" }}>
              <div>
                <label style={labelStyle}>{t("pests")} Name</label>
                <input placeholder="e.g. Aphids" value={newPest.pestName} onChange={(e) => setNewPest({...newPest, pestName: e.target.value})} required />
              </div>
              <div>
                <label style={labelStyle}>Crop Affected</label>
                <input placeholder="e.g. Cotton, Wheat" value={newPest.cropAffected} onChange={(e) => setNewPest({...newPest, cropAffected: e.target.value})} required />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Symptoms</label>
                <textarea placeholder="Describe visual symptoms..." value={newPest.symptoms} onChange={(e) => setNewPest({...newPest, symptoms: e.target.value})} required rows="2" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Treatment & Prevention</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <textarea placeholder="Organic Solution" value={newPest.organicSolution} onChange={(e) => setNewPest({...newPest, organicSolution: e.target.value})} required rows="3" />
                  <textarea placeholder="Chemical Solution" value={newPest.chemicalSolution} onChange={(e) => setNewPest({...newPest, chemicalSolution: e.target.value})} required rows="3" />
                </div>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Treatment & Prevention Tips</label>
                <textarea placeholder="General prevention strategies..." value={newPest.prevention} onChange={(e) => setNewPest({...newPest, prevention: e.target.value})} required rows="2" />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>Image URL (optional)</label>
                <input placeholder="https://..." value={newPest.imageUrl} onChange={(e) => setNewPest({...newPest, imageUrl: e.target.value})} />
              </div>
              <div style={{ gridColumn: "span 2", marginTop: "12px" }}>
                <button type="submit" className="btn-premium btn-primary" style={{ width: "100%", padding: "14px" }}>
                  <HiOutlinePlusCircle size={20} />
                  {t("addPest")} to Database
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

const tableHeaderStyle = { padding: "16px 24px", textAlign: "left", fontSize: "0.85rem", fontWeight: "700", color: "var(--slate-500)", textTransform: "uppercase", letterSpacing: "1px" };
const tableRowStyle = { padding: "16px 24px", fontSize: "0.95rem", color: "var(--slate-700)" };
const labelStyle = { display: "block", marginBottom: "8px", fontSize: "0.9rem", fontWeight: "600", color: "var(--slate-700)" };

export default AdminPanel;