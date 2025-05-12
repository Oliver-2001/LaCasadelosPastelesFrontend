import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, CircularProgress
} from '@mui/material';

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/ventas'); // Ajusta si usas un puerto diferente
      setVentas(res.data);
    } catch (error) {
      console.error('Error al obtener ventas', error);
    }
  };

  const abrirModalDetalles = async (venta) => {
    setVentaSeleccionada(venta);
    setModalOpen(true);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/ventas/${venta.id_venta}`);
      setDetalles(res.data.detalles || []);
    } catch (error) {
      console.error('Error al obtener detalles', error);
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setDetalles([]);
    setVentaSeleccionada(null);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Listado de Ventas</Typography>
      <TableContainer component={Paper} sx={{ border: '2px solidrgb(74, 34, 255)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#ff9800' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>ID Venta</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Fecha</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Total</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>ID Usuario</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {ventas.map((venta) => (
              <TableRow key={venta.id_venta}>
                <TableCell>{venta.id_venta}</TableCell>
                <TableCell>{venta.fecha}</TableCell>
                <TableCell>Q{venta.total.toFixed(2)}</TableCell>
                <TableCell>{venta.id_usuario}</TableCell>
                <TableCell>
                  <Button variant="contained" sx={{ my: 2, backgroundColor: '#FF5722' }} onClick={() => abrirModalDetalles(venta)}>
                    Ver Detalles
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalles */}
      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles de Venta #{ventaSeleccionada?.id_venta}</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <Typography>Fecha: {ventaSeleccionada?.fecha}</Typography>
              <Typography>Total: Q{ventaSeleccionada?.total?.toFixed(2)}</Typography>
              <Typography>ID Usuario: {ventaSeleccionada?.id_usuario}</Typography>
              <Typography variant="h6" mt={2}>Productos:</Typography>
              {detalles.length > 0 ? (
                <ul>
                  {detalles.map((item, index) => (
                    <li key={index}>
                      {item.nombre_producto} - Cant: {item.cantidad} - Subtotal: Q{item.subtotal.toFixed(2)}
                    </li>
                  ))}
                </ul>
              ) : (
                <Typography>No hay productos.</Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={cerrarModal}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Ventas;
