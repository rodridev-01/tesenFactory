import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import GlobalDataTable from "../GlobalDatatable";

function Repuesto() {

  const [ordenes, setOrdenes] = useState([]);
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
    const data = await fetchWithAuth("http://localhost:8080/api/ordenes/estado/repuestos");
    setOrdenes(data || []);
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

  const columns = [
    { name: "Orden", selector: row => row.id_orden },
    {
      name: "Acciones",
      cell: row => (
        <button onClick={() => openModal(row)}>
          Ver / Aprobar
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: 20 }}>

      <GlobalDataTable
        columns={columns}
        data={ordenes}
        pagination
      />

      {showModal && (
        <div className="modal">

          <h3>Orden #{ordenSeleccionada?.id_orden}</h3>

          {/* 🔹 DETALLES EXISTENTES */}
          {detalles.map(d => {
            const producto = getProducto(d.idProducto);

            return (
              <div key={d.id} style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 10
              }}>

                <span>{d.descripcion}</span>
                <span>x{d.cantidad}</span>
                <span>S/ {d.precioUnitario}</span>

                <span>
                  {d.aprobado ? "✅" : "⏳"}
                </span>

                {!d.aprobado && (
                  <button onClick={() => aprobarDetalle(d.id)}>
                    Aprobar
                  </button>
                )}

              </div>
            );
          })}

          <hr />

          {/* 🔹 AGREGAR NUEVO */}
          <h4>Agregar repuesto</h4>

          <select
            value={nuevoDetalle.idProducto}
            onChange={e =>
              setNuevoDetalle({
                ...nuevoDetalle,
                idProducto: e.target.value
              })
            }
          >
            <option value="">Seleccionar</option>
            {productos.map(p => (
              <option
                key={p.id_producto}
                value={p.id_producto}
              >
                {p.nombre}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={nuevoDetalle.cantidad}
            onChange={e =>
              setNuevoDetalle({
                ...nuevoDetalle,
                cantidad: Number(e.target.value)
              })
            }
          />

          <button onClick={agregarDetalle}>
            Agregar
          </button>

          <br /><br />

          {/* 🔹 APROBAR ORDEN */}
          <button onClick={async () => {
            await fetchWithAuth(`http://localhost:8080/api/ordenes/${ordenSeleccionada.id_orden}/aprobar`, {
              method: "PUT"
            });

            alert("Orden aprobada");
            setShowModal(false);
            loadOrdenes();
          }}>
            Aprobar Orden
          </button>

          <button onClick={() => setShowModal(false)}>
            Cerrar
          </button>

        </div>
      )}

    </div>
  );
}

export default Repuesto;