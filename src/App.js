import React, { useState } from "react";
import LoginPage from "./components/LoginPage";
import Sidebar from "./components/Sidebar";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState("super_admin"); // Cambia aquí para probar otros roles

  const handleLoginSuccess = (role) => {
    setIsAuthenticated(true);
    setUserRole(role); // Se puede cambiar dinámicamente según el login
  };

  return (
    <div style={{ display: "flex" }}>
      {isAuthenticated && <Sidebar role={userRole} />}
      <div style={{ marginLeft: isAuthenticated ? 240 : 0, padding: 20, flexGrow: 1 }}>
        {!isAuthenticated ? (
          <LoginPage onLoginSuccess={handleLoginSuccess} />
        ) : (
          <h1>¡Bienvenido al Dashboard!</h1>
        )}
      </div>
    </div>
  );
}

export default App;
