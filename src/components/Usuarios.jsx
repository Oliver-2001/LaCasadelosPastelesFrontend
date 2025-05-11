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

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [openModalEditar, setOpenModalEditar] = useState(false);
  const [openModalCrear, setOpenModalCrear] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  const [nombre, setNombre] = useState("");
  const [usuario, setUsuario] = useState("");
  const [rol, setRol] = useState(""); // Correcto para editar y crear
  const [password, setPassword] = useState(""); // Solo para crear

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
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;

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
      if (response.ok) fetchUsuarios();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };

  const abrirModalEditar = (usuarioData) => {
    setNombre(usuarioData.nombre);
    setUsuario(usuarioData.usuario);
    setRol(usuarioData.id_rol); // Aquí asignamos correctamente el rol
    setUsuarioEditar(usuarioData);
    setOpenModalEditar(true);
  };

  const cerrarModal = () => {
    setOpenModalEditar(false);
    setOpenModalCrear(false);
    setNombre("");
    setUsuario("");
    setPassword("");
    setRol("");
    setUsuarioEditar(null);
  };

  const editarUsuario = async () => {
    if (!nombre || !usuario || !rol) return alert("Todos los campos son obligatorios.");

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
          nombre,
          usuario,
          id_rol: parseInt(rol),
        }),
      });

      if (response.ok) {
        alert("Usuario actualizado correctamente.");
        fetchUsuarios();
        cerrarModal();
      } else {
        const data = await response.json();
        alert(data.message || "Error al actualizar usuario.");
      }
    } catch (error) {
      console.error("Error al editar:", error);
    } finally {
      setLoading(false);
    }
  };

  const crearUsuario = async () => {
    if (!nombre || !usuario || !password || !rol) return alert("Todos los campos son obligatorios.");

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/usuarios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          usuario,
          contrasena: password,
          id_rol: parseInt(rol),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Usuario creado correctamente.");
        fetchUsuarios();
        cerrarModal();
      } else {
        alert(data.message || "Error al crear usuario.");
      }
    } catch (error) {
      console.error("Error al crear usuario:", error);
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
        sx={{ my: 2, backgroundColor: "#FF5722" }}
        onClick={() => setOpenModalCrear(true)}
      >
        Crear Usuario
      </Button>

      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff9800" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Usuario</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Rol</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Acciones</TableCell>
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
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => abrirModalEditar(usuario)}>
                    Editar
                  </Button>
                  <Button variant="outlined" color="secondary" onClick={() => eliminarUsuario(usuario.id_usuario)}>
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Editar */}
      <Modal open={openModalEditar} onClose={cerrarModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Editar Usuario</Typography>
          <TextField label="Nombre" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Usuario" fullWidth value={usuario} onChange={(e) => setUsuario(e.target.value)} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select value={rol} onChange={(e) => setRol(e.target.value)} label="Rol">
              <MenuItem value={2}>Administrador</MenuItem>
              <MenuItem value={3}>Cajero</MenuItem>
              <MenuItem value={4}>Panadero</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" fullWidth onClick={editarUsuario} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Actualizar Usuario"}
          </Button>
        </Box>
      </Modal>

      {/* Modal Crear */}
      <Modal open={openModalCrear} onClose={cerrarModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>Crear Usuario</Typography>
          <TextField label="Nombre" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Usuario" fullWidth value={usuario} onChange={(e) => setUsuario(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Contraseña" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 2 }} />
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Rol</InputLabel>
            <Select value={rol} onChange={(e) => setRol(e.target.value)} label="Rol">
              <MenuItem value={2}>Administrador</MenuItem>
              <MenuItem value={3}>Cajero</MenuItem>
              <MenuItem value={4}>Panadero</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" fullWidth onClick={crearUsuario} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Crear Usuario"}
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: "white",
  padding: 4,
  borderRadius: 2,
  boxShadow: 24,
  width: 400,
};

export default Usuarios;
