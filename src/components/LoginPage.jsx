import React, { useState } from "react";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
} from "@mui/material";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLoginSuccess }) => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(""); // 🔴 Mensaje de error
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg(""); // Limpiar mensaje anterior

    // Validación básica de campos vacíos
    if (!usuario.trim() || !password.trim()) {
      setErrorMsg("Todos los campos son obligatorios.");
      return;
    }

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
        localStorage.setItem("token", data.token);

        const modulosResponse = await fetch("http://127.0.0.1:5000/modulos", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const modulosData = await modulosResponse.json();
        const userRole = modulosData.length > 3 ? "super_admin" : "cajero";

        onLoginSuccess(userRole);
        navigate("/dashboard");
      } else {
        setErrorMsg(data.message || "Credenciales incorrectas.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      setErrorMsg("Error de conexión con el servidor.");
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
          "&:hover": { transform: "scale(1.02)" },
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

          {errorMsg && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {errorMsg}
            </Alert>
          )}

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
              sx={{
                mt: 2,
                borderRadius: 3,
                padding: "10px",
                "&:hover": { bgcolor: "#FF5722" },
              }}
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
