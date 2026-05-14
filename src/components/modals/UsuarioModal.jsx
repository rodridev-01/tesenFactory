import React from "react";
import {
  FaTimes,
  FaUser,
  FaIdCard,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaUserTag,
  FaBuilding,
  FaSave,
} from "react-icons/fa";

function UsuarioModal({
  isOpen,
  onClose,
  form,
  handleChange,
  handleSubmit,
  editId,
  roles,
  talleres,
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
        {/* Header */}
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
          <h2 style={{ margin: 0, fontSize: "1.3rem", color: "#f1f5f9" }}>
            {editId ? "Editar Usuario" : "Crear Usuario"}
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

        {/* Formulario */}
        <div style={{ padding: "30px" }}>
          {/* Fila 1 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Nombre *</label>
              <div style={inputContainer}>
                <FaUser style={iconInInput} />
                <input
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  placeholder="Nombre"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Apellido *</label>
              <div style={inputContainer}>
                <FaUser style={iconInInput} />
                <input
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  placeholder="Apellido"
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          {/* Fila 2 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>DNI</label>
              <div style={inputContainer}>
                <FaIdCard style={iconInInput} />
                <input
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  placeholder="Documento"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Usuario (Login) *</label>
              <div style={inputContainer}>
                <FaUserTag style={iconInInput} />
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Usuario"
                  style={inputStyled}
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* Fila 3 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Email *</label>
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

            <div>
              <label style={labelStyle}>
                Contraseña {editId && "(Opcional)"} *
              </label>
              <div style={inputContainer}>
                <FaLock style={iconInInput} />
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••"
                  style={inputStyled}
                  autoComplete="new-password"
                />
              </div>
            </div>
          </div>

          {/* Fila 4 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
              marginBottom: "15px",
            }}
          >
            <div>
              <label style={labelStyle}>Teléfono</label>
              <div style={inputContainer}>
                <FaPhone style={iconInInput} />
                <input
                  name="telefono"
                  value={form.telefono}
                  onChange={handleChange}
                  placeholder="Celular"
                  style={inputStyled}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Dirección</label>
              <div style={inputContainer}>
                <FaMapMarkerAlt style={iconInInput} />
                <input
                  name="direccion"
                  value={form.direccion}
                  onChange={handleChange}
                  placeholder="Dirección"
                  style={inputStyled}
                />
              </div>
            </div>
          </div>

          {/* Fila 5 */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label style={labelStyle}>Rol *</label>
              <div style={inputContainer}>
                <FaUserTag style={iconInInput} />
                <select
                  name="idRol"
                  value={form.idRol}
                  onChange={handleChange}
                  style={{
                    ...inputStyled,
                    appearance: "none",
                    cursor: "pointer",
                  }}
                >
                  <option value="">Seleccione rol...</option>
                  {roles.map((r) => (
                    <option key={r.idRol} value={r.idRol}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Taller</label>
              <div style={inputContainer}>
                <FaBuilding style={iconInInput} />
                <input
                  value={talleres.find(t => t.idTaller === 1)?.nombre || "Principal"}
                  disabled
                  style={{
                    ...inputStyled,
                    opacity: 0.7,
                    cursor: "not-allowed",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "15px",
              paddingTop: "25px",
              marginTop: "20px",
              borderTop: "1px solid #2d2d30",
            }}
          >
            <button
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
              onClick={handleSubmit}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
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
              {editId ? "Actualizar" : "Crear Usuario"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UsuarioModal;