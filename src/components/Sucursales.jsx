import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MapaSucursales from './MapaSucursales';

const Sucursales = () => {
  const [sucursales, setSucursales] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaSucursal, setNuevaSucursal] = useState({
    nombre: '',
    direccion: '',
    latitud: '',
    longitud: '',
  });

  const obtenerSucursales = () => {
    axios.get('http://localhost:5000/sucursales')
      .then((response) => setSucursales(response.data))
      .catch((error) => console.error('Error al obtener sucursales:', error));
  };

  useEffect(() => {
    obtenerSucursales();
  }, []);

  const manejarCambio = (e) => {
    setNuevaSucursal({ ...nuevaSucursal, [e.target.name]: e.target.value });
  };

  const guardarSucursal = async () => {
    try {
      await axios.post('http://localhost:5000/sucursales', nuevaSucursal);
      setMostrarModal(false);
      setNuevaSucursal({ nombre: '', direccion: '', latitud: '', longitud: '' });
      obtenerSucursales();
    } catch (error) {
      console.error('Error al agregar sucursal:', error);
    }
  };

  const eliminarSucursal = async (id_sucursal) => {
  const confirmar = window.confirm('¿Estás seguro de que deseas eliminar esta sucursal?');
  if (!confirmar) return;

  try {
    await axios.delete(`http://localhost:5000/sucursales/${id_sucursal}`);
    obtenerSucursales(); // Actualiza la lista
  } catch (error) {
    console.error('Error al eliminar sucursal:', error);
  }
};

  return (
    <div style={contenedorEstilo}>
      <h2 style={{ fontSize: '28px', fontWeight: '600', marginBottom: '20px' }}>Sucursales</h2>
      <button onClick={() => setMostrarModal(true)} style={botonEstilo}>+ Nueva Sucursal</button>

      <MapaSucursales datos={sucursales} />

      <table style={tablaEstilo}>
        <thead style={theadEstilo}>
          <tr>
            <th style={thEstilo}>Nombre</th>
            <th style={thEstilo}>Dirección</th>
            <th style={thEstilo}>Latitud</th>
            <th style={thEstilo}>Longitud</th>
            <th style={thEstilo}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sucursales.map((sucursal) => (
            <tr key={sucursal.id_sucursal} style={trEstilo}>
              <td style={tdEstilo}>{sucursal.nombre}</td>
              <td style={tdEstilo}>{sucursal.direccion}</td>
              <td style={tdEstilo}>{sucursal.latitud}</td>
              <td style={tdEstilo}>{sucursal.longitud}</td>
              <td style={tdEstilo}>
              <button onClick={() => eliminarSucursal(sucursal.id_sucursal)} style={botonEliminar}>
              Eliminar
              </button>
            </td>
            </tr>
          ))}
        </tbody>
      </table>

      {mostrarModal && (
        <div style={modalFondo}>
          <div style={modalContenido}>
            <h3 style={modalTitulo}>Agregar Nueva Sucursal</h3>
            <input name="nombre" placeholder="Nombre" value={nuevaSucursal.nombre} onChange={manejarCambio} style={inputEstilo} />
            <input name="direccion" placeholder="Dirección" value={nuevaSucursal.direccion} onChange={manejarCambio} style={inputEstilo} />
            <input name="latitud" placeholder="Latitud" value={nuevaSucursal.latitud} onChange={manejarCambio} style={inputEstilo} />
            <input name="longitud" placeholder="Longitud" value={nuevaSucursal.longitud} onChange={manejarCambio} style={inputEstilo} />
            <div style={{ marginTop: '10px' }}>
              <button onClick={guardarSucursal} style={botonGuardar}>Guardar</button>
              <button onClick={() => setMostrarModal(false)} style={botonCancelar}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Estilos mejorados
const contenedorEstilo = {
  padding: '20px',
  backgroundColor: '#f9f9f9',
};

const tablaEstilo = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '20px',
  boxShadow: '0 0 8px rgba(0,0,0,0.1)',
};

const theadEstilo = {
  backgroundColor: '#004b8d', 
  color: '#fff',
};

const thEstilo = {
  padding: '12px',
  textAlign: 'left',
  fontWeight: 'bold',
};

const trEstilo = {
  backgroundColor: '#fff',
  transition: 'background-color 0.3s ease',
};

const tdEstilo = {
  padding: '12px',
  borderBottom: '1px solid #eee',
  fontSize: '16px',
};

const modalFondo = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 9999,
};

const modalContenido = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  width: '90%',
  maxWidth: '400px',
  boxShadow: '0 0 10px rgba(0,0,0,0.3)',
  zIndex: 10000,
};

const modalTitulo = {
  fontSize: '20px',
  fontWeight: '600',
  marginBottom: '20px',
};

const inputEstilo = {
  width: '100%',
  padding: '12px',
  margin: '8px 0',
  borderRadius: '6px',
  border: '1px solid #ddd',
  fontSize: '16px',
  outline: 'none',
  transition: 'border-color 0.3s',
};

const botonEstilo = {
  backgroundColor: '#004b8d',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '16px',
  transition: 'background-color 0.4s',
};

const botonGuardar = {
  ...botonEstilo,
  marginRight: '15px',
  backgroundColor: '#28a745', // verde para el botón de guardar
};

const botonCancelar = {
  ...botonEstilo,
  backgroundColor: '#dc3545', // rojo para cancelar
};

const botonEliminar = {
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  padding: '8px 12px',
  borderRadius: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  transition: 'background-color 0.3s',
};

export default Sucursales;
