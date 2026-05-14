import React, { useEffect, useState } from "react";
import {
  FaTimes,
  FaSave,
  FaClipboardCheck,
  FaTools,
} from "react-icons/fa";

function EjecucionModal({
  showModal,
  setShowModal,
  ordenSeleccionada,
  guardarEjecucion,
}) {

  const initialState = {
    informeReparacion: "",
    recomendaciones: "",
  };

  const [formData, setFormData] = useState(initialState);

  useEffect(() => {
    if (showModal) {
      setFormData(initialState);
    }
  }, [showModal]);

  if (!showModal) return null;

  const closeModal = () => {
    setFormData(initialState);
    setShowModal(false);
  };

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
    top: "14px",
    color: "#9ca3af",
    fontSize: "15px",
    zIndex: 1,
  };

  const inputStyled = {
    width: "100%",
    padding: "12px 12px 12px 40px",
    borderRadius: "6px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
    resize: "vertical",
    transition: "0.2s ease",
  };

  const handleGuardar = async () => {

    await guardarEjecucion(formData);

    setFormData(initialState);
  };

  return (
    <div
      className="modal-overlay"
      onClick={closeModal}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "650px",
          background: "#1f1f22",
          border: "1px solid #2d2d30",
          borderRadius: "10px",
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
        }}
      >

        {/* HEADER */}
        <div
          style={{
            padding: "20px 28px",
            borderBottom: "1px solid #2d2d30",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#151517",
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
                color: "#f1f5f9",
                fontSize: "1.25rem",
              }}
            >
              Finalizar Reparación
            </h2>

            <span
              style={{
                color: "#9ca3af",
                fontSize: "0.85rem",
              }}
            >
              Orden #{ordenSeleccionada?.id_orden}
            </span>
          </div>

          <button
            type="button"
            onClick={closeModal}
            style={{
              background: "transparent",
              border: "none",
              color: "#9ca3af",
              fontSize: "1.1rem",
              cursor: "pointer",
            }}
          >
            <FaTimes />
          </button>
        </div>

        {/* BODY */}
        <div
          style={{
            padding: "28px",
            display: "grid",
            gap: "20px",
          }}
        >

          {/* INFORME */}
          <div>
            <label style={labelStyle}>
              Informe de reparación
            </label>

            <div style={inputContainer}>
              <FaClipboardCheck style={iconInInput} />

              <textarea
                rows={6}
                placeholder="Describe el trabajo realizado en el vehículo..."
                value={formData.informeReparacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    informeReparacion: e.target.value,
                  })
                }
                style={{
                  ...inputStyled,
                  minHeight: "130px",
                }}
              />
            </div>
          </div>

          {/* RECOMENDACIONES */}
          <div>
            <label style={labelStyle}>
              Recomendaciones
            </label>

            <div style={inputContainer}>
              <FaTools style={iconInInput} />

              <textarea
                rows={4}
                placeholder="Agregar recomendaciones para el cliente..."
                value={formData.recomendaciones}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    recomendaciones: e.target.value,
                  })
                }
                style={{
                  ...inputStyled,
                  minHeight: "100px",
                }}
              />
            </div>
          </div>

          {/* FOOTER */}
          <div
            style={{
              marginTop: "5px",
              paddingTop: "20px",
              borderTop: "1px solid #2d2d30",
              display: "flex",
              justifyContent: "flex-end",
              gap: "10px",
            }}
          >
            <button
              type="button"
              onClick={closeModal}
              style={{
                padding: "10px 20px",
                borderRadius: "6px",
                border: "1px solid #374151",
                background: "transparent",
                color: "#cbd5e1",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handleGuardar}
              style={{
                background: "#ef4444",
                color: "white",
                padding: "10px 22px",
                border: "none",
                borderRadius: "6px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: "600",
                cursor: "pointer",
              }}
            >
              <FaSave />
              Guardar y pasar a entrega
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EjecucionModal;