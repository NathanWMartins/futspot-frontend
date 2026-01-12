import { Box, useMediaQuery } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";
import { Outlet } from "react-router-dom";
import HeaderJogador from "../components/jogador/HeaderJogador";
import HeaderLocador from "../components/locador/HeaderLocador";
import BottomNavJogador from "../components/jogador/BottomNavJogador";
import BottomNavLocador from "../components/locador/BottomNavLocador";

export default function UserLayout() {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width:900px)");

  if (!user) return null;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {!isMobile && user.tipoUsuario === "jogador" && <HeaderJogador />}
      {!isMobile && user.tipoUsuario === "locador" && <HeaderLocador />}

      <Box sx={{ pb: isMobile ? 8 : 0 }}>
        <Outlet />
      </Box>

      {isMobile && user.tipoUsuario === "jogador" && <BottomNavJogador />}
      {isMobile && user.tipoUsuario === "locador" && <BottomNavLocador />}
    </Box>
  );
}
