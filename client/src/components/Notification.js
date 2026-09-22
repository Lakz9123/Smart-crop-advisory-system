import React from "react";
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle, HiXCircle } from "react-icons/hi";

const Notification = ({ message, type }) => {
  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "rgba(16, 185, 129, 0.2)",
          icon: <HiCheckCircle style={{ color: "#10B981", fontSize: "24px" }} />,
          textColor: "#065F46"
        };
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.2)",
          icon: <HiXCircle style={{ color: "#EF4444", fontSize: "24px" }} />,
          textColor: "#991B1B"
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          border: "rgba(245, 158, 11, 0.2)",
          icon: <HiExclamationCircle style={{ color: "#F59E0B", fontSize: "24px" }} />,
          textColor: "#92400E"
        };
      default:
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "rgba(59, 130, 246, 0.2)",
          icon: <HiInformationCircle style={{ color: "#3B82F6", fontSize: "24px" }} />,
          textColor: "#1E40AF"
        };
    }
  };

  const { bg, border, icon, textColor } = getStyles();

  return (
    <div style={{
      minWidth: "300px",
      maxWidth: "450px",
      padding: "16px 20px",
      borderRadius: "16px",
      backgroundColor: bg,
      backdropFilter: "blur(12px)",
      border: `1px solid ${border}`,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      display: "flex",
      alignItems: "center",
      gap: "12px",
      animation: "slideIn 0.3s ease-out forwards",
      pointerEvents: "auto",
    }}>
      <div style={{ flexShrink: 0 }}>{icon}</div>
      <div style={{ 
        color: textColor, 
        fontSize: "14px", 
        fontWeight: "600",
        lineHeight: "1.4"
      }}>
        {message}
      </div>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Notification;
