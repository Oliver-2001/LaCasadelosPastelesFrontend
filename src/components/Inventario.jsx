import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination } from "@mui/material";

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchInventario = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await fetch("http://127.0.0.1:5000/inventario", {
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setInventario(data);
      }
    };

    fetchInventario();
  }, []);

  return (
    <TableContainer component={Paper} 
      sx={{ 
        width: "90%", 
        margin: "auto", 
        mt: 3, 
        boxShadow: 4, 
        borderRadius: 3, 
        backgroundColor: "#fff8e1"  // Fondo beige claro para combinar con el naranja
      }}>
      <Table>
        <TableHead sx={{ backgroundColor: "#ff9800" }}> 
          <TableRow>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>ID</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Nombre</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Cantidad</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Unidad</TableCell>
            <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Última actualización</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {inventario.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
            <TableRow key={item.id_insumo} sx={{ height: "60px" }}>
              <TableCell sx={{ fontSize: "1rem" }}>{item.id_insumo}</TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>{item.nombre}</TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>{item.cantidad}</TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>{item.unidad}</TableCell>
              <TableCell sx={{ fontSize: "1rem" }}>{new Date(item.fecha_actualizacion).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <TablePagination
        component="div"
        count={inventario.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => setRowsPerPage(parseInt(event.target.value, 10))}
      />
    </TableContainer>
  );
};

export default Inventario;
