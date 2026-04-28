import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaPlus } from "react-icons/fa";
import OrderCard from "../layout/OrdenCard";
import SearchableSelect from "../layout/SearchableSelect";
import ClienteModal from "../modals/ClienteModal";
import VehiculoModal from "../modals/VehiculoModal";
import RecepcionModal from "../modals/orden/RecepcionModal";
import DiagnosticoModal from "../modals/orden/DiagnosticoModal";
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
    setClientes,
    handleClienteChange,
    guardarCliente
  } = useClientes();

  const {
    vehiculos,
    marcas,
    years,
    vehiculoForm,
    handleVehiculoChange,
    guardarVehiculo,
  } = useVehiculos();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDiagnostico, setModalDiagnostico] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [ordenEditandoId, setOrdenEditandoId] = useState(null);


  const [modalCliente, setModalCliente] = useState(false);
  const [modalVehiculo, setModalVehiculo] = useState(false);

  const [diagnosticoForm, setDiagnosticoForm] = useState({
    idOrden: "",
    diagnostico: "",
    creadoPor: ""
  });

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
      if (modoEdicion) {
        await fetchWithAuth(
          `http://localhost:8080/api/ordenes/recepcion/${ordenEditandoId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
          }
        );

        alert("Recepción actualizada");
      } else {
        await fetchWithAuth("http://localhost:8080/api/ordenes/recepcion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        });

        alert("Recepción creada");
      }

      setModalOpen(false);
      setModoEdicion(false);
      setOrdenEditandoId(null);
      clearForm();
      loadAll();

    } catch (err) {
      alert("Error: " + err.message);
    }
  };

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
      (c.idCliente || c.id_cliente) === id
    );
    return c ? `${c.nombre} ${c.apellido}` : id;
  };

  const getVehiculoNombre = (id) => {
    const v = vehiculos.find(v =>
      (v.idVehiculo || v.id_vehiculo) === id
    );
    return v ? `${v.marcaNombre} ${v.modelo} - ${v.placa}` : id;
  };

  const getTecnicoNombre = (id) => {
    const t = usuarios.find(u =>
      (u.idUsuario || u.id_usuario) === id
    );
    return t ? `${t.nombre} ${t.apellido}` : id;
  };

  const abrirEditar = (orden) => {
    setForm({
      id_taller: orden.id_taller || 1,
      id_cliente: orden.id_cliente,
      id_vehiculo: orden.id_vehiculo,
      id_tecnico: orden.id_tecnico,
      kilometrajeEntrada: orden.kilometrajeEntrada || orden.kilometraje_entrada,
      nivelCombustible: orden.nivelCombustible || orden.nivel_combustible,
      motivoIngreso: orden.motivoIngreso || orden.motivo_ingreso,
      danosVisuales: orden.danosVisuales || orden.danos_visuales
    });

    setOrdenEditandoId(orden.id_orden);
    setModoEdicion(true);
    setModalOpen(true);
  };

  const renderOrdenContent = (orden, badgeStyle) => {
    const km = orden.kilometrajeEntrada || orden.kilometraje_entrada;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "1rem" }}>Orden #{orden.id_orden}</strong>
          <span
            style={badgeStyle(
              orden.estado === "Facturado" ? "#3fb950" : "#58a6ff"
            )}
          >
            {orden.estado || "Pendiente"}
          </span>
        </div>

        <div><strong>Cliente:</strong> {getClienteNombre(orden.id_cliente)}</div>
        <div><strong>Vehículo:</strong> {getVehiculoNombre(orden.id_vehiculo)}</div>
        <div><strong>Técnico:</strong> {getTecnicoNombre(orden.id_tecnico)}</div>
        <div><strong>Kilometraje:</strong> {km ? `${Number(km).toLocaleString("en-US")} km` : "-"}</div>
        <div><strong>Combustible:</strong> {orden.nivelCombustible || orden.nivel_combustible || "-"}</div>
        <div><strong>Daños Visuales:</strong> {orden.danosVisuales || orden.danos_visuales || "-"}</div>
        <div><strong>Motivo Ingreso:</strong> {orden.motivoIngreso || orden.motivo_ingreso || "-"}</div>
        <div><strong>Fecha Ingreso:</strong> {
          orden.fecha_ingreso
            ? new Date(orden.fecha_ingreso).toLocaleString("es-PE", {
              dateStyle: "short",
              timeStyle: "short",
            })
            : "-"
        }</div>
      </>
    );
  };

  const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: '600', color: '#cbd5e1', fontSize: '0.85rem' };
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

      <OrderCard
        title="Órdenes en Recepción"
        data={ordenes}
        renderContent={renderOrdenContent}
        buttonConfig={{
          prev: false,
          print: true,
          edit: true,
          diagnostic: true,
          details: true,
          delete: true,
          comments: true,
          view: true,
          next: true,
        }}
        buttonActions={{
          print: (orden) => console.log("Imprimir", orden),
          edit: abrirEditar,
          diagnostic: abrirDiagnostico,
          details: (orden) => console.log("Detalles", orden),
          delete: (orden) => console.log("Eliminar", orden),
          comments: (orden) => console.log("Comentarios", orden),
          view: (orden) => console.log("Visualizar", orden),
          next: (orden) => console.log("Siguiente", orden),
        }}
      />

      <RecepcionModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        form={form}
        setForm={setForm}
        handleSave={handleSave}
        handleChange={handleChange}
        clientes={clientes}
        vehiculosFiltrados={vehiculosFiltrados}
        tecnicos={tecnicos}
        SearchableSelect={SearchableSelect}
        inputStyled={inputStyled}
        setModalCliente={setModalCliente}
        setModalVehiculo={setModalVehiculo}
        modoEdicion={modoEdicion}
      />

      <DiagnosticoModal
        modalDiagnostico={modalDiagnostico}
        setModalDiagnostico={setModalDiagnostico}
        guardarDiagnostico={guardarDiagnostico}
        diagnosticoForm={diagnosticoForm}
        handleDiagnosticoChange={handleDiagnosticoChange}
        tecnicos={tecnicos}
        labelStyle={labelStyle}
        inputStyled={inputStyled}
      />

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
            setClientes(prev => [...prev, nuevoCliente]);
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
        form={{
          ...vehiculoForm,
          idCliente: form.id_cliente,
        }}
        handleChange={handleVehiculoChange}
        handleSubmit={async (e) => {
          e.preventDefault();
          const nuevoVehiculo = await guardarVehiculo(vehiculoForm);
          setModalVehiculo(false);
          await loadAll();
          setForm(prev => ({
            ...prev,
            id_vehiculo: nuevoVehiculo?.idVehiculo || nuevoVehiculo?.id_vehiculo
          }));
        }}
        clientes={clientes}
        marcas={marcas}
        years={years}
      />
    </div>
  );
}

export default Recepcion;