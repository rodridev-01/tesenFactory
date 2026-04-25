import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaPlus, FaTimes, FaSearch, FaSave } from "react-icons/fa";
import GlobalDataTable from "../GlobalDatatable";
import SearchableSelect from "../layout/SearchableSelect";
import ClienteModal from "../modals/ClienteModal";
import VehiculoModal from "../modals/VehiculoModal";
import { useClientes } from "../../hooks/useClientes";
import { useVehiculos } from "../../hooks/useVehiculos";

function Recepcion() {

  const [ordenes, setOrdenes] = useState([]);
  const [vehiculosFiltrados, setVehiculosFiltrados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const {
    clientes,
    clienteForm,
    handleClienteChange,
    guardarCliente
  } = useClientes();

  const {
    vehiculos,
    marcas,
    years,
    vehiculoForm,
    handleVehiculoChange,
    handleGuardarVehiculo
  } = useVehiculos();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDiagnostico, setModalDiagnostico] = useState(false);

  const [modalCliente, setModalCliente] = useState(false);
  const [modalVehiculo, setModalVehiculo] = useState(false);

  const [diagnosticoForm, setDiagnosticoForm] = useState({
    idOrden: "",
    diagnostico: "",
    creadoPor: ""
  });

  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    id_taller: 1,
    id_cliente: "",
    id_vehiculo: "",
    id_tecnico: "",
    kilometrajeEntrada: "",
    nivelCombustible: "",
    motivoIngreso: "",
    danosVisuales: ""
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [ordenesData, usuariosData] = await Promise.all([
        fetchWithAuth("http://localhost:8080/api/ordenes/estado/recepcion"),
        fetchWithAuth("http://localhost:8080/api/usuarios")
      ]);

      setOrdenes(ordenesData || []);
      setUsuarios(usuariosData || []);

      const tecnicosFiltrados = (usuariosData || []).filter(u => {
        const rol = u.idRol || u.id_rol;
        return rol === 2 || rol === "TECNICO";
      });

      setTecnicos(tecnicosFiltrados);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (form.id_cliente) {
      const filtrados = vehiculos.filter(v =>
        (v.idCliente || v.id_cliente) == form.id_cliente
      );
      setVehiculosFiltrados(filtrados);
    } else {
      setVehiculosFiltrados([]);
    }
  }, [form.id_cliente, vehiculos]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const clearForm = () => {
    setForm({
      id_taller: 1,
      id_cliente: "",
      id_vehiculo: "",
      id_tecnico: "",
      kilometrajeEntrada: "",
      nivelCombustible: "",
      motivoIngreso: "",
      danosVisuales: ""
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.id_cliente || !form.id_vehiculo) {
      return alert("Cliente y Vehículo son obligatorios");
    }

    try {
      await fetchWithAuth("http://localhost:8080/api/ordenes/recepcion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(form)
      });

      alert("Recepción creada");
      setModalOpen(false);
      clearForm();
      loadAll();

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const filteredData = ordenes.filter(o =>
    o.id_orden.toString().includes(search)
  );

  const abrirDiagnostico = (orden) => {
    setDiagnosticoForm({
      idOrden: orden.id_orden,
      diagnostico: "",
      creadoPor: orden.id_tecnico || ""
    });
    setModalDiagnostico(true);
  };

  const handleDiagnosticoChange = (e) => {
    setDiagnosticoForm({
      ...diagnosticoForm,
      [e.target.name]: e.target.value
    });
  };

  const guardarDiagnostico = async (e) => {
    e.preventDefault();

    try {
      await fetchWithAuth("http://localhost:8080/api/ordenes/diagnostico", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(diagnosticoForm)
      });

      alert("Diagnóstico registrado");
      setModalDiagnostico(false);
      loadAll();

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const getClienteNombre = (id) => {
    const c = clientes.find(c =>
      (c.idCliente || c.id_cliente) == id
    );
    return c ? `${c.nombre} ${c.apellido}` : id;
  };

  const getVehiculoNombre = (id) => {
    const v = vehiculos.find(v =>
      (v.idVehiculo || v.id_vehiculo) == id
    );
    return v ? `${v.marcaNombre} ${v.modelo} - ${v.placa}` : id;
  };

  const getTecnicoNombre = (id) => {
    const t = usuarios.find(u =>
      (u.idUsuario || u.id_usuario) == id
    );
    return t ? `${t.nombre} ${t.apellido}` : id;
  };

  const columns = [
    { name: "Orden", selector: row => row.id_orden, sortable: true },
    { name: "Cliente", selector: row => getClienteNombre(row.id_cliente) },
    { name: "Vehículo", selector: row => getVehiculoNombre(row.id_vehiculo) },
    { name: "Técnico", selector: row => getTecnicoNombre(row.id_tecnico) },
    {
      name: "Kilometraje",
      selector: row => {
        const km = row.kilometrajeEntrada || row.kilometraje_entrada;
        return km ? `${Number(km).toLocaleString('en-US')} km` : "-";
      },
      sortable: true
    },
    { name: "Combustible", selector: row => row.nivelCombustible || row.nivel_combustible || "-" },
    { name: "Estado", selector: row => row.estado },
    { name: "Daños Visuales", selector: row => row.danosVisuales || row.danos_visuales || "-" },
    { name: "Motivo Ingreso", selector: row => row.motivoIngreso || row.motivo_ingreso || "-" },
    {
      name: "Fecha Ingreso",
      selector: row => {
        const fecha = row.fecha_ingreso;

        if (!fecha) return "-";

        return new Date(fecha).toLocaleString("es-PE", {
          dateStyle: "short",
          timeStyle: "short"
        });
      }
    },
    {
      name: "Acciones",
      cell: row => (
        <button
          onClick={() => abrirDiagnostico(row)}
          style={{
            background: "#22c55e",
            color: "white",
            border: "none",
            padding: "6px 10px",
            borderRadius: "6px",
            cursor: "pointer"
          }}
        >
          Diagnóstico
        </button>
      )
    }
  ];

  // 🔹 estilos
  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#cbd5e1', fontSize: '0.85rem' };
  const inputContainer = { position: 'relative', width: '100%' };
  const inputStyled = {
    width: '100%', padding: '10px', borderRadius: '8px',
    border: '1px solid #2d2d30', background: '#151517', color: '#f1f5f9'
  };

  return (
    <div style={{ padding: "20px", minHeight: "100%", background: "#151517" }}>

      {/* BOTÓN */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          onClick={() => { clearForm(); setModalOpen(true); }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ef4444",
            padding: "10px 20px",
            borderRadius: 6,
            color: "white",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold"
          }}
        >
          <FaPlus /> Nueva Orden
        </button>
      </div>

      {/* TABLA */}
      <div style={{ background: "#1f1f22", border: "1px solid #2d2d30" }}>
        <GlobalDataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          subHeaderComponent={
            <div style={{ position: "relative", width: "250px" }}>
              <FaSearch style={{ position: "absolute", top: "10px", left: "10px", color: "#9ca3af" }} />
              <input
                type="text"
                placeholder="Buscar orden..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px 10px 10px 35px",
                  borderRadius: "8px",
                  border: "1px solid #2d2d30",
                  background: "#151517",
                  color: "#f1f5f9"
                }}
              />
            </div>
          }
        />
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            style={{
              width: 450,
              background: "#1f1f22",
              border: "1px solid #2d2d30",
              padding: 20
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ color: "#f1f5f9" }}>Nueva Recepción</h2>

            <form onSubmit={handleSave}>

              {/* CLIENTE */}
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
                addLabel="Agregar nuevo cliente"
              />

              {/* VEHÍCULO */}
              <SearchableSelect
                label="Vehículo *"
                placeholder="Buscar vehículo..."
                items={vehiculosFiltrados}
                value={form.id_vehiculo}
                onChange={(value) => setForm({ ...form, id_vehiculo: value })}
                getOptionLabel={(v) => `${v.marcaNombre} ${v.modelo} - ${v.placa}`}
                getOptionValue={(v) => v.idVehiculo || v.id_vehiculo}
                onAddNew={() => setModalVehiculo(true)}
                addLabel="Registrar nuevo vehículo"
              />
              <SearchableSelect
                label="Técnico *"
                placeholder="Buscar técnico..."
                items={tecnicos}
                value={form.id_tecnico}
                onChange={(value) => setForm({ ...form, id_tecnico: value })}
                getOptionLabel={(t) => `${t.nombre} ${t.apellido}`}
                getOptionValue={(t) => t.idUsuario || t.id_usuario}
              />

              <input name="kilometrajeEntrada" placeholder="Kilometraje" onChange={handleChange} style={inputStyled} />
              <input name="nivelCombustible" placeholder="Combustible" onChange={handleChange} style={inputStyled} />
              <input name="motivoIngreso" placeholder="Motivo" onChange={handleChange} style={inputStyled} />
              <input name="danosVisuales" placeholder="Daños" onChange={handleChange} style={inputStyled} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setModalOpen(false)}>Cancelar</button>
                <button type="submit" style={{ background: "#ef4444", color: "white", padding: "8px 15px" }}>
                  <FaSave /> Guardar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {modalDiagnostico && (
        <div className="modal-overlay" onClick={() => setModalDiagnostico(false)}>
          <div
            style={{
              width: 400,
              background: "#1f1f22",
              border: "1px solid #2d2d30",
              padding: 20
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ color: "#f1f5f9" }}>Registrar Diagnóstico</h2>

            <form onSubmit={guardarDiagnostico}>

              <label style={labelStyle}>Diagnóstico</label>
              <textarea
                name="diagnostico"
                value={diagnosticoForm.diagnostico}
                onChange={handleDiagnosticoChange}
                required
                style={{ ...inputStyled, minHeight: 80 }}
              />

              <label style={labelStyle}>Técnico</label>
              <select
                name="creadoPor"
                value={diagnosticoForm.creadoPor}
                onChange={handleDiagnosticoChange}
                required
                style={{ ...inputStyled, cursor: "pointer" }}
              >
                <option value="">Seleccione técnico...</option>
                {tecnicos.map(t => (
                  <option
                    key={t.idUsuario || t.id_usuario}
                    value={t.idUsuario || t.id_usuario}
                  >
                    {t.nombre} {t.apellido}
                  </option>
                ))}
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 10 }}>
                <button type="button" onClick={() => setModalDiagnostico(false)}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  style={{
                    background: "#22c55e",
                    color: "white",
                    padding: "8px 15px",
                    border: "none",
                    borderRadius: 6
                  }}
                >
                  <FaSave /> Guardar
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      <ClienteModal
        isOpen={modalCliente}
        onClose={() => setModalCliente(false)}
        form={clienteForm}
        handleChange={handleClienteChange}
        handleSubmit={async (e) => {
          e.preventDefault();
          const nuevoCliente = await guardarCliente(clienteForm);
          if (nuevoCliente) {
            setModalCliente(false);
            setForm(prev => ({
              ...prev,
              id_cliente: nuevoCliente.idCliente || nuevoCliente.id_cliente
            }));
          }
        }}
      />

      <VehiculoModal
        isOpen={modalVehiculo}
        onClose={() => setModalVehiculo(false)}
        form={vehiculoForm}
        handleChange={handleVehiculoChange}
        handleSubmit={async (e) => {
          const nuevoVehiculo = await handleGuardarVehiculo(e);
          if (nuevoVehiculo) {
            setModalVehiculo(false);
            await loadAll();
            setForm(prev => ({
              ...prev,
              id_vehiculo: nuevoVehiculo.idVehiculo || nuevoVehiculo.id_vehiculo
            }));
          }
        }}
        clientes={clientes}
        marcas={marcas}
        years={years}
      />
    </div>
  );
}

export default Recepcion;