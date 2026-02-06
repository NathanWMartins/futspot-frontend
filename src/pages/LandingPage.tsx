import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import FutspotLogo from "../assets/LogoFutSpotDark.png";
import { AuthDialog } from "../components/AuthDialog";
import { useLocation, useNavigate } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";
import { FieldScene } from "../components/landing/campo/FieldScene";
import { Email, Instagram, WhatsApp } from "@mui/icons-material";

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.default", mt: 2 }}
      >
        <Toolbar disableGutters>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6, lg: 8 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={scrollToTop}
              >
                <Box
                  component="img"
                  src={FutspotLogo}
                  alt="FutSpot"
                  sx={{ height: 40 }}
                />

                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#00E676",
                    pr: 5,
                  }}
                >
                  Fut<span style={{ color: "#fff" }}>Spot</span>
                </Typography>

                {!isMobile && (
                  <>
                    <Button href="#sobre" color="inherit">
                      Sobre
                    </Button>
                    <Button href="#contato" color="inherit" sx={{ pl: 2 }}>
                      Contato
                    </Button>
                  </>
                )}
              </Stack>

              <Button
                variant="contained"
                size="large"
                sx={{ color: "#fff", borderRadius: "8px" }}
                onClick={handleOpenAuth}
              >
                Entrar
              </Button>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      {/* Hero Campo*/}
      <Box
        sx={{
          minHeight: "calc(100vh - 64px)",
          display: "flex",
          alignItems: "center",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6, lg: 8 } }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={{ xs: 3, md: 0 }}
            alignItems="center"
          >
            <Box flex={1} sx={{ pl: { md: 4 }, pt: { xs: 6, md: 0 } }}>
              <Typography variant="h3" component="h1">
                Organize suas{" "}
                <Box
                  component="span"
                  color="primary.main"
                  sx={{
                    display: "inline-block",
                    maxWidth: 300,
                  }}
                >
                  <Typewriter
                    words={["partidas", "reservas", "quadras"]}
                    loop={0}
                    cursor
                    cursorStyle="|"
                    typeSpeed={80}
                    deleteSpeed={50}
                    delaySpeed={1500}
                  />
                </Box>
              </Typography>

              <Typography variant="h3" sx={{ mt: 1 }}>
                sem dor de cabeça.
              </Typography>

                <Stack direction="row" spacing={2} mt={4}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleOpenAuth}
                    sx={{ color: "#fff", borderRadius: "8px" }}
                  >
                    Começar agora
                  </Button>
                </Stack>
            </Box>

            <Box sx={{ width: "100%", maxWidth: 520, ml: { md: -6, lg: -10 } }}>
              <FieldScene />
            </Box>
          </Stack>
        </Container>
      </Box>

      {/* Sobre*/}
      <Box
        id="sobre"
        sx={{
          bgcolor: "background.paper",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Stack
            spacing={3}
            alignItems={{ xs: "center", md: "flex-start" }}
            textAlign={{ xs: "center", md: "left" }}
          >
            <Typography variant="h4" fontWeight={700}>
              Sobre o FutSpot
            </Typography>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ maxWidth: 600, lineHeight: 1.7 }}
            >
              O FutSpot conecta jogadores e locadores de quadras em um só lugar.
              Encontre horários disponíveis, reserve sua quadra favorita e
              gerencie seus agendamentos de forma simples, rápida e sem
              complicação.
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Contato*/}
      <Box
        id="contato"
        sx={{
          bgcolor: "background.default",
          pt: { xs: 10, md: 14 },
          pb: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="sm" sx={{ px: { xs: 2, sm: 3, md: 6 } }}>
          <Stack spacing={4} alignItems="center" textAlign="center">
            <Typography variant="h4" fontWeight={700}>
              Fale com a gente
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Ficou com alguma dúvida ou quer levar o FutSpot para sua quadra?
            </Typography>

            <Stack direction="row" spacing={3} alignItems="center">
              <IconButton
                href="mailto:futspot.oficial@outlook.com"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                  width: 60,
                  height: 60,
                }}
              >
                <Email />
              </IconButton>

              <IconButton
                href="https://www.instagram.com/futspot.oficial"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                  width: 60,
                  height: 60,
                }}
              >
                <Instagram />
              </IconButton>

              <IconButton
                href="https://wa.me/48998472801"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: "primary.main",
                  color: "#fff",
                  "&:hover": { bgcolor: "primary.dark" },
                  width: 60,
                  height: 60,
                }}
              >
                <WhatsApp />
              </IconButton>
            </Stack>
            
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
