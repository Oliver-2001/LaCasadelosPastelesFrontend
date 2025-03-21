import React, { useEffect, useState } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Box,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Usuarios = () => {
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoUsuario, setNuevoUsuario] = useState("");
  const [nuevoRol, setNuevoRol] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsuarios();
  }, []);

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

  const eliminarUsuario = async (id_usuario) => {
    const confirmacion = window.confirm("¿Seguro que deseas eliminar este usuario?");
    if (!confirmacion) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/usuarios/${id_usuario}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      alert(data.message);

      if (response.ok) {
        // Actualizar la lista de usuarios después de eliminar
        fetchUsuarios();
      }
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const abrirModalEditar = (usuario) => {
    setNuevoNombre(usuario.nombre);
    setNuevoUsuario(usuario.usuario);
    setNuevoRol(usuario.id_rol);
    setUsuarioEditar(usuario);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setNuevoNombre("");
    setNuevoUsuario("");
    setNuevoRol("");
    setUsuarioEditar(null);
  };

  const editarUsuario = async () => {
    if (!nuevoNombre || !nuevoUsuario || !nuevoRol) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/usuarios/${usuarioEditar.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          usuario: nuevoUsuario,
          id_rol: parseInt(nuevoRol),
        }),
      });

      if (response.ok) {
        alert("Usuario actualizado correctamente.");
        fetchUsuarios(); // Actualizamos la lista después de editar
        cerrarModal(); // Cerramos el modal
      } else {
        const data = await response.json();
        alert(data.message || "Error al actualizar usuario.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

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
                <TableCell>
                  {usuario.rol === 1
                    ? "Superadministrador"
                    : usuario.rol === 2
                    ? "Administrador"
                    : usuario.rol === 3
                    ? "Cajero"
                    : "Panadero"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    sx={{ mr: 1 }}
                    onClick={() => abrirModalEditar(usuario)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => eliminarUsuario(usuario.id_usuario)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para editar usuario */}
      <Modal
        open={openModal}
        onClose={cerrarModal}
        aria-labelledby="modal-edit-title"
        aria-describedby="modal-edit-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: 4,
            borderRadius: 2,
            boxShadow: 24,
            width: 400,
          }}
        >
          <Typography variant="h6" id="modal-edit-title" gutterBottom>
            Editar Usuario
          </Typography>
          <TextField
            label="Nombre"
            fullWidth
            value={nuevoNombre}
            onChange={(e) => setNuevoNombre(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Usuario"
            fullWidth
            value={nuevoUsuario}
            onChange={(e) => setNuevoUsuario(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select
              value={nuevoRol}
              onChange={(e) => setNuevoRol(e.target.value)}
              label="Rol"
            >
              <MenuItem value={2}>Administrador</MenuItem>
              <MenuItem value={3}>Cajero</MenuItem>
              <MenuItem value={4}>Panadero</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            color="primary"
            onClick={editarUsuario}
            disabled={loading}
            sx={{ width: "100%" }}
          >
            {loading ? <CircularProgress size={24} /> : "Actualizar Usuario"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Usuarios;