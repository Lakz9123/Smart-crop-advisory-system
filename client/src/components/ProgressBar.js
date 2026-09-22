import React from "react";

function ProgressBar({ progress, color = "#4CAF50" }) {
  return (
    <div style={{
      width: "100%",
      height: "6px",
      backgroundColor: "#e0e0e0",
      borderRadius: "3px",
      overflow: "hidden"
    }}>
      <div style={{
        width: `${progress}%`,
        height: "100%",
        backgroundColor: color,
        transition: "width 0.3s ease",
        borderRadius: "3px"
      }} />
    </div>
  );
}

export default ProgressBar;