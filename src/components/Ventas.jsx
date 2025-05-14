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

  // ⚙️ Simulamos ID de usuario 1 (ajusta según autenticación real)
  const id_usuario = 1;

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/productos');
      setProductos(res.data);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado || cantidad <= 0) return;

    const producto = productos.find(p => p.id_producto === productoSeleccionado);
    if (!producto) return;

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
  };

  const eliminarItem = (index) => {
    const item = detallesVenta[index];
    setTotal(prev => prev - item.subtotal);
    setDetallesVenta(prev => prev.filter((_, i) => i !== index));
  };

  const registrarVenta = async () => {
    if (detallesVenta.length === 0) return;

    const detalles = detallesVenta.map(item => ({
      id_producto: item.id_producto,
      cantidad: item.cantidad,
    }));

    try {
      const res = await axios.post('http://localhost:5000/ventas', {
        id_usuario,
        detalles,
      });

      alert(`Venta registrada exitosamente con ID: ${res.data.id_venta}`);
      setDetallesVenta([]);
      setTotal(0);
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
          onChange={(e) => setProductoSeleccionado(e.target.value)}
          label="Producto"
        >
          <MenuItem value="">
            <em>Seleccionar producto</em>
          </MenuItem>
          {productos.map((producto) => (
            <MenuItem key={producto.id_producto} value={producto.id_producto}>
              {producto.nombre} - Q{producto.precio}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="number"
        label="Cantidad"
        value={cantidad}
        onChange={(e) => setCantidad(parseInt(e.target.value))}
        fullWidth
        margin="normal"
        inputProps={{ min: 1 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={agregarProducto}
        sx={{ mt: 1 }}
      >
        Agregar Producto
      </Button>

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
