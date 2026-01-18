import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Chip,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FutspotLogo from "../assets/LogoFutSpotDark.png";
import { AuthDialog } from "../components/AuthDialog";
import { NeonFieldHeroVisual } from "../components/NeonFieldHeroVisual";
import { useLocation, useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

export const LandingPage: React.FC = () => {
  const [authOpen, setAuthOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleOpenAuth = () => setAuthOpen(true);
  const handleCloseAuth = () => setAuthOpen(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [snack, setSnack] = useState<null | {
    severity: "error" | "success" | "info" | "warning";
    message: string;
  }>(null);

  useEffect(() => {
    const state = location.state as any;

    if (state?.snackbar?.message) {
      setSnack(state.snackbar);

      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            onClick={() => navigate("/locador/home")}
            sx={{ cursor: "pointer" }}
          >
            <Box
              component="img"
              src={FutspotLogo}
              alt="FutSpot"
              sx={{
                height: 40,
                width: "auto",
              }}
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

          <Button
            color="inherit"
            onClick={handleOpenAuth}
            sx={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Entrar
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl">
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={6}
            alignItems="center"
          >
            <Box flex={1}>
              {!isMobile ? (
                <Chip
                  label="Agende seu jogo em minutos"
                  color="primary"
                  variant="outlined"
                  sx={{ mb: 2, fontWeight: 600 }}
                />
              ) : null}
              <Typography variant="h3" component="h1" gutterBottom>
                Organize suas{" "}
                <Box component="span" color="primary.main">
                  <Typewriter
                    words={["partidas", "reservas", "quadras"]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </Box>{" "}
                sem dor de cabeça.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                O FutSpot conecta jogadores e locadores de quadras em um só
                lugar. Encontre horários disponíveis, reserve sua quadra
                favorita e gerencie seus agendamentos de forma simples e rápida.
              </Typography>
              {!isMobile ? (
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenAuth}
                    sx={{ fontFamily: "'Poppins', sans-serif", color: "#fff" }}
                  >
                    Começar agora
                  </Button>
                </Stack>
              ) : null}
            </Box>

            <Box flex={1} sx={{ width: "100%", ml: { md: 6, lg: 10 } }}>
              <NeonFieldHeroVisual />
            </Box>
          </Stack>
        </Container>
      </Box>

      <AuthDialog open={authOpen} onClose={handleCloseAuth} />
      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3500}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snack?.severity ?? "info"}
          onClose={() => setSnack(null)}
          variant="filled"
        >
          {snack?.message}
        </Alert>
      </Snackbar>
    </>
  );
};
