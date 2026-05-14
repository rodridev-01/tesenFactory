import React from "react";
import { FaTimes, FaPlus, FaSave, FaTrash } from "react-icons/fa";

function RepuestoModal({
  showModal,
  setShowModal,
  ordenSeleccionada,
  detalles,
  productos,
  nuevoDetalle,
  setNuevoDetalle,
  agregarDetalle,
  eliminarDetalle,
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

  const servicios = detalles || [];
  const repuestos = productos || [];

  const totalGeneral = servicios.reduce((acc, d) => acc + (d.total || 0), 0);

  const getTipoColor = (tipo) => {
    switch (tipo) {
      case "PRODUCTO":
        return "#3b82f6";
      default:
        return "#ef4444";
    }
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

          {/* ================= SERVICIOS ================= */}
          <label style={labelStyle}>Servicios (desde diagnóstico)</label>

          {servicios.map((d, i) => {

            const producto = productos.find(
              (p) =>
                Number(p.id_producto || p.idProducto) === Number(d.idProducto)
            );

            return (
              <div
                key={i}
                style={{
                  display: "grid",
                  gridTemplateColumns: "90px 2fr 1fr 1fr 50px",
                  gap: "8px",
                  marginBottom: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    background: getTipoColor(producto?.tipo),
                    color: "white",
                    borderRadius: "12px",
                    fontSize: "12px",
                    textAlign: "center",
                    padding: "6px",
                    fontWeight: "600",
                  }}
                >
                  {producto?.tipo || "SERVICIO"}
                </div>

                <div style={{ color: "#f1f5f9" }}>
                  {d.descripcion}
                </div>

                <input
                  value={d.precioUnitario}
                  disabled
                  style={inputStyled}
                />

                <input
                  value={d.cantidad}
                  disabled
                  style={inputStyled}
                />

                <button
                  onClick={() => eliminarDetalle(d.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#ef4444",
                    cursor: "pointer",
                  }}
                >
                  <FaTrash />
                </button>
              </div>
            );
          })}

          {/* ================= REPUESTOS ================= */}
          <label style={{ ...labelStyle, marginTop: "20px" }}>
            Repuestos (materiales)
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 120px 120px",
              gap: "10px",
              marginBottom: "10px",
            }}
          >
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
              {repuestos.map((p) => (
                <option
                  key={p.id_producto || p.idProducto}
                  value={p.id_producto || p.idProducto}
                >
                  {p.nombre}
                </option>
              ))}
            </select>

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

            <button
              onClick={agregarDetalle}
              style={{
                background: "#3b82f6",
                border: "none",
                color: "white",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <FaPlus /> Agregar
            </button>
          </div>

          {/* TOTAL */}
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
            <strong>Total servicios</strong>
            <strong>S/ {totalGeneral.toFixed(2)}</strong>
          </div>

          {/* ACCIONES */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              onClick={aprobarOrden}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#22c55e",
                padding: "10px 18px",
                borderRadius: "6px",
                color: "white",
                border: "none",
                cursor: "pointer",
                fontWeight: "600",
              }}
            >
              <FaSave /> Aprobar orden
            </button>

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
          </div>

        </div>
      </div>
    </div>
  );
}

export default RepuestoModal;