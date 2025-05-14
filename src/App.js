// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import Usuarios from "./components/Usuarios";
import Productos from "./components/Productos";
import Inventario from "./components/Inventario";
import DetalleVentas from "./components/DetalleVentas";
import Ventas from "./components/Ventas";
import Sucursales from "./components/Sucursales";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("role"));

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    setIsAuthenticated(!!token);
    setUserRole(role);
  }, []);

  const handleLoginSuccess = (role) => {
    localStorage.setItem("role", role);
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserRole(null);
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isAuthenticated && userRole && <Sidebar onLogout={handleLogout} />}
        <div
          style={{
            marginLeft: isAuthenticated ? 260 : 0, // Ajusta según el Sidebar
            padding: 20,
            flexGrow: 1,
          }}
        >
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/usuarios"
              element={isAuthenticated ? <Usuarios /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
            <Route
              path="/productos"
              element={isAuthenticated ? <Productos /> : <Navigate to="/login" />}
            />
            <Route
              path="/inventario"
              element={isAuthenticated ? <Inventario /> : <Navigate to="/login" />}
            />
            <Route
              path="/detalleventas"
              element={isAuthenticated ? <DetalleVentas /> : <Navigate to="/login" />}
            />
            <Route
              path="/ventas"
              element={isAuthenticated ? <Ventas /> : <Navigate to="/login" />}
            />
            <Route
              path="/sucursales"
              element={isAuthenticated ? <Sucursales /> : <Navigate to="/login" />}
            />
            
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;