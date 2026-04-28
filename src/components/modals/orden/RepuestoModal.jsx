import React from "react";

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

  return (
    <div className="modal-overlay" onClick={() => setShowModal(false)}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "800px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: "10px",
          padding: "20px",
          color: "#f1f5f9",
        }}
      >
        <h3 style={{ marginBottom: "20px" }}>
          Orden #{ordenSeleccionada?.id_orden}
        </h3>

        <h4>Repuestos de la Orden</h4>
        {detalles.map((d) => (
          <div
            key={d.id}
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 80px 120px 100px 120px",
              gap: "10px",
              alignItems: "center",
              marginBottom: "10px",
              padding: "10px",
              border: "1px solid #2d2d30",
              borderRadius: "8px",
            }}
          >
            <span>{d.descripcion}</span>
            <span>x{d.cantidad}</span>
            <span>S/ {Number(d.precioUnitario).toFixed(2)}</span>
            <span>{d.aprobado ? "✅" : "⏳"}</span>

            {!d.aprobado && (
              <button
                onClick={() => aprobarDetalle(d.id)}
                style={{
                  background: "#22c55e",
                  border: "none",
                  color: "white",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Aprobar
              </button>
            )}
          </div>
        ))}

        <hr style={{ margin: "20px 0", borderColor: "#2d2d30" }} />

        <h4>Agregar Repuesto</h4>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 120px 120px",
            gap: "10px",
            marginBottom: "20px",
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
            style={{ padding: "10px", borderRadius: "6px" }}
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
            style={{ padding: "10px", borderRadius: "6px" }}
          />

          <button
            onClick={agregarDetalle}
            style={{
              background: "#3b82f6",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Agregar
          </button>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            onClick={aprobarOrden}
            style={{
              background: "#22c55e",
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Aprobar Orden
          </button>

          <button
            onClick={() => setShowModal(false)}
            style={{
              background: "#475569",
              border: "none",
              color: "white",
              padding: "10px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default RepuestoModal;