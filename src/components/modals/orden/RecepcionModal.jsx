import React from "react";
import {
  FaSave,
  FaTimes,
  FaTachometerAlt,
  FaGasPump,
  FaClipboardList,
  FaCarCrash,
} from "react-icons/fa";

const RecepcionModal = ({
  modalOpen,
  setModalOpen,
  form,
  setForm,
  handleSave,
  handleChange,
  clientes,
  vehiculosFiltrados,
  tecnicos,
  SearchableSelect,
  inputStyled,
  setModalCliente,
  setModalVehiculo,
  modoEdicion,
}) => {
  if (!modalOpen) return null;

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
    zIndex: 1,
  };

  const styledInput = {
    ...inputStyled,
    width: "100%",
    paddingLeft: "35px",
    background: "#151517",
    border: "1px solid #2d2d30",
  };

  return (
    <div className="modal-overlay" onClick={() => setModalOpen(false)}>
      <div
        className="modal-content"
        style={{
          width: "650px",
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
            {modoEdicion ? "Editar Recepción" : "Nueva Recepción"}
          </h2>

          <button
            onClick={() => setModalOpen(false)}
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

        <form onSubmit={handleSave}>
          <div style={{ padding: "30px", display: "grid", gap: 18 }}>
            <SearchableSelect
              label="Cliente *"
              placeholder="Buscar cliente..."
              items={clientes}
              value={form.id_cliente}
              onChange={(value) =>
                setForm({ ...form, id_cliente: value, id_vehiculo: "" })
              }
              getOptionLabel={(c) => `${c.nombre} ${c.apellido}`}
              getOptionValue={(c) => c.idCliente || c.id_cliente}
              onAddNew={() => setModalCliente(true)}
              addLabel=""
            />

            <SearchableSelect
              label="Vehículo *"
              placeholder="Buscar vehículo..."
              items={vehiculosFiltrados}
              value={form.id_vehiculo}
              onChange={(value) =>
                setForm({ ...form, id_vehiculo: value })
              }
              getOptionLabel={(v) =>
                `${v.marcaNombre} ${v.modelo} - ${v.placa}`
              }
              getOptionValue={(v) => v.idVehiculo || v.id_vehiculo}
              onAddNew={() => {
                if (!form.id_cliente) {
                  alert("Primero selecciona un cliente");
                  return;
                }
                setModalVehiculo(true);
                console.log("cliente actual:", form.id_cliente);
              }}
              addLabel=""
            />

            <SearchableSelect
              label="Técnico *"
              placeholder="Buscar técnico..."
              items={tecnicos}
              value={form.id_tecnico}
              onChange={(value) =>
                setForm({ ...form, id_tecnico: value })
              }
              getOptionLabel={(t) => `${t.nombre} ${t.apellido}`}
              getOptionValue={(t) => t.idUsuario || t.id_usuario}
            />

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 20,
              }}
            >
              <div>
                <label style={labelStyle}>Kilometraje</label>
                <div style={inputContainer}>
                  <FaTachometerAlt style={iconInInput} />
                  <input
                    name="kilometrajeEntrada"
                    placeholder="Ej. 50000"
                    value={form.kilometrajeEntrada || ""}
                    onChange={handleChange}
                    style={styledInput}
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Nivel de Combustible</label>
                <div style={inputContainer}>
                  <FaGasPump style={iconInInput} />
                  <select
                    name="nivelCombustible"
                    value={form.nivelCombustible || ""}
                    onChange={handleChange}
                    style={styledInput}
                  >
                    <option value="" disabled>Nivel de combustible</option>
                    <option value="Vacío">Vacío (E)</option>
                    <option value="1/4">1/4 tanque</option>
                    <option value="1/2">1/2 tanque</option>
                    <option value="3/4">3/4 tanque</option>
                    <option value="Lleno">Lleno (F)</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label style={labelStyle}>Motivo de Ingreso</label>
              <div style={inputContainer}>
                <FaClipboardList style={iconInInput} />
                <input
                  name="motivoIngreso"
                  placeholder="Describe el motivo del ingreso"
                  value={form.motivoIngreso || ""}
                  onChange={handleChange}
                  style={styledInput}
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Daños Visuales</label>
              <div style={inputContainer}>
                <FaCarCrash style={iconInInput} />
                <input
                  name="danosVisuales"
                  placeholder="Daños visibles o observaciones"
                  value={form.danosVisuales || ""}
                  onChange={handleChange}
                  style={styledInput}
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
                onClick={() => setModalOpen(false)}
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
                  background: modoEdicion ? "#3b82f6" : "#ef4444",
                  color: "white",
                  padding: "10px 24px",
                  border: "none",
                  borderRadius: 6,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                <FaSave /> {modoEdicion ? "Actualizar Recepción" : "Guardar Recepción"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecepcionModal;