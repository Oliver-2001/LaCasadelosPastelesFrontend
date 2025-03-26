import React, { useEffect, useState } from "react";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
} from "@mui/material";
import { Edit, Delete} from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
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

  const handleEdit = (id) => {
    console.log("Editar producto con ID:", id);
    // Aquí puedes abrir un modal o redirigir a una página de edición
  };

  const handleDelete = (id) => {
    console.log("Eliminar producto con ID:", id);
    // Aquí puedes llamar a la API para eliminar el producto
  };


  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      {/* Botón para añadir producto */}
      <Button variant="contained" color="warning" startIcon={<AddIcon />} sx={{ mb: 2 }}>
        Agregar Producto
      </Button>


      <TableContainer component={Paper} sx={{ maxWidth: 1000, margin: "auto" }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff9800" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Nombre</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Precio (Q)</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Stock</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white" }}>Categoría</TableCell>
              <TableCell sx={{ fontWeight: "bold", color: "white", textAlign: "center" }}>
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {productos.length > 0 ? (
              productos.map((producto) => (
                <TableRow key={producto.nombre}>
                  <TableCell>{producto.nombre}</TableCell>
                  <TableCell>Q{producto.precio.toFixed(2)}</TableCell>
                  <TableCell>{producto.stock}</TableCell>
                  <TableCell>{producto.categoria}</TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEdit(producto.id_producto)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(producto.id_producto)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay productos disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Productos;
