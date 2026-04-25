import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Usuarios from "./components/Usuarios";
import Marcas from "./components/Marcas";
import Clientes from "./components/Clientes";
import Vehiculos from "./components/Vehiculos";
import Repuestos from "./components/ProductoList";
import Stock from "./components/Stock";
import MainLayout from "./components/layout/MainLayout";
import { isAccessTokenValid } from "./services/authService";


const OrdenesServicio = lazy(() => import("./components/OrdenesServicio"));
const CotizacionForm = lazy(() => import("./components/CotizacionForm"));

const LoadingFallback = () => (
  <div style={{ padding: 20, textAlign: "center", color: "#666" }}>
    Cargando módulo...
  </div>
);

function ProtectedRoute({ children, title }) {
  const valid = isAccessTokenValid();
  if (!valid) return <Navigate to="/login" />;

  return (
    <MainLayout title={title}>
      {/* 3. Envolvemos los hijos en Suspense para manejar la espera */}
      <Suspense fallback={<LoadingFallback />}>
        {children}
      </Suspense>
    </MainLayout>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* RUTAS PRINCIPALES */}
        <Route path="/dashboard" element={<ProtectedRoute title="Dashboard"> <Dashboard /> </ProtectedRoute>} />

        {/* ÓRDENES DE SERVICIO */}
        <Route
          path="/ordenes"
          element={
            <ProtectedRoute title="Órdenes de Servicio">
              <OrdenesServicio />
            </ProtectedRoute>
          }
        />


        {/* REPUESTOS / INVENTARIO */}
        <Route
          path="/inventario"
          element={
            <ProtectedRoute title="Repuestos">
              <Repuestos />
            </ProtectedRoute>
          }
        />
        <Route path="/repuestos" element={<ProtectedRoute title="Inventario de Repuestos"> <Repuestos /> </ProtectedRoute>} />

        {/* COTIZACIONES */}
        <Route
          path="/cotizaciones"
          element={
            <ProtectedRoute title="Crear Cotización">
              <CotizacionForm />
            </ProtectedRoute>
          }
        />
        {/* OTROS MÓDULOS */}
        <Route path="/usuarios" element={<ProtectedRoute title="Usuarios"> <Usuarios /> </ProtectedRoute>} />
        <Route path="/clientes" element={<ProtectedRoute title="Clientes"> <Clientes /> </ProtectedRoute>} />
        <Route path="/marcas" element={<ProtectedRoute title="Marcas"> <Marcas /> </ProtectedRoute>} />
        <Route path="/vehiculos" element={<ProtectedRoute title="Vehículos"> <Vehiculos /> </ProtectedRoute>} />
        <Route path="/stock" element={<ProtectedRoute title="Stock"> <Stock /> </ProtectedRoute>} />

        {/* Redirección por defecto */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;