import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../../services/authService";
import { FaSearch } from "react-icons/fa";
import GlobalDataTable from "../GlobalDatatable";

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
      cantidad: "1" 
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
        fetchWithAuth("http://localhost:8080/api/ordenes/estado/diagnostico"),
        fetchWithAuth("http://localhost:8080/api/clientes/taller/1"),
        fetchWithAuth("http://localhost:8080/api/vehiculos"),
        fetchWithAuth("http://localhost:8080/api/usuarios"),
        fetchWithAuth("http://localhost:8080/api/productos/taller/1"),
        fetchWithAuth("http://localhost:8080/api/stock/almacen/1")
      ]);

          setProductos(productosData || []);
          setStock(stockData || []);
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

  const updateRow = (index, field, value) => {
    const newData = [...detalles];
    newData[index][field] = value;
    setDetalles(newData);
  };

  const removeRow = (index) => {
    const newData = detalles.filter((_, i) => i !== index);
    setDetalles(newData);
  };

  const totalGeneral = detalles.reduce(
    (acc, d) => acc + (d.precio * d.cantidad),
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
      const total = d.precio * d.cantidad;

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
          total: total // 👈 CLAVE
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

  const getProducto = (id) =>
  productos.find(p => (p.id_producto || p.idProducto) == id);

  const getStock = (idProducto) =>
  stock.find(s => s.idProducto == idProducto);

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
    },
    {
      name: "Acciones",
      cell: row => (
        <button onClick={() => openModal(row)}>
          Agregar
        </button>
      )
    }
  ];

  return (
    <div style={{ padding: "20px", minHeight: "100%", background: "#151517" }}>

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

      {showModal && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          background: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}>

          <div style={{
            background: "#1f1f22",
            padding: 20,
            width: "700px",
            borderRadius: 10
          }}>

            <h3>Detalle Orden #{ordenSeleccionada?.id_orden}</h3>

            {/* LISTA TIPO BOLETA */}
            {detalles.map((d, i) => {
              const producto = getProducto(d.idProducto);
              const stockItem = getStock(d.idProducto);

              return (
                <div key={i} style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 100px 100px 80px 50px",
                  gap: 10,
                  marginBottom: 10
                }}>

                  {/* PRODUCTO (OBLIGATORIO) */}
                  <select
                    value={d.idProducto}
                    onChange={e => handleProductoChange(i, e.target.value)}
                  >
                    <option value="">Seleccionar producto</option>

                    {productos.map(p => (
                      <option
                        key={p.id_producto || p.idProducto}
                        value={p.id_producto || p.idProducto}
                      >
                        {p.nombre} ({p.tipo}) - S/ {p.precio_venta || p.precioVenta}
                      </option>
                    ))}
                  </select>

                  {/* PRECIO */}
                  <input type="number" value={d.precio} disabled />

                  {/* CANTIDAD */}
                  {producto?.tipo === "SERVICIO" ? (
                    <input value={1} disabled />
                  ) : (
                    <input
                      type="number"
                      value={d.cantidad}
                      onChange={e => updateCantidad(i, e.target.value)}
                    />
                  )}

                  {/* STOCK */}
                  <div style={{ fontSize: 12, color: "#9ca3af" }}>
                    {producto?.tipo === "SERVICIO"
                      ? "-"
                      : stockItem
                        ? `Stock: ${stockItem.stockActual}`
                        : "Sin stock"}
                  </div>

                  <button onClick={() => removeRow(i)}>X</button>

                </div>
              );
            })}

            <button onClick={addRow}>+ Agregar</button>

            <hr />

            <h3>Total: S/ {totalGeneral.toFixed(2)}</h3>

            <button onClick={guardarDetalles}>
              Guardar
            </button>

            <button onClick={() => setShowModal(false)}>
              Cancelar
            </button>

          </div>
        </div>
      )}

    </div>
  );
}

export default Diagnostico;