import React, { useState } from "react";
import {
  FaEdit, FaTrash, FaPlus, FaSearch
} from "react-icons/fa";
import GlobalDataTable from "./GlobalDatatable";
import "../assets/styles/Global.css";
import ClienteModal from "./modals/ClienteModal";
import { useClientes } from "../hooks/useClientes";

function Clientes({ idTaller = 1 }) {
  const { clientes, guardarCliente, cambiarEstadoCliente } = useClientes(idTaller);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    tipoDocumento: "DNI", dni: "", nombre: "", apellido: "",
    telefono: "", email: "", direccion: "", observaciones: "", id_taller: idTaller
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await guardarCliente(form, editId);
      closeModal();
    } catch (err) {
      console.error(err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm({ tipoDocumento: "DNI", dni: "", nombre: "", apellido: "", telefono: "", email: "", direccion: "", observaciones: "", id_taller: idTaller });
    setEditId(null);
  };

  const handleEdit = (cliente) => {
    setEditId(cliente.id_cliente);
    setForm(cliente);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await cambiarEstadoCliente(id);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.dni}`.toLowerCase().includes(search.toLowerCase())
  );

  const inputStyled = {
    width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px',
    border: '1px solid #2d2d30', outline: 'none', fontSize: '0.9rem',
    background: '#151517', color: '#f1f5f9'
  };

  const columns = [
    { name: "ID", selector: row => row.idCliente, sortable: true, width: "80px" },
    { name: "Cliente", selector: row => `${row.nombre} ${row.apellido}`, sortable: true, },
    { name: "Documento", selector: row => row.dni, },
    { name: "Contacto", selector: row => row.telefono },
    { name: "Email", selector: row => row.email, sortable: true, cell: row => row.email || "-" },
    { name: "Estado", selector: row => row.activo, cell: row => (row.activo ? <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>Activo</span> : <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>Inactivo</span>) },
    {
      name: "Acciones", cell: row => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => handleEdit(row)} style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }} title="Editar"><FaEdit size={18} /></button>
          <button onClick={() => handleDelete(row.idCliente)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }} title="Estado"><FaTrash size={18} /></button>
        </div>
      )
    },
  ];

  return (
    <div className="usuarios-container" style={{ padding: '20px', minHeight: '100%', background: '#151517' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn-crear" onClick={() => { setEditId(null); setModalOpen(true); }} style={{ marginTop: 0, width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: 6, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          <FaPlus /> Nuevo Cliente
        </button>
      </div>

      <div className="table-card" style={{ background: '#1f1f22', border: '1px solid #2d2d30' }}>
        <GlobalDataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
          subHeaderComponent={
            <div style={{ position: 'relative', width: '250px' }}>
              <FaSearch style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }} />
              <input type="text" placeholder="Buscar cliente..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inputStyled, paddingLeft: '35px' }} />
            </div>
          }
        />
      </div>

      <ClienteModal
        isOpen={modalOpen}
        onClose={closeModal}
        form={form}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        editId={editId}
      />

    </div>
  );
}

export default Clientes;