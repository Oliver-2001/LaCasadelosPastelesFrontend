// App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard"; // Asegúrate de tener este componente

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role"); // Guardar el rol en el localStorage
    if (storedRole) setUserRole(storedRole);
  }, []);

  const handleLoginSuccess = (role) => {
    localStorage.setItem("role", role); // Guardar el rol después de iniciar sesión
    setIsAuthenticated(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar el token
    localStorage.removeItem("role"); // Eliminar el rol
    setIsAuthenticated(false); // Cambiar el estado de autenticación
    setUserRole(null); // Eliminar el rol del estado
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {isAuthenticated && userRole && <Sidebar onLogout={handleLogout} />}
        <div style={{ marginLeft: isAuthenticated ? 240 : 0, padding: 20, flexGrow: 1 }}>
          <Routes>
            <Route path="/login" element={<LoginPage onLoginSuccess={handleLoginSuccess} />} />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
