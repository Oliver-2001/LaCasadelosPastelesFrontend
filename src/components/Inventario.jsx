import React, { useEffect, useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, 
  Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const Inventario = () => {
  const [inventario, setInventario] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newCantidad, setNewCantidad] = useState("");

  useEffect(() => {
    fetchInventario();
  }, []);

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

  const handleEdit = (item) => {
    setSelectedItem(item);
    setNewCantidad(item.cantidad);
    setOpenEdit(true);
  };

  const handleUpdateCantidad = async () => {
    if (!selectedItem) return;

    const response = await fetch(`http://127.0.0.1:5000/inventario/${selectedItem.id_insumo}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ cantidad: newCantidad }),
    });

    if (response.ok) {
      fetchInventario();
      setOpenEdit(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este insumo?")) {
      await fetch(`http://127.0.0.1:5000/inventario/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      });
      fetchInventario();
    }
  };

  return (
    <div style={{ width: "90%", margin: "auto", marginTop: "20px" }}>
      <Button variant="contained" color="warning" startIcon={<AddIcon />} sx={{ mb: 2 }}>
        Crear Insumo
      </Button>

      <TableContainer component={Paper} sx={{ boxShadow: 4, borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#ff9800" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Cantidad</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Unidad</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Última actualización</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold", fontSize: "1.1rem" }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventario.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
              <TableRow key={item.id_insumo}>
                <TableCell>{item.id_insumo}</TableCell>
                <TableCell>{item.nombre}</TableCell>
                <TableCell>{item.cantidad}</TableCell>
                <TableCell>{item.unidad}</TableCell>
                <TableCell>{new Date(item.fecha_actualizacion).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button color="primary" size="small" startIcon={<EditIcon />} onClick={() => handleEdit(item)}>
                    Editar
                  </Button>
                  <Button color="error" size="small" startIcon={<DeleteIcon />} onClick={() => handleDelete(item.id_insumo)}>
                    Eliminar
                  </Button>
                </TableCell>
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

      {/* Modal para editar cantidad */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Editar Cantidad</DialogTitle>
        <DialogContent>
          <TextField
            label="Cantidad"
            type="number"
            fullWidth
            variant="outlined"
            value={newCantidad}
            onChange={(e) => setNewCantidad(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancelar</Button>
          <Button onClick={handleUpdateCantidad} color="primary">Guardar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Inventario;
