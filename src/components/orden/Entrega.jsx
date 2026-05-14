import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import OrderCard from "../layout/OrdenCard";
import { generarBoletaPDF } from "../../utils/GenerarBoleta";

function Entrega() {

  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
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
        productosData,
        usuariosData
      ] = await Promise.all([
        fetchWithAuth("/ordenes/estado/entrega"),
        fetchWithAuth("/clientes/taller/1"),
        fetchWithAuth("/vehiculos"),
        fetchWithAuth("/productos/taller/1"),
        fetchWithAuth("/usuarios")
      ]);

      const ordenesBase = ordenesData || [];

      const ordenesConDetalles = await Promise.all(
        ordenesBase.map(async (o) => {

          const det = await fetchWithAuth(
            `/ordenes/${o.id_orden}/detalles`
          );

          return {
            ...o,
            detalles: det || []
          };
        })
      );

      setProductos(productosData || []);
      setOrdenes(ordenesConDetalles);
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

    const km =
      orden.kilometrajeEntrada ||
      orden.kilometraje_entrada;

    const detalles = orden.detalles || [];

    const servicios = detalles.filter((d) => {

      const producto = productos.find(
        p =>
          Number(p.id_producto || p.idProducto) ===
          Number(d.id_producto || d.idProducto)
      );

      return producto?.tipo === "SERVICIO";
    });

    const repuestos = detalles.filter((d) => {

      const producto = productos.find(
        p =>
          Number(p.id_producto || p.idProducto) ===
          Number(d.id_producto || d.idProducto)
      );

      return producto?.tipo !== "SERVICIO";
    });

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "1rem" }}>
            Orden #{orden.id_orden}
          </strong>

          <span
            style={badgeStyle(
              orden.estado === "Facturado"
                ? "#3fb950"
                : "#58a6ff"
            )}
          >
            {orden.estado || "Entrega"}
          </span>
        </div>

        <div>
          <strong>Cliente:</strong>{" "}
          {getClienteNombre(orden.id_cliente)}
        </div>

        <div>
          <strong>Vehículo:</strong>{" "}
          {getVehiculoNombre(orden.id_vehiculo)}
        </div>

        <div>
          <strong>Técnico:</strong>{" "}
          {getTecnicoNombre(orden.id_tecnico)}
        </div>

        <div>
          <strong>Kilometraje:</strong>{" "}
          {km
            ? `${Number(km).toLocaleString("en-US")} km`
            : "-"}
        </div>

        <div>
          <strong>Combustible:</strong>{" "}
          {orden.nivelCombustible ||
            orden.nivel_combustible ||
            "-"}
        </div>

        <div>
          <strong>Daños Visuales:</strong>{" "}
          {orden.danosVisuales ||
            orden.danos_visuales ||
            "-"}
        </div>

        <div>
          <strong>Diagnóstico:</strong>{" "}
          {orden.diagnostico || "Sin diagnóstico"}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Informe Reparación:</strong>{" "}
          {orden.informeReparacion ||
            orden.informe_reparacion ||
            "-"}
        </div>

        <div style={{ marginTop: 10 }}>
          <strong>Recomendaciones:</strong>{" "}
          {orden.recomendaciones || "-"}
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>Servicios Brindados:</strong>

          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6
            }}
          >
            {servicios.length === 0 ? (
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "0.8rem"
                }}
              >
                Sin servicios
              </span>
            ) : (
              servicios.map((d, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 8px",
                    background: "#1f1f22",
                    border: "1px solid #2d2d30",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    color: "#cbd5e1",
                  }}
                >
                  {d.descripcion} x{d.cantidad}
                </span>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: 8 }}>
          <strong>Repuestos:</strong>

          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6
            }}
          >
            {repuestos.length === 0 ? (
              <span
                style={{
                  color: "#9ca3af",
                  fontSize: "0.8rem"
                }}
              >
                Sin repuestos
              </span>
            ) : (
              repuestos.map((d, i) => (
                <span
                  key={i}
                  style={{
                    padding: "4px 8px",
                    background: "#1f1f22",
                    border: "1px solid #2d2d30",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    color: "#cbd5e1",
                  }}
                >
                  {d.descripcion} x{d.cantidad}
                </span>
              ))
            )}
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Total:</strong>{" "}
          S/. {detalles
            .reduce(
              (acc, d) => acc + Number(d.total || 0),
              0
            )
            .toFixed(2)}
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
          print: true,
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
          print: (orden) =>
            generarBoletaPDF(orden, {
              getClienteNombre,
              getVehiculoNombre,
              getTecnicoNombre,
            }),
        }}
      />

    </div>
  );
}

export default Entrega;