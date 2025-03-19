import React from "react";
import { Drawer, List, ListItem, ListItemText, Typography, Divider } from "@mui/material";

const Sidebar = ({ role }) => {
  // Opciones de menú según los roles
  const menuOptions = {
    super_admin: ["Dashboard", "Ventas", "Inventario", "Usuarios", "Reportes", "Predicciones"],
    admin: ["Dashboard", "Ventas", "Inventario", "Reportes"],
    cajero: ["Dashboard", "Ventas"],
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box", backgroundColor: "#FF6347", color: "white" },
      }}
    >
      <Typography variant="h5" sx={{ padding: 2, fontWeight: "bold" }}>
        La Casa de los Pasteles
      </Typography>
      <Divider sx={{ backgroundColor: "white" }} />
      <List>
        {menuOptions[role]?.map((option, index) => (
          <ListItem button key={index}>
            <ListItemText primary={option} sx={{ color: "white" }} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
