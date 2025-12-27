import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import HeaderLocador from "../../components/locador/HeaderLocador";
import BottomNavLocador from "../../components/locador/BottomNavLocador";

export default function LocadorLayout() {
    const isMobile = useMediaQuery("(max-width:900px)");

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
            {!isMobile && <HeaderLocador />}

            <Box sx={{ pb: isMobile ? 8 : 0 }}>
                <Outlet />
            </Box>

            {isMobile && <BottomNavLocador />}
        </Box>
    );
}
