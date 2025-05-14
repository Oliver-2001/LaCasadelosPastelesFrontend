import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Fix para los íconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png',
});

export default function MapaSucursales() {
  const [sucursales, setSucursales] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/sucursales') // Ajusta si usas otra ruta
      .then(res => setSucursales(res.data))
      .catch(err => console.error(err));
  }, []);

  // Coordenadas centradas en Guatemala si no hay sucursales
  const centro = sucursales.length
    ? [parseFloat(sucursales[0].latitud), parseFloat(sucursales[0].longitud)]
    : [14.55671, -90.73389];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Mapa de Sucursales</h2>
      <MapContainer center={centro} zoom={13} scrollWheelZoom={true}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {sucursales.map((sucursal) => (
          <Marker
            key={sucursal.id_sucursal}
            position={[parseFloat(sucursal.latitud), parseFloat(sucursal.longitud)]}
          >
            <Popup>
              <strong>{sucursal.nombre}</strong><br />
              {sucursal.direccion}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
