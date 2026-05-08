import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import OrderCard from "../layout/OrdenCard";
import RepuestoModal from "../modals/orden/RepuestoModal";

function Repuesto() {

  const [ordenes, setOrdenes] = useState([]);
  const [ordenesConDetalles, setOrdenesConDetalles] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [nuevoDetalle, setNuevoDetalle] = useState({
    idProducto: "",
    cantidad: 1
  });

  useEffect(() => {
    loadOrdenes();
  }, []);

  const loadOrdenes = async () => {
    const data = await fetchWithAuth(
      "http://localhost:8080/api/ordenes/estado/repuestos"
    );

    const ordenesBase = data || [];

    const ordenesConDetalles = await Promise.all(
      ordenesBase.map(async (o) => {
        const det = await fetchWithAuth(
          `http://localhost:8080/api/ordenes/${o.id_orden}/detalles`
        );

        return {
          ...o,
          detalles: det || []
        };
      })
    );

    setOrdenes(ordenesConDetalles);
  };

  const loadDetalles = async (idOrden) => {
    const data = await fetchWithAuth(`http://localhost:8080/api/ordenes/${idOrden}/detalles`);
    setDetalles(data || []);
  };

  const loadExtras = async () => {
    const [prod, stk] = await Promise.all([
      fetchWithAuth("http://localhost:8080/api/productos/taller/1"),
      fetchWithAuth("http://localhost:8080/api/stock/almacen/1")
    ]);

    setProductos(prod || []);
    setStock(stk || []);
  };

  const openModal = async (orden) => {
    setOrdenSeleccionada(orden);
    await loadDetalles(orden.id_orden);
    await loadExtras();
    setShowModal(true);
  };

  const getProducto = (id) =>
    productos.find(p => (p.id_producto || p.idProducto) == id);

  const getStock = (idProducto) =>
    stock.find(s => s.idProducto == idProducto);

  // 🔥 APROBAR
  const aprobarDetalle = async (id) => {
    await fetchWithAuth(`http://localhost:8080/api/ordenes/detalle/${id}/aprobar`, {
      method: "PUT"
    });

    await loadDetalles(ordenSeleccionada.id_orden);
  };

  const agregarDetalle = async () => {

    if (!nuevoDetalle.idProducto) {
      return alert("Selecciona producto");
    }

    const stockItem = getStock(nuevoDetalle.idProducto);

    if (!stockItem || nuevoDetalle.cantidad > stockItem.stockActual) {
      return alert("Stock insuficiente");
    }

    const producto = getProducto(nuevoDetalle.idProducto);

    await fetchWithAuth("/api/ordenes/detalle", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        idOrden: ordenSeleccionada.id_orden,
        idProducto: nuevoDetalle.idProducto,
        descripcion: producto.nombre,
        precioUnitario: producto.precio_venta || producto.precioVenta,
        cantidad: nuevoDetalle.cantidad,
        total: producto.precio_venta * nuevoDetalle.cantidad
      })
    });

    setNuevoDetalle({ idProducto: "", cantidad: 1 });
    await loadDetalles(ordenSeleccionada.id_orden);
  };

  return (
    <div
      style={{
        padding: "20px",
        minHeight: "100%",
        background: "#151517",
      }}
    >

      <OrderCard
        title="Órdenes en Repuestos"
        data={ordenes}
        renderContent={(orden, badgeStyle) => (
          <>
            <div style={{ marginBottom: "10px" }}>
              <strong style={{ fontSize: "1rem" }}>
                Orden #{orden.id_orden}
              </strong>

              <span style={badgeStyle("#8b5cf6")}>
                {orden.estado || "Repuestos"}
              </span>
            </div>

            <div>
              <strong>Vehículo:</strong>{" "}
              {orden.vehiculo || orden.placa || "-"}
            </div>

            <div>
              <strong>Cliente:</strong>{" "}
              {orden.cliente || "-"}
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Servicios:</strong>

              <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {(orden.detalles || []).length === 0 ? (
                  <span style={{ color: "#9ca3af", fontSize: "0.85rem" }}>
                    Sin servicios
                  </span>
                ) : (
                  orden.detalles.map((d, i) => (
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

            <div style={{ marginTop: 10 }}>
              <strong>Total:</strong>{" "}
              S/. {(orden.detalles || [])
                .reduce((acc, d) => acc + d.total, 0)
                .toFixed(2)}
            </div>

            <div style={{ marginTop: 10 }}>
              <strong>Fecha:</strong>{" "}
              {orden.fecha_ingreso
                ? new Date(orden.fecha_ingreso).toLocaleString("es-PE", {
                  dateStyle: "short",
                  timeStyle: "short",
                })
                : "-"}
            </div>
          </>
        )}
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
          details: openModal,
          view: (orden) => console.log("Visualizar", orden),
          next: (orden) => console.log("Siguiente", orden),
        }}
      />

      <RepuestoModal
        showModal={showModal}
        setShowModal={setShowModal}
        ordenSeleccionada={ordenSeleccionada}
        detalles={detalles}
        productos={productos}
        nuevoDetalle={nuevoDetalle}
        setNuevoDetalle={setNuevoDetalle}
        agregarDetalle={agregarDetalle}
        aprobarDetalle={aprobarDetalle}
        aprobarOrden={async () => {
          await fetchWithAuth(
            `http://localhost:8080/api/ordenes/${ordenSeleccionada.id_orden}/aprobar`,
            {
              method: "PUT",
            }
          );

          alert("Orden aprobada");
          setShowModal(false);
          loadOrdenes();
        }}
      />

    </div>
  );
}

export default Repuesto;