import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import BottomNavJogador from "../../components/jogador/BottomNavJogador";
import { useAuth } from "../../contexts/AuthContext";
import { jogadorMenu } from "../../components/sidebar/menus";
import { Sidebar } from "../../components/sidebar/Sidebar";

export default function JogadorLayout() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user } = useAuth();

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {!isMobile && (
        <Sidebar
          menu={jogadorMenu}
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

      {isMobile && <BottomNavJogador />}
    </Box>
  );
}
