import React from "react";
import { FaTimes, FaPlus, FaSave, FaCheck, FaCogs, FaBox } from "react-icons/fa";

function RepuestoModal({
  showModal,
  setShowModal,
  ordenSeleccionada,
  detalles,
  productos,
  nuevoDetalle,
  setNuevoDetalle,
  agregarDetalle,
  aprobarDetalle,
  aprobarOrden,
}) {
  if (!showModal) return null;

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
    top: "12px",
    color: "#9ca3af",
    fontSize: "15px",
    zIndex: 1,
  };

  const inputStyled = {
    width: "100%",
    padding: "10px 10px 10px 38px",
    borderRadius: "6px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
  };

  const totalGeneral = detalles.reduce((acc, d) => acc + (d.total || 0), 0);

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "650px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        {/* HEADER */}
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
          <h3 style={{ margin: 0, color: "#f1f5f9" }}>
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

        <div style={{ padding: "25px" }}>

          {/* ================= SERVICIOS ================= */}
          <label style={labelStyle}>Servicios aprobados</label>

          <div style={{ display: "grid", gap: 10 }}>
            {detalles.map((d, i) => (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 80px 80px 60px",
                  gap: 10,
                  alignItems: "center",
                  padding: "10px",
                  border: "1px solid #2d2d30",
                  borderRadius: "8px",
                }}
              >
                <div style={{ color: "#f1f5f9" }}>{d.descripcion}</div>

                <div style={{ color: "#94a3b8" }}>x{d.cantidad}</div>

                <div style={{ color: "#94a3b8" }}>
                  S/ {Number(d.precioUnitario).toFixed(2)}
                </div>

                <button
                  onClick={() => aprobarDetalle(d.id)}
                  disabled={d.aprobado}
                  style={{
                    background: d.aprobado ? "#475569" : "#22c55e",
                    border: "none",
                    color: "white",
                    borderRadius: "6px",
                    cursor: d.aprobado ? "not-allowed" : "pointer",
                    height: "36px",
                  }}
                >
                  <FaCheck />
                </button>
              </div>
            ))}
          </div>

          {/* ================= AGREGAR REPUESTO ================= */}
          <label style={{ ...labelStyle, marginTop: 20 }}>
            Agregar repuesto
          </label>

          <div style={{ display: "grid", gap: 12 }}>

            {/* SELECT */}
            <div style={inputContainer}>
              <FaBox style={iconInInput} />
              <select
                value={nuevoDetalle.idProducto}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    idProducto: e.target.value,
                  })
                }
                style={inputStyled}
              >
                <option value="">Seleccionar repuesto</option>
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

            {/* CANTIDAD */}
            <div style={inputContainer}>
              <FaCogs style={iconInInput} />
              <input
                type="number"
                min="1"
                value={nuevoDetalle.cantidad}
                onChange={(e) =>
                  setNuevoDetalle({
                    ...nuevoDetalle,
                    cantidad: Number(e.target.value),
                  })
                }
                style={inputStyled}
              />
            </div>

            {/* BOTÓN AGREGAR */}
            <button
              onClick={agregarDetalle}
              style={{
                background: "#3b82f6",
                border: "none",
                color: "white",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
                display: "flex",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FaPlus /> Agregar repuesto
            </button>
          </div>

          {/* TOTAL */}
          <div
            style={{
              marginTop: 20,
              paddingTop: 15,
              borderTop: "1px solid #2d2d30",
              display: "flex",
              justifyContent: "space-between",
              color: "#f1f5f9",
            }}
          >
            <strong>Total</strong>
            <strong>S/ {totalGeneral.toFixed(2)}</strong>
          </div>

          {/* ACCIONES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 10,
              marginTop: 20,
            }}
          >
            <button
              onClick={aprobarOrden}
              style={{
                background: "#22c55e",
                border: "none",
                color: "white",
                padding: "10px 18px",
                borderRadius: "6px",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <FaSave /> Aprobar
            </button>

            <button
              onClick={() => setShowModal(false)}
              style={{
                padding: "10px 18px",
                borderRadius: "6px",
                border: "1px solid #2d2d30",
                background: "transparent",
                color: "#cbd5e1",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default RepuestoModal;