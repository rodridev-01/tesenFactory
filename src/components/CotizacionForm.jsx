import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import { 
  FaPlus, FaTrash, FaSave, FaFilePdf, FaUserTie, 
  FaCalendarAlt, FaHashtag, FaMotorcycle, FaWrench, FaTachometerAlt
} from "react-icons/fa";
import { PDFDownloadLink } from '@react-pdf/renderer';
import CotizacionTemplate from './reportes/CotizacionTemplate';
import "../assets/styles/Global.css"; 

function CotizacionForm({ onCancel, onSuccess }) {
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [todosVehiculos, setTodosVehiculos] = useState([]); // Todos los vehículos del sistema
  const [vehiculosDelCliente, setVehiculosDelCliente] = useState([]); // Filtro dinámico
  
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  const [header, setHeader] = useState({
    idCliente: "",
    fecha: new Date().toISOString().split('T')[0],
    numero: "AUTO", 
    condiciones: "Contado",
    vehiculo: "", 
    kilometraje: "",
    fallaReportada: "", 
    notaPublica: "Validez de la oferta: 15 días.\nLos precios incluyen IGV."
  });

  const [items, setItems] = useState([
    { id: 1, idProducto: "", codigo: "", descripcion: "", cantidad: 1, precio: 0, total: 0 }
  ]);

  const [totales, setTotales] = useState({ subtotal: 0, impuestos: 0, total: 0 });

  useEffect(() => { loadCatalogos(); }, []);
  useEffect(() => { calculateTotals(); }, [items]);

  const loadCatalogos = async () => {
    try {
      const [cli, prod, veh] = await Promise.all([
        fetchWithAuth("http://localhost:8080/api/clientes/taller/1"),
        fetchWithAuth("http://localhost:8080/api/productos/taller/1"),
        fetchWithAuth("http://localhost:8080/api/vehiculos") // Cargamos vehículos para el enlace automático
      ]);
      setClientes(cli || []);
      setProductos(prod || []);
      setTodosVehiculos(veh || []);
    } catch (err) { console.error("Error cargando catálogos", err); }
  };

  // --- LÓGICA INTELIGENTE DE SELECCIÓN ---
  const handleHeaderChange = (e) => {
    const { name, value } = e.target;
    
    // Si cambiamos el Cliente, buscamos sus motos
    if (name === 'idCliente') {
        const idCli = Number(value);
        const clienteFound = clientes.find(c => c.idCliente === idCli);
        setClienteSeleccionado(clienteFound || null); 

        // Filtramos las motos de este cliente
        const motosEncontradas = todosVehiculos.filter(v => v.idCliente === idCli);
        setVehiculosDelCliente(motosEncontradas);

        // AUTORRELLENADO
        let autoVehiculo = "";
        let autoKm = "";

        if (motosEncontradas.length === 1) {
            // Si tiene solo una, la seleccionamos automáticamente
            const v = motosEncontradas[0];
            autoVehiculo = `${v.marcaNombre} ${v.modelo} - ${v.placa}`;
            autoKm = v.kilometraje;
        }

        setHeader(prev => ({
            ...prev,
            [name]: value,
            vehiculo: autoVehiculo, // Se llena solo si hay 1
            kilometraje: autoKm
        }));
    } 
    // Si cambiamos el Vehículo (desde el combobox)
    else if (name === 'vehiculoSelect') {
        const vehiculoObj = vehiculosDelCliente.find(v => v.placa === value); // Usamos placa como value único
        if (vehiculoObj) {
            setHeader(prev => ({
                ...prev,
                vehiculo: `${vehiculoObj.marcaNombre} ${vehiculoObj.modelo} - ${vehiculoObj.placa}`,
                kilometraje: vehiculoObj.kilometraje
            }));
        }
    }
    else {
        // Cambio normal para otros campos
        setHeader({ ...header, [name]: value });
    }
  };

  const handleItemChange = (id, field, value) => {
    const newItems = items.map(item => {
      if (item.id === id) {
        let updates = { [field]: value };
        if (field === 'idProducto') {
            const prod = productos.find(p => p.id_producto === Number(value));
            if (prod) {
                updates = { ...updates, codigo: prod.sku, descripcion: prod.nombre, precio: prod.precio_venta };
            }
        }
        return { ...item, ...updates };
      }
      return item;
    });
    setItems(newItems);
  };

  const calculateTotals = () => {
    let sub = 0;
    items.forEach(item => { sub += item.cantidad * item.precio; });
    setTotales({ subtotal: sub, impuestos: sub * 0.18, total: sub * 1.18 });
  };

  const addItem = () => {
    const newId = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    setItems([...items, { id: newId, idProducto: "", codigo: "", descripcion: "", cantidad: 1, precio: 0, total: 0 }]);
  };

  const removeItem = (id) => {
    if (items.length === 1) return;
    setItems(items.filter(i => i.id !== id));
  };

  const handleSubmit = async () => {
    console.log("Guardando Cotización:", { header, items });
    alert("Cotización Guardada");
    if(onSuccess) onSuccess();
  };

  // ESTILOS MODO NOCHE
  const containerStyle = { background: '#1e293b', width: '100%', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)', overflow: 'hidden', border: '1px solid #334155', color: '#f1f5f9' };
  const topBarStyle = { background: '#1e293b', padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '3px solid #ef4444', flexWrap: 'wrap', gap: '15px' };
  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', marginBottom: '6px' };
  const inputStyle = { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #334155', fontSize: '0.95rem', background: '#020617', color: 'white', outline:'none' };
  const tableHeader = { background: '#0f172a', color: '#94a3b8', padding: '12px 15px', textAlign: 'left', fontSize: '0.8rem', fontWeight: '800', borderBottom: '2px solid #334155', textTransform: 'uppercase' };
  const tableCell = { padding: '10px 15px', minWidth: '80px', color: '#f1f5f9' };

  const pdfButtonStyle = { textDecoration: 'none', background: '#1e293b', border: '1px solid #ef4444', color: '#ef4444', padding: '8px 15px', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.9rem', fontWeight: 'bold' };

  return (
    <div style={containerStyle}>
        
        {/* HEADER */}
        <div style={topBarStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <img src="/images/tesen.png" alt="Logo" style={{ height: '45px', objectFit: 'contain', background: 'white', padding: '5px 10px', borderRadius: '6px' }} />
                <span style={{ fontSize:'0.75rem', background:'rgba(239, 68, 68, 0.2)', color:'#f87171', padding:'4px 10px', borderRadius:'20px', fontWeight:'700' }}>NUEVA COTIZACIÓN</span>
            </div>
            
            <div style={{display:'flex', gap:'10px'}}>
                {clienteSeleccionado ? (
                  <PDFDownloadLink document={<CotizacionTemplate data={header} items={items} totales={totales} cliente={clienteSeleccionado} />} fileName={`Cotizacion_${header.numero || 'Borrador'}.pdf`} style={pdfButtonStyle}>
                    {({ loading }) => loading ? '...' : <><FaFilePdf /> PDF</>}
                  </PDFDownloadLink>
                ) : (
                  <button style={{...pdfButtonStyle, borderColor:'#475569', color:'#64748b', cursor:'not-allowed'}} disabled><FaFilePdf /> PDF</button>
                )}
                <button onClick={handleSubmit} style={{background:'#ef4444', border:'none', color:'white', padding:'8px 20px', borderRadius:'6px', cursor:'pointer', fontWeight:'bold', display:'flex', alignItems:'center', gap:5}}><FaSave/> Guardar</button>
            </div>
        </div>

        {/* FORMULARIO */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', padding: '30px' }}>
            
            {/* COLUMNA IZQUIERDA */}
            <div style={{ flex: '2 1 400px', minWidth: '300px' }}>
                {/* SELECCIÓN CLIENTE */}
                <div style={{background:'rgba(59, 130, 246, 0.1)', padding:'20px', borderRadius:'8px', border:'1px solid rgba(59, 130, 246, 0.3)', marginBottom:'20px'}}>
                    <label style={{...labelStyle, color:'#60a5fa', marginBottom: 10, display:'flex', alignItems:'center', gap:6}}>
                        <FaUserTie size={14}/> CLIENTE DESTINATARIO
                    </label>
                    <select name="idCliente" value={header.idCliente} onChange={handleHeaderChange} style={{...inputStyle, borderColor:'rgba(59, 130, 246, 0.5)', fontSize:'1rem'}}>
                        <option value="">-- Buscar Cliente --</option>
                        {clientes.map(c => <option key={c.idCliente} value={c.idCliente}>{c.nombre} {c.apellido}</option>)}
                    </select>
                </div>

                {/* DATOS DEL VEHÍCULO (DINÁMICO) */}
                <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', marginBottom:'15px'}}>
                    <div>
                        <label style={labelStyle}>Vehículo / Placa</label>
                        <div style={{position:'relative'}}>
                            <FaMotorcycle style={{position:'absolute', top:10, left:10, color:'#94a3b8'}}/>
                            
                            {/* --- AQUÍ ESTÁ EL CAMBIO INTELIGENTE --- */}
                            {vehiculosDelCliente.length > 0 ? (
                                // Si el cliente tiene motos, mostramos un SELECT
                                <select 
                                    name="vehiculoSelect" 
                                    onChange={handleHeaderChange} 
                                    style={{...inputStyle, paddingLeft:'35px', appearance:'none', cursor:'pointer'}}
                                >
                                    {vehiculosDelCliente.length > 1 && <option value="">Seleccione Moto...</option>}
                                    {vehiculosDelCliente.map(v => (
                                        <option key={v.idVehiculo} value={v.placa}>
                                            {v.marcaNombre} {v.modelo} - {v.placa}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                // Si no tiene, dejamos el INPUT para escribir manual
                                <input 
                                    name="vehiculo" 
                                    value={header.vehiculo} 
                                    onChange={handleHeaderChange} 
                                    style={{...inputStyle, paddingLeft:'35px'}} 
                                    placeholder="Ej: Honda CB125 (Manual)" 
                                />
                            )}
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Kilometraje</label>
                        <div style={{position:'relative'}}>
                            <FaTachometerAlt style={{position:'absolute', top:10, left:10, color:'#94a3b8'}}/>
                            <input type="number" name="kilometraje" value={header.kilometraje} onChange={handleHeaderChange} style={{...inputStyle, paddingLeft:'35px'}} placeholder="0" />
                        </div>
                    </div>
                </div>
                <div>
                    <label style={labelStyle}>Falla Reportada / Solicitud</label>
                    <div style={{position:'relative'}}>
                        <FaWrench style={{position:'absolute', top:10, left:10, color:'#ef4444'}}/>
                        <input name="fallaReportada" value={header.fallaReportada} onChange={handleHeaderChange} style={{...inputStyle, paddingLeft:'35px', borderColor:'#ef4444'}} placeholder="Ej: Ruido en motor, Cambio de aceite..." />
                    </div>
                </div>
            </div>

            {/* COLUMNA DERECHA */}
            <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
                <div style={{background:'rgba(239, 68, 68, 0.1)', padding:'20px', borderRadius:'8px', border:'1px solid rgba(239, 68, 68, 0.3)'}}>
                    <h4 style={{marginTop:0, color:'#f87171', marginBottom:'15px', fontSize:'0.85rem', textTransform:'uppercase'}}>Detalles</h4>
                    <div style={{marginBottom:'15px'}}><label style={labelStyle}>Nº Cotización</label><div style={{display:'flex', alignItems:'center', gap:5}}><FaHashtag style={{color:'#ef4444'}}/><input name="numero" value={header.numero} readOnly style={{...inputStyle, fontWeight:'bold', color:'#f87171', background:'#1e293b'}} /></div></div>
                    <div style={{marginBottom:'15px'}}><label style={labelStyle}>Fecha Emisión</label><div style={{display:'flex', alignItems:'center', gap:5}}><FaCalendarAlt style={{color:'#ef4444'}}/><input type="date" name="fecha" value={header.fecha} onChange={handleHeaderChange} style={inputStyle} /></div></div>
                    <div style={{marginBottom:'15px'}}><label style={labelStyle}>Condiciones Pago</label><select name="condiciones" value={header.condiciones} onChange={handleHeaderChange} style={inputStyle}><option>Contado</option><option>Crédito 15 días</option></select></div>
                </div>
            </div>
        </div>

        {/* TABLA DE PRODUCTOS */}
        <div style={{padding:'0 30px 30px 30px'}}>
            <table style={{width:'100%', borderCollapse:'collapse', minWidth:'700px', marginBottom:'15px'}}>
                <thead>
                    <tr>
                        <th style={{...tableHeader, width:'70px', textAlign:'center'}}>CANT.</th>
                        <th style={{...tableHeader, width:'250px'}}>PRODUCTO / SERVICIO</th>
                        <th style={tableHeader}>DESCRIPCIÓN</th>
                        <th style={{...tableHeader, width:'130px'}}>P. UNIT.</th>
                        <th style={{...tableHeader, width:'130px', textAlign:'right'}}>TOTAL</th>
                        <th style={{...tableHeader, width:'50px'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id} style={{borderBottom: '1px solid #334155'}}>
                            <td style={{...tableCell, textAlign:'center'}}><input type="number" value={item.cantidad} onChange={(e) => handleItemChange(item.id, 'cantidad', Number(e.target.value))} style={{...inputStyle, textAlign:'center', padding:'6px'}} /></td>
                            <td style={tableCell}><select value={item.idProducto} onChange={(e) => handleItemChange(item.id, 'idProducto', e.target.value)} style={{...inputStyle, padding:'6px'}}><option value="">-- Manual --</option>{productos.map(p => <option key={p.id_producto} value={p.id_producto}>{p.sku} - {p.nombre}</option>)}</select></td>
                            <td style={tableCell}><input type="text" value={item.descripcion} onChange={(e) => handleItemChange(item.id, 'descripcion', e.target.value)} placeholder="Detalle..." style={{...inputStyle, padding:'6px'}} /></td>
                            <td style={tableCell}><input type="number" value={item.precio} onChange={(e) => handleItemChange(item.id, 'precio', Number(e.target.value))} style={{...inputStyle, textAlign:'right', padding:'6px'}} /></td>
                            <td style={{...tableCell, textAlign:'right', fontWeight:'700'}}>S/ {(item.cantidad * item.precio).toFixed(2)}</td>
                            <td style={tableCell}><button onClick={() => removeItem(item.id)} style={{border:'none', background:'transparent', color:'#ef4444', cursor:'pointer'}}><FaTrash/></button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={addItem} style={{background:'#1e293b', border:'2px dashed #475569', color:'#94a3b8', padding:'12px', borderRadius:'6px', cursor:'pointer', width:'100%', fontWeight:'600'}}><FaPlus /> AGREGAR LÍNEA</button>
        </div>

        {/* FOOTER TOTALES */}
        <div style={{ padding: '0 30px 40px 30px', display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
            <div style={{flex: '2 1 300px'}}>
                <label style={labelStyle}>Notas</label>
                <textarea name="notaPublica" value={header.notaPublica} onChange={handleHeaderChange} style={{...inputStyle, minHeight:'100px', resize:'none'}} />
            </div>
            <div style={{flex: '1 1 250px', background: '#0f172a', padding: '20px', borderRadius: '8px', border: '1px solid #334155'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}><span>Subtotal</span><span>S/ {totales.subtotal.toFixed(2)}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}><span>IGV (18%)</span><span>S/ {totales.impuestos.toFixed(2)}</span></div>
                <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '10px', paddingTop: '10px', borderTop: '2px dashed #475569', fontSize: '1.4rem', fontWeight: '800', color: '#ef4444'}}><span>TOTAL</span><span>S/ {totales.total.toFixed(2)}</span></div>
            </div>
        </div>

    </div>
  );
}

export default CotizacionForm;