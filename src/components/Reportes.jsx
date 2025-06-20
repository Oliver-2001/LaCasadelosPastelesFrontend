import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TableChartIcon from '@mui/icons-material/TableChart';
import axios from 'axios';

const reportes = [
  {
    titulo: 'Ventas por Producto (últimos 30 días)',
    descripcion: 'Reporte en Excel con la cantidad vendida por producto.',
    tipo: 'excel',
    endpoint: '/reporte/excel/ventas-producto',
  },
  {
    titulo: 'Ventas Detalladas Diarias (últimos 30 días)',
    descripcion: 'Reporte en PDF con el detalle de ventas por día y producto.',
    tipo: 'pdf',
    endpoint: '/reporte/pdf/ventas-detalladas-diarias',
  },
  {
    titulo: 'Ventas por Usuario (últimos 30 días)',
    descripcion: 'Reporte en Excel con el total vendido por cada usuario.',
    tipo: 'excel',
    endpoint: '/reporte/excel/ventas-por-usuario',
  },
  {
    titulo: 'Insumos Detallado por Mes',
    descripcion: 'Reporte en Excel con el detalle mensual de insumos.',
    tipo: 'excel',
    endpoint: '/reporte/excel/insumos-detallado-por-mes',
  },
];

const ModuloReportes = () => {
  const descargarReporte = async (endpoint, tipo) => {
    try {
      const res = await axios.get(`http://localhost:5000${endpoint}`, {
        responseType: 'blob',
      });

      const tipoArchivo =
        tipo === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

      const extension = tipo === 'pdf' ? '.pdf' : '.xlsx';
      const nombre = endpoint.split('/').pop() + extension;

      const url = window.URL.createObjectURL(new Blob([res.data], { type: tipoArchivo }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nombre);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error al descargar reporte:', error);
      alert('Hubo un error al generar el reporte.');
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={4} fontWeight="bold">
        Módulo de Reportes
      </Typography>

      <Grid container spacing={3}>
        {reportes.map((reporte, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card elevation={4}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  {reporte.tipo === 'pdf' ? (
                    <PictureAsPdfIcon fontSize="large" color="error" />
                  ) : (
                    <TableChartIcon fontSize="large" color="primary" />
                  )}
                  <Typography variant="h6" ml={2}>
                    {reporte.titulo}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {reporte.descripcion}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DescriptionIcon />}
                  onClick={() => descargarReporte(reporte.endpoint, reporte.tipo)}
                >
                  Descargar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ModuloReportes;
