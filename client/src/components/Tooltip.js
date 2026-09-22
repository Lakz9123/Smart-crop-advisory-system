import React, { useState } from "react";

function Tooltip({ text, children, position = "top" }) {
  const [visible, setVisible] = useState(false);

  const getPositionStyle = () => {
    const styles = {
      top: { bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: "8px" },
      bottom: { top: "100%", left: "50%", transform: "translateX(-50%)", marginTop: "8px" },
      left: { right: "100%", top: "50%", transform: "translateY(-50%)", marginRight: "8px" },
      right: { left: "100%", top: "50%", transform: "translateY(-50%)", marginLeft: "8px" }
    };
    return styles[position] || styles.top;
  };

  const getArrowStyle = () => {
    const arrows = {
      top: { top: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #333" },
      bottom: { bottom: "100%", left: "50%", transform: "translateX(-50%)", borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "6px solid #333" },
      left: { left: "100%", top: "50%", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "6px solid #333" },
      right: { right: "100%", top: "50%", transform: "translateY(-50%)", borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderRight: "6px solid #333" }
    };
    return arrows[position] || arrows.top;
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <div
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        style={{ display: "inline-block" }}
      >
        {children}
      </div>
      {visible && (
        <div style={{
          position: "absolute",
          ...getPositionStyle(),
          backgroundColor: "#333",
          color: "white",
          padding: "6px 12px",
          borderRadius: "6px",
          fontSize: "12px",
          whiteSpace: "nowrap",
          zIndex: 1000,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
        }}>
          {text}
          <div style={{
            position: "absolute",
            ...getArrowStyle(),
            width: 0,
            height: 0
          }} />
        </div>
      )}
    </div>
  );
}

export default Tooltip;