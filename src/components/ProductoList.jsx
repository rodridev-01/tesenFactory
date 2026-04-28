import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import "../assets/styles/Global.css";
import GlobalDataTable from "./GlobalDatatable";
import ProductoModal from "./modals/ProductoModal";
import StockModal from "./modals/StockModal";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaLayerGroup,
} from "react-icons/fa";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [talleres, setTalleres] = useState([]);
  const [stock, setStock] = useState([]);

  const [idTaller, setIdTaller] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [newProductId, setNewProductId] = useState(null);

  const [stockForm, setStockForm] = useState({
    idProducto: "",
    stockActual: "",
    stockMinimo: "",
  });

  const idAlmacen = 1;

  const [formData, setFormData] = useState({
    idTaller: "",
    tipo: "PRODUCTO",
    sku: "",
    nombre: "",
    unidad: "",
    precioCompra: "",
    precioVenta: "",
    activo: true,
  });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const talleresData = await fetchWithAuth("http://localhost:8080/api/talleres");
      setTalleres(talleresData);

      const defaultTaller = talleresData[0]?.idTaller;
      if (defaultTaller) {
        await loadProductos(defaultTaller);
      }
    } catch (err) {
      alert("Error al cargar datos: " + err.message);
    }
  };

  const loadProductos = async (id) => {
    try {
      const [productosData, stockData] = await Promise.all([
        fetchWithAuth(`http://localhost:8080/api/productos/taller/${id}/productos`),
        fetchWithAuth(`http://localhost:8080/api/stock/almacen/${idAlmacen}`),
      ]);

      setProductos(productosData);
      setStock(stockData);
      setIdTaller(id);
    } catch (err) {
      console.error(err);
    }
  };

  const getStockByProduct = (idProducto) => {
    return (
      stock.find(
        (s) => Number(s.idProducto) === Number(idProducto)
      ) || null
    );
  };

  const clearForm = () => {
    setFormData({
      idTaller: idTaller || "",
      tipo: "PRODUCTO",
      sku: "",
      nombre: "",
      unidad: "",
      precioCompra: "",
      precioVenta: "",
      activo: true,
    });
    setEditingId(null);
  };

  const clearStockForm = () => {
    setStockForm({
      idProducto: "",
      stockActual: "",
      stockMinimo: "",
    });
  };

  const handleCreate = async () => {
    try {
      const response = await fetchWithAuth("http://localhost:8080/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_taller: Number(formData.idTaller),
          tipo: "PRODUCTO",
          sku: formData.sku,
          nombre: formData.nombre,
          unidad: formData.unidad,
          precio_compra: Number(formData.precioCompra),
          precio_venta: Number(formData.precioVenta),
          activo: formData.activo,
        }),
      });

      const productId =
        response?.id_producto || response?.idProducto || response?.id;

      clearForm();
      setModalOpen(false);
      await loadProductos(idTaller);

      if (productId) {
        setNewProductId(productId);
        setStockForm({
          idProducto: productId,
          stockActual: "",
          stockMinimo: "",
        });
        setStockModalOpen(true);
      }
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetchWithAuth(`http://localhost:8080/api/productos/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id_taller: Number(formData.idTaller),
          tipo: "PRODUCTO",
          sku: formData.sku,
          nombre: formData.nombre,
          unidad: formData.unidad,
          precio_compra: Number(formData.precioCompra),
          precio_venta: Number(formData.precioVenta),
          activo: formData.activo,
        }),
      });

      clearForm();
      setModalOpen(false);
      await loadProductos(idTaller);
      alert("Producto actualizado correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleSaveStock = async () => {
    try {
      await fetchWithAuth("http://localhost:8080/api/stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idProducto: Number(stockForm.idProducto),
          idAlmacen,
          stockActual: Number(stockForm.stockActual),
          stockMinimo: Number(stockForm.stockMinimo),
        }),
      });

      setStockModalOpen(false);
      clearStockForm();
      await loadProductos(idTaller);
      alert("Stock registrado correctamente");
    } catch (err) {
      alert("Error al guardar stock: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas desactivar este producto?")) return;

    try {
      await fetchWithAuth(
        `http://localhost:8080/api/productos/${id}/estado`,
        { method: "PATCH" }
      );
      await loadProductos(idTaller);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleAddStock = async (idStock) => {
    const cantidad = prompt("Ingrese cantidad a agregar:");
    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
      return alert("Cantidad inválida");
    }

    try {
      await fetchWithAuth(
        `http://localhost:8080/api/stock/${idStock}/add?cantidad=${cantidad}`,
        { method: "PATCH" }
      );
      await loadProductos(idTaller);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleRemoveStock = async (row) => {
    const cantidad = prompt("Ingrese cantidad a quitar:");

    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
      return alert("Cantidad inválida");
    }

    const cantidadNum = Number(cantidad);
    const stockActualNum = Number(row.stockActual);

    if (cantidadNum > stockActualNum) {
      return alert(
        `No puedes retirar ${cantidadNum} unidades. El stock actual es de ${stockActualNum}.`
      );
    }

    try {
      await fetchWithAuth(
        `http://localhost:8080/api/stock/${row.idStock}/delete?cantidad=${cantidadNum}`,
        {
          method: "PATCH",
        }
      );

      await loadAll();
      alert("Stock actualizado correctamente");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const openEditModal = (producto) => {
    setEditingId(producto.id_producto || producto.idProducto);
    setFormData({
      idTaller: producto.id_taller || producto.idTaller || idTaller,
      tipo: "PRODUCTO",
      sku: producto.sku || "",
      nombre: producto.nombre || "",
      unidad: producto.unidad || "",
      precioCompra: producto.precio_compra || producto.precioCompra || "",
      precioVenta: producto.precio_venta || producto.precioVenta || "",
      activo: producto.activo ?? true,
    });
    setModalOpen(true);
  };

  const filteredData = productos.filter((p) =>
    `${p.nombre} ${p.sku} ${p.unidad}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const dataWithStock = filteredData.map((producto) => {
    const productId = producto.id_producto || producto.idProducto;
    const stockInfo = getStockByProduct(productId);

    return {
      ...producto,
      stockInfo,
    };
  });

  const columns = [
    {
      name: "SKU",
      selector: (row) => row.sku || "-",
      sortable: true,
      width: "140px",
    },
    {
      name: "Nombre",
      selector: (row) => row.nombre,
      sortable: true,
      grow: 2,
      wrap: true,
      width: "300px",
      cell: (row) => (
        <span style={{ fontWeight: "bold", color: "#f1f5f9" }}>
          {row.nombre}
        </span>
      ),
    },
    {
      name: "Unidad",
      selector: (row) => row.unidad,
      width: "100px",
    },
    {
      name: "P. Compra",
      selector: (row) => row.precio_compra || row.precioCompra,
      width: "120px",
      cell: (row) => (
        <span style={{ fontWeight: "bold"}}>
          S/ {Number(row.precio_compra || row.precioCompra).toFixed(2)}
        </span>
      ),
    },
    {
      name: "P. Venta",
      selector: (row) => row.precio_venta || row.precioVenta,
      width: "120px",
      cell: (row) => (
        <span style={{ fontWeight: "bold" }}>
          S/ {Number(row.precio_venta || row.precioVenta).toFixed(2)}
        </span>
      ),
    },
    {
      name: "Stock Actual",
      selector: (row) => row.stockInfo?.stockActual || 0,
      sortable: true,
      width: "150px",
      cell: (row) => {
        const actual = row.stockInfo?.stockActual || 0;
        const minimo = row.stockInfo?.stockMinimo || 0;
        return (
          <span
            style={{
              fontWeight: "bold",
              color: actual <= minimo ? "#ef4444" : "#10b981",
            }}
          >
            {actual}
          </span>
        );
      },
    },
    {
      name: "Stock Mínimo",
      selector: (row) => row.stockInfo?.stockMinimo || 0,
      sortable: true,
      width: "150px",
    },
    {
      name: "Estado",
      selector: (row) => row.activo,
      width: "110px",
      cell: (row) =>
        row.activo ? (
          <span style={{ color: "#10b981", fontWeight: "bold" }}>Activo</span>
        ) : (
          <span style={{ color: "#ef4444", fontWeight: "bold" }}>Inactivo</span>
        ),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          {row.stockInfo && (
            <>
              <button
                onClick={() => handleAddStock(row.stockInfo.idStock)}
                title="Agregar Stock"
                style={{ border: "none", background: "transparent", color: "#10b981", cursor: "pointer" }}
              >
                <FaPlus size={16} />
              </button>

              <button
                onClick={() => handleRemoveStock(row.stockInfo)}
                title="Quitar Stock"
                style={{ border: "none", background: "transparent", color: "#f59e0b", cursor: "pointer" }}
              >
                <FaLayerGroup size={16} />
              </button>
            </>
          )}

          <button
            onClick={() => openEditModal(row)}
            title="Editar"
            style={{ border: "none", background: "transparent", color: "#3b82f6", cursor: "pointer" }}
          >
            <FaEdit size={18} />
          </button>

          <button
            onClick={() => handleDelete(row.id_producto || row.idProducto)}
            title="Eliminar"
            style={{ border: "none", background: "transparent", color: "#ef4444", cursor: "pointer" }}
          >
            <FaTrash size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="usuarios-container" style={{ padding: "20px", minHeight: "100%", background: "#151517" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <button
          className="btn-crear"
          onClick={() => {
            clearForm();
            setModalOpen(true);
          }}
          style={{
            marginTop: 0,
            width: "auto",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "#ef4444",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: 6,
            fontWeight: "bold",
            cursor: "pointer",
          }}
        >
          <FaPlus /> Agregar Producto
        </button>
      </div>

      <div className="table-card" style={{ background: "#1f1f22", border: "1px solid #2d2d30" }}>
        <GlobalDataTable
          columns={columns}
          data={dataWithStock}
          subHeaderComponent={
            <div style={{ display: "flex", gap: 10, alignItems: "center", width: "100%", justifyContent: "flex-end" }}>
              <select
                value={idTaller}
                onChange={(e) => loadProductos(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #2d2d30",
                  background: "#151517",
                  color: "#f1f5f9",
                }}
              >
                {talleres.map((t) => (
                  <option key={t.idTaller} value={t.idTaller}>
                    {t.nombre}
                  </option>
                ))}
              </select>

              <div style={{ position: "relative", width: "250px" }}>
                <FaSearch style={{ position: "absolute", top: "10px", left: "12px", color: "#9ca3af" }} />
                <input
                  type="text"
                  placeholder="Buscar producto..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{
                    paddingLeft: "35px",
                    background: "#151517",
                    color: "#f1f5f9",
                    border: "1px solid #2d2d30",
                    width: "100%",
                    borderRadius: "6px",
                    height: "35px",
                    outline: "none",
                  }}
                />
              </div>
            </div>
          }
        />
      </div>

      <ProductoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        editingId={editingId}
        formData={formData}
        setFormData={setFormData}
        onSave={editingId ? handleUpdate : handleCreate}
      />
      <StockModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        stockForm={stockForm}
        setStockForm={setStockForm}
        productos={productos}
        onSave={handleSaveStock}
      />
    </div>
  );
}

export default Productos;
