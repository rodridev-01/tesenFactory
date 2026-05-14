import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import "../assets/styles/Global.css";
import GlobalDataTable from "./GlobalDatatable";
import { FaEdit, FaTrash, FaPlus, FaTimes, FaBox, FaLayerGroup, FaExclamationTriangle, FaSearch } from "react-icons/fa";

function Stock() {
  const [stock, setStock] = useState([]);
  const [productos, setProductos] = useState([]);

  const [idStock, setIdStock] = useState(null);
  const [idProducto, setIdProducto] = useState("");
  const [stockActual, setStockActual] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");

  const idAlmacen = 1; 
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredData = stock.filter((s) =>
    `${s.nombreProducto} ${s.stockActual} ${s.stockMinimo}`.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      const productosData = await fetchWithAuth("/productos/taller/1");
      const productosFisicos = productosData.filter(
        (p) => p.tipo === "PRODUCTO"
      );
      setProductos(productosFisicos);

      const stockData = await fetchWithAuth(`/stock/almacen/${idAlmacen}`);
      setStock(stockData);

    } catch (err) {
      console.error("Error cargando datos:", err);
      alert("Error al cargar datos: " + err.message);
    }
  };

  const clearForm = () => {
    setIdStock(null); setIdProducto(""); setStockActual(""); setStockMinimo("");
  };

  const handleSave = async () => {
    const idProdNum = parseInt(idProducto, 10);
    const stockActualNum = parseFloat(stockActual);
    const stockMinimoNum = parseFloat(stockMinimo);

    if (!idProdNum || isNaN(stockActualNum) || isNaN(stockMinimoNum)) return alert("Por favor, seleccione un producto y complete los campos numéricos.");

    try {
      const payload = { idProducto: idProdNum, idAlmacen: idAlmacen, stockActual: stockActualNum, stockMinimo: stockMinimoNum };
      if (idStock) payload.idStock = idStock;

      await fetchWithAuth("/stock", {
        method: "POST", 
        body: JSON.stringify(payload),
      });

      await loadAll(); clearForm(); setModalOpen(false);
      alert(idStock ? "Stock actualizado correctamente" : "Stock creado correctamente");
    } catch (err) { alert("Error guardando: " + err.message); }
  };

  const openEditModal = (row) => {
    setIdStock(row.idStock); setIdProducto(row.idProducto); setStockActual(row.stockActual); setStockMinimo(row.stockMinimo);
    setModalOpen(true);
  };
// const handleDelete = async (idStock) => {
//   if (!window.confirm("¿Está seguro de eliminar este registro de stock?")) return;
//   try {
//     await fetchWithAuth(`/stock/${idStock}`, {
//       method: "DELETE"
//     });
//     await loadAll();
//     alert("Eliminado correctamente");
//   } catch (err) {
//     alert("Error al eliminar: " + err.message);
//   }
// };

  const handleAddStock = async (idStock) => {
    const cantidad = prompt("Ingrese cantidad a agregar:");
    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) return alert("Cantidad inválida");

    try {
      await fetchWithAuth(`/stock/${idStock}/add?cantidad=${cantidad}`, {
        method: "PATCH",
      });
      await loadAll();
      alert("Stock actualizado");
    } catch (err) { alert("Error: " + err.message); }
  };

  const handleRemoveStock = async (idStock) => {
    const cantidad = prompt("Ingrese cantidad a quitar:");
    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) return alert("Cantidad inválida");

    try {
      await fetchWithAuth(`/stock/${idStock}/delete?cantidad=${cantidad}`, {
        method: "PATCH",
      });
      await loadAll();
      alert("Stock actualizado");
    } catch (err) { alert("Error: " + err.message); }
  };

  // --- ESTILOS ---
  const labelStyle = { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#cbd5e1', fontSize: '0.85rem' };
  const inputContainer = { position: 'relative', width: '100%' };
  const iconInInput = { position: 'absolute', left: '12px', top: '11px', color: '#9ca3af', fontSize: '15px' };
  const inputStyled = { 
    width: '100%', padding: '10px 10px 10px 35px', borderRadius: '6px', 
    border: '1px solid #2d2d30', outline: 'none', fontSize: '0.9rem', 
    background: '#151517', color: '#f1f5f9' 
  };

  const columns = [
    { name: "Producto", selector: (row) => row.nombreProducto, sortable: true, grow: 2 },
    { name: "Stock Actual", selector: (row) => row.stockActual, sortable: true, cell: row => <span style={{fontWeight:'bold', color: row.stockActual <= row.stockMinimo ? '#ef4444' : '#10b981'}}>{row.stockActual}</span> },
    { name: "Stock Mínimo", selector: (row) => row.stockMinimo, sortable: true },
    {
      name: "Acciones",
      cell: (row) => (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => handleAddStock(row.idStock)} title="Agregar Stock" style={{ border: 'none', background: 'transparent', color: '#10b981', cursor: 'pointer' }}><FaPlus size={16} /></button>
          <button onClick={() => handleRemoveStock(row.idStock)} title="Quitar Stock" style={{ border: 'none', background: 'transparent', color: '#f59e0b', cursor: 'pointer' }}><FaLayerGroup size={16} /></button>
          <button onClick={() => openEditModal(row)} title="Editar" style={{ border: 'none', background: 'transparent', color: '#3b82f6', cursor: 'pointer' }}><FaEdit size={18} /></button>
        </div>
      ),
    }
  ];

  return (
    <div className="usuarios-container" style={{padding:'20px', minHeight:'100%', background:'#151517'}}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <button className="btn-crear" onClick={() => { clearForm(); setModalOpen(true); }} style={{ marginTop: 0, width: 'auto', display: 'flex', alignItems: 'center', gap: '8px', background:'#ef4444', border:'none', padding:'10px 20px', borderRadius:6, color:'white', fontWeight:'bold', cursor:'pointer' }}>
          <FaPlus /> Agregar Stock
        </button>
      </div>

      <div className="table-card" style={{background:'#1f1f22', border:'1px solid #2d2d30'}}>
        <GlobalDataTable
          columns={columns}
          data={filteredData}
          subHeaderComponent={
            <div style={{ position: 'relative', width: '250px' }}>
                <FaSearch style={{ position: 'absolute', top: '10px', left: '12px', color: '#9ca3af' }} />
                <input type="text" placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} style={{...inputStyled, paddingLeft:'35px'}} />
            </div>
          }
        />
      </div>

      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="modal-content" style={{width:'500px', background:'#1f1f22', border:'1px solid #2d2d30', padding:0}} onClick={(e) => e.stopPropagation()}>
            <div style={{ padding: '20px 30px', borderBottom: '1px solid #2d2d30', display:'flex', justifyContent:'space-between', alignItems:'center', background:'#151517' }}>
                <h2 style={{margin:0, color:'#f1f5f9', fontSize:'1.3rem'}}>{idStock ? "Actualizar Stock" : "Crear Stock"}</h2>
                <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', fontSize: '1.3rem', color: '#9ca3af', cursor:'pointer' }}><FaTimes /></button>
            </div>
            <div style={{padding:'30px', display:'grid', gap:15}}>
              <div>
                  <label style={labelStyle}>Producto</label>
                  <div style={inputContainer}>
                      <FaBox style={iconInInput} />
                      <select value={idProducto} onChange={(e) => setIdProducto(e.target.value)} disabled={idStock !== null} style={{...inputStyled, appearance:'none', cursor:'pointer'}}>
                        <option value="">Seleccione un producto...</option>
                        {productos.map((p) => <option key={p.id_producto || p.idProducto} value={p.id_producto || p.idProducto}>{p.nombre}</option>)}
                      </select>
                  </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
                  <div>
                      <label style={labelStyle}>Stock Actual</label>
                      <div style={inputContainer}>
                          <FaLayerGroup style={iconInInput} />
                          <input placeholder="0" type="number" value={stockActual} onChange={(e) => setStockActual(e.target.value)} style={inputStyled} />
                      </div>
                  </div>
                  <div>
                      <label style={labelStyle}>Stock Mínimo</label>
                      <div style={inputContainer}>
                          <FaExclamationTriangle style={iconInInput} />
                          <input placeholder="0" type="number" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} style={inputStyled} />
                      </div>
                  </div>
              </div>
              <div style={{ marginTop: "20px", textAlign: "right", borderTop:'1px solid #2d2d30', paddingTop:'20px', display:'flex', justifyContent:'flex-end', gap:10 }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', borderRadius: '6px', border: '1px solid #2d2d30', background: 'transparent', color: '#cbd5e1', cursor: 'pointer' }}>Cancelar</button>
                <button className="btn-crear" onClick={handleSave} style={{width:'auto', marginTop:0, background:'#ef4444', border:'none', padding:'10px 25px', borderRadius:6, color:'white', fontWeight:'bold', cursor:'pointer'}}>
                  {idStock ? "Actualizar" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Stock;