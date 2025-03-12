import React, { useState } from 'react';
import LoginPage from './components/LoginPage'; // Asegúrate de que la ruta sea correcta

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <div className="App">
      {!isAuthenticated ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <h1>¡Bienvenido al Dashboard!</h1> // Esto es solo un ejemplo, lo puedes cambiar por el dashboard
      )}
    </div>
  );
}

export default App;
