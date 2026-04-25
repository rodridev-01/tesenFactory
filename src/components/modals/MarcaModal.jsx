import React from "react";
import { FaTimes, FaTag, FaSave } from "react-icons/fa";

const MarcaModal = ({
  isOpen,
  onClose,
  onSubmit,
  editingId,
  nombre,
  setNombre,
  clearForm,
  labelStyle,
  inputContainer,
  iconInInput,
  inputStyled,
}) => {
  if (!isOpen) return null;

  const handleClose = () => {
    onClose();
    if (clearForm) clearForm();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content"
        style={{
          width: 400,
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
          <h2 style={{ margin: 0, fontSize: "1.25rem", color: "#f1f5f9" }}>
            {editingId ? "Editar Marca" : "Nueva Marca"}
          </h2>

          <button
            onClick={handleClose}
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

        <form onSubmit={onSubmit} style={{ padding: "25px" }}>
          <label style={labelStyle}>Nombre de la Marca</label>

          <div style={inputContainer}>
            <FaTag style={iconInInput} />
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              style={inputStyled}
              autoFocus
              placeholder="Ej: Honda"
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
              onClick={handleClose}
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
              className="btn-crear"
              style={{
                width: "auto",
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#ef4444",
                padding: "10px 25px",
                borderRadius: 6,
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
};

export default MarcaModal;