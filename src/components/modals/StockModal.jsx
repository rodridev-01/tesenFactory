import React from "react";
import {
  FaTimes,
  FaBox,
  FaLayerGroup,
  FaExclamationTriangle,
} from "react-icons/fa";

function StockModal({
  isOpen,
  onClose,
  stockForm,
  setStockForm,
  productos,
  onSave,
}) {
  if (!isOpen) return null;

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
    zIndex: 1,
  };

  const inputStyled = {
    width: "100%",
    padding: "10px 10px 10px 35px",
    borderRadius: "6px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          width: "500px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          padding: 0,
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
            Configurar Stock Inicial
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

        <div style={{ padding: "30px", display: "grid", gap: 15 }}>
          <div>
            <label style={labelStyle}>Producto</label>
            <div style={inputContainer}>
              <FaBox style={iconInInput} />
              <select
                value={stockForm.idProducto}
                disabled
                style={{
                  ...inputStyled,
                  appearance: "none",
                  cursor: "not-allowed",
                  opacity: 0.8,
                }}
              >
                <option value="">Seleccione un producto...</option>
                {productos.map((p) => (
                  <option
                    key={p.id_producto || p.idProducto}
                    value={p.id_producto || p.idProducto}
                  >
                    {p.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 20,
            }}
          >
            <div>
              <label style={labelStyle}>Stock Inicial</label>
              <div style={inputContainer}>
                <FaLayerGroup style={iconInInput} />
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={stockForm.stockActual}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      stockActual: e.target.value,
                    })
                  }
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Stock Mínimo</label>
              <div style={inputContainer}>
                <FaExclamationTriangle style={iconInInput} />
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={stockForm.stockMinimo}
                  onChange={(e) =>
                    setStockForm({
                      ...stockForm,
                      stockMinimo: e.target.value,
                    })
                  }
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "20px",
              textAlign: "right",
              borderTop: "1px solid #2d2d30",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "1px solid #2d2d30",
                background: "transparent",
                color: "#cbd5e1",
                cursor: "pointer",
              }}
            >
              Omitir
            </button>

            <button
              className="btn-crear"
              onClick={onSave}
              style={{
                width: "auto",
                marginTop: 0,
                background: "#ef4444",
                border: "none",
                padding: "10px 25px",
                borderRadius: 6,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Guardar Stock
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StockModal;