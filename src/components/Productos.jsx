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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [nuevoPrecio, setNuevoPrecio] = useState("");
  const [nuevoStock, setNuevoStock] = useState("");
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // 🆕 Estado para controlar modal de creación
  const [openCrearModal, setOpenCrearModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria: "",
  });

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/productos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setProductos(data);
      } else {
        console.error("Error al obtener productos");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  const abrirModalEditar = (producto) => {
    setNuevoNombre(producto.nombre);
    setNuevoPrecio(producto.precio);
    setNuevoStock(producto.stock);
    setNuevaCategoria(producto.categoria);
    setProductoEditar(producto);
    setOpenModal(true);
  };

  const cerrarModal = () => {
    setOpenModal(false);
    setNuevoNombre("");
    setNuevoPrecio("");
    setNuevoStock("");
    setNuevaCategoria("");
    setProductoEditar(null);
  };

  const editarProducto = async () => {
    if (!nuevoNombre || !nuevoPrecio || !nuevoStock || !nuevaCategoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/productos/${productoEditar.id_producto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: nuevoNombre,
          precio: parseFloat(nuevoPrecio),
          stock: parseInt(nuevoStock),
          categoria: nuevaCategoria,
        }),
      });

      if (response.ok) {
        alert("Producto actualizado correctamente.");
        obtenerProductos();
        cerrarModal();
      } else {
        const data = await response.json();
        alert(data.message || "Error al actualizar producto.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmarEliminacion = (producto) => {
    setProductoAEliminar(producto);
    setConfirmDialogOpen(true);
  };

  const ejecutarEliminacion = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/productos/${productoAEliminar.id_producto}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      alert(data.message);
      if (response.ok) obtenerProductos();
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    } finally {
      setConfirmDialogOpen(false);
      setProductoAEliminar(null);
    }
  };

  // 🆕 Crear producto
  const agregarProducto = async () => {
    const { nombre, precio, stock, categoria } = nuevoProducto;
    if (!nombre || !precio || !stock || !categoria) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          precio: parseFloat(precio),
          stock: parseInt(stock),
          categoria,
        }),
      });

      if (response.ok) {
        alert("Producto agregado exitosamente.");
        setNuevoProducto({ nombre: "", precio: "", stock: "", categoria: "" });
        obtenerProductos();
        setOpenCrearModal(false);
      } else {
        const data = await response.json();
        alert(data.message || "Error al agregar producto.");
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
        Gestión de Productos
      </Typography>

      {/* 🆕 Botón para abrir modal de creación */}
      <Button
        variant="contained"
        sx={{ backgroundColor: "#FF5722", mb: 2 }}
        onClick={() => setOpenCrearModal(true)}
      >
        Agregar Producto
      </Button>

      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff9800" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Precio</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Stock</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Categoría</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.map((producto) => (
              <TableRow key={producto.id_producto}>
                <TableCell>{producto.nombre}</TableCell>
                <TableCell>Q{producto.precio.toFixed(2)}</TableCell>
                <TableCell>{producto.stock}</TableCell>
                <TableCell>{producto.categoria}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    sx={{ mr: 1, borderColor: "#4caf50", color: "#4caf50" }}
                    onClick={() => abrirModalEditar(producto)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => confirmarEliminacion(producto)}
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para editar producto */}
      <Modal open={openModal} onClose={cerrarModal}>
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
          <Typography variant="h6" gutterBottom>
            Editar Producto
          </Typography>
          <TextField label="Nombre" fullWidth value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Precio" type="number" fullWidth value={nuevoPrecio} onChange={(e) => setNuevoPrecio(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Stock" type="number" fullWidth value={nuevoStock} onChange={(e) => setNuevoStock(e.target.value)} sx={{ mb: 2 }} />
          <TextField label="Categoría" fullWidth value={nuevaCategoria} onChange={(e) => setNuevaCategoria(e.target.value)} sx={{ mb: 2 }} />
          <Button variant="contained" sx={{ backgroundColor: "#4caf50", width: "100%" }} onClick={editarProducto} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Actualizar Producto"}
          </Button>
        </Box>
      </Modal>

      {/* 🆕 Modal para agregar producto */}
      <Modal open={openCrearModal} onClose={() => setOpenCrearModal(false)}>
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
          <Typography variant="h6" gutterBottom>
            Agregar Producto
          </Typography>
          <TextField label="Nombre" fullWidth value={nuevoProducto.nombre} onChange={(e) => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Precio" type="number" fullWidth value={nuevoProducto.precio} onChange={(e) => setNuevoProducto({ ...nuevoProducto, precio: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Stock" type="number" fullWidth value={nuevoProducto.stock} onChange={(e) => setNuevoProducto({ ...nuevoProducto, stock: e.target.value })} sx={{ mb: 2 }} />
          <TextField label="Categoría" fullWidth value={nuevoProducto.categoria} onChange={(e) => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} sx={{ mb: 2 }} />
          <Button variant="contained" sx={{ backgroundColor: "#1976d2", width: "100%" }} onClick={agregarProducto} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Agregar Producto"}
          </Button>
        </Box>
      </Modal>

      {/* Diálogo de confirmación */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          ¿Estás seguro de eliminar el producto "{productoAEliminar?.nombre}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={ejecutarEliminacion} color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Productos;
