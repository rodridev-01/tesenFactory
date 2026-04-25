import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import { FaBars } from 'react-icons/fa';

import '../../assets/styles/MainLayout.css';
import '../../assets/styles/Global.css';

const MainLayout = ({ children, title = "Panel" }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="layout-container">
      
      {/* Overlay para cerrar menú en móvil */}
      {isSidebarOpen && (
        <div 
          className="modal-overlay" 
          style={{ zIndex: 999 }} 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />

      <main className="main-content">
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="menu-toggle-btn" 
              onClick={() => setIsSidebarOpen(true)}
            >
              <FaBars size={24} />
            </button>
            <h1 style={{ margin: 0, fontSize: '1.4rem', color: '#333' }}>{title}</h1>
          </div>
          <div style={{ fontWeight: 500, color: '#555' }}>
            Hola, {localStorage.getItem("username") || "Usuario"}
          </div>
        </header>

        <div className="content-area">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;