import React, { useEffect, useState } from 'react';
import { Button, Modal, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Box } from '@mui/material';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editInsumo, setEditInsumo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [fechaActualizacion, setFechaActualizacion] = useState('');
  const [idSucursal, setIdSucursal] = useState('');

  // Obtener el inventario
  const obtenerInventario = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/inventario', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      setInventario(data);
    } else {
      console.error('Error al obtener inventario');
    }
  };

  // Eliminar insumo
  const handleDelete = async (idInsumo) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:5000/inventario/${idInsumo}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setInventario(inventario.filter(insumo => insumo.id_insumo !== idInsumo));
      alert('Insumo eliminado');
    } else {
      console.error('Error al eliminar insumo');
    }
  };

  // Editar insumo
  const handleEdit = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://127.0.0.1:5000/inventario/${editInsumo.id_insumo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre,
        cantidad,
        unidad,
        fecha_actualizacion: fechaActualizacion,
        id_sucursal: idSucursal,
      }),
    });

    if (response.ok) {
      // Obtener el inventario actualizado
      obtenerInventario();
      setModalOpen(false); // Cerrar el modal
      alert('Insumo editado');
    } else {
      console.error('Error al editar insumo');
    }
  };

  // Abrir el modal para editar
  const abrirModalEditar = (insumo) => {
    setEditInsumo(insumo);
    setNombre(insumo.nombre);
    setCantidad(insumo.cantidad);
    setUnidad(insumo.unidad);
    setFechaActualizacion(insumo.fecha_actualizacion);
    setIdSucursal(insumo.id_sucursal);
    setModalOpen(true);
  };

  // Cerrar el modal de edición
  const cerrarModal = () => {
    setModalOpen(false);
  };

  // Obtener el inventario al cargar el componente
  useEffect(() => {
    obtenerInventario();
  }, []);

  return (
    <div>
      <TableContainer component={Paper} sx={{ border: '2px solid #FF5722' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#FF5722' }}>
            <TableRow>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Nombre</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Cantidad</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Unidad</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Fecha de Actualización</TableCell>
              <TableCell style={{ fontWeight: 'bold', color: '#fff' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventario.map((insumo) => (
              <TableRow key={insumo.id_insumo}>
                <TableCell>{insumo.nombre}</TableCell>
                <TableCell>{insumo.cantidad}</TableCell>
                <TableCell>{insumo.unidad}</TableCell>
                <TableCell>{new Date(insumo.fecha_actualizacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button onClick={() => abrirModalEditar(insumo)} color="primary">Editar</Button>
                  <Button onClick={() => handleDelete(insumo.id_insumo)} color="secondary">Eliminar</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal de Edición */}
      <Modal open={modalOpen} onClose={cerrarModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', padding: 4 }}>
          <h2>Editar Insumo</h2>
          <TextField
            label="Nombre"
            fullWidth
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Cantidad"
            fullWidth
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
            margin="normal"
            type="number"
          />
          <TextField
            label="Unidad"
            fullWidth
            value={unidad}
            onChange={(e) => setUnidad(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Fecha de Actualización"
            fullWidth
            value={fechaActualizacion}
            onChange={(e) => setFechaActualizacion(e.target.value)}
            margin="normal"
            type="date"
            InputLabelProps={{
              shrink: true,
            }}
          />
          <TextField
            label="ID de Sucursal"
            fullWidth
            value={idSucursal}
            onChange={(e) => setIdSucursal(e.target.value)}
            margin="normal"
            type="number"
          />
          <Button onClick={handleEdit} color="primary" fullWidth>
            Guardar cambios
          </Button>
          <Button onClick={cerrarModal} color="secondary" fullWidth>
            Cancelar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventario;
