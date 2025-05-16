import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, CircularProgress, Box, List, ListItem, ListItemText,
  Switch, FormControlLabel
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from 'moment';
import 'moment/locale/es'; // Asegura que los meses estén en español
moment.locale('es');

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [detalles, setDetalles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [filtroHoy, setFiltroHoy] = useState(false);

  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const res = await axios.get('http://localhost:5000/ventas');
      // Ordenar por fecha descendente
      const ventasOrdenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
      setVentas(ventasOrdenadas);
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

  const obtenerVentasFiltradas = () => {
    if (!filtroHoy) return ventas;
    const hoy = moment().format('YYYY-MM-DD');
    return ventas.filter(v => moment(v.fecha).format('YYYY-MM-DD') === hoy);
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>Listado de Ventas</Typography>

      <FormControlLabel
        control={<Switch checked={filtroHoy} onChange={() => setFiltroHoy(!filtroHoy)} />}
        label="Mostrar solo ventas del día"
        sx={{ mb: 2 }}
      />

      <TableContainer component={Paper} sx={{ border: '2px solidrgb(238, 127, 0)' }}>
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
            {(() => {
              const mostradas = new Set();
              const ventasFiltradas = obtenerVentasFiltradas();

              return ventasFiltradas.map((venta) => {
                const fechaFormateada = moment(venta.fecha).format('YYYY-MM-DD');
                const mostrarEncabezado = !mostradas.has(fechaFormateada);
                mostradas.add(fechaFormateada);

                return (
                  <React.Fragment key={venta.id_venta}>
                    {mostrarEncabezado && (
                      <TableRow>
                        <TableCell colSpan={5} sx={{
                          backgroundColor: '#e3f2fd',
                          borderTop: '2px solidrgb(255, 105, 19)',
                          py: 2
                        }}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <CalendarMonthIcon sx={{ color: '#1976d2' }} />
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                              Ventas del {moment(venta.fecha).format('DD [de] MMMM [de] YYYY')}
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell>{venta.id_venta}</TableCell>
                      <TableCell>{moment(venta.fecha).format('YYYY-MM-DD HH:mm')}</TableCell>
                      <TableCell>Q{venta.total.toFixed(2)}</TableCell>
                      <TableCell>{venta.id_usuario}</TableCell>
                      <TableCell>
                        <Button variant="contained" sx={{ my: 2, backgroundColor: '#FF5722' }} onClick={() => abrirModalDetalles(venta)}>
                          Ver Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              });
            })()}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Detalles */}
      <Dialog open={modalOpen} onClose={cerrarModal} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: "bold", fontFamily: "'Poppins', sans-serif" }}>
          Detalles de Venta #{ventaSeleccionada?.id_venta}
        </DialogTitle>

        <DialogContent dividers>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight={100}>
              <CircularProgress />
            </Box>
          ) : (
            <Box sx={{ fontFamily: "'Poppins', sans-serif" }}>
              <Box mb={2}>
                <Typography variant="body1"><strong>Fecha:</strong> {ventaSeleccionada?.fecha}</Typography>
                <Typography variant="body1"><strong>Total:</strong> Q{ventaSeleccionada?.total?.toFixed(2)}</Typography>
                <Typography variant="body1"><strong>ID Usuario:</strong> {ventaSeleccionada?.id_usuario}</Typography>
              </Box>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>Productos:</Typography>

              {detalles.length > 0 ? (
                <List dense>
                  {detalles.map((item, index) => (
                    <ListItem key={index} disablePadding sx={{ mb: 1 }}>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {item.nombre_producto}
                          </Typography>
                        }
                        secondary={
                          <Typography variant="body2">
                            Cantidad: {item.cantidad} &nbsp;&nbsp;|&nbsp;&nbsp;
                            Subtotal: Q{item.subtotal.toFixed(2)}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="text.secondary">No hay productos.</Typography>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={cerrarModal} variant="contained" color="secondary">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Ventas;
