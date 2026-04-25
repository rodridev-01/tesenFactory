import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, FaTools, FaCogs, FaUsers, FaCar, FaSignOutAlt, 
  FaChevronRight, FaUserCog, FaTimes, FaMotorcycle, FaFileInvoiceDollar 
} from "react-icons/fa";

import '../../assets/styles/MainLayout.css'; 
import { logout } from "../../services/authService";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const [menusOpen, setMenusOpen] = useState({});

  const toggleMenu = (menuKey) => {
    setMenusOpen(prev => ({ ...prev, [menuKey]: !prev[menuKey] }));
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const userRole = localStorage.getItem('role') || "ADMIN";

  const handleLogout = async () => {
    if (logout) await logout();
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      
      <button className="sidebar-close-btn" onClick={onClose}>
        <FaTimes size={24} />
      </button>

      <div className="brand">
        <img src="/images/tesen.png" alt="Logo" className="brand-logo" />
      </div>

      <nav className="nav-links">
        
        <Link 
          to="/dashboard" 
          className={`nav-item ${isActive('/dashboard')}`} 
          onClick={onClose}
        >
          <div className="nav-label"><FaTachometerAlt size={18} /> <span>Inicio</span></div>
        </Link>

        {/* Reparación */}
        <div>
          <button 
            className={`nav-item-header ${menusOpen.reparacion ? 'active-menu' : ''}`} 
            onClick={() => toggleMenu("reparacion")}
          >
            <div className="nav-label">
              <FaTools size={18} />
              <span>Servicios</span> 
            </div>
            <FaChevronRight size={12} className={`arrow-icon ${menusOpen.reparacion ? 'rotate-90' : ''}`} />
          </button>
          
          {menusOpen.reparacion && (
            <div className="submenu">
              
              
              <Link 
                to="/ordenes" 
                className={`submenu-item ${isActive('/reparaciones')}`} 
                onClick={onClose}
              >
                Órdenes de Servicio
              </Link>
              
            </div>
          )}
        </div>

        {/* Repuestos */}
        <div>
          <button 
            className={`nav-item-header ${menusOpen.repuestos ? 'active-menu' : ''}`} 
            onClick={() => toggleMenu("repuestos")}
          >
            <div className="nav-label">
              <FaCogs size={18} />
              <span>Repuestos</span>
            </div>
            <FaChevronRight size={12} className={`arrow-icon ${menusOpen.repuestos ? 'rotate-90' : ''}`} />
          </button>
          {menusOpen.repuestos && (
            <div className="submenu">
              <Link to="/inventario" className={`submenu-item ${isActive('/inventario')}`} onClick={onClose}>Productos</Link>
              <Link to="/stock" className={`submenu-item ${isActive('/stock')}`} onClick={onClose}>Stock</Link>
            </div>
          )}
        </div>

        {/* Clientes */}
        <div>
          <button 
            className={`nav-item-header ${menusOpen.clientes ? 'active-menu' : ''}`} 
            onClick={() => toggleMenu("clientes")}
          >
            <div className="nav-label">
              <FaUsers size={18} />
              <span>Clientes</span>
            </div>
            <FaChevronRight size={12} className={`arrow-icon ${menusOpen.clientes ? 'rotate-90' : ''}`} />
          </button>
          {menusOpen.clientes && (
            <div className="submenu">
              <Link to="/clientes" className={`submenu-item ${isActive('/clientes')}`} onClick={onClose}>Directorio</Link>
            </div>
          )}
        </div>

        {/* Gestión Vehicular */}
        <div>
          <button 
            className={`nav-item-header ${menusOpen.vehiculos ? 'active-menu' : ''}`} 
            onClick={() => toggleMenu("vehiculos")}
          >
            <div className="nav-label">
              <FaCar size={18} />
              <span>Gestión Vehicular</span>
            </div>
            <FaChevronRight size={12} className={`arrow-icon ${menusOpen.vehiculos ? 'rotate-90' : ''}`} />
          </button>
          {menusOpen.vehiculos && (
            <div className="submenu">
              <Link to="/vehiculos" className={`submenu-item ${isActive('/vehiculos')}`} onClick={onClose}>
                <FaMotorcycle size={14} style={{ marginRight: "8px" }} /> Motos
              </Link>
              <Link to="/marcas" className={`submenu-item ${isActive('/marcas')}`} onClick={onClose}>Marcas</Link>
            </div>
          )}
        </div>

        {/* Reportes (Admin) */}
        {userRole === "ADMIN" && (
          <div>
            <button 
              className={`nav-item-header ${menusOpen.reportes ? 'active-menu' : ''}`} 
              onClick={() => toggleMenu("reportes")}
            >
              <div className="nav-label">
                <FaFileInvoiceDollar size={18} />
                <span>Reportes</span>
              </div>
              <FaChevronRight size={12} className={`arrow-icon ${menusOpen.reportes ? 'rotate-90' : ''}`} />
            </button>
            {menusOpen.reportes && (
              <div className="submenu">
                <Link to="/reportes" className={`submenu-item ${isActive('/reportes')}`} onClick={onClose}>Financiero</Link>
              </div>
            )}
          </div>
        )}

        {/* Usuario */}
        <Link 
          to="/usuarios" 
          className={`nav-item ${isActive('/usuarios')}`} 
          onClick={onClose}
        >
          <div className="nav-label"><FaUserCog size={18} /> <span>Usuario</span></div>
        </Link>

      </nav>

      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt size={18} /> <span>Cerrar Sesión</span>
      </button>

    </aside>
  );
}

export default Sidebar;