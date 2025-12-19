import React, { useState } from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Container,
    Stack,
    Chip,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { AuthDialog } from "../components/AuthDialog";
import { NeonFieldHeroVisual } from "../components/NeonFieldHeroVisual";

export const LandingPage: React.FC = () => {
    const [authOpen, setAuthOpen] = useState(false);

    const handleOpenAuth = () => setAuthOpen(true);
    const handleCloseAuth = () => setAuthOpen(false);

    return (
        <>
            <AppBar position="sticky" elevation={0}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SportsSoccerIcon />
                        <Typography variant="h6" fontWeight={700}>
                            FutSpot
                        </Typography>
                    </Stack>

                    <Button color="inherit" onClick={handleOpenAuth}>
                        Entrar / Cadastrar
                    </Button>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    minHeight: "calc(100vh - 64px)",
                    display: "flex",
                    alignItems: "center",
                    bgcolor: "background.default",
                    py: 4,
                }}
            >
                <Container maxWidth="lg">
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        spacing={6}
                        alignItems="center"
                    >
                        {/* Texto principal */}
                        <Box flex={1}>
                            <Chip
                                label="Agende seu jogo em minutos"
                                color="primary"
                                variant="outlined"
                                sx={{ mb: 2, fontWeight: 600 }}
                            />
                            <Typography variant="h3" component="h1" gutterBottom>
                                Organize suas{" "}
                                <Box component="span" color="primary.main">
                                    partidas
                                </Box>{" "}
                                sem dor de cabeça.
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                O FutSpot conecta jogadores e locadores de quadras em um só
                                lugar. Encontre horários disponíveis, reserve sua quadra
                                favorita e gerencie seus agendamentos de forma simples e rápida.
                            </Typography>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    onClick={handleOpenAuth}
                                >
                                    Começar agora
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="large"
                                    onClick={handleOpenAuth}
                                >
                                    Sou locador de quadra
                                </Button>
                            </Stack>
                        </Box>

                        <Box flex={1} sx={{ width: "100%", ml: { md: 6, lg: 10 } }}>
                            <NeonFieldHeroVisual />
                        </Box>
                    </Stack>
                </Container>
            </Box>

            <AuthDialog open={authOpen} onClose={handleCloseAuth} />
        </>
    );
};
