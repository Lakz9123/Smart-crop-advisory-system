import React, { useMemo, useState } from "react";
import {
  HiOutlineBadgeCheck,
  HiOutlineChartBar,
  HiOutlineCheckCircle,
  HiOutlineClock,
  HiOutlineCurrencyRupee,
  HiOutlineCube,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
  HiOutlineSearch,
  HiOutlineSparkles,
  HiOutlineTrendingUp,
  HiOutlineTruck
} from "react-icons/hi";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useLanguage } from "./LanguageContext";

const sampleData = [
  { crop: "Rice", market: "Salem", price: 2200, unit: "quintal", date: "2024-03-15", change: 3.4, demand: "High", distance: 18 },
  { crop: "Rice", market: "Erode", price: 2150, unit: "quintal", date: "2024-03-15", change: 1.8, demand: "Medium", distance: 64 },
  { crop: "Rice", market: "Thanjavur", price: 2250, unit: "quintal", date: "2024-03-14", change: 4.1, demand: "High", distance: 126 },
  { crop: "Wheat", market: "Salem", price: 2500, unit: "quintal", date: "2024-03-14", change: 2.2, demand: "Medium", distance: 18 },
  { crop: "Wheat", market: "Coimbatore", price: 2550, unit: "quintal", date: "2024-03-14", change: 3.1, demand: "High", distance: 154 },
  { crop: "Cotton", market: "Coimbatore", price: 6500, unit: "quintal", date: "2024-03-13", change: 5.6, demand: "High", distance: 154 },
  { crop: "Cotton", market: "Madurai", price: 6400, unit: "quintal", date: "2024-03-13", change: -1.2, demand: "Medium", distance: 186 },
  { crop: "Maize", market: "Dindigul", price: 1800, unit: "quintal", date: "2024-03-12", change: 2.9, demand: "High", distance: 138 },
  { crop: "Groundnut", market: "Vellore", price: 5200, unit: "quintal", date: "2024-03-12", change: 4.4, demand: "High", distance: 202 },
  { crop: "Sugarcane", market: "Erode", price: 3500, unit: "ton", date: "2024-03-11", change: 0.8, demand: "Stable", distance: 64 },
  { crop: "Banana", market: "Thanjavur", price: 2800, unit: "quintal", date: "2024-03-11", change: -0.6, demand: "Medium", distance: 126 },
  { crop: "Tomato", market: "Madurai", price: 1850, unit: "quintal", date: "2024-03-15", change: 6.8, demand: "High", distance: 186 },
  { crop: "Tomato", market: "Oddanchatram", price: 1920, unit: "quintal", date: "2024-03-15", change: 7.4, demand: "High", distance: 124 },
  { crop: "Onion", market: "Coimbatore", price: 1650, unit: "quintal", date: "2024-03-15", change: 2.6, demand: "Medium", distance: 154 },
  { crop: "Onion", market: "Dindigul", price: 1720, unit: "quintal", date: "2024-03-14", change: 3.9, demand: "High", distance: 138 },
  { crop: "Potato", market: "Mettupalayam", price: 1450, unit: "quintal", date: "2024-03-14", change: 1.4, demand: "Stable", distance: 176 },
  { crop: "Chilli", market: "Virudhunagar", price: 9800, unit: "quintal", date: "2024-03-13", change: 5.2, demand: "High", distance: 214 },
  { crop: "Brinjal", market: "Salem", price: 1600, unit: "quintal", date: "2024-03-13", change: -1.5, demand: "Medium", distance: 18 },
  { crop: "Mango", market: "Krishnagiri", price: 4200, unit: "quintal", date: "2024-03-12", change: 4.8, demand: "High", distance: 118 },
  { crop: "Grapes", market: "Theni", price: 5600, unit: "quintal", date: "2024-03-12", change: 2.7, demand: "Medium", distance: 196 },
  { crop: "Pomegranate", market: "Coimbatore", price: 7400, unit: "quintal", date: "2024-03-11", change: 3.6, demand: "High", distance: 154 },
  { crop: "Sunflower", market: "Karur", price: 4800, unit: "quintal", date: "2024-03-11", change: 2.1, demand: "Stable", distance: 92 },
  { crop: "Soybean", market: "Erode", price: 4300, unit: "quintal", date: "2024-03-10", change: 1.9, demand: "Medium", distance: 64 },
  { crop: "Ragi", market: "Dharmapuri", price: 3400, unit: "quintal", date: "2024-03-10", change: 4.3, demand: "High", distance: 84 },
  { crop: "Jowar", market: "Namakkal", price: 2950, unit: "quintal", date: "2024-03-10", change: 0.9, demand: "Stable", distance: 54 },
  { crop: "Bajra", market: "Tiruchirappalli", price: 2850, unit: "quintal", date: "2024-03-09", change: 1.6, demand: "Medium", distance: 168 },
  { crop: "Green Gram", market: "Thanjavur", price: 7800, unit: "quintal", date: "2024-03-09", change: 3.8, demand: "High", distance: 126 },
  { crop: "Black Gram", market: "Madurai", price: 8200, unit: "quintal", date: "2024-03-09", change: 4.5, demand: "High", distance: 186 },
  { crop: "Red Gram", market: "Salem", price: 9100, unit: "quintal", date: "2024-03-08", change: 2.4, demand: "Medium", distance: 18 },
  { crop: "Horse Gram", market: "Erode", price: 6200, unit: "quintal", date: "2024-03-08", change: -0.8, demand: "Stable", distance: 64 },
  { crop: "Turmeric", market: "Erode", price: 12200, unit: "quintal", date: "2024-03-08", change: 6.1, demand: "High", distance: 64 },
  { crop: "Coconut", market: "Pollachi", price: 3100, unit: "quintal", date: "2024-03-07", change: 1.2, demand: "Stable", distance: 182 },
  { crop: "Sesame", market: "Villupuram", price: 11200, unit: "quintal", date: "2024-03-07", change: 5.9, demand: "High", distance: 236 },
  { crop: "Coriander", market: "Virudhunagar", price: 7600, unit: "quintal", date: "2024-03-07", change: 2.8, demand: "Medium", distance: 214 },
  { crop: "Tapioca", market: "Salem", price: 2100, unit: "ton", date: "2024-03-06", change: 1.7, demand: "Stable", distance: 18 }
];

const trendData = [
  { month: "Jan", price: 2120 },
  { month: "Feb", price: 2180 },
  { month: "Mar", price: 2240 },
  { month: "Apr", price: 2190 },
  { month: "May", price: 2320 },
  { month: "Jun", price: 2410 }
];

function MarketStat({ icon: Icon, label, value, detail }) {
  return (
    <div className="market-stat-card">
      <span><Icon size={24} /></span>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </div>
  );
}

function PriceRow({ item, active, onClick, translateCrop }) {
  return (
    <button type="button" className={`market-price-row ${active ? "is-active" : ""}`} onClick={onClick}>
      <div>
        <strong>{translateCrop(item.crop)}</strong>
        <span><HiOutlineLocationMarker size={16} /> {item.market}</span>
      </div>
      <div>
        <strong>Rs. {item.price}</strong>
        <span>per {item.unit}</span>
      </div>
      <div className={item.change >= 0 ? "positive" : "negative"}>
        {item.change >= 0 ? "+" : ""}{item.change}%
      </div>
      <div>
        <span>{item.demand}</span>
        <small>{item.distance} km</small>
      </div>
    </button>
  );
}

function MarketPulse({ selectedMarket }) {
  const score = selectedMarket ? Math.min(94, Math.max(42, 56 + selectedMarket.change * 5 + (selectedMarket.demand === "High" ? 16 : selectedMarket.demand === "Stable" ? 8 : 2))) : 0;
  const logisticsCost = selectedMarket ? Math.max(90, Math.round(selectedMarket.distance * 7.5)) : 0;
  const netEstimate = selectedMarket ? Math.max(0, selectedMarket.price - logisticsCost) : 0;
  const demandTone = selectedMarket?.demand === "High" ? "Hot demand" : selectedMarket?.demand === "Stable" ? "Steady buyer flow" : "Compare bids";

  return (
    <div className="card-premium market-pulse-card">
      <div className="weather-card-heading">
        <div>
          <span>Decision cockpit</span>
          <h3>{selectedMarket ? `${selectedMarket.crop} sale readiness` : "Select a crop"}</h3>
        </div>
        <HiOutlineSparkles size={28} />
      </div>

      <div className="market-pulse-orbit" style={{ "--score": `${score}%` }}>
        <div>
          <strong>{score}</strong>
          <span>sale score</span>
        </div>
      </div>

      <div className="market-signal-grid">
        <div>
          <span>Demand</span>
          <strong>{selectedMarket?.demand || "--"}</strong>
          <small>{demandTone}</small>
        </div>
        <div>
          <span>Net estimate</span>
          <strong>Rs. {netEstimate || "--"}</strong>
          <small>after route cost</small>
        </div>
      </div>

      <div className="market-route-strip">
        <HiOutlineLocationMarker size={22} />
        <div>
          <strong>{selectedMarket ? `${selectedMarket.market} route` : "Market route"}</strong>
          <span>{selectedMarket ? `${selectedMarket.distance} km away, approx. Rs. ${logisticsCost} transport` : "Choose a row to estimate distance and cost."}</span>
        </div>
      </div>
    </div>
  );
}

function MarketActionTimeline({ selectedMarket }) {
  const steps = selectedMarket?.change >= 3
    ? ["Call two buyers before noon", "Check grading and moisture", "Book transport for evening"]
    : selectedMarket?.change >= 0
      ? ["Watch one more market update", "Compare nearby mandi bids", "Prepare harvest quantity"]
      : ["Store safely if possible", "Avoid distress sale today", "Recheck price trend tomorrow"];

  return (
    <div className="card-premium market-timeline-card">
      <div className="weather-card-heading">
        <div>
          <span>Next best moves</span>
          <h3>Action timeline</h3>
        </div>
        <HiOutlineClock size={28} />
      </div>
      <div className="market-action-timeline">
        {steps.map((step, index) => (
          <div key={step} style={{ "--delay": `${index * 0.12}s` }}>
            <span>{index + 1}</span>
            <p>{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketOpportunityStack({ prices, selectedMarket, translateCrop, onSelect }) {
  const leaders = [...prices].sort((a, b) => b.price - a.price).slice(0, 4);
  const topPrice = leaders[0]?.price || 1;

  return (
    <div className="card-premium market-opportunity-card">
      <div className="weather-card-heading">
        <div>
          <span>Opportunity stack</span>
          <h3>Best selling lanes</h3>
        </div>
        <HiOutlineChartBar size={28} />
      </div>
      <div className="market-ladder">
        {leaders.map((item, index) => (
          <button
            key={`${item.crop}-${item.market}-${index}`}
            type="button"
            className={selectedMarket === item ? "is-active" : ""}
            onClick={() => onSelect(item)}
          >
            <div>
              <strong>{translateCrop(item.crop)}</strong>
              <span>{item.market} - {item.distance} km</span>
            </div>
            <div className="market-ladder-bar">
              <span style={{ width: `${Math.max(32, (item.price / topPrice) * 100)}%` }} />
            </div>
            <b>Rs. {item.price}</b>
          </button>
        ))}
      </div>
    </div>
  );
}

function BuyerReadinessCard({ selectedMarket }) {
  const buyerCount = selectedMarket ? Math.max(3, Math.round(selectedMarket.change + (selectedMarket.demand === "High" ? 5 : 2))) : 0;
  const paymentSpeed = selectedMarket?.demand === "High" ? "Same day" : selectedMarket?.demand === "Stable" ? "1-2 days" : "Confirm first";
  const score = selectedMarket?.demand === "High" ? 88 : selectedMarket?.demand === "Stable" ? 74 : 61;

  return (
    <div className="card-premium market-buyer-card">
      <div className="weather-card-heading">
        <div>
          <span>Buyer radar</span>
          <h3>Demand confidence</h3>
        </div>
        <HiOutlineBadgeCheck size={28} />
      </div>
      <div className="buyer-meter" style={{ "--value": `${score}%` }}>
        <span />
      </div>
      <div className="market-signal-grid">
        <div>
          <span>Active buyers</span>
          <strong>{buyerCount}</strong>
          <small>likely today</small>
        </div>
        <div>
          <span>Payment</span>
          <strong>{paymentSpeed}</strong>
          <small>expected cycle</small>
        </div>
      </div>
    </div>
  );
}

function HarvestLogisticsCard({ selectedMarket }) {
  const storageText = selectedMarket?.change < 0 ? "Store 24-48 hrs" : selectedMarket?.change >= 3 ? "Move quickly" : "Keep ready";
  const truckSlots = selectedMarket ? Math.max(1, Math.min(6, Math.round((240 - selectedMarket.distance) / 40))) : 0;
  const qualityTip = selectedMarket?.unit === "ton" ? "Confirm weighbridge slip" : "Grade and bag uniformly";

  return (
    <div className="card-premium market-logistics-card">
      <div className="weather-card-heading">
        <div>
          <span>Dispatch planner</span>
          <h3>Harvest movement</h3>
        </div>
        <HiOutlineTruck size={28} />
      </div>
      <div className="logistics-grid">
        <div>
          <HiOutlineCube size={22} />
          <strong>{storageText}</strong>
          <span>storage advice</span>
        </div>
        <div>
          <HiOutlineTruck size={22} />
          <strong>{truckSlots} slots</strong>
          <span>nearby transport</span>
        </div>
      </div>
      <div className="market-route-strip">
        <HiOutlineCheckCircle size={22} />
        <div>
          <strong>{qualityTip}</strong>
          <span>Keep invoice, moisture note, and buyer phone number ready before dispatch.</span>
        </div>
      </div>
    </div>
  );
}

function MarketPrice() {
  const { t } = useLanguage();
  const [cropName, setCropName] = useState("");
  const [prices, setPrices] = useState(sampleData);
  const [error, setError] = useState("");
  const [activeCrop, setActiveCrop] = useState("All");
  const [selectedMarket, setSelectedMarket] = useState(sampleData[0]);

  const crops = useMemo(() => ["All", ...Array.from(new Set(sampleData.map((item) => item.crop)))], []);

  const translateCrop = (crop) => {
    const map = {
      Rice: t("cropRice"),
      Wheat: t("cropWheat"),
      Cotton: t("cropCotton"),
      Maize: t("cropMaize"),
      Groundnut: t("cropGroundnut"),
      Sugarcane: t("cropSugarcane"),
      Banana: t("cropBanana"),
      Tomato: t("cropTomato"),
      Onion: t("cropOnion"),
      Potato: t("cropPotato"),
      Chilli: t("cropChilli"),
      Brinjal: t("cropBrinjal"),
      Mango: t("cropMango"),
      Grapes: t("cropGrapes"),
      Pomegranate: t("cropPomegranate"),
      Sunflower: t("cropSunflower"),
      Soybean: t("cropSoybean"),
      Ragi: t("cropRagi"),
      Jowar: t("cropJowar"),
      Bajra: t("cropBajra"),
      "Green Gram": t("cropGreenGram"),
      "Black Gram": t("cropBlackGram"),
      "Red Gram": t("cropRedGram"),
      "Horse Gram": t("cropHorseGram")
    };
    return map[crop] || crop;
  };

  const updateResults = (nextCrop, query = cropName) => {
    const lowerQuery = query.trim().toLowerCase();
    const nextPrices = sampleData.filter((item) => {
      const cropMatch = nextCrop === "All" || item.crop === nextCrop;
      const searchMatch = !lowerQuery || item.crop.toLowerCase().includes(lowerQuery) || item.market.toLowerCase().includes(lowerQuery);
      return cropMatch && searchMatch;
    });

    setPrices(nextPrices);
    setSelectedMarket(nextPrices[0] || null);
    setError(nextPrices.length ? "" : `${t("noPricesFound")} "${query || nextCrop}"`);
  };

  const searchPrices = (e) => {
    e.preventDefault();
    updateResults(activeCrop);
  };

  const showAll = () => {
    setCropName("");
    setActiveCrop("All");
    setPrices(sampleData);
    setSelectedMarket(sampleData[0]);
    setError("");
  };

  const handleCropFilter = (crop) => {
    setActiveCrop(crop);
    updateResults(crop, cropName);
  };

  const bestMarket = useMemo(() => {
    return prices.reduce((best, item) => (!best || item.price > best.price ? item : best), null);
  }, [prices]);

  const averagePrice = useMemo(() => {
    if (!prices.length) return 0;
    return Math.round(prices.reduce((sum, item) => sum + item.price, 0) / prices.length);
  }, [prices]);

  const sellSignal = selectedMarket?.change >= 3 ? "Strong sell window" : selectedMarket?.change >= 0 ? "Watch and compare" : "Hold if storage is safe";

  return (
    <div className="market-page animate-fade">
      <section className="market-hero">
        <div className="market-hero-copy">
          <span className="hero-badge"><HiOutlineSparkles /> Market Intelligence</span>
          <h1>{t("marketTitle")}</h1>
          <p>Compare market prices, spot the strongest selling window, and choose where to sell your harvest with confidence.</p>

          <form className="market-search-panel" onSubmit={searchPrices}>
            <div>
              <HiOutlineSearch size={22} />
              <input
                placeholder="Search crop or market"
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
              />
            </div>
            <button className="btn-premium btn-primary" type="submit">
              {t("searchCrop")} <HiOutlineRefresh />
            </button>
            <button className="btn-premium btn-secondary" type="button" onClick={showAll}>
              {t("showAll")}
            </button>
          </form>

          <div className="market-chip-row">
            {crops.map((crop) => (
              <button
                key={crop}
                type="button"
                className={activeCrop === crop ? "is-active" : ""}
                onClick={() => handleCropFilter(crop)}
              >
                {crop === "All" ? "All crops" : translateCrop(crop)}
              </button>
            ))}
          </div>
          {error && <div className="weather-error">{error}</div>}
        </div>

        <div className="market-spotlight-card">
          <span>Best market today</span>
          <h2>{bestMarket ? translateCrop(bestMarket.crop) : "No crop"}</h2>
          <strong>{bestMarket ? `Rs. ${bestMarket.price}/${bestMarket.unit}` : "--"}</strong>
          <p>{bestMarket ? `${bestMarket.market} market is currently leading with ${bestMarket.demand.toLowerCase()} demand.` : "Search again to find a selling opportunity."}</p>
        </div>
      </section>

      <section className="market-stats-grid">
        <MarketStat icon={HiOutlineCurrencyRupee} label="Average price" value={`Rs. ${averagePrice || "--"}`} detail="Across selected markets" />
        <MarketStat icon={HiOutlineTrendingUp} label="Top gain" value={`${bestMarket?.change >= 0 ? "+" : ""}${bestMarket?.change ?? 0}%`} detail="Latest market movement" />
        <MarketStat icon={HiOutlineLocationMarker} label="Markets tracked" value={prices.length || 0} detail="Filtered live board" />
        <MarketStat icon={HiOutlineClock} label="Sell signal" value={sellSignal} detail="Based on price momentum" />
      </section>

      <section className="market-grid">
        <div className="card-premium market-board">
          <div className="weather-card-heading">
            <div>
              <span>Price board</span>
              <h3>{cropName ? `${t("price")} - ${cropName}` : t("marketTitle")}</h3>
            </div>
            <HiOutlineChartBar size={28} />
          </div>

          <div className="market-price-list">
            {prices.map((item, index) => (
              <PriceRow
                key={`${item.crop}-${item.market}-${index}`}
                item={item}
                active={selectedMarket === item}
                onClick={() => setSelectedMarket(item)}
                translateCrop={translateCrop}
              />
            ))}
          </div>

        </div>

        <aside className="market-side">
          <div className="card-premium market-trend-card">
            <div className="weather-card-heading">
              <div>
                <span>Trend view</span>
                <h3>{selectedMarket ? translateCrop(selectedMarket.crop) : "Crop"} price movement</h3>
              </div>
              <HiOutlineTrendingUp size={28} />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={trendData} margin={{ top: 10, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="marketGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--slate-200)" vertical={false} />
                <XAxis dataKey="month" tick={{ fill: "var(--slate-500)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--slate-500)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => [`Rs. ${value}`, "Price"]} />
                <Area type="monotone" dataKey="price" stroke="#d97706" strokeWidth={3} fill="url(#marketGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="card-premium market-action-card">
            <span>Farmer action</span>
            <h3>{sellSignal}</h3>
            <p>{selectedMarket ? `${selectedMarket.market} offers Rs. ${selectedMarket.price}/${selectedMarket.unit}. Compare transport cost before confirming sale.` : "Select a market row to see a selling recommendation."}</p>
          </div>

          <MarketPulse selectedMarket={selectedMarket} />

          <MarketActionTimeline selectedMarket={selectedMarket} />

          <MarketOpportunityStack prices={prices} selectedMarket={selectedMarket} translateCrop={translateCrop} onSelect={setSelectedMarket} />

          <BuyerReadinessCard selectedMarket={selectedMarket} />

          <HarvestLogisticsCard selectedMarket={selectedMarket} />
        </aside>
      </section>
    </div>
  );
}

export default MarketPrice;
