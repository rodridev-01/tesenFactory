import React from "react";
import {
  FaSave,
  FaTimes,
  FaStethoscope,
  FaUserCog,
} from "react-icons/fa";

const DiagnosticoModal = ({
  modalDiagnostico,
  setModalDiagnostico,
  guardarDiagnostico,
  diagnosticoForm,
  handleDiagnosticoChange,
  tecnicos,
}) => {
  if (!modalDiagnostico) return null;

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
    resize: "vertical",
  };

  return (
    <div className="modal-overlay" onClick={() => setModalDiagnostico(false)}>
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
            Registrar Diagnóstico
          </h2>

          <button
            type="button"
            onClick={() => setModalDiagnostico(false)}
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

        <form onSubmit={guardarDiagnostico}>
          <div style={{ padding: "30px", display: "grid", gap: 18 }}>
            <div>
              <label style={labelStyle}>Diagnóstico</label>
              <div style={inputContainer}>
                <FaStethoscope style={iconInInput} />
                <textarea
                  name="diagnostico"
                  value={diagnosticoForm.diagnostico}
                  onChange={handleDiagnosticoChange}
                  required
                  placeholder="Describe el diagnóstico del vehículo..."
                  style={{ ...inputStyled, minHeight: 120, paddingTop: "12px" }}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Técnico Responsable</label>

              <div style={inputContainer}>
                <FaUserCog style={iconInInput} />

                <input
                  type="text"
                  disabled
                  value={
                    tecnicos.find(
                      (t) =>
                        Number(t.idUsuario || t.id_usuario) ===
                        Number(diagnosticoForm.creadoPor)
                    )
                      ? `${tecnicos.find(
                          (t) =>
                            Number(t.idUsuario || t.id_usuario) ===
                            Number(diagnosticoForm.creadoPor)
                        ).nombre} ${
                          tecnicos.find(
                            (t) =>
                              Number(t.idUsuario || t.id_usuario) ===
                              Number(diagnosticoForm.creadoPor)
                          ).apellido
                        }`
                      : ""
                  }
                  style={{
                    ...inputStyled,
                    background: "#0f0f11",
                    cursor: "not-allowed",
                  }}
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "10px",
                paddingTop: "20px",
                borderTop: "1px solid #2d2d30",
                display: "flex",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <button
                type="button"
                onClick={() => setModalDiagnostico(false)}
                style={{
                  padding: "10px 20px",
                  borderRadius: "6px",
                  border: "1px solid #2d2d30",
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
                  background: "#ef4444",
                  color: "white",
                  padding: "10px 22px",
                  border: "none",
                  borderRadius: "6px",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: "600",
                  cursor: "pointer",
                }}
              >
                <FaSave /> Guardar Diagnóstico
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiagnosticoModal;