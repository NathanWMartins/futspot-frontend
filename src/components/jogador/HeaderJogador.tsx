import { useState } from "react";
import {
    AppBar,
    Avatar,
    Box,
    IconButton,
    Menu,
    MenuItem,
    Stack,
    Toolbar,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

import FutspotLogo from "../../assets/LogoFutSpotDark.png";

export default function HeaderJogador() {
    const navigate = useNavigate();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
    const { user, signOut } = useAuth();

    const initial = (user?.nome?.trim()?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

    const openMenu = (event: React.MouseEvent<HTMLElement>) => setMenuAnchor(event.currentTarget);
    const closeMenu = () => setMenuAnchor(null);

    return (
        <AppBar
            position="sticky"
            elevation={0}
            sx={{
                bgcolor: "rgba(16,16,16,0.72)",
                backdropFilter: "blur(10px)",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    onClick={() => navigate("/jogador/home")}
                    sx={{ cursor: "pointer" }}
                >
                    <Box
                        component="img"
                        src={FutspotLogo}
                        alt="FutSpot"
                        sx={{ height: 30, width: "auto" }}
                    />
                    <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{
                            fontFamily: "'Poppins', sans-serif",
                            userSelect: "none",
                            color: "#00E676",
                            letterSpacing: 0.4,
                        }}
                    >
                        Fut<span style={{ color: "#fff" }}>Spot</span>
                    </Typography>
                </Stack>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <IconButton onClick={openMenu}>
                        <Avatar
                            src={user?.fotoUrl ?? undefined}
                            sx={{ bgcolor: "#00E676" }}
                            imgProps={{ referrerPolicy: "no-referrer" }}
                        >
                            {initial}
                        </Avatar>
                    </IconButton>

                    <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu}>
                        <MenuItem
                            onClick={() => {
                                closeMenu();
                                navigate("/jogador/home");
                            }}
                        >
                            Início
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                closeMenu();
                                navigate("/jogador/agenda");
                            }}
                        >
                            Agenda
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                closeMenu();
                                navigate("/user/editar-perfil");
                            }}
                        >
                            Perfil
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                closeMenu();
                                signOut();
                                navigate("/");
                            }}
                        >
                            Sair
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
