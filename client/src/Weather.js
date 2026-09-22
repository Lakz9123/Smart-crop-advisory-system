import React, { useMemo, useState } from "react";
import axios from "axios";
import {
  HiOutlineBeaker,
  HiOutlineCalendar,
  HiOutlineCloud,
  HiOutlineClock,
  HiOutlineExclamationCircle,
  HiOutlineEye,
  HiOutlineFire,
  HiOutlineLightningBolt,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineShieldCheck,
  HiOutlineSparkles,
  HiOutlineSun,
  HiOutlineTrendingUp
} from "react-icons/hi";
import { useLanguage } from "./LanguageContext";

const forecastTimeline = [
  { time: "6 AM", temp: 24, rain: 12, label: "Light mist" },
  { time: "9 AM", temp: 28, rain: 18, label: "Good field work" },
  { time: "12 PM", temp: 33, rain: 8, label: "Heat stress watch" },
  { time: "3 PM", temp: 35, rain: 15, label: "Avoid spraying" },
  { time: "6 PM", temp: 29, rain: 36, label: "Rain possible" }
];

const savedLocations = ["Salem", "Coimbatore", "Madurai", "Thanjavur"];

function WeatherMetric({ icon: Icon, label, value, detail }) {
  return (
    <div className="weather-metric-card">
      <span><Icon size={24} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function WeatherAdvice({ icon: Icon, title, desc, tone }) {
  return (
    <div className={`weather-advice-card ${tone}`}>
      <Icon size={26} />
      <div>
        <strong>{title}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function Weather() {
  const { t } = useLanguage();
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTimeline, setActiveTimeline] = useState(1);

  const API_KEY = "4674429a25d12cbfbb1ba0e4e7701e8f";

  const translateWeatherCondition = (description) => {
    const map = {
      "broken clouds": "Broken clouds",
      "few clouds": "Few clouds",
      "scattered clouds": "Scattered clouds",
      "overcast clouds": "Overcast clouds",
      "clear sky": "Clear sky",
      "light rain": "Light rain",
      "moderate rain": "Moderate rain",
      "heavy intensity rain": "Heavy rain",
      "shower rain": "Shower rain",
      thunderstorm: "Thunderstorm",
      snow: "Snow",
      mist: "Mist"
    };
    return map[description.toLowerCase()] || description;
  };

  const getWeather = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location},IN&appid=${API_KEY}&units=metric`
      );
      setWeather(res.data);
    } catch (err) {
      setError(t("errorOccurred"));
      setWeather(null);
    }
    setLoading(false);
  };

  const current = weather?.weather?.[0];
  const condition = current ? translateWeatherCondition(current.description) : "Clear field conditions";
  const temp = Math.round(weather?.main?.temp ?? 29);
  const humidity = weather?.main?.humidity ?? 62;
  const wind = weather?.wind?.speed ?? 3.2;
  const feelsLike = Math.round(weather?.main?.feels_like ?? 31);
  const city = weather?.name || "Tamil Nadu";
  const country = weather?.sys?.country || "IN";

  const farmScore = useMemo(() => {
    const heatPenalty = temp > 34 ? 18 : temp > 30 ? 8 : 0;
    const humidityPenalty = humidity > 80 ? 14 : humidity > 65 ? 6 : 0;
    const windPenalty = wind > 7 ? 12 : 0;
    return Math.max(52, 94 - heatPenalty - humidityPenalty - windPenalty);
  }, [humidity, temp, wind]);

  const irrigationAdvice = temp > 32 || humidity < 45 ? "Irrigate before 8 AM" : "Normal irrigation window";
  const sprayAdvice = wind > 6 ? "Avoid spraying today" : "Safe spray window: morning";
  const pestRisk = humidity > 75 ? "High fungal risk" : humidity > 60 ? "Moderate pest watch" : "Low pest pressure";

  return (
    <div className="weather-page animate-fade">
      <section className="weather-hero">
        <div className="weather-hero-copy">
          <span className="hero-badge"><HiOutlineSparkles /> Farm Weather Intelligence</span>
          <h1>{t("weatherTitle")}</h1>
          <p>Plan irrigation, spraying, harvest movement and field visits with weather insights built for crop decisions.</p>

          <form className="weather-search-panel" onSubmit={getWeather}>
            <div>
              <HiOutlineSearch size={22} />
              <input
                placeholder=""
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </div>
            <button className="btn-premium btn-primary" type="submit" disabled={loading}>
              {loading ? t("loading") : t("getWeather")} <HiOutlineRefresh />
            </button>
          </form>

          <div className="weather-location-chips">
            {savedLocations.map((item) => (
              <button key={item} type="button" onClick={() => setLocation(item)}>
                <HiOutlineLocationMarker size={16} /> {item}
              </button>
            ))}
          </div>
          {error && <div className="weather-error">{error}</div>}
        </div>

        <div className="weather-current-card">
          <div className="weather-orbit">
            <HiOutlineSun size={70} />
          </div>
          <div className="weather-current-top">
            <div>
              <span>{city}, {country}</span>
              <h2>{temp}°C</h2>
              <p>{condition}</p>
            </div>
            <div className="weather-score">
              <strong>{farmScore}</strong>
              <span>Farm score</span>
            </div>
          </div>
          <div className="weather-current-strip">
            <div><span>Feels</span><strong>{feelsLike}°C</strong></div>
            <div><span>Humidity</span><strong>{humidity}%</strong></div>
            <div><span>Wind</span><strong>{wind} m/s</strong></div>
          </div>
        </div>
      </section>

      <section className="weather-grid">
        <div className="weather-main-column">
          <div className="weather-metrics-grid">
            <WeatherMetric icon={HiOutlineCloud} label={t("humidity")} value={`${humidity}%`} detail="Impacts fungal disease pressure" />
            <WeatherMetric icon={HiOutlineLightningBolt} label={t("windSpeed")} value={`${wind} m/s`} detail="Spray drift and field safety" />
            <WeatherMetric icon={HiOutlineFire} label={t("feelsLike")} value={`${feelsLike}°C`} detail="Heat stress indicator" />
            <WeatherMetric icon={HiOutlineEye} label="Visibility" value={`${weather?.visibility ? Math.round(weather.visibility / 1000) : 8} km`} detail="Good for field scouting" />
          </div>

          <div className="card-premium weather-timeline-card">
            <div className="weather-card-heading">
              <div>
                <span>Today timeline</span>
                <h3>Best field activity windows</h3>
              </div>
              <HiOutlineCalendar size={28} />
            </div>
            <div className="weather-timeline">
              {forecastTimeline.map((item, index) => (
                <button
                  key={item.time}
                  type="button"
                  className={activeTimeline === index ? "is-active" : ""}
                  onClick={() => setActiveTimeline(index)}
                >
                  <span>{item.time}</span>
                  <strong>{item.temp}°</strong>
                  <small>{item.rain}% rain</small>
                  <p>{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="weather-advice-grid">
            <WeatherAdvice icon={HiOutlineBeaker} title="Irrigation decision" desc={irrigationAdvice} tone="blue" />
            <WeatherAdvice icon={HiOutlineShieldCheck} title="Spray decision" desc={sprayAdvice} tone="green" />
            <WeatherAdvice icon={HiOutlineExclamationCircle} title="Crop risk" desc={pestRisk} tone="amber" />
          </div>
        </div>

        <aside className="weather-side-column">
          <div className="card-premium weather-radar-card">
            <div className="weather-card-heading">
              <div>
                <span>Field readiness</span>
                <h3>Operations board</h3>
              </div>
              <HiOutlineTrendingUp size={28} />
            </div>
            <div className="weather-readiness">
              <div style={{ "--value": `${farmScore}%` }}>
                <strong>{farmScore}%</strong>
                <span>Ready</span>
              </div>
            </div>
            <div className="weather-checklist">
              <p><HiOutlineClock /> Morning field visit preferred</p>
              <p><HiOutlineCloud /> Watch humidity before pesticide spray</p>
              <p><HiOutlineSun /> Protect young crops from afternoon heat</p>
            </div>
          </div>

          <div className="card-premium weather-alert-card">
            <span>Smart advisory</span>
            <h3>{temp > 33 ? "Heat stress possible" : "Stable weather window"}</h3>
            <p>{temp > 33 ? "Avoid fertilizer application during peak afternoon heat. Prefer early morning or evening." : "Current conditions are suitable for scouting, irrigation planning and light field work."}</p>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Weather;
