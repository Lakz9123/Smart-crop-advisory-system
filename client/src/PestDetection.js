import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  HiOutlineBadgeCheck,
  HiOutlineBeaker,
  HiOutlineCamera,
  HiOutlineCheckCircle,
  HiOutlineClipboardCheck,
  HiOutlineCloud,
  HiOutlineDocumentSearch,
  HiOutlineExclamation,
  HiOutlinePhotograph,
  HiOutlineRefresh,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineUpload
} from "react-icons/hi";
import { useLanguage } from "./LanguageContext";

const symptomChips = [
  "Yellowing leaves",
  "Holes in leaves",
  "Sticky residue",
  "Wilting",
  "Leaf spots",
  "Dead heart",
  "Curling leaves",
  "White powder",
  "Brown spots",
  "Diamond-shaped lesions",
  "Water-soaked lesions",
  "Orange pustules",
  "White powdery coating",
  "Folded leaves",
  "White streaks",
  "Holes in stems",
  "Broken stalks",
  "Sawdust-like frass",
  "Defoliation",
  "Shot holes",
  "Ear damage",
  "Clustered insects",
  "Stunted growth",
  "Honeydew",
  "Sooty mold",
  "Longitudinal white streaks",
  "Skeletonized leaves",
  "Mottled leaves",
  "White mycelial growth",
  "Green smut balls",
  "Yellow smut balls",
  "Hopper burn",
  "Plant collapse",
  "Rolled leaves",
  "Panicle blast",
  "Rotten neck"
];

const scoutingTasks = [
  "Check underside of leaves",
  "Compare affected and healthy plants",
  "Capture a clear close-up photo",
  "Record field age and recent rainfall"
];

const preventionCards = [
  {
    icon: HiOutlineCloud,
    title: "Weather-aware spray",
    text: "Avoid spraying before rain or during strong wind. Early morning is usually safer."
  },
  {
    icon: HiOutlineShieldCheck,
    title: "Integrated pest management",
    text: "Start with field sanitation, trap monitoring, and organic controls before chemicals."
  },
  {
    icon: HiOutlineClipboardCheck,
    title: "Follow-up inspection",
    text: "Recheck the same patch after 48 hours and record whether symptoms are spreading."
  }
];

function PestMetric({ icon: Icon, label, value, detail }) {
  return (
    <div className="pest-metric-card">
      <span><Icon size={24} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function ResultDetail({ icon: Icon, title, children, tone = "green" }) {
  return (
    <div className={`pest-result-detail ${tone}`}>
      <Icon size={24} />
      <div>
        <strong>{title}</strong>
        <p>{children || "No details available yet."}</p>
      </div>
    </div>
  );
}

function PestDetection() {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadMethod, setUploadMethod] = useState("text");

  const readiness = useMemo(() => {
    const items = [
      { label: "Crop selected", done: Boolean(cropName.trim()) },
      { label: uploadMethod === "image" ? "Leaf photo added" : "Symptoms described", done: uploadMethod === "image" ? Boolean(selectedImage) : symptoms.trim().length > 8 },
      { label: "Diagnosis ready", done: Boolean(cropName.trim()) && (uploadMethod === "image" ? Boolean(selectedImage) : symptoms.trim().length > 8) }
    ];
    return items;
  }, [cropName, selectedImage, symptoms, uploadMethod]);

  const readinessScore = Math.round((readiness.filter((item) => item.done).length / readiness.length) * 100);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const addSymptom = (chip) => {
    setSymptoms((current) => {
      if (current.toLowerCase().includes(chip.toLowerCase())) return current;
      return current ? `${current}, ${chip}` : chip;
    });
  };

  const resetForm = () => {
    setCropName("");
    setSymptoms("");
    setResult(null);
    setError("");
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    if (!selectedImage || !cropName.trim()) {
      setError("Please select an image and enter crop name.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("cropName", cropName);

    try {
      const res = await axios.post("http://localhost:5000/api/upload-pest", formData);

      if (res.data.imageUrl) {
        setResult(res.data);
      }

      if (!res.data.success) {
        setError(res.data.message || "No matching pest was found.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Error uploading image. Please try again.";
      setError(message);
    }
    setLoading(false);
  };

  const handleTextDetect = async (e) => {
    e.preventDefault();
    if (!cropName.trim() || symptoms.trim().length < 4) {
      setError("Please enter crop name and describe visible symptoms.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post("http://localhost:5000/api/detect-pest", {
        cropName,
        symptoms
      });

      if (res.data.pest || (res.data.suggestions && res.data.suggestions.length > 0)) {
        setResult(res.data);
      }

      if (!res.data.success) {
        setError(res.data.message || "No matching pest was found.");
      }
    } catch (err) {
      const message = err.response?.data?.message || "Error detecting pest. Please try again.";
      setError(message);
    }
    setLoading(false);
  };

  return (
    <div className="pest-page animate-fade">
      <section className="pest-hero">
        <div className="pest-hero-copy">
          <span className="hero-badge"><HiOutlineSparkles /> Smart Crop Protection</span>
          <h1>{t("pestTitle")}</h1>
          <p>Detect crop threats earlier with symptom-based diagnosis, photo upload, treatment guidance, and field-ready prevention steps.</p>
          <div className="pest-hero-actions">
            <button className={uploadMethod === "text" ? "is-active" : ""} type="button" onClick={() => setUploadMethod("text")}>
              <HiOutlineDocumentSearch /> Describe symptoms
            </button>
            <button className={uploadMethod === "image" ? "is-active" : ""} type="button" onClick={() => setUploadMethod("image")}>
              <HiOutlineCamera /> Upload leaf photo
            </button>
          </div>
        </div>

        <div className="pest-hero-panel">
          <div className="pest-scan-orb" style={{ "--score": `${readinessScore}%` }}>
            <div>
              <strong>{readinessScore}%</strong>
              <span>ready</span>
            </div>
          </div>
          <div className="pest-readiness-list">
            {readiness.map((item) => (
              <p key={item.label} className={item.done ? "is-done" : ""}>
                <HiOutlineCheckCircle /> {item.label}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="pest-metrics-grid">
        <PestMetric icon={HiOutlineShieldCheck} label="Risk lens" value="Early watch" detail="Designed for field scouting" />
        <PestMetric icon={HiOutlineBeaker} label="Solutions" value="Organic + chemical" detail="Balanced treatment options" />
        <PestMetric icon={HiOutlineBadgeCheck} label="Output" value="Action plan" detail="Symptoms, control, prevention" />
      </section>

      <section className="pest-workspace">
        <div className="card-premium pest-diagnosis-card">
          <div className="weather-card-heading">
            <div>
              <span>Diagnosis studio</span>
              <h3>{uploadMethod === "image" ? "Photo-based detection" : "Symptom-based detection"}</h3>
            </div>
            <HiOutlineDocumentSearch size={28} />
          </div>

          <form className="pest-form" onSubmit={uploadMethod === "image" ? handleImageUpload : handleTextDetect}>
            <label>
              Crop name
              <input
                type="text"
                placeholder="e.g., Rice, Maize, Cotton"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                required
              />
            </label>

            {uploadMethod === "text" ? (
              <>
                <label>
                  Visible symptoms
                  <textarea
                    placeholder="Describe symptoms such as holes in leaves, yellowing, caterpillars, dead heart, sticky residue, brown spots, white powder, wilting, curling leaves, diamond-shaped lesions, water-soaked lesions, folded leaves, white streaks, hopper burn, plant collapse..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    required
                    rows="5"
                  />
                </label>
                <div className="symptom-chip-row">
                  {symptomChips.map((chip) => (
                    <button key={chip} type="button" onClick={() => addSymptom(chip)}>
                      {chip}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <label className={`pest-upload-zone ${imagePreview ? "has-preview" : ""}`}>
                <input type="file" accept="image/*" onChange={handleImageChange} />
                {imagePreview ? (
                  <img src={imagePreview} alt="Selected crop preview" />
                ) : (
                  <div>
                    <HiOutlineUpload size={42} />
                    <strong>Drop in a clear crop image</strong>
                    <span>Use a close-up photo with visible leaf or stem damage.</span>
                  </div>
                )}
              </label>
            )}

            {error && (
              <div className="pest-error">
                <HiOutlineExclamation /> {error}
              </div>
            )}

            <div className="pest-form-actions">
              <button className="btn-premium btn-primary" type="submit" disabled={loading}>
                {loading ? "Analyzing..." : uploadMethod === "image" ? "Analyze image" : "Detect pest"}
                {loading ? <HiOutlineRefresh className="spin-icon" /> : <HiOutlineSparkles />}
              </button>
              <button className="btn-premium btn-secondary" type="button" onClick={resetForm}>
                Reset
              </button>
            </div>
          </form>
        </div>

        <aside className="pest-side-panel">
          <div className="card-premium pest-scout-card">
            <div className="weather-card-heading">
              <div>
                <span>Field scouting</span>
                <h3>Before you diagnose</h3>
              </div>
              <HiOutlineClipboardCheck size={28} />
            </div>
            <div className="pest-scout-list">
              {scoutingTasks.map((task, index) => (
                <p key={task} style={{ "--delay": `${index * 0.1}s` }}>
                  <span>{index + 1}</span>{task}
                </p>
              ))}
            </div>
          </div>

          <div className="card-premium pest-alert-card">
            <span>Spray safety</span>
            <h3>Confirm pest before treatment</h3>
            <p>Use pesticides only after checking pest stage, crop age, label dose, weather, and harvest interval.</p>
          </div>
        </aside>
      </section>

      {result && (
        <section className="pest-results-section">
          {result.imageUrl && (
            <div className="card-premium pest-uploaded-card">
              <HiOutlinePhotograph size={28} />
              <div>
                <span>Uploaded image</span>
                <strong>Field sample captured</strong>
              </div>
              <img src={result.imageUrl} alt="Uploaded crop sample" />
            </div>
          )}

          {result.pest && (
            <div className="card-premium pest-result-card">
              <div className="pest-result-header">
                <div>
                  <span>Detection result {result.confidence && `• AI Confidence: ${result.confidence.toFixed(1)}%`}</span>
                  <h2>{result.pest.pestName}</h2>
                  <p>{result.pest.cropAffected || cropName} requires targeted monitoring and quick action.</p>
                  {result.mlPrediction && (
                    <p style={{ color: "var(--accent)", fontSize: "0.85rem", marginTop: "4px" }}>
                      Model identified: {result.mlPrediction}
                    </p>
                  )}
                </div>
                <div className="pest-confidence-pill">Action needed</div>
              </div>

              <div className="pest-result-grid">
                <ResultDetail icon={HiOutlineExclamation} title="Symptoms" tone="amber">{result.pest.symptoms}</ResultDetail>
                <ResultDetail icon={HiOutlineShieldCheck} title="Organic solution">{result.pest.organicSolution}</ResultDetail>
                <ResultDetail icon={HiOutlineBeaker} title="Chemical solution" tone="blue">{result.pest.chemicalSolution}</ResultDetail>
                <ResultDetail icon={HiOutlineCheckCircle} title="Prevention">{result.pest.prevention}</ResultDetail>
                <ResultDetail icon={HiOutlineClipboardCheck} title="Treatment plan" tone="amber">{result.pest.treatment}</ResultDetail>
              </div>
            </div>
          )}

          {result.suggestions && result.suggestions.length > 0 && !result.pest && (
            <div className="pest-suggestion-grid">
              {result.suggestions.map((pest, index) => (
                <div key={`${pest.pestName}-${index}`} className="card-premium pest-suggestion-card">
                  <span>Possible match</span>
                  <h3>{pest.pestName}</h3>
                  <p><strong>Symptoms:</strong> {pest.symptoms}</p>
                  <p><strong>Organic:</strong> {pest.organicSolution}</p>
                  <p><strong>Chemical:</strong> {pest.chemicalSolution}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="pest-prevention-grid">
        {preventionCards.map((card) => (
          <div key={card.title} className="card-premium pest-prevention-card">
            <card.icon size={30} />
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}

export default PestDetection;
