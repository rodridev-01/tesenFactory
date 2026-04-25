import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
} from "react-icons/fa";
import "../assets/styles/Global.css";
import GlobalDataTable from "./GlobalDatatable";
import MarcaModal from "./modals/MarcaModal";
import NotificationModal from "./modals/GlobalModal";
import ConfirmModal from "./modals/ConfirmModal";

function Marcas() {
  const [marcas, setMarcas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [confirmModal, setConfirmModal] = useState(false);
  const [selectedMarca, setSelectedMarca] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    type: "success",
    title: "",
    message: "",
  });

  const confirmToggleEstado = (marca) => {
    setSelectedMarca(marca);
    setConfirmModal(true);
  };

  useEffect(() => {
    loadMarcas();
  }, []);

  const showNotification = (type, title, message) => {
    setNotification({ open: true, type, title, message });
  };

  const closeNotification = () => {
    setNotification((prev) => ({ ...prev, open: false }));
  };

  const loadMarcas = async () => {
    try {
      const data = await fetchWithAuth("http://localhost:8080/api/marcas");
      setMarcas(data);
    } catch (err) {
      showNotification(
        "error",
        "Error al cargar",
        "No se pudieron obtener las marcas."
      );
    }
  };

  const clearForm = () => {
    setNombre("");
    setEditingId(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      showNotification(
        "warning",
        "Campo requerido",
        "El nombre de la marca es obligatorio."
      );
      return;
    }

    try {
      const body = { nombre };

      if (editingId) {
        const marca = marcas.find((m) => m.id_marca === editingId);
        body.activo = marca ? marca.activo : true;

        await fetchWithAuth(`http://localhost:8080/api/marcas/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        showNotification(
          "success",
          "Marca actualizada",
          "La marca se actualizó correctamente."
        );
      } else {
        await fetchWithAuth("http://localhost:8080/api/marcas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        showNotification(
          "success",
          "Marca registrada",
          "La nueva marca se registró correctamente."
        );
      }

      setModalOpen(false);
      clearForm();
      loadMarcas();
    } catch (err) {
      showNotification(
        "error",
        "Error al guardar",
        err.message || "Ocurrió un error inesperado."
      );
    }
  };

  const handleEdit = (marca) => {
    setEditingId(marca.id_marca);
    setNombre(marca.nombre);
    setModalOpen(true);
  };

  const handleToggleEstado = async () => {
    if (!selectedMarca) return;

    try {
      await fetchWithAuth(
        `http://localhost:8080/api/marcas/${selectedMarca.id_marca}/toggle`,
        {
          method: "PATCH",
        }
      );

      showNotification(
        "success",
        "Estado actualizado",
        `La marca "${selectedMarca.nombre}" cambió su estado correctamente.`
      );

      setConfirmModal(false);
      setSelectedMarca(null);
      loadMarcas();
    } catch (err) {
      showNotification(
        "error",
        "Error al cambiar estado",
        err.message || "No se pudo actualizar la marca."
      );
    }
  };

  const filteredData = marcas.filter((m) =>
    m.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
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
    padding: "10px 10px 10px 38px",
    borderRadius: "8px",
    border: "1px solid #2d2d30",
    outline: "none",
    fontSize: "0.9rem",
    background: "#151517",
    color: "#f1f5f9",
  };

  const columns = [
    { name: "ID", selector: (row) => row.id_marca, sortable: true },
    { name: "Nombre", selector: (row) => row.nombre, sortable: true },
    {
      name: "Estado",
      selector: (row) =>
        row.activo ? (
          <span style={{ color: "#10b981", background: "rgba(16, 185, 129, 0.1)", padding: "2px 6px", borderRadius: 4, fontSize: "0.7rem", fontWeight: "bold" }}>
            Activo
          </span>
        ) : (
          <span style={{ color: "#ef4444", background: "rgba(239, 68, 68, 0.1)", padding: "2px 6px", borderRadius: 4, fontSize: "0.7rem", fontWeight: "bold" }}>
            Inactivo
          </span>
        ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => handleEdit(row)}
            style={{ border: "none", background: "transparent", color: "#3b82f6", cursor: "pointer" }}
          >
            <FaEdit size={18} />
          </button>
          <button
            onClick={() => confirmToggleEstado(row)}
            style={{
              border: "none",
              background: "transparent",
              color: "#ef4444",
              cursor: "pointer",
            }}
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="marcas-container" style={{ padding: "20px", minHeight: "100%", background: "#151517" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          className="btn-crear"
          onClick={() => {
            clearForm();
            setModalOpen(true);
          }}
          style={{
            marginTop: 0,
            width: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ef4444",
            border: "none",
            padding: "10px 20px",
            borderRadius: 6,
            color: "white",
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <FaPlus /> Nueva Marca
        </button>
      </div>

      <div className="table-card" style={{ background: "#1f1f22", border: "1px solid #2d2d30" }}>
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
                placeholder="Buscar marca..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ ...inputStyled, paddingLeft: "35px" }}
              />
            </div>
          }
        />
      </div>

      <MarcaModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        editingId={editingId}
        nombre={nombre}
        setNombre={setNombre}
        clearForm={clearForm}
        labelStyle={labelStyle}
        inputContainer={inputContainer}
        iconInInput={iconInInput}
        inputStyled={inputStyled}
      />

      <NotificationModal isOpen={notification.open} onClose={closeNotification} type={notification.type} title={notification.title} message={notification.message} />

      <ConfirmModal
        isOpen={confirmModal}
        onCancel={() => {
          setConfirmModal(false);
          setSelectedMarca(null);
        }}
        onConfirm={handleToggleEstado}
        title="Confirmar acción"
        message={
          selectedMarca
            ? `¿Deseas ${selectedMarca.activo ? "desactivar" : "activar"
            } la marca "${selectedMarca.nombre}"?`
            : ""
        }
      />
    </div>
  );
}

export default Marcas;
