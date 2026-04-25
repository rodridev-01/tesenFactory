import React from "react";
import {
  FaTimes,
  FaIdCard,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaSave,
  FaFileAlt,
} from "react-icons/fa";

function ClienteModal({
  isOpen,
  onClose,
  form,
  handleChange,
  handleSubmit,
  editId,
}) {
  if (!isOpen) return null;

  const labelStyle = {
    display: "block",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#cbd5e1",
    fontSize: "0.85rem",
  };

  const inputContainer = { position: "relative", width: "100%" };

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
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{
          width: "700px",
          padding: "0",
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
            {editId ? "Editar Cliente" : "Registrar Cliente"}
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
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Tipo Documento</label>
              <div style={inputContainer}>
                <FaFileAlt style={iconInInput} />
                <select
                  name="tipoDocumento"
                  value={form.tipoDocumento}
                  onChange={handleChange}
                  style={{ ...inputStyled, appearance: "none", cursor: "pointer" }}
                >
                  <option value="DNI">DNI (Persona)</option>
                  <option value="RUC">RUC (Empresa)</option>
                  <option value="CE">Carnet Extranjería</option>
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Número de Documento *</label>
              <div style={inputContainer}>
                <FaIdCard style={iconInInput} />
                <input
                  name="dni"
                  type="number"
                  value={form.dni}
                  onChange={handleChange}
                  placeholder="Ingrese número"
                  style={inputStyled}
                  required
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Nombres *</label>
              <div style={inputContainer}>
                <FaUser style={iconInInput} />
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Ingrese nombres"
                  style={inputStyled}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Apellidos</label>
              <div style={inputContainer}>
                <FaUser style={iconInInput} />
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Ingrese apellidos"
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Teléfono Celular</label>
              <div style={inputContainer}>
                <FaPhone style={iconInInput} />
                <input
                  name="telefono"
                  type="number"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Número celular"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Correo Electrónico</label>
              <div style={inputContainer}>
                <FaEnvelope style={iconInInput} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="correo@ejemplo.com"
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={labelStyle}>Dirección Fiscal</label>
            <div style={inputContainer}>
              <FaMapMarkerAlt style={iconInInput} />
              <input
                name="direccion"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Dirección completa"
                style={inputStyled}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px",
              marginTop: "30px",
              borderTop: "1px solid #2d2d30",
              paddingTop: "20px",
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
                gap: "8px",
                background: "#ef4444",
                padding: "10px 25px",
                borderRadius: "6px",
                color: "white",
                fontWeight: "bold",
                border: "none",
                cursor: "pointer",
              }}
            >
              <FaSave /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClienteModal;
