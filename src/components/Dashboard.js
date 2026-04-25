import React, { useEffect, useState } from "react";
import { fetchWithAuth } from "../services/authService";
import { FaUser, FaMotorcycle, FaBoxes, FaWarehouse, FaClock, FaCheckCircle, FaArrowUp } from "react-icons/fa";
import { Bar, Line } from "react-chartjs-2"; 
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

// Registro de componentes de ChartJS
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, 
  BarElement, Title, Tooltip, Legend, Filler
);

ChartJS.defaults.color = "#94a3b8"; 
ChartJS.defaults.borderColor = "#334155";

function Dashboard() {
  const username = localStorage.getItem("username") || "Usuario";

  const [vehiculos, setVehiculos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [stock, setStock] = useState([]);
  const [ordenesRecientes, setOrdenesRecientes] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [vehiculosData, clientesData, productosData, stockData] = await Promise.all([
          fetchWithAuth("http://localhost:8080/api/vehiculos"),
          fetchWithAuth("http://localhost:8080/api/clientes"),
          fetchWithAuth("http://localhost:8080/api/productos/taller/1"),
          fetchWithAuth("http://localhost:8080/api/stock/almacen/1")
        ]);

        setVehiculos(vehiculosData || []);
        setClientes(clientesData || []);
        setProductos(productosData || []);
        setStock(stockData || []);

        setOrdenesRecientes([
            { id: 509, placa: "ZK-9988", vehiculo: "Yamaha R3", estado: "En Proceso", hora: "Hace 2h" },
            { id: 510, placa: "A1-555", vehiculo: "Suzuki Gixxer", estado: "Pendiente", hora: "Hace 4h" },
            { id: 508, placa: "NB-1234", vehiculo: "Honda CB125", estado: "Finalizado", hora: "Ayer" },
        ]);

      } catch (err) {
        console.error("Error cargando dashboard:", err);
      }
    };
    loadData();
  }, []);

  const stockTotal = stock.reduce((sum, s) => sum + (s.stockActual || 0), 0);
  
  const productosBajoStock = stock
    .map(s => {
      const p = productos.find(prod => prod.id_producto === s.idProducto);
      return p ? { nombre: p.nombre, stockActual: s.stockActual, stockMinimo: s.stockMinimo } : null;
    })
    .filter(p => p && p.stockActual <= p.stockMinimo);

  // 1. GRÁFICO DE TENDENCIA (Línea)
  const chartTrendData = {
    labels: ["Ago", "Sep", "Oct", "Nov", "Dic", "Ene"],
    datasets: [
      {
        label: "Servicios",
        data: [12, 19, 15, 25, 22, 30],
        fill: true,
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        borderColor: "#3b82f6",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#3b82f6",
      },
    ],
  };

  // 2. GRÁFICO DE BARRAS (Estado del Taller - MODIFICADO)
  const chartStatusData = {
    labels: ["En Proceso", "Pendientes", "Finalizados"],
    datasets: [
      {
        label: 'Cantidad',
        data: [5, 3, 12], // Datos simulados
        backgroundColor: [
          "#3b82f6", // Azul (En Proceso)
          "#f59e0b", // Naranja (Pendientes)
          "#10b981"  // Verde (Finalizados)
        ],
        borderRadius: 6,
        barThickness: 45, // Barras gruesas para que se vean bien
      },
    ],
  };

  const barStatusOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false } // Ocultamos leyenda porque las etiquetas de abajo ya lo dicen
    },
    scales: {
      y: { 
        beginAtZero: true, 
        grid: { color: '#334155' },
        ticks: { stepSize: 1 } // Solo números enteros
      },
      x: { 
        grid: { display: false } 
      }
    }
  };

  // --- ESTILOS ---
  const cardBase = {
    background: "#2a2a2a",
    borderRadius: "8px",
    padding: "24px",
    border: "1px solid #334155",
    color: "#f1f5f9",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  };

  const statCardStyle = {
    ...cardBase,
    flexDirection: "row",
    alignItems: "center",
    minWidth: "200px",
    flex: 1,
  };

  const iconBox = (color) => ({
    width: "50px", height: "50px", borderRadius: "12px",
    display: "flex", alignItems: "center", justifyContent: "center",
    background: `${color}20`, color: color, fontSize: "24px", marginRight: "15px"
  });

  return (
    <div style={{ padding: "0px", fontFamily: "Segoe UI, sans-serif", color: "#f1f5f9" }}>
      
      {/* Título */}
      <div style={{marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "flex-end"}}>
        <div>
            <h1 style={{ fontSize: "26px", fontWeight: "700", margin: 0, color: "#f1f5f9" }}>
            Dashboard General
            </h1>
            <p style={{ margin: "5px 0 0", color: "#94a3b8", fontSize: "0.95rem" }}>Bienvenido, {username}. Aquí está el resumen de hoy.</p>
        </div>
        <div style={{fontSize:'0.85rem', color:'#10b981', background:'rgba(16, 185, 129, 0.1)', padding:'5px 12px', borderRadius:'20px', display:'flex', alignItems:'center', gap:5}}>
            <FaClock /> Actualizado ahora
        </div>
      </div>

      {/* 1. KPIs */}
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "25px" }}>
        {[
          { icon: <FaMotorcycle />, value: vehiculos.length, label: "Motos en Taller", color: "#3b82f6" },
          { icon: <FaUser />, value: clientes.length, label: "Clientes Totales", color: "#8b5cf6" },
          { icon: <FaBoxes />, value: productos.length, label: "Productos", color: "#f59e0b" },
          { icon: <FaWarehouse />, value: stockTotal, label: "Stock Total", color: "#ef4444" }
        ].map((c, idx) => (
          <div key={idx} style={statCardStyle}>
            <div style={{display:'flex', alignItems:'center'}}>
                <div style={iconBox(c.color)}>{c.icon}</div>
                <div>
                <h3 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>{c.value}</h3>
                <p style={{ margin: 0, color: "#94a3b8", fontSize: "0.85rem" }}>{c.label}</p>
                </div>
            </div>
          </div>
        ))}
      </div>

      {/* 2. GRÁFICAS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "25px", marginBottom: "25px" }}>
        
        {/* Gráfico 1: Tendencia */}
        <div style={cardBase}>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'20px'}}>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Flujo de Servicios</h3>
                <span style={{color:'#10b981', fontSize:'0.8rem', display:'flex', alignItems:'center', gap:3}}><FaArrowUp/> +12% mes</span>
            </div>
            <div style={{height: '250px'}}>
                <Line data={chartTrendData} options={{...barStatusOptions, plugins:{legend:{display:false}}}} />
            </div>
        </div>

        {/* Gráfico 2: Estado del Taller (AHORA ES BARRAS) */}
        <div style={cardBase}>
            <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Estado del Taller</h3>
            <div style={{height: '250px', position:'relative'}}>
                <Bar data={chartStatusData} options={barStatusOptions} />
            </div>
        </div>

        {/* Alertas Stock */}
        <div style={cardBase}>
            <h3 style={{ margin: "0 0 15px 0", fontSize: "1.1rem", display:'flex', alignItems:'center', gap:10 }}>
                Alertas de Stock <span style={{background:'#ef4444', fontSize:'0.7rem', padding:'2px 8px', borderRadius:'10px'}}>Critico</span>
            </h3>
            
            {productosBajoStock.length > 0 ? (
                <div style={{display:'flex', flexDirection:'column', gap:'10px', overflowY:'auto', maxHeight:'220px'}}>
                    {productosBajoStock.map((p, i) => (
                        <div key={i} style={{background:'#0f172a', padding:'7px', display:'flex', justifyContent:'space-between', alignItems:'center', borderLeft:'2px solid #ef4444'}}>
                            <div>
                                <div style={{fontWeight:'600', fontSize:'0.9rem'}}>{p.nombre}</div>
                                <div style={{fontSize:'0.75rem', color:'#94a3b8'}}>Mínimo: {p.stockMinimo}</div>
                            </div>
                            <div style={{textAlign:'right'}}>
                                <div style={{fontSize:'1.1rem', fontWeight:'bold', color:'#ef4444'}}>{p.stockActual}</div>
                                <div style={{fontSize:'0.7rem', color:'#ef4444'}}>Unds</div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div style={{flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#10b981', opacity:0.8}}>
                    <FaCheckCircle size={40} style={{marginBottom:10}}/>
                    <p>Inventario Saludable</p>
                </div>
            )}
        </div>
      </div>

      {/* 3. ACTIVIDAD RECIENTE */}
      <div style={cardBase}>
        <h3 style={{ margin: "0 0 20px 0", fontSize: "1.1rem" }}>Actividad Reciente en Taller</h3>
        <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead>
                <tr style={{borderBottom:'1px solid #334155', color:'#94a3b8', fontSize:'0.85rem', textAlign:'left'}}>
                    <th style={{paddingBottom:'10px'}}>Vehículo</th>
                    <th style={{paddingBottom:'10px'}}>Placa</th>
                    <th style={{paddingBottom:'10px'}}>Estado</th>
                    <th style={{paddingBottom:'10px', textAlign:'right'}}>Tiempo</th>
                </tr>
            </thead>
            <tbody>
                {ordenesRecientes.map((o, i) => (
                    <tr key={i} style={{borderBottom: i === ordenesRecientes.length -1 ? 'none' : '1px solid #334155'}}>
                        <td style={{padding:'12px 0', fontWeight:'600'}}>{o.vehiculo}</td>
                        <td style={{padding:'12px 0', color:'#94a3b8', fontSize:'0.9rem'}}>{o.placa}</td>
                        <td style={{padding:'12px 0'}}>
                            <span style={{
                                padding:'4px 10px', borderRadius:'20px', fontSize:'0.75rem', fontWeight:'bold',
                                background: o.estado === 'Finalizado' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                                color: o.estado === 'Finalizado' ? '#34d399' : '#60a5fa'
                            }}>
                                {o.estado}
                            </span>
                        </td>
                        <td style={{padding:'12px 0', textAlign:'right', color:'#64748b', fontSize:'0.85rem'}}>{o.hora}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;