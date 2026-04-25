import React from "react";
import {
  FaTimes,
  FaSave,
  FaBox,
  FaBarcode,
  FaTag,
  FaDollarSign,
} from "react-icons/fa";

function ProductoModal({
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
          width: "800px",
          padding: 0,
          background: "#1f1f22",
          border: "1px solid #2d2d30",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "20px 30px",
            borderBottom: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#151517",
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "#f1f5f9",
              fontSize: "1.3rem",
            }}
          >
            {editingId ? "Actualizar Producto" : "Nuevo Producto"}
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

        <div
          className="form-grid"
          style={{
            padding: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Nombre del Producto *</label>
              <div style={inputContainer}>
                <FaTag style={iconInInput} />
                <input
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                  placeholder="Ej: Aceite Motor 20W50"
                  style={inputStyled}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Código SKU</label>
              <div style={inputContainer}>
                <FaBarcode style={iconInInput} />
                <input
                  value={formData.sku}
                  onChange={(e) => handleChange("sku", e.target.value)}
                  placeholder="COD-001"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Unidad de Medida</label>
              <div style={inputContainer}>
                <FaBox style={iconInInput} />
                <select
                  value={formData.unidad}
                  onChange={(e) => handleChange("unidad", e.target.value)}
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">Seleccione...</option>
                  <option value="UND">Unidad (UND)</option>
                  <option value="LTS">Litros (LTS)</option>
                  <option value="GAL">Galones (GAL)</option>
                  <option value="KIT">Kit (KIT)</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <label style={labelStyle}>Precio Compra</label>
              <div style={inputContainer}>
                <FaDollarSign style={iconInInput} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioCompra}
                  onChange={(e) => handleChange("precioCompra", e.target.value)}
                  placeholder="0.00"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Precio Venta *</label>
              <div style={inputContainer}>
                <FaDollarSign style={{ ...iconInInput, color: "#ef4444" }} />
                <input
                  type="number"
                  step="0.01"
                  value={formData.precioVenta}
                  onChange={(e) => handleChange("precioVenta", e.target.value)}
                  placeholder="0.00"
                  style={{
                    ...inputStyled,
                    borderColor: "#ef4444",
                    color: "#ef4444",
                    fontWeight: "bold",
                  }}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                cursor: "pointer",
                fontSize: "0.95rem",
                color: "#cbd5e1",
                background: "rgba(239, 68, 68, 0.05)",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid rgba(239, 68, 68, 0.2)",
              }}
            >
              <input
                type="checkbox"
                checked={formData.activo}
                onChange={(e) => handleChange("activo", e.target.checked)}
                style={{
                  accentColor: "#ef4444",
                  width: "16px",
                  height: "16px",
                }}
              />
              <span style={{ fontWeight: "600" }}>
                Producto disponible para venta (Activo)
              </span>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
              paddingTop: "25px",
              marginTop: "10px",
              borderTop: "1px solid #2d2d30",
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 25px",
                borderRadius: "6px",
                border: "1px solid #2d2d30",
                background: "transparent",
                color: "#cbd5e1",
                fontWeight: "500",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              className="btn-crear"
              onClick={onSave}
              style={{
                marginTop: 0,
                width: "auto",
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 30px",
                fontSize: "1rem",
                background: "#ef4444",
                border: "none",
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <FaSave />
              {editingId ? "Actualizar" : "Guardar Producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductoModal;