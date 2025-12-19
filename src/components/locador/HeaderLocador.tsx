import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import NotificationsIcon from "@mui/icons-material/Notifications";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

function HeaderLocador() {
    const navigate = useNavigate();
    const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setMenuAnchor(event.currentTarget);
    };

    const closeMenu = () => setMenuAnchor(null);

    return (
        <>
            <AppBar
                position="sticky"
                elevation={0}
                sx={{
                    bgcolor: "#101010",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SportsSoccerIcon color="primary" />
                        <Typography variant="h6" fontWeight={700} onClick={() => navigate("/home-locador")} sx={{ cursor: "pointer" }}>
                            FutSpot
                        </Typography>
                    </Stack>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton color="primary">
                            <NotificationsIcon />
                        </IconButton>
                        <IconButton onClick={openMenu}>
                            <Avatar sx={{ bgcolor: "#00E676" }}>L</Avatar>
                        </IconButton>

                        <Menu
                            anchorEl={menuAnchor}
                            open={Boolean(menuAnchor)}
                            onClose={closeMenu}
                        >
                            <MenuItem onClick={() => { closeMenu(); navigate("/locador/locais"); }}>
                                Meus locais
                            </MenuItem>

                            <MenuItem onClick={() => { closeMenu(); navigate("/locador/agenda"); }}>
                                Agenda
                            </MenuItem>

                            <MenuItem onClick={() => { closeMenu(); navigate("/locador/perfil"); }}>
                                Meu perfil
                            </MenuItem>

                            <MenuItem onClick={() => { closeMenu(); navigate("/"); }}>
                                Sair
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
    )
}

export default HeaderLocador