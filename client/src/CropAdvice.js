import React, { useMemo, useState } from "react";
import {
  HiOutlineBeaker,
  HiOutlineCalendar,
  HiOutlineCheckCircle,
  HiOutlineCloud,
  HiOutlineLocationMarker,
  HiOutlineSparkles
} from "react-icons/hi";

const cropRules = {
  clay: {
    summer: { crop: "Rice", fertilizer: "Urea + DAP", tip: "Keep water levels controlled and avoid over-irrigation after heavy rain." },
    monsoon: { crop: "Paddy", fertilizer: "Compost + NPK 20:20:0", tip: "Use raised bunds and monitor standing water every two days." },
    winter: { crop: "Wheat", fertilizer: "NPK + zinc sulphate", tip: "Prepare fine tilth and schedule light irrigation during tillering." }
  },
  loam: {
    summer: { crop: "Maize", fertilizer: "Nitrogen-rich fertilizer", tip: "Irrigate early morning and mulch to protect soil moisture." },
    monsoon: { crop: "Groundnut", fertilizer: "Gypsum + potash", tip: "Ensure good drainage and inspect for leaf spot after rainfall." },
    winter: { crop: "Tomato", fertilizer: "Compost + calcium nitrate", tip: "Use staking and maintain regular moisture for fruit quality." }
  },
  sandy: {
    summer: { crop: "Millet", fertilizer: "Organic manure + potash", tip: "Use drip irrigation or shorter watering intervals to reduce stress." },
    monsoon: { crop: "Cotton", fertilizer: "NPK + micronutrient mix", tip: "Scout early for sucking pests and avoid waterlogging." },
    winter: { crop: "Groundnut", fertilizer: "Gypsum + farmyard manure", tip: "Add organic matter to improve moisture holding capacity." }
  },
  red: {
    summer: { crop: "Ragi", fertilizer: "Farmyard manure + urea", tip: "Choose drought-tolerant varieties and irrigate during flowering." },
    monsoon: { crop: "Pulses", fertilizer: "Rhizobium seed treatment", tip: "Use seed treatment and keep rows weed-free for early growth." },
    winter: { crop: "Chilli", fertilizer: "Compost + potash", tip: "Monitor thrips and apply mulch to stabilize root-zone temperature." }
  }
};

function CropAdvice() {
  const [form, setForm] = useState({
    soilType: "loam",
    season: "summer",
    location: "",
    water: "medium"
  });
  const [submitted, setSubmitted] = useState(false);

  const recommendation = useMemo(() => {
    return cropRules[form.soilType]?.[form.season] || cropRules.loam.summer;
  }, [form.soilType, form.season]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="crop-advice-page animate-fade">
      <section className="crop-advice-hero">
        <div>
          <span className="hero-badge">Crop Recommendation</span>
          <h1>Get crop advice for your field</h1>
          <p>Enter your soil, season, location and water availability to generate a practical crop plan for your farm.</p>
        </div>
        <div className="crop-advice-hero-card card-premium">
          <HiOutlineSparkles size={34} />
          <strong>Smart suggestion ready</strong>
          <span>Personalized crop, fertilizer and field action guidance.</span>
        </div>
      </section>

      <div className="crop-advice-grid">
        <form className="card-premium crop-advice-form" onSubmit={handleSubmit}>
          <h2>Tell us about your field</h2>

          <label>
            Soil type
            <select name="soilType" value={form.soilType} onChange={handleChange}>
              <option value="loam">Loam soil</option>
              <option value="clay">Clay soil</option>
              <option value="sandy">Sandy soil</option>
              <option value="red">Red soil</option>
            </select>
          </label>

          <label>
            Season
            <select name="season" value={form.season} onChange={handleChange}>
              <option value="summer">Summer</option>
              <option value="monsoon">Monsoon</option>
              <option value="winter">Winter</option>
            </select>
          </label>

          <label>
            Location
            <input name="location" value={form.location} onChange={handleChange} placeholder="Example: Salem, Tamil Nadu" />
          </label>

          <label>
            Water availability
            <select name="water" value={form.water} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <button className="btn-premium btn-primary" type="submit">
            Get advice <HiOutlineSparkles />
          </button>
        </form>

        <div className={`card-premium crop-advice-result ${submitted ? "is-ready" : ""}`}>
          <div className="result-header">
            <HiOutlineCheckCircle size={34} />
            <div>
              <span>{submitted ? "Recommended crop" : "Preview recommendation"}</span>
              <h2>{recommendation.crop}</h2>
            </div>
          </div>

          <div className="advice-detail-grid">
            <div>
              <HiOutlineBeaker size={24} />
              <span>Fertilizer</span>
              <strong>{recommendation.fertilizer}</strong>
            </div>
            <div>
              <HiOutlineCloud size={24} />
              <span>Water plan</span>
              <strong>{form.water === "low" ? "Conserve moisture" : form.water === "high" ? "Drainage watch" : "Normal irrigation"}</strong>
            </div>
            <div>
              <HiOutlineLocationMarker size={24} />
              <span>Region</span>
              <strong>{form.location || "Not entered"}</strong>
            </div>
            <div>
              <HiOutlineCalendar size={24} />
              <span>Next action</span>
              <strong>Field inspection</strong>
            </div>
          </div>

          <div className="advice-tip">
            <strong>Farmer tip</strong>
            <p>{recommendation.tip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CropAdvice;
