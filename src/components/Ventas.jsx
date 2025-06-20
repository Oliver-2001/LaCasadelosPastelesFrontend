import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

const Ventas = () => {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [detallesVenta, setDetallesVenta] = useState([]);
  const [total, setTotal] = useState(0);
  const [errorStock, setErrorStock] = useState('');


  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/productos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error.response?.status, error.response?.data);
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) return;

    const producto = productos.find(p => p.id_producto === productoSeleccionado);
    if (!producto) return;

    // Cantidad total ya agregada de este producto en el carrito
    const cantidadEnCarrito = detallesVenta
      .filter(item => item.id_producto === productoSeleccionado)
      .reduce((acc, item) => acc + item.cantidad, 0);

    if (cantidad + cantidadEnCarrito > producto.stock) {
      setErrorStock(`Stock insuficiente. Solo quedan ${producto.stock - cantidadEnCarrito} unidades disponibles.`);
      return;
    }

    const subtotal = producto.precio * cantidad;

    setDetallesVenta(prev => [
      ...prev,
      {
        id_producto: producto.id_producto,
        nombre: producto.nombre,
        cantidad,
        precio: producto.precio,
        subtotal,
      },
    ]);

    setTotal(prev => prev + subtotal);
    setProductoSeleccionado('');
    setCantidad(1);
    setErrorStock('');
  };

  // Actualizar cantidad y validar que no sea mayor al stock disponible
  const handleCantidadChange = (e) => {
    let valor = parseInt(e.target.value);
    if (isNaN(valor) || valor < 1) valor = 1;

    if (productoSeleccionado) {
      const producto = productos.find(p => p.id_producto === productoSeleccionado);
      if (producto) {
        // Cantidad total ya agregada en el carrito para este producto
        const cantidadEnCarrito = detallesVenta
          .filter(item => item.id_producto === productoSeleccionado)
          .reduce((acc, item) => acc + item.cantidad, 0);

        const maxCantidad = producto.stock - cantidadEnCarrito;

        if (valor > maxCantidad) {
          valor = maxCantidad > 0 ? maxCantidad : 1; // mínimo 1 si hay stock, si no 1 igual
          setErrorStock(`Stock insuficiente. Solo quedan ${maxCantidad} unidades disponibles.`);
        } else {
          setErrorStock('');
        }
      }
    }

    setCantidad(valor);
  };

  const eliminarItem = (index) => {
    const item = detallesVenta[index];
    setTotal(prev => prev - item.subtotal);
    setDetallesVenta(prev => prev.filter((_, i) => i !== index));
    setErrorStock('');
  };

const registrarVenta = async () => {
  if (detallesVenta.length === 0) return;

  const detalles = detallesVenta.map(item => ({
    id_producto: item.id_producto,
    cantidad: item.cantidad,
  }));

  try {
    const token = localStorage.getItem('token'); // obtener token guardado en login

    const res = await axios.post(
      'http://localhost:5000/ventas',
      { detalles },  // SOLO detalles, no id_usuario
      {
        headers: {
          Authorization: `Bearer ${token}` // enviar token en header
        }
      }
    );

    alert(`Venta registrada exitosamente con ID: ${res.data.id_venta}`);

    const quierePDF = window.confirm('¿Quieres descargar el reporte PDF de esta venta?');

    if (quierePDF) {
      const pdfRes = await axios.get(
        `http://localhost:5000/ventas/${res.data.id_venta}/reporte-pdf`,
        {
          headers: {
            Authorization: `Bearer ${token}`  // también enviar token aquí
          },
          responseType: 'blob',
        }
      );

      const url = window.URL.createObjectURL(new Blob([pdfRes.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `reporte_venta_${res.data.id_venta}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }

    // Limpiar carrito
    setDetallesVenta([]);
    setTotal(0);
    setErrorStock('');
  } catch (error) {
    console.error('Error al registrar venta:', error);
    alert('Error al registrar la venta.');
  }
};

  return (
    <Box p={3}>
      <Typography variant="h4" mb={2}>
        Nueva Venta
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel id="producto-label">Producto</InputLabel>
        <Select
          labelId="producto-label"
          value={productoSeleccionado}
          onChange={(e) => {
            setProductoSeleccionado(e.target.value);
            setCantidad(1);
            setErrorStock('');
          }}
          label="Producto"
        >
          <MenuItem value="">
            <em>Seleccionar producto</em>
          </MenuItem>
          {productos.map((producto) => (
            <MenuItem key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre} - Q{producto.precio} - Stock: {producto.stock}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="number"
        label="Cantidad"
        value={cantidad}
        onChange={handleCantidadChange}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
        disabled={!productoSeleccionado}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={agregarProducto}
        sx={{ mt: 1 }}
        disabled={!productoSeleccionado}
      >
        Agregar Producto
      </Button>

      {errorStock && (
        <Typography color="error" mt={1}>
          {errorStock}
        </Typography>
      )}

      <Paper sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Cantidad</TableCell>
              <TableCell>Precio</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detallesVenta.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>Q{item.precio.toFixed(2)}</TableCell>
                <TableCell>Q{item.subtotal.toFixed(2)}</TableCell>
                <TableCell>
                  <Button
                    color="error"
                    onClick={() => eliminarItem(index)}
                    size="small"
                  >
                    Eliminar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {detallesVenta.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay productos agregados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>

      <Typography variant="h6" mt={3}>
        Total: Q{total.toFixed(2)}
      </Typography>

      <Button
        variant="contained"
        color="success"
        fullWidth
        onClick={registrarVenta}
        sx={{ mt: 2 }}
        disabled={detallesVenta.length === 0}
      >
        Registrar Venta
      </Button>
    </Box>
  );
};

export default Ventas;
