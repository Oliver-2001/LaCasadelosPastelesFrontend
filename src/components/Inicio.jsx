import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);

const Inicio = () => {
  const [productosMasVendidos, setProductosMasVendidos] = useState([]);
  const [ventasDiarias, setVentasDiarias] = useState([]);

  useEffect(() => {
    // Productos más vendidos - Recuerda que la respuesta es { productos: [...] }
    fetch("http://localhost:5000/productos/mas-vendidos")
      .then((res) => res.json())
      .then((data) => {
        console.log("Productos más vendidos:", data);
        setProductosMasVendidos(Array.isArray(data.productos) ? data.productos : []);
      })
      .catch((err) => console.error(err));

    // Ventas diarias - total_ventas (no total)
    fetch("http://localhost:5000/ventas/diarias")
      .then((res) => res.json())
      .then((data) => {
        console.log("Ventas diarias:", data);
        setVentasDiarias(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err));
  }, []);

  // Configuración para productos más vendidos (gráfica de barras)
  const productosMasVendidosData = {
    labels: productosMasVendidos.map((p) => p.nombre),
    datasets: [
      {
        label: "Cantidad Vendida",
        data: productosMasVendidos.map((p) => p.cantidad_vendida),
        backgroundColor: "rgba(255, 99, 132, 0.6)",
      },
    ],
  };

  // Configuración para ventas diarias (línea)
  const ventasDiariasData = {
    labels: ventasDiarias.map((v) => v.fecha),
    datasets: [
      {
        label: "Ventas Diarias (Q)",
        data: ventasDiarias.map((v) => v.total_ventas),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.4)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard</h1>

      <section style={{ marginBottom: "40px" }}>
        <h2>Productos Más Vendidos</h2>
        {productosMasVendidos.length > 0 ? (
          <Bar data={productosMasVendidosData} />
        ) : (
          <p>Cargando datos de productos más vendidos...</p>
        )}
      </section>

      <section style={{ marginBottom: "40px" }}>
        <h2>Ventas Diarias</h2>
        {ventasDiarias.length > 0 ? (
          <Line data={ventasDiariasData} />
        ) : (
          <p>Cargando datos de ventas diarias...</p>
        )}
      </section>
    </div>
  );
};

export default Inicio;
