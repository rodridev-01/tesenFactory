import React from "react";
import { FaTimes, FaSave, FaTag, FaDollarSign } from "react-icons/fa";

function ServiceModal({
  isOpen,
  onClose,
  editingId,
  formData,
  setFormData,
  onSave,
}) {
  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.nombre?.trim()) return "El nombre es obligatorio";
    if (!formData.precioVenta) return "El precio de venta es obligatorio";
    return null;
  };

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#cbd5e1",
    fontSize: "0.85rem",
  };

  const inputContainer = {
    position: "relative",
    width: "100%",
  };

  const iconInInput = {
    position: "absolute",
    left: "12px",
    top: "11px",
    color: "#9ca3af",
    fontSize: "15px",
  };

  const inputStyled = {
    width: "100%",
    padding: "10px 10px 10px 35px",
    borderRadius: "6px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.95rem",
    background: "#151517",
    color: "#f1f5f9",
    boxSizing: "border-box",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          width: "600px",
          padding: 0,
          background: "#1f1f22",
          border: "1px solid #2d2d30",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "20px 25px",
            borderBottom: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#151517",
          }}
        >
          <h2 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.2rem" }}>
            {editingId ? "Actualizar Servicio" : "Nuevo Servicio"}
          </h2>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.3rem",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div style={{ padding: "25px", display: "flex", flexDirection: "column", gap: "15px" }}>
          
          {/* NOMBRE */}
          <div>
            <label style={labelStyle}>Nombre del Servicio *</label>
            <div style={inputContainer}>
              <FaTag style={iconInInput} />
              <input
                value={formData.nombre || ""}
                onChange={(e) => handleChange("nombre", e.target.value)}
                placeholder="Ej: Cambio de aceite"
                style={inputStyled}
              />
            </div>
          </div>

          {/* PRECIO */}
          <div>
            <label style={labelStyle}>Precio Venta *</label>
            <div style={inputContainer}>
              <FaDollarSign style={iconInInput} />
              <input
                type="number"
                step="0.01"
                value={formData.precioVenta || ""}
                onChange={(e) => handleChange("precioVenta", e.target.value)}
                placeholder="0.00"
                style={{
                  ...inputStyled,
                  fontWeight: "bold",
                  color: "#ef4444",
                  borderColor: "#ef4444",
                }}
              />
            </div>
          </div>

          {/* ACTIVO */}
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: "0.95rem",
              color: "#cbd5e1",
              marginTop: "10px",
            }}
          >
            <input
              type="checkbox"
              checked={formData.activo ?? true}
              onChange={(e) => handleChange("activo", e.target.checked)}
              style={{ accentColor: "#ef4444" }}
            />
            Servicio activo
          </label>

          {/* FOOTER */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              borderTop: "1px solid #2d2d30",
              paddingTop: "20px",
              marginTop: "10px",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                background: "transparent",
                border: "1px solid #2d2d30",
                color: "#cbd5e1",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={() => {
                const error = validateForm();
                if (error) {
                  alert(error);
                  return;
                }
                onSave();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 25px",
                background: "#ef4444",
                border: "none",
                color: "white",
                fontWeight: "bold",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              <FaSave />
              {editingId ? "Actualizar" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceModal;