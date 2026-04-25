import React, { useState, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import GlobalDataTable from "./GlobalDatatable";
import VehiculoModal from "./modals/VehiculoModal";
import { useVehiculos } from "../hooks/useVehiculos";
import "../assets/styles/Global.css";

function Vehiculos({ idTaller = 1 }) {
  const {
    vehiculos,
    clientes,
    marcas,
    guardarVehiculo,
    cambiarEstadoVehiculo,
  } = useVehiculos(idTaller);

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1999 + 2 },
    (_, i) => currentYear + 1 - i
  );
  const initialForm = {
    idCliente: "",
    idMarca: "",
    modelo: "",
    anio: currentYear,
    sistema: "Carburada",
    placa: "",
    color: "",
    vin: "",
    kilometraje: 0,
    observaciones: "",
  };

  const [form, setForm] = useState(initialForm);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditId(null);
  };

  const closeModal = () => {
    resetForm();
    setModalOpen(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    await guardarVehiculo(form, editId);
    closeModal();
  };

  const handleEdit = (vehiculo) => {
    let sistemaRecuperado = "Carburada";
    let obsLimpia = vehiculo.observaciones || "";

    if (vehiculo.observaciones?.includes("[Sistema:")) {
      const match = vehiculo.observaciones.match(/\[Sistema: (.*?)\]/);
      if (match) {
        sistemaRecuperado = match[1];
        obsLimpia = vehiculo.observaciones.replace(match[0], "").trim();
      }
    }

    setEditId(vehiculo.idVehiculo);
    setForm({
      idCliente: vehiculo.idCliente,
      idMarca: vehiculo.idMarca,
      modelo: vehiculo.modelo,
      anio: vehiculo.anio,
      sistema: sistemaRecuperado,
      placa: vehiculo.placa,
      color: vehiculo.color,
      vin: vehiculo.vin || "",
      kilometraje: vehiculo.kilometraje,
      observaciones: obsLimpia,
    });

    setModalOpen(true);
  };

  const handleToggle = async (id) => {
    await cambiarEstadoVehiculo(id);
  };

  const inputStyled = { width: '100%', padding: '10px 10px 10px 38px', borderRadius: '8px', border: '1px solid #2d2d30', outline: 'none', fontSize: '0.9rem', background: '#151517', color: '#f1f5f9' };

  const filteredData = useMemo(() => {
    return vehiculos.filter((v) => {
      const term = search.toLowerCase();
      return (
        `${v.clienteNombre || ""} ${v.clienteApellido || ""}`
          .toLowerCase()
          .includes(term) ||
        `${v.marcaNombre || ""} ${v.modelo || ""}`
          .toLowerCase()
          .includes(term) ||
        (v.placa || "").toLowerCase().includes(term) ||
        (v.vin || "").toLowerCase().includes(term)
      );
    });
  }, [vehiculos, search]);
  const columns = [
    {
      name: "Cliente",
      selector: (row) => `${row.clienteNombre || ""} ${row.clienteApellido || ""}`,
      sortable: true,
      grow: 2,
    },
    {
      name: "Vehículo",
      selector: (row) => `${row.marcaNombre || ""} ${row.modelo || ""}`,
      sortable: true,
      grow: 2,
    },
    {
      name: "Placa",
      selector: (row) => row.placa,
      sortable: true,
    },
    {
      name: "VIN",
      selector: (row) => row.vin || "-",
    },
    {
      name: "Año",
      selector: (row) => row.anio,
    },
    {
      name: "Estado",
      selector: row => row.activo, width: "80px",
      cell: row => (row.activo ?
        <span clas="badge" style={{ color: '#10b981' }}>Activo</span> :
        <span class="badge" style={{ color: '#ef4444' }}>Inactivo</span>)
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => handleEdit(row)} style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }}>
            <FaEdit size={18} />
          </button>
          <button onClick={() => handleToggle(row.idVehiculo || row.id_vehiculo)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }}><FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];



  return (
    <div className="vehiculos-container">
      <button
        className="btn-crear"
        onClick={() => {
          resetForm();
          setModalOpen(true);
        }}
      >
        <FaPlus /> Nuevo Vehículo
      </button>

      <div className="table-card" style={{ background: '#1f1f22', border: '1px solid #2d2d30' }}>
        <GlobalDataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          subHeaderComponent={<div style={{ position: 'relative', width: '250px' }}>
            <FaSearch style={{ position: 'absolute', top: '10px', left: '10px', color: '#9ca3af' }} />
            <input type="text" placeholder="Buscar vehículo o placa..."
              className="datatable-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ ...inputStyled, paddingLeft: '35px' }}
            />
          </div>}
        />
      </div>
      <VehiculoModal
        isOpen={modalOpen}
        onClose={closeModal}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editId={editId}
        clientes={clientes}
        marcas={marcas}
        years={years}
      />
    </div>);
}

export default Vehiculos;