import React from "react";
import { FaTimes } from "react-icons/fa";

function ConfirmModal({
  isOpen,
  title = "Confirmar acción",
  message,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 420,
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3 style={{ color: "#f1f5f9" }}>{title}</h3>
          <FaTimes
            onClick={onCancel}
            style={{ cursor: "pointer", color: "#9ca3af" }}
          />
        </div>

        <p style={{ color: "#cbd5e1", marginTop: 10 }}>{message}</p>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 10,
            marginTop: 20,
          }}
        >
          <button
            onClick={onCancel}
            style={{
              padding: "8px 14px",
              background: "transparent",
              border: "1px solid #475569",
              color: "#cbd5e1",
              borderRadius: 6,
            }}
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            style={{
              padding: "8px 14px",
              background: "#ef4444",
              border: "none",
              color: "white",
              borderRadius: 6,
              fontWeight: "bold",
            }}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;