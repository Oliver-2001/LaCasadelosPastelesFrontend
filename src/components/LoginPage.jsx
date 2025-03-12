import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { Box } from "@mui/system";

const LoginPage = () => {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Se envían los datos de usuario y contraseña al backend
  const response = await fetch('http://127.0.0.1:5000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      usuario: usuario,
      contrasena: password,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    // Si la respuesta es exitosa, mostrar mensaje o redirigir
    console.log('Login exitoso:', data.message);
    // Aquí puedes manejar lo que sucede después del login exitoso
  } else {
    // Si el login falla, mostrar un error
    console.log('Error de login:', data.message);
  }
};


  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #FF8C00, #FF6347)", // Un gradiente de colores vibrantes
      }}
    >
      <Card
        sx={{
          width: 400,
          p: 3,
          borderRadius: 5,
          boxShadow: 10,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          transition: "transform 0.3s ease-in-out", // Para un poco de animación cuando el mouse pasa por encima
          "&:hover": {
            transform: "scale(1.05)", // Un ligero zoom al pasar el mouse
          },
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
            />
            <TextField
              label="Contraseña"
              type="password"
              variant="outlined"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                },
              }}
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
