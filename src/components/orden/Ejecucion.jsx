import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import OrderCard from "../layout/OrdenCard";
import EjecucionModal from "../modals/orden/EjecucionModal";

function Ejecucion() {

  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const [ejecucionForm, setEjecucionForm] = useState({
    informeReparacion: "",
    recomendaciones: "",
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {

      const [
        ordenesData,
        clientesData,
        vehiculosData,
        usuariosData,
        productosData
      ] = await Promise.all([
        fetchWithAuth("/ordenes/estado/ejecucion"),
        fetchWithAuth("/clientes/taller/1"),
        fetchWithAuth("/vehiculos"),
        fetchWithAuth("/usuarios"),
        fetchWithAuth("/productos/taller/1")
      ]);

      setProductos(productosData || []);
      setClientes(clientesData || []);
      setVehiculos(vehiculosData || []);
      setUsuarios(usuariosData || []);

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

      setOrdenes(ordenesConDetalles);

    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = ordenes.filter(o =>
    o.id_orden.toString().includes(search)
  );

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

  const renderOrdenContent = (orden, badgeStyle) => {
    const km = orden.kilometrajeEntrada || orden.kilometraje_entrada;

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
              orden.estado === "Finalizado" ? "#3fb950" : "#f59e0b"
            )}
          >
            {orden.estado || "En ejecución"}
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

        <div style={{ marginTop: 10 }}>
          <strong>Diagnóstico:</strong>{" "}
          {orden.diagnostico || "Sin diagnóstico"}
        </div>

        <div style={{ marginTop: 12 }}>
          <strong>Servicios:</strong>

          <div
            style={{
              marginTop: 6,
              display: "flex",
              flexWrap: "wrap",
              gap: 6
            }}
          >
            {servicios.length === 0 ? (
              <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
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

        <div style={{ marginTop: 12 }}>
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
              <span style={{ color: "#9ca3af", fontSize: "0.8rem" }}>
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
            .reduce((acc, d) => acc + Number(d.total || 0), 0)
            .toFixed(2)}
        </div>
      </>
    );
  };

  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#151517" }}>

      {/* SEARCH */}
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

      <EjecucionModal
        showModal={showModal}
        setShowModal={setShowModal}
        ordenSeleccionada={ordenSeleccionada}
        guardarEjecucion={async (formData) => {
          try {

            await fetchWithAuth("/ordenes/ejecucion", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                idOrden: ordenSeleccionada.id_orden,
                informeReparacion:
                  formData.informeReparacion,
                recomendaciones:
                  formData.recomendaciones,
              }),
            });

            alert("Orden enviada a entrega");
            setShowModal(false);
            await loadAll();

          } catch (err) {
            alert(err.message);
          }

        }}
      />

      {/* ORDER CARD */}
      <OrderCard
        title="Órdenes en Ejecución"
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
          next: true,
        }}
        buttonActions={{
          details: (orden) => console.log("Detalles", orden),
          view: (orden) => console.log("Ver orden", orden),
          next: (orden) => {
            setOrdenSeleccionada(orden);

            setEjecucionForm({
              informeReparacion: "",
              recomendaciones: "",
            });

            setShowModal(true);
          },
        }}
      />

    </div>
  );
}

export default Ejecucion;