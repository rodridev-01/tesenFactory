import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import OrderCard from "../layout/OrdenCard";
import DiagnosticoModal from "../modals/orden/DiagnosticoModalRepuestos";

function Diagnostico() {
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [stock, setStock] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState(null);

  const [detalles, setDetalles] = useState([
    {
      idProducto: "",
      descripcion: "",
      precio: 0,
      cantidad: 1
    }
  ]);

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
        productosData,
        stockData
      ] = await Promise.all([
        fetchWithAuth("/ordenes/estado/diagnostico"),
        fetchWithAuth("/clientes/taller/1"),
        fetchWithAuth("/vehiculos"),
        fetchWithAuth("/usuarios"),
        fetchWithAuth("/productos/taller/1"),
        fetchWithAuth("/stock/almacen/1")
      ]);

      setOrdenes(ordenesData || []);
      setClientes(clientesData || []);
      setVehiculos(vehiculosData || []);
      setUsuarios(usuariosData || []);
      setProductos(productosData || []);
      setStock(stockData || []);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredData = ordenes.filter(o =>
    o.id_orden.toString().includes(search)
  );

  const openModal = (orden) => {
    setOrdenSeleccionada(orden);
    setDetalles([
      {
        idProducto: "",
        descripcion: "",
        precio: 0,
        cantidad: 1
      }
    ]);
    setShowModal(true);
  };

  const addRow = () => {
    const last = detalles[detalles.length - 1];

    if (!last.idProducto) {
      return alert("Selecciona un producto primero");
    }

    setDetalles([
      ...detalles,
      {
        idProducto: "",
        descripcion: "",
        precio: 0,
        cantidad: 1
      }
    ]);
  };

  const updateCantidad = (index, value) => {
    const newData = [...detalles];

    if (value === "") {
      newData[index].cantidad = "";
      setDetalles(newData);
      return;
    }

    const num = Number(value);
    if (isNaN(num)) return;

    const stockItem = getStock(newData[index].idProducto);

    if (stockItem && num > stockItem.stockActual) {
      alert("Stock insuficiente");
      return;
    }

    newData[index].cantidad = value;
    setDetalles(newData);
  };

  const removeRow = (index) => {
    setDetalles(detalles.filter((_, i) => i !== index));
  };

  const totalGeneral = detalles.reduce(
    (acc, d) => acc + d.precio * d.cantidad,
    0
  );

  const handleProductoChange = (index, productId) => {
    const producto = getProducto(productId);
    const newData = [...detalles];

    newData[index].idProducto = productId;
    newData[index].descripcion = producto?.nombre || "";
    newData[index].precio =
      producto?.precio_venta || producto?.precioVenta || 0;

    if (producto?.tipo === "SERVICIO") {
      newData[index].cantidad = 1;
    }

    setDetalles(newData);
  };

  const guardarDetalles = async () => {
    try {
      for (const d of detalles) {
        if (!d.idProducto) {
          return alert("Todos los items deben tener producto");
        }

        if (d.cantidad <= 0) {
          return alert("Cantidad inválida");
        }

        const producto = getProducto(d.idProducto);

        if (producto?.tipo !== "SERVICIO") {
          const stockItem = getStock(d.idProducto);

          if (!stockItem || d.cantidad > stockItem.stockActual) {
            return alert(`Stock insuficiente para ${producto.nombre}`);
          }
        }
      }

      for (const d of detalles) {
        await fetchWithAuth("http://localhost:8080/api/ordenes/detalle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            idOrden: ordenSeleccionada.id_orden,
            idProducto: d.idProducto,
            descripcion: d.descripcion,
            precioUnitario: d.precio,
            cantidad: d.cantidad,
            total: d.precio * d.cantidad
          })
        });
      }

      alert("Detalles guardados");
      setShowModal(false);
      await loadAll();
    } catch (err) {
      console.error(err);
      alert("Error al guardar");
    }
  };

  const getClienteNombre = (id) => {
    const c = clientes.find(c => (c.idCliente || c.id_cliente) === id);
    return c ? `${c.nombre} ${c.apellido}` : id;
  };

  const getVehiculoNombre = (id) => {
    const v = vehiculos.find(v => (v.idVehiculo || v.id_vehiculo) === id);
    return v ? `${v.marcaNombre} ${v.modelo} - ${v.placa}` : id;
  };

  const getTecnicoNombre = (id) => {
    const t = usuarios.find(u => (u.idUsuario || u.id_usuario) === id);
    return t ? `${t.nombre} ${t.apellido}` : id;
  };

  const getProducto = (id) =>
    productos.find(p => (p.id_producto || p.idProducto) === id);

  const getStock = (idProducto) =>
    stock.find(s => s.idProducto === idProducto);

  const renderOrdenContent = (orden, badgeStyle) => {
    const km = orden.kilometrajeEntrada || orden.kilometraje_entrada;

    return (
      <>
        <div style={{ marginBottom: "10px" }}>
          <strong style={{ fontSize: "1rem" }}>
            Orden #{orden.id_orden}
          </strong>
          <span style={badgeStyle("#f59e0b")}>
            {orden.estado || "Diagnóstico"}
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
          <strong>Diagnóstico:</strong> {orden.diagnostico || "Sin diagnóstico"}
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
    <div style={{ padding: "20px", minHeight: "100%", background: "#151517" }}>
      <div style={{ marginBottom: 20, width: "300px", position: "relative" }}>
        <FaSearch
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            color: "#9ca3af"
          }}
        />
        <input
          type="text"
          placeholder="Buscar orden..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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

      <OrderCard
        title="Órdenes en Diagnóstico"
        data={filteredData}
        renderContent={renderOrdenContent}
        buttonConfig={{
          prev: true,
          print: false,
          edit: true,
          diagnostic: false,
          details: true,
          delete: true,
          comments: false,
          view: true,
          next: true,
        }}
        buttonActions={{
          prev: (orden) => console.log("Anterior", orden),
          edit: (orden) => console.log("Imprimir", orden),
          details: openModal,
          delete: (orden) => console.log("Eliminar", orden),
          view: (orden) => console.log("Visualizar", orden),
          next: (orden) => console.log("Siguiente", orden),
        }}
      />

      <DiagnosticoModal
        showModal={showModal}
        setShowModal={setShowModal}
        ordenSeleccionada={ordenSeleccionada}
        detalles={detalles}
        setDetalles={setDetalles}
        productos={productos}
        stock={stock}
        getProducto={getProducto}
        getStock={getStock}
        handleProductoChange={handleProductoChange}
        updateCantidad={updateCantidad}
        removeRow={removeRow}
        addRow={addRow}
        guardarDetalles={guardarDetalles}
        totalGeneral={totalGeneral}
      />
    </div>
  );
}

export default Diagnostico;