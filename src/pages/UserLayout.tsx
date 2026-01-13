import { Box, useMediaQuery } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router-dom";
import BottomNavJogador from "../components/jogador/BottomNavJogador";
import BottomNavLocador from "../components/locador/BottomNavLocador";
import { Sidebar } from "../components/sidebar/Sidebar";
import { jogadorMenu, locadorMenu } from "../components/sidebar/menus";

export default function UserLayout() {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:900px)");

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {!isMobile && user.tipoUsuario === "jogador" && (
        <Sidebar
          menu={jogadorMenu}
          user={{
            nome: user?.nome ?? "User",
            fotoUrl: user?.fotoUrl ?? "",
            tipoUsuario: user?.tipoUsuario ?? "",
          }}
        />
      )}
      {!isMobile && user.tipoUsuario === "locador" && (
        <Sidebar
          menu={locadorMenu}
          user={{
            nome: user?.nome ?? "User",
            fotoUrl: user?.fotoUrl ?? "",
            tipoUsuario: user?.tipoUsuario ?? "",
          }}
        />
      )}

      <Box sx={{ pb: isMobile ? 8 : 0 }}>
        <Outlet />
      </Box>

      {isMobile && user.tipoUsuario === "jogador" && <BottomNavJogador />}
      {isMobile && user.tipoUsuario === "locador" && <BottomNavLocador />}
    </Box>
  );
}
