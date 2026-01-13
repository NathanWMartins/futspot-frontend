import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import BottomNavLocador from "../../components/locador/BottomNavLocador";
import { Sidebar } from "../../components/sidebar/Sidebar";
import { locadorMenu } from "../../components/sidebar/menus";
import { useAuth } from "../../contexts/AuthContext";

export default function LocadorLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {!isMobile && (
        <Sidebar
          menu={locadorMenu}
          user={{
            nome: user?.nome ?? "User",
            fotoUrl: user?.fotoUrl ?? "",
            tipoUsuario: user?.tipoUsuario ?? ""
          }}
        />
      )}

      <Box sx={{ pb: isMobile ? 8 : 0 }}>
        <Outlet />
      </Box>

      {isMobile && <BottomNavLocador />}
    </Box>
  );
}
