import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaTools,
  FaBoxOpen,
  FaWrench,
  FaWarehouse,
  FaBoxes,
  FaUsers,
  FaCar,
  FaSignOutAlt,
  FaChevronRight,
  FaUserCog,
  FaTimes,
  FaMotorcycle,
  FaWhatsapp,
  FaAddressBook,
  FaTags
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
          <div className="nav-label">
            <FaTachometerAlt size={18} />
            <span>Inicio</span>
          </div>
        </Link>

        <Link
          to="/ordenes"
          className={`nav-item-custom ${isActive('/ordenes') ? 'active' : ''}`}
          onClick={onClose}
        >
          <div className="nav-label">
            <FaTools size={18} />
            <span>Órdenes de Servicio</span>
          </div>
        </Link>

        <Link
          to="/servicios"
          className={`nav-item ${isActive('/servicios')}`}
          onClick={onClose}
        >
          <div className="nav-label">
            <FaWrench size={18} />
            <span>Servicios</span>
          </div>
        </Link>

        <Link
          to="/inventario"
          className={`nav-item ${isActive('/inventario')}`}
          onClick={onClose}
        >
          <div className="nav-label">
            <FaBoxOpen size={18} />
            <span>Productos</span>
          </div>
        </Link>

        {/* Inventario */}
        <div>
          <button
            className={`nav-item-header ${menusOpen.inventario ? 'active-menu' : ''}`}
            onClick={() => toggleMenu("inventario")}
          >
            <div className="nav-label">
              <FaWarehouse size={18} />
              <span>Inventario</span>
            </div>
            <FaChevronRight
              size={12}
              className={`arrow-icon ${menusOpen.inventario ? 'rotate-90' : ''}`}
            />
          </button>

          {menusOpen.inventario && (
            <div className="submenu">
              <Link
                to="/stock"
                className={`submenu-item ${isActive('/stock')}`}
                onClick={onClose}
              >
                <FaBoxes size={14} style={{ marginRight: "8px" }} />
                Stock
              </Link>
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
            <FaChevronRight
              size={12}
              className={`arrow-icon ${menusOpen.clientes ? 'rotate-90' : ''}`}
            />
          </button>

          {menusOpen.clientes && (
            <div className="submenu">
              <Link
                to="/clientes"
                className={`submenu-item ${isActive('/clientes')}`}
                onClick={onClose}
              >
                <FaAddressBook size={14} style={{ marginRight: "8px" }} />
                Directorio
              </Link>
            </div>
          )}
        </div>

        {/* Vehículos */}
        <div>
          <button
            className={`nav-item-header ${menusOpen.vehiculos ? 'active-menu' : ''}`}
            onClick={() => toggleMenu("vehiculos")}
          >
            <div className="nav-label">
              <FaCar size={18} />
              <span>Vehículos</span>
            </div>
            <FaChevronRight
              size={12}
              className={`arrow-icon ${menusOpen.vehiculos ? 'rotate-90' : ''}`}
            />
          </button>

          {menusOpen.vehiculos && (
            <div className="submenu">
              <Link
                to="/vehiculos"
                className={`submenu-item ${isActive('/vehiculos')}`}
                onClick={onClose}
              >
                <FaMotorcycle size={14} style={{ marginRight: "8px" }} />
                Motos
              </Link>

              <Link
                to="/marcas"
                className={`submenu-item ${isActive('/marcas')}`}
                onClick={onClose}
              >
                <FaTags size={14} style={{ marginRight: "8px" }} />
                Marcas
              </Link>
            </div>
          )}
        </div>

        {/* Reportes 
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
              <FaChevronRight
                size={12}
                className={`arrow-icon ${menusOpen.reportes ? 'rotate-90' : ''}`}
              />
            </button>

            {menusOpen.reportes && (
              <div className="submenu">
                <Link
                  to="/reportes"
                  className={`submenu-item ${isActive('/reportes')}`}
                  onClick={onClose}
                >
                  <FaChartLine size={14} style={{ marginRight: "8px" }} />
                  Financiero
                </Link>
              </div>
            )}
          </div>
        )}
*/}
        <Link
          to="/usuarios"
          className={`nav-item ${isActive('/usuarios')}`}
          onClick={onClose}
        >
          <div className="nav-label">
            <FaUserCog size={18} />
            <span>Usuarios</span>
          </div>
        </Link>

        <a
          href="https://wa.me/tu_numero"
          target="_blank"
          rel="noopener noreferrer"
          className="submenu-item active-red"
        >
          <div className="nav-label support-button ">
            <FaWhatsapp size={18} />
            <span>Soporte</span>
          </div>
        </a>
      </nav>



      <button onClick={handleLogout} className="logout-btn">
        <FaSignOutAlt size={18} />
        <span>Cerrar Sesión</span>
      </button>
    </aside>
  );
}

export default Sidebar;