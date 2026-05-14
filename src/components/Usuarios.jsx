import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import "../assets/styles/Global.css";
import GlobalDataTable from "./GlobalDatatable";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import UsuarioModal from "./modals/UsuarioModal";

function Usuarios() {
    // --- ESTADOS ---
    const [usuarios, setUsuarios] = useState([]);
    const [roles, setRoles] = useState([]);
    const [talleres, setTalleres] = useState([]);

    const [form, setForm] = useState({
        nombre: "", apellido: "", dni: "", username: "", email: "",
        password: "", telefono: "", direccion: "", idRol: "", idTaller: "1"
    });

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editId, setEditId] = useState(null);

    // --- CARGA DE DATOS ---
    useEffect(() => { loadAll(); }, []);

    const loadAll = async () => {
        try {
            const [usuariosData, rolesData, talleresData] = await Promise.all([
                fetchWithAuth("/usuarios"),
                fetchWithAuth("/roles"),
                fetchWithAuth("/talleres")
            ]);
            setUsuarios(usuariosData);
            setRoles(rolesData);
            setTalleres(talleresData);
        } catch (err) { alert("Error al cargar datos: " + err.message); }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const resetForm = () => {
        setForm({ nombre: "", apellido: "", dni: "", username: "", email: "", password: "", telefono: "", direccion: "", idRol: "", idTaller: "1" });
        setEditId(null);
    };

    const handleSubmit = async () => {
        if (!form.nombre || !form.username || !form.email || !form.idRol || !form.idTaller) 
            return alert("Por favor complete los campos obligatorios.");
        
        try {
            const endpoint = editId ? `/usuarios/${editId}` : "/usuarios";
            const method = editId ? "PUT" : "POST";
            const payload = { ...form, idRol: Number(form.idRol), idTaller: Number(form.idTaller) };
            
            if (!form.password) delete payload.password; 

            await fetchWithAuth(endpoint, {
                method: method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            setModalOpen(false); 
            resetForm(); 
            loadAll();
            alert(editId ? "Usuario actualizado" : "Usuario creado");
        } catch (err) { alert("Error al guardar: " + err.message); }
    };

    const handleEdit = (user) => {
        const id = user.idUsuario ?? user.id_usuario ?? user.id;
        if (!id) return alert("Error: ID no encontrado");
        setEditId(id);
        setForm({
            nombre: user.nombre || "", apellido: user.apellido || "", dni: user.dni || "",
            username: user.username || "", email: user.email || "", password: "",
            telefono: user.telefono || "", direccion: user.direccion || "",
            idRol: user.idRol ?? user.id_rol ?? "", idTaller: user.idTaller ?? user.id_taller ?? ""
        });
        setModalOpen(true);
    };

    const handleDelete = async (user) => {
        const id = user.idUsuario || user.id_usuario;
        if (!window.confirm(`¿${user.activo ? 'DESACTIVAR' : 'ACTIVAR'} al usuario ${user.username}?`)) return;
        try {
            // PATCH relativo
            await fetchWithAuth(`/usuarios/${id}/toggle`, { method: "PATCH" });
            loadAll();
        } catch (err) { alert("Error: " + err.message); }
    };

    const filteredData = usuarios.filter((u) => 
        `${u.nombre} ${u.apellido} ${u.username} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    );

    // --- COLUMNAS ---
    const columns = [
        { name: "Nombre", selector: row => `${row.nombre} ${row.apellido}`, sortable: true, grow: 2 },
        { name: "Usuario", selector: row => row.username, sortable: true },
        { name: "Email", selector: row => row.email, grow: 2 },
        {
            name: "Rol",
            cell: row => {
                const rId = row.idRol || row.id_rol;
                const rName = roles.find(r => (r.idRol || r.id_rol) === rId)?.nombre || rId;
                return <span style={{ background: '#2d2d30', color: '#cbd5e1', padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: 'bold', border: '1px solid #475569' }}>{rName}</span>;
            }
        },
        { name: "DNI", selector: row => row.dni || "-" },
        { name: "Activo", selector: row => (row.activo ? <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>Sí</span> : <span style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '2px 6px', borderRadius: 4, fontSize: '0.7rem', fontWeight: 'bold' }}>No</span>), width: "80px" },
        {
            name: "Acciones",
            cell: row => (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button onClick={() => handleEdit(row)} style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }} title="Editar"><FaEdit size={18} /></button>
                    <button onClick={() => handleDelete(row)} style={{ border: 'none', background: 'transparent', color: '#ef4444', cursor: 'pointer' }} title="Estado"><FaTrash size={18} /></button>
                </div>
            )
        }
    ];

    return (
        <div className="usuarios-container" style={{ padding: '20px', minHeight: '100%', background: '#151517' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <button className="btn-crear" onClick={() => { resetForm(); setModalOpen(true); }} style={{ marginTop: 0, width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background: '#ef4444', border: 'none', padding: '10px 20px', borderRadius: 6, color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
                    <FaPlus /> Agregar Usuario
                </button>
            </div>

            <div className="table-card" style={{ background: '#1f1f22', border: '1px solid #2d2d30' }}>
                <GlobalDataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    striped
                    highlightOnHover
                    subHeaderComponent={
                        <div style={{ position: 'relative', width: '250px' }}>
                            <FaSearch style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }} />
                            <input
                                type="text"
                                placeholder="Buscar usuario..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                style={{
                                    width: '100%', padding: '8px 10px 8px 35px', borderRadius: '6px',
                                    border: '1px solid #2d2d30', background: '#151517', color: '#f1f5f9', outline: 'none'
                                }}
                            />
                        </div>
                    }
                />
            </div>

            <UsuarioModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                form={form}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                editId={editId}
                roles={roles}
                talleres={talleres}
            />
        </div>
    );
}

export default Usuarios;