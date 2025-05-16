import React, { useEffect, useState } from 'react';
import {
  Button, Modal, TextField, Table, Typography, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  Box, Alert
  
} from '@mui/material';

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editInsumo, setEditInsumo] = useState(null);
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [unidad, setUnidad] = useState('');
  const [fechaActualizacion, setFechaActualizacion] = useState('');
  const [idSucursal, setIdSucursal] = useState('');

  const [crearModalOpen, setCrearModalOpen] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaCantidad, setNuevaCantidad] = useState('');
  const [nuevaUnidad, setNuevaUnidad] = useState('');
  const [nuevoIdSucursal, setNuevoIdSucursal] = useState('');

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
      obtenerInventario();
      setModalOpen(false);
      alert('Insumo editado');
    } else {
      console.error('Error al editar insumo');
    }
  };

  const abrirModalEditar = (insumo) => {
    setEditInsumo(insumo);
    setNombre(insumo.nombre);
    setCantidad(insumo.cantidad);
    setUnidad(insumo.unidad);
    setFechaActualizacion(insumo.fecha_actualizacion);
    setIdSucursal(insumo.id_sucursal);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  const handleCrearInsumo = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://127.0.0.1:5000/inventario', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: nuevoNombre,
        cantidad: nuevaCantidad,
        unidad: nuevaUnidad,
        id_sucursal: nuevoIdSucursal,
      }),
    });

    if (response.ok) {
      obtenerInventario();
      setCrearModalOpen(false);
      setNuevoNombre('');
      setNuevaCantidad('');
      setNuevaUnidad('');
      setNuevoIdSucursal('');
      alert('Insumo creado exitosamente');
    } else {
      const data = await response.json();
      alert(`Error al crear insumo: ${data.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Inventario
      </Typography>
      <Button variant="contained" sx={{ my: 2, backgroundColor: '#FF5722' }} onClick={() => setCrearModalOpen(true)}>
        Agregar Insumo
      </Button>
      <TableContainer component={Paper} sx={{ border: '2px solid rgb(240, 117, 17)' }}>
        <Table>
          <TableHead sx={{ backgroundColor: '#ff9800' }}>
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
          <React.Fragment key={insumo.id_insumo}>
            <TableRow>
              <TableCell>{insumo.nombre}</TableCell>
              <TableCell>{insumo.cantidad}</TableCell>
              <TableCell>{insumo.unidad}</TableCell>
              <TableCell>{new Date(insumo.fecha_actualizacion).toLocaleDateString()}</TableCell>
              <TableCell>
            <Button onClick={() => abrirModalEditar(insumo)} color="primary">Editar</Button>
            <Button onClick={() => handleDelete(insumo.id_insumo)} color="secondary">Eliminar</Button>
            </TableCell>
            </TableRow>
              {Number(insumo.cantidad) < 2 && (
            <TableRow>
            <TableCell colSpan={5}>
            <Box sx={{ mt: 1 }}>
              <Alert severity="error">
                ⚠ El insumo <strong>{insumo.nombre}</strong> tiene una cantidad baja ({insumo.cantidad}). Considera reabastecerlo.
              </Alert>
            </Box>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      {/* Modal Edición */}
      <Modal open={modalOpen} onClose={cerrarModal}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', padding: 4 }}>
          <h2>Editar Insumo</h2>
          <TextField label="Nombre" fullWidth value={nombre} onChange={(e) => setNombre(e.target.value)} margin="normal" />
          <TextField label="Cantidad" fullWidth value={cantidad} onChange={(e) => setCantidad(e.target.value)} margin="normal" type="number" />
          <TextField label="Unidad" fullWidth value={unidad} onChange={(e) => setUnidad(e.target.value)} margin="normal" />
          <TextField label="Fecha de Actualización" fullWidth value={fechaActualizacion} onChange={(e) => setFechaActualizacion(e.target.value)} margin="normal" type="date" InputLabelProps={{ shrink: true }} />
          <TextField label="ID de Sucursal" fullWidth value={idSucursal} onChange={(e) => setIdSucursal(e.target.value)} margin="normal" type="number" />
          <Button onClick={handleEdit} color="primary" fullWidth>Guardar cambios</Button>
          <Button onClick={cerrarModal} color="secondary" fullWidth>Cancelar</Button>
        </Box>
      </Modal>

      {/* Modal Crear */}
      <Modal open={crearModalOpen} onClose={() => setCrearModalOpen(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', padding: 4 }}>
          <h2>Agregar Insumo</h2>
          <TextField label="Nombre" fullWidth value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} margin="normal" />
          <TextField label="Cantidad" fullWidth value={nuevaCantidad} onChange={(e) => setNuevaCantidad(e.target.value)} margin="normal" type="number" />
          <TextField label="Unidad" fullWidth value={nuevaUnidad} onChange={(e) => setNuevaUnidad(e.target.value)} margin="normal" />
          <TextField label="ID de Sucursal" fullWidth value={nuevoIdSucursal} onChange={(e) => setNuevoIdSucursal(e.target.value)} margin="normal" type="number" />
          <Button onClick={handleCrearInsumo} color="primary" fullWidth>Crear Insumo</Button>
          <Button onClick={() => setCrearModalOpen(false)} color="secondary" fullWidth>Cancelar</Button>
        </Box>
      </Modal>
    </div>
  );
};

export default Inventario;
