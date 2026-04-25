import React from "react";
import {
  FaTimes,
  FaUser,
  FaCar,
  FaHashtag,
  FaPalette,
  FaTachometerAlt,
  FaCalendarAlt,
  FaCogs,
  FaSave,
  FaBarcode,
  FaTag,
} from "react-icons/fa";

function VehiculoModal({
  isOpen,
  onClose,
  form,
  handleChange,
  handleSubmit,
  editId,
  clientes,
  marcas,
  years,
}) {
  if (!isOpen) return null;

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
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
    padding: "10px 10px 10px 38px",
    borderRadius: "8px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
    boxSizing: "border-box",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          width: 750,
          padding: 0,
          background: "#1f1f22",
          border: "1px solid #2d2d30",
        }}
        onClick={(e) => e.stopPropagation()}
      >
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
          <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#f1f5f9" }}>
            {editId ? "Editar Vehículo" : "Registrar Vehículo"}
          </h3>

          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: "1.2rem",
              color: "#9ca3af",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: "25px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
            <div>
              <label style={labelStyle}>Cliente *</label>
              <div style={inputContainer}>
                <FaUser style={iconInInput} />
                <select
                  name="idCliente"
                  value={form.idCliente}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">Seleccione...</option>
                  {clientes.map((c) => (
                    <option key={c.idCliente || c.id_cliente} value={c.idCliente || c.id_cliente}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Marca *</label>
              <div style={inputContainer}>
                <FaTag style={iconInInput} />
                <select
                  name="idMarca"
                  value={form.idMarca}
                  onChange={handleChange}
                  required
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  <option value="">Seleccione...</option>
                  {marcas.map((m) => (
                    <option key={m.id_marca || m.idMarca} value={m.id_marca || m.idMarca}>
                      {m.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
            <div>
              <label style={labelStyle}>Modelo *</label>
              <div style={inputContainer}>
                <FaCar style={iconInInput} />
                <input
                  name="modelo"
                  value={form.modelo}
                  onChange={handleChange}
                  placeholder="Ej: CB190R"
                  style={inputStyled}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Placa *</label>
              <div style={inputContainer}>
                <FaHashtag style={iconInInput} />
                <input
                  name="placa"
                  value={form.placa}
                  onChange={handleChange}
                  placeholder="Ej: 1234-56"
                  style={inputStyled}
                  required
                />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
            <div>
              <label style={labelStyle}>Año de Fab.</label>
              <div style={inputContainer}>
                <FaCalendarAlt style={iconInInput} />
                <select
                  name="anio"
                  value={form.anio}
                  onChange={handleChange}
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Kilometraje</label>
              <div style={inputContainer}>
                <FaTachometerAlt style={iconInInput} />
                <input
                  name="kilometraje"
                  type="number"
                  value={form.kilometraje}
                  onChange={handleChange}
                  placeholder="0"
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "15px" }}>
            <div>
              <label style={labelStyle}>Color</label>
              <div style={inputContainer}>
                <FaPalette style={iconInInput} />
                <input
                  name="color"
                  value={form.color}
                  onChange={handleChange}
                  placeholder="Ej: Rojo"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Sistema / Mecánica</label>
              <div style={inputContainer}>
                <FaCogs style={iconInInput} />
                <select
                  name="sistema"
                  value={form.sistema}
                  onChange={handleChange}
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  <option value="Carburada">Carburada</option>
                  <option value="Inyectada">Inyectada</option>
                  <option value="Scooter">Scooter</option>
                  <option value="Eléctrica">Eléctrica</option>
                  <option value="MotoCarga">MotoCarga / Trimovil</option>
                </select>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>VIN / Nro de Serie (Chasis)</label>
            <div style={inputContainer}>
              <FaBarcode style={iconInInput} />
              <input
                name="vin"
                value={form.vin}
                onChange={handleChange}
                placeholder="Ingrese el código alfanumérico del chasis"
                style={inputStyled}
              />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handleChange}
              placeholder="Detalles extra o daños previos..."
              style={{ ...inputStyled, minHeight: "80px", padding: "10px" }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "20px",
              paddingTop: "15px",
              borderTop: "1px solid #2d2d30",
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: "10px 20px",
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
              type="submit"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#ef4444",
                border: "none",
                padding: "10px 25px",
                borderRadius: 6,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              <FaSave />
              {editId ? "Actualizar Vehículo" : "Guardar Vehículo"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VehiculoModal;