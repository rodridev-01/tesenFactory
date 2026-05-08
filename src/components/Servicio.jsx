import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import "../assets/styles/Global.css";
import GlobalDataTable from "./GlobalDatatable";
import ServiceModal from "./modals/ServiceModal";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";

function Servicios() {
  const idTallerFijo = 1;

  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    idTaller: idTallerFijo,
    tipo: "SERVICIO",
    nombre: "",
    precioVenta: "",
    activo: true,
  });

  useEffect(() => {
    loadServicios();
  }, []);

  const loadServicios = async () => {
    try {
      const data = await fetchWithAuth(
        `/productos/taller/${idTallerFijo}/servicios`
      );
      setServicios(data);
    } catch (err) {
      console.error("Error cargando servicios:", err);
    }
  };

  const clearForm = () => {
    setFormData({
      idTaller: idTallerFijo,
      tipo: "SERVICIO",
      nombre: "",
      precioVenta: "",
      activo: true,
    });
    setEditingId(null);
  };

  const handleCreate = async () => {
    try {
      await fetchWithAuth("/productos", {
        method: "POST",
        body: {
          id_taller: idTallerFijo,
          tipo: "SERVICIO",
          nombre: formData.nombre,
          precio_venta: Number(formData.precioVenta),
          activo: true,
        },
      });

      setModalOpen(false);
      clearForm();
      loadServicios();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetchWithAuth(
        `/productos/${editingId}`,
        {
          method: "PUT",
          body: {
            id_taller: idTallerFijo,
            tipo: "SERVICIO",
            nombre: formData.nombre,
            precio_venta: Number(formData.precioVenta),
            activo: formData.activo,
          },
        }
      );

      setModalOpen(false);
      clearForm();
      loadServicios();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Desactivar servicio?")) return;

    try {
      await fetchWithAuth(
        `/productos/${id}/estado`,
        { method: "PATCH" }
      );
      loadServicios();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openEditModal = (row) => {
    setEditingId(row.id_producto || row.idProducto);
    setFormData({
      idTaller: idTallerFijo,
      tipo: "SERVICIO",
      nombre: row.nombre,
      precioVenta: row.precio_venta || row.precioVenta,
      activo: row.activo,
    });
    setModalOpen(true);
  };

  const filtered = servicios.filter((s) =>
    s.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
    },
    {
      name: "Precio",
      selector: (row) => row.precio_venta,
      cell: (row) => (
        <span style={{ fontWeight: "bold" }}>
          S/ {Number(row.precio_venta || row.precioVenta).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Estado",
      selector: (row) => row.activo,
      cell: (row) =>
        row.activo ? (
          <span style={{ color: "#10b981" }}>Activo</span>
        ) : (
          <span style={{ color: "#ef4444" }}>Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: 10 }}>
          <button 
            onClick={() => openEditModal(row)}
            style={{ background: 'transparent', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
          >
            <FaEdit size={18} />
          </button>

          <button 
            onClick={() => handleDelete(row.id_producto || row.idProducto)}
            style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="usuarios-container" style={{ padding: 20, background: "#151517" }}>
      
      <button
        onClick={() => {
          clearForm();
          setModalOpen(true);
        }}
        style={{
          background: "#ef4444",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: 6,
          marginBottom: 20,
        }}
      >
        <FaPlus /> Agregar Servicio
      </button>

      <div className="table-card" style={{ background: "#1f1f22" }}>
        <GlobalDataTable
          columns={columns}
          data={filtered}
          subHeaderComponent={
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <div style={{ position: "relative" }}>
                <FaSearch style={{ position: "absolute", left: 10, top: 10 }} />
                <input
                  placeholder="Buscar servicio..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ paddingLeft: 30 }}
                />
              </div>
            </div>
          }
        />
      </div>

      <ServiceModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSave={editingId ? handleUpdate : handleCreate}
      />
    </div>
  );
}

export default Servicios;