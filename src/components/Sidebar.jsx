import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Importar useNavigate
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Home, ShoppingCart, Inventory, People, BarChart, TrendingUp, ExitToApp } from "@mui/icons-material";

const iconos = {
  Dashboard: <Home />,
  Ventas: <ShoppingCart />,
  Inventario: <Inventory />,
  Usuarios: <People />,
  Reportes: <BarChart />,
  Predicciones: <TrendingUp />,
};

const Sidebar = ({ onLogout }) => {
  const [modulos, setModulos] = useState([]);
  const navigate = useNavigate(); // Hook para redirección

  useEffect(() => {
    const fetchModulos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/modulos", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setModulos(data);
      } catch (error) {
        console.error("Error al obtener los módulos:", error);
      }
    };

    fetchModulos();
  }, []);

  const handleLogout = () => {
    onLogout(); // Limpiar autenticación
    navigate("/login"); // Redirigir al login
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Asegura que el botón quede abajo
        [`& .MuiDrawer-paper`]: {
          width: 260,
          boxSizing: "border-box",
          background: "linear-gradient(135deg, #FF8C00, #FF6347)",
          color: "white",
          padding: 2,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <div>
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            fontFamily: "'Poppins', sans-serif",
            marginBottom: 2,
          }}
        >
          La Casa de los Pasteles
        </Typography>
        <Divider sx={{ backgroundColor: "white", marginBottom: 2 }} />
        <List>
          {modulos.map((modulo) => (
            <ListItemButton
              key={modulo.id_modulo}
              sx={{
                borderRadius: 3,
                marginY: 1,
                paddingY: 1.5,
                transition: "0.3s",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
              }}
            >
              <ListItemIcon sx={{ color: "white" }}>
                {iconos[modulo.nombre] || <Home />}
              </ListItemIcon>
              <ListItemText
                primary={modulo.nombre}
                sx={{
                  color: "white",
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: "bold",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </div>
      
      {/* Botón de Cerrar Sesión */}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ExitToApp />}
        onClick={handleLogout}
        sx={{
          marginTop: "auto", 
          borderRadius: 3,
          backgroundColor: "#B22222",
          "&:hover": { backgroundColor: "#8B0000" },
        }}
      >
        Cerrar Sesión
      </Button>
    </Drawer>
  );
};

export default Sidebar;
