import React from "react";
import {
  HiOutlineBadgeCheck,
  HiOutlineIdentification,
  HiOutlineLocationMarker,
  HiOutlineMail,
  HiOutlineScale,
  HiOutlineShieldCheck,
  HiOutlineUserCircle,
  HiOutlineGlobeAlt
} from "react-icons/hi";

function DetailCard({ icon: Icon, label, value }) {
  return (
    <div className="card-premium" style={{ padding: 24, display: "flex", alignItems: "center", gap: 16 }}>
      <div
        style={{
          width: 46,
          height: 46,
          borderRadius: 12,
          background: "var(--emerald-100)",
          color: "var(--primary)",
          display: "grid",
          placeItems: "center",
          flexShrink: 0
        }}
      >
        <Icon size={22} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: "0.82rem", color: "var(--slate-500)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          {label}
        </div>
        <div style={{ marginTop: 6, color: "var(--slate-900)", fontWeight: 800, overflowWrap: "anywhere" }}>
          {value || "Not added"}
        </div>
      </div>
    </div>
  );
}

function Profile({ user }) {
  const displayName = user?.name || "Farmer";
  const initial = displayName.charAt(0).toUpperCase();
  const roleLabel = user?.role === "admin" ? "Administrator" : "Farmer";

  const details = [
    { icon: HiOutlineUserCircle, label: "Full name", value: displayName },
    { icon: HiOutlineMail, label: "Email address", value: user?.email },
    { icon: HiOutlineBadgeCheck, label: "Account role", value: roleLabel },
    { icon: HiOutlineLocationMarker, label: "Location", value: user?.location },
    { icon: HiOutlineGlobeAlt, label: "Soil type", value: user?.soilType },
    { icon: HiOutlineScale, label: "Land size", value: user?.landSize ? `${user.landSize} acres` : "" }
  ];

  return (
    <div className="animate-fade" style={{ display: "grid", gap: 28 }}>
      <section
        className="card-premium"
        style={{
          padding: 32,
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 24,
          alignItems: "center",
          background: "linear-gradient(135deg, rgba(236, 253, 245, 0.96), rgba(255, 255, 255, 0.98))"
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "var(--primary)",
            color: "white",
            display: "grid",
            placeItems: "center",
            fontSize: "2.4rem",
            fontWeight: 800,
            boxShadow: "0 18px 36px rgba(6, 95, 70, 0.24)"
          }}
        >
          {initial}
        </div>

        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--emerald-700)", fontWeight: 800, marginBottom: 10 }}>
            <HiOutlineShieldCheck size={22} />
            <span>{roleLabel} Profile</span>
          </div>
          <h1 style={{ margin: 0, color: "var(--slate-900)", fontSize: "2.3rem" }}>{displayName}</h1>
          <p style={{ margin: "10px 0 0", color: "var(--slate-600)", maxWidth: 680 }}>
            View your account information and registered farm details in one place.
          </p>
        </div>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 18 }}>
        {details.map((detail) => (
          <DetailCard key={detail.label} icon={detail.icon} label={detail.label} value={detail.value} />
        ))}
      </section>

      <section className="card-premium" style={{ padding: 28 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <HiOutlineIdentification size={26} color="var(--primary)" />
          <h2 style={{ margin: 0, color: "var(--slate-900)", fontSize: "1.5rem" }}>Profile Summary</h2>
        </div>
        <p style={{ margin: 0, color: "var(--slate-600)", lineHeight: 1.8 }}>
          This profile is created from the details entered during registration. Use it to quickly confirm the location,
          soil type, and land size used for crop advisory recommendations.
        </p>
      </section>
    </div>
  );
}

export default Profile;
