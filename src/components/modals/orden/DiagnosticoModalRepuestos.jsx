import React from "react";
import { FaTimes, FaPlus, FaSave, FaWrench } from "react-icons/fa";

function DiagnosticoModalRepuestos({
  showModal,
  setShowModal,
  ordenSeleccionada,
  detalles,
  productos,
  getProducto,
  handleProductoChange,
  removeRow,
  addRow,
  guardarDetalles,
  totalGeneral
}) {
  if (!showModal) return null;

  const servicios = productos.filter((p) => p.tipo === "SERVICIO");

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#cbd5e1",
    fontSize: "0.85rem",
  };

  const inputStyled = {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
  };

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "850px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "18px 20px",
            borderBottom: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#151517",
          }}
        >
          <h3 style={{ margin: 0, color: "#f1f5f9", fontSize: "1.1rem" }}>
            Orden #{ordenSeleccionada?.id_orden}
          </h3>

          <button
            onClick={() => setShowModal(false)}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <label style={labelStyle}>Servicios del diagnóstico</label>

          {detalles.map((d, i) => {
            const producto = getProducto(d.idProducto);

            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 2fr 1fr 1fr 80px",
                  gap: "8px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                {/* TIPO */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    background: "#ff6060",
                    borderRadius: "12px",
                    fontSize: "14px",
                    padding: "6px",
                    justifyContent: "center",
                  }}
                >
                  Servicio
                </div>

                {/* SERVICIO */}
                <select
                  value={d.idProducto}
                  onChange={(e) => handleProductoChange(i, e.target.value)}
                  style={inputStyled}
                >
                  <option value="">Seleccionar servicio</option>
                  {servicios.map((p) => (
                    <option
                      key={p.id_producto || p.idProducto}
                      value={p.id_producto || p.idProducto}
                    >
                      {p.nombre}
                    </option>
                  ))}
                </select>

                {/* PRECIO */}
                <input
                  type="number"
                  value={d.precio}
                  disabled
                  style={inputStyled}
                />

                {/* CANTIDAD */}
                <input value={1} disabled style={inputStyled} />

                {/* ELIMINAR */}
                <button
                  onClick={() => removeRow(i)}
                  disabled={detalles.length === 1}
                  style={{
                    background: "transparent",
                    border: "1px solid #2d2d30",
                    color: detalles.length === 1 ? "#475569" : "#ef4444",
                    borderRadius: "6px",
                    cursor: detalles.length === 1 ? "not-allowed" : "pointer",
                    height: "42px",
                  }}
                >
                  <FaTimes />
                </button>
              </div>
            );
          })}

          <button
            onClick={addRow}
            style={{
              marginTop: "10px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "1px dashed #475569",
              color: "#cbd5e1",
              padding: "10px",
              borderRadius: "6px",
              cursor: "pointer",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <FaPlus /> Agregar servicio
          </button>

          <div
            style={{
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #2d2d30",
              display: "flex",
              justifyContent: "space-between",
              color: "#f1f5f9",
            }}
          >
            <strong>Total</strong>
            <strong>S/ {totalGeneral.toFixed(2)}</strong>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "1px solid #475569",
                background: "transparent",
                color: "#cbd5e1",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>

            <button
              onClick={guardarDetalles}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#ef4444",
                padding: "10px 18px",
                borderRadius: "6px",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <FaSave /> Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiagnosticoModalRepuestos;