import React from "react";
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const variants = {
  success: {
    icon: FaCheckCircle,
    color: "#10b981",
    glow: "rgba(16, 185, 129, 0.15)",
  },
  error: {
    icon: FaExclamationTriangle,
    color: "#ef4444",
    glow: "rgba(239, 68, 68, 0.15)",
  },
  info: {
    icon: FaInfoCircle,
    color: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.15)",
  },
};

function GlobalModal({ isOpen, onClose, type = "info", title, message }) {
  if (!isOpen) return null;

  const config = variants[type] || variants.info;
  const Icon = config.icon;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.75)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "420px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: "12px",
          boxShadow: `0 20px 40px rgba(0,0,0,0.5), 0 0 25px ${config.glow}`,
          overflow: "hidden",
          animation: "modalEntry 0.25s ease",
        }}
      >
        {/* HEADER SOLO TEXTO */}
        <div
          style={{
            padding: "14px 18px",
            borderBottom: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#151517",
          }}
        >
          <h3 style={{ color: "#f1f5f9"}}>
            {title || "Mensaje del sistema"}
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY ICONO + TEXTO */}
        <div style={{ padding: "2px 18px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
            }}
          >
            {/* ICONO */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={50} color={config.color} />
            </div>

            {/* TEXTO */}
            <div>
              <p
                style={{
                  margin: 0,
                  color: "#cbd5e1",
                  fontSize: "0.95rem",
                  lineHeight: 1.5,
                }}
              >
                {message}
              </p>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div
          style={{
            padding: "14px 18px",
            borderTop: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: config.color,
              border: "none",
              color: "white",
              padding: "8px 16px",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Aceptar
          </button>
        </div>
      </div>

      <style>
        {`
          @keyframes modalEntry {
            from { opacity: 0; transform: scale(0.96) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}
      </style>
    </div>
  );
}

export default GlobalModal;