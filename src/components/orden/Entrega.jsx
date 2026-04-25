import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import GlobalDataTable from "../GlobalDatatable";

function Entrega() {

  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [
        ordenesData,
        clientesData,
        vehiculosData,
        usuariosData
      ] = await Promise.all([
        fetchWithAuth("http://localhost:8080/api/ordenes/estado/entrega"),
        fetchWithAuth("http://localhost:8080/api/clientes/taller/1"),
        fetchWithAuth("http://localhost:8080/api/vehiculos"),
        fetchWithAuth("http://localhost:8080/api/usuarios")
      ]);

      setOrdenes(ordenesData || []);
      setClientes(clientesData || []);
      setVehiculos(vehiculosData || []);
      setUsuarios(usuariosData || []);

    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = ordenes.filter(o =>
    o.id_orden.toString().includes(search)
  );

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
    { name: "Combustible", selector: row => row.nivelCombustible || row.nivel_combustible || "-"},
    { name: "Estado", selector: row => row.estado },
    { name: "Daños Visuales", selector: row => row.danosVisuales || row.danos_visuales || "-"},
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
    }
  ];

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#151517" }}>

      {/* BARRA DE BÚSQUEDA */}
      <div style={{ marginBottom: 20, width: "250px", position: "relative" }}>
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

      {/* TABLA */}
      <div style={{ background: "#1f1f22", border: "1px solid #2d2d30" }}>
        <GlobalDataTable
          columns={columns}
          data={filteredData}
          pagination
          highlightOnHover
        />
      </div>

    </div>
  );
}

export default Entrega;