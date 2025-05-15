import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PrediccionesIA = () => {
  const [predicciones, setPredicciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [productosUnicos, setProductosUnicos] = useState([]);

  // Obtener datos de la API
  const fetchPredicciones = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/predicciones");
      setPredicciones(response.data);

      const productos = [
        ...new Set(response.data.map((p) => p.nombre_producto)),
      ];
      setProductosUnicos(productos);

      if (!productoSeleccionado && productos.length > 0) {
        setProductoSeleccionado(productos[0]);
      }
    } catch (error) {
      console.error("Error al obtener las predicciones:", error);
    } finally {
      setLoading(false);
    }
  }, [productoSeleccionado]);

  useEffect(() => {
    fetchPredicciones();
  }, [fetchPredicciones]);

  // Filtrar datos para el producto seleccionado
  const datosFiltrados = predicciones.filter(
    (p) => p.nombre_producto === productoSeleccionado
  );

  // Manejar cambio en el select
  const handleProductoChange = (event) => {
    setProductoSeleccionado(event.target.value);
  };

  if (loading) {
    return (
      <Box p={3} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  if (predicciones.length === 0) {
    return (
      <Box p={3}>
        <Typography variant="h6">No hay datos de predicciones disponibles.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        📈 Predicciones de Demanda
      </Typography>

      {/* Selector de producto */}
      <FormControl sx={{ minWidth: 220, mb: 3 }}>
        <InputLabel id="select-producto-label">Producto</InputLabel>
        <Select
          labelId="select-producto-label"
          id="select-producto"
          value={productoSeleccionado}
          label="Producto"
          onChange={handleProductoChange}
        >
          {productosUnicos.map((producto) => (
            <MenuItem key={producto} value={producto}>
              {producto}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Botón actualizar */}
      <Button variant="contained" onClick={fetchPredicciones} sx={{ ml: 2 }}>
        Actualizar
      </Button>

      {/* Tabla */}
      <TableContainer component={Paper} sx={{ marginTop: 3, marginBottom: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Producto</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell><strong>Cantidad Predicha</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosFiltrados.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.nombre_producto}</TableCell>
                <TableCell>{row.fecha_prediccion}</TableCell>
                <TableCell>{Math.round(row.cantidad_prediccion)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Gráfica de barras */}
      <Typography variant="h6" gutterBottom>
        Tendencia de Predicciones
      </Typography>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosFiltrados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="fecha_prediccion" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad_prediccion" fill="#1976d2" name="Cantidad Predicha" />
        </BarChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PrediccionesIA;
