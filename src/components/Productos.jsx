import React, { useState, useEffect } from "react";
import { Table, Button } from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";

const Productos = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/productos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleAddProducto = () => {
    // Función para agregar un nuevo producto (redirigir a una página de formulario, por ejemplo)
  };

  const handleEditProducto = (id) => {
    // Función para editar un producto
  };

  const handleDeleteProducto = (id) => {
    // Función para eliminar un producto
  };

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        startIcon={<Add />}
        onClick={handleAddProducto}
        sx={{ marginBottom: 2 }}
      >
        Agregar Producto
      </Button>

      <Table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id_producto}>
              <td>{producto.nombre}</td>
              <td>{producto.precio}</td>
              <td>{producto.stock}</td>
              <td>{producto.categoria}</td>
              <td>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleEditProducto(producto.id_producto)}
                >
                  Editar
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteProducto(producto.id_producto)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Productos;
