import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import OrderCard from "../layout/OrdenCard";

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
        fetchWithAuth("/ordenes/estado/entrega"),
        fetchWithAuth("/clientes/taller/1"),
        fetchWithAuth("/vehiculos"),
        fetchWithAuth("/usuarios")
      ]);

      setOrdenes(ordenesData || []);
      setClientes(clientesData || []);
      setVehiculos(vehiculosData || []);
      setUsuarios(usuariosData || []);

    } catch (err) {
      console.error(err);
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

  const filteredData = ordenes.filter(o =>
    o.id_orden.toString().includes(search)
  );

  const renderOrdenContent = (orden, badgeStyle) => {
    const km = orden.kilometrajeEntrada || orden.kilometraje_entrada;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "1rem" }}>
            Orden #{orden.id_orden}
          </strong>

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

        <div>
          <strong>Kilometraje:</strong>{" "}
          {km ? `${Number(km).toLocaleString("en-US")} km` : "-"}
        </div>

        <div>
          <strong>Combustible:</strong>{" "}
          {orden.nivelCombustible || orden.nivel_combustible || "-"}
        </div>

        <div>
          <strong>Daños Visuales:</strong>{" "}
          {orden.danosVisuales || orden.danos_visuales || "-"}
        </div>

        <div>
          <strong>Fecha Ingreso:</strong>{" "}
          {orden.fecha_ingreso
            ? new Date(orden.fecha_ingreso).toLocaleString("es-PE", {
                dateStyle: "short",
                timeStyle: "short"
              })
            : "-"}
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#151517" }}>

      {/* BUSCADOR */}
      <div style={{ marginBottom: 20, width: "250px", position: "relative" }}>
        <FaSearch style={{ position: "absolute", top: 10, left: 10, color: "#9ca3af" }} />
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

      {/* ORDER CARD */}
      <OrderCard
        title="Órdenes en Entrega"
        data={filteredData}
        renderContent={renderOrdenContent}
        buttonConfig={{
          prev: false,
          print: false,
          edit: false,
          diagnostic: false,
          details: true,
          delete: false,
          comments: false,
          view: true,
          next: false,
        }}
        buttonActions={{
          details: (orden) => console.log("Detalles", orden),
          view: (orden) => console.log("Ver", orden),
        }}
      />

    </div>
  );
}

export default Entrega;