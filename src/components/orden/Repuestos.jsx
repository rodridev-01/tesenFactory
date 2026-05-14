import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import OrderCard from "../layout/OrdenCard";
import RepuestoModal from "../modals/orden/RepuestoModal";

function Repuesto() {

  const [ordenes, setOrdenes] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
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

    const [
      ordenesData,
      clientesData,
      vehiculosData,
      usuariosData
    ] = await Promise.all([
      fetchWithAuth("/ordenes/estado/repuestos"),
      fetchWithAuth("/clientes/taller/1"),
      fetchWithAuth("/vehiculos"),
      fetchWithAuth("/usuarios")
    ]);

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
  };

  const loadDetalles = async (idOrden) => {

    const data = await fetchWithAuth(
      `/ordenes/${idOrden}/detalles`
    );

    setDetalles(data || []);
  };

  const repuestos = productos.filter(
    (p) => p.tipo !== "SERVICIO"
  );

  const loadExtras = async () => {

    const [prod, stk] = await Promise.all([
      fetchWithAuth("/productos/taller/1"),
      fetchWithAuth("/stock/almacen/1")
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
    productos.find(
      p => Number(p.id_producto || p.idProducto) === Number(id)
    );

  const getStock = (idProducto) =>
    stock.find(
      s => Number(s.idProducto || s.id_producto) === Number(idProducto)
    );

  const getClienteNombre = (id) => {
    const c = clientes.find(c =>
      (c.idCliente || c.id_cliente) === id
    );

    return c
      ? `${c.nombre} ${c.apellido}`
      : id;
  };

  const getVehiculoNombre = (id) => {
    const v = vehiculos.find(v =>
      (v.idVehiculo || v.id_vehiculo) === id
    );

    return v
      ? `${v.marcaNombre} ${v.modelo} - ${v.placa}`
      : id;
  };

  const getTecnicoNombre = (id) => {
    const t = usuarios.find(u =>
      (u.idUsuario || u.id_usuario) === id
    );

    return t
      ? `${t.nombre} ${t.apellido}`
      : id;
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

    await fetchWithAuth("/ordenes/detalle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        idOrden: ordenSeleccionada.id_orden,
        idProducto: nuevoDetalle.idProducto,
        descripcion: producto.nombre,
        precioUnitario:
          producto.precio_venta || producto.precioVenta,
        cantidad: nuevoDetalle.cantidad,
        total:
          (producto.precio_venta || producto.precioVenta)
          * nuevoDetalle.cantidad
      })
    });

    setNuevoDetalle({
      idProducto: "",
      cantidad: 1
    });

    await loadDetalles(ordenSeleccionada.id_orden);
    await loadOrdenes();
  };

  const aprobarOrden = async () => {

    try {

      await fetchWithAuth(
        `/ordenes/${ordenSeleccionada.id_orden}/aprobar`,
        {
          method: "PUT",
        }
      );
      alert("Orden aprobada correctamente");
      setShowModal(false);
      await loadOrdenes();
    } catch (err) {
      console.error(err);
      alert(err.message || "No se pudo aprobar la orden");
    }
  };

  const eliminarDetalle = async (idDetalle) => {
    if (!window.confirm("¿Eliminar detalle?")) {
      return;
    }
    try {
      await fetchWithAuth(
        `/ordenes/detalle/${idDetalle}`,
        {
          method: "DELETE",
        }
      );
      await loadDetalles(ordenSeleccionada.id_orden);
      await loadOrdenes();
      alert("Detalle eliminado");
    } catch (err) {
      console.error(err);
      alert(
        err.message || "No se pudo eliminar"
      );
    }
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

            <div style={{ marginTop: 8 }}>
              <strong>Diagnóstico:</strong>{" "}
              {orden.diagnostico || "Sin diagnóstico"}
            </div>

            <div style={{ marginTop: 8 }}>

              <strong>Detalles:</strong>

              <div
                style={{
                  marginTop: 6,
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6
                }}
              >

                {(orden.detalles || []).length === 0 ? (

                  <span
                    style={{
                      color: "#9ca3af",
                      fontSize: "0.85rem"
                    }}
                  >
                    Sin detalles
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
          view: false,
          next: false,
        }}

        buttonActions={{
          details: openModal,
        }}
      />

      <RepuestoModal
        showModal={showModal}
        setShowModal={setShowModal}
        ordenSeleccionada={ordenSeleccionada}
        detalles={detalles}
        productos={repuestos}
        nuevoDetalle={nuevoDetalle}
        setNuevoDetalle={setNuevoDetalle}
        agregarDetalle={agregarDetalle}
        eliminarDetalle={eliminarDetalle}
        aprobarOrden={aprobarOrden}
      />

    </div>
  );
}

export default Repuesto;