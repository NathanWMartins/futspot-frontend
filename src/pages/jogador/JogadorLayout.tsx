import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderJogador from "../../components/jogador/HeaderJogador";
import BottomNavJogador from "../../components/jogador/BottomNavJogador";

export default function JogadorLayout() {
    const isMobile = useMediaQuery("(max-width:900px)");

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
            {!isMobile && <HeaderJogador />}

            <Box sx={{ pb: isMobile ? 8 : 0 }}>
                <Outlet />
            </Box>

            {isMobile && <BottomNavJogador />}
        </Box>
    );
}
