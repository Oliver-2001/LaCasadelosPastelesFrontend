import React, { useEffect, useState } from "react";
import { Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/usuarios", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setUsuarios(data);
        } else {
          console.error("Error al obtener usuarios");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    fetchUsuarios();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Usuarios
      </Typography>
      <Button
        variant="contained"
        color="primary"
        sx={{ mb: 2 }}
        onClick={() => navigate("/usuarios/nuevo")}
      >
        Crear Usuario
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {usuarios.map((usuario) => (
              <TableRow key={usuario.id_usuario}>
                <TableCell>{usuario.nombre}</TableCell>
                <TableCell>{usuario.usuario || "No disponible"}</TableCell>
                <TableCell>{usuario.rol === 1 ? "Administrador" : usuario.rol === 2 ? "Cajero" : "Otro"}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => navigate(`/usuarios/editar/${usuario.id_usuario}`)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => console.log(`Eliminar usuario con ID: ${usuario.id_usuario}`)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Usuarios;
