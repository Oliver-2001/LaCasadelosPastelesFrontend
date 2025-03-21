import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom"; // Importa useNavigate

const LoginPage = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // Inicializa el hook useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://127.0.0.1:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario: usuario,
          contrasena: password,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login exitoso:", data.message);
        
        // Guardamos el token en localStorage
        localStorage.setItem("token", data.token);
  
        // Llamamos al endpoint /modulos para obtener el rol y módulos
        const modulosResponse = await fetch("http://127.0.0.1:5000/modulos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });
  
        const modulosData = await modulosResponse.json();
        console.log("Módulos obtenidos:", modulosData);
  
        // Aquí puedes definir la lógica para obtener el rol (si está en el backend)
        const userRole = modulosData.length > 3 ? "super_admin" : "cajero"; // Simulación
        
        // Llamamos a onLoginSuccess con el rol del usuario
        onLoginSuccess(userRole);

        // Redirigir al Dashboard después del login exitoso
        navigate("/dashboard"); // Redirige a la página del dashboard
      } else {
        console.log("Error de login:", data.message);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #FF8C00, #FF6347)",
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 3,
          borderRadius: 5,
          boxShadow: 10,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          "&:hover": { transform: "scale(1.05)" },
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            fontWeight="bold"
            color="#5D4037"
            sx={{ mb: 3 }}
          >
            Bienvenido a La Casa de los Pasteles
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              label="Usuario"
              variant="outlined"
              fullWidth
              margin="normal"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2, borderRadius: 3, padding: "10px", "&:hover": { bgcolor: "#FF5722" } }}
            >
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;