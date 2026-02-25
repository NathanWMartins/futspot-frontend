import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Snackbar,
  Alert,
  AppBar,
  Toolbar,
  Container,
  Stack,
} from "@mui/material";
import axios from "axios";
import { resetPasswordConfirm } from "../services/authService";
import FutspotLogo from "../assets/LogoFutSpotDark.png";

export default function RedefinirSenhaPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });

  const showError = (msg: string) =>
    setSnack({ open: true, msg, severity: "error" });
  const showSuccess = (msg: string) =>
    setSnack({ open: true, msg, severity: "success" });

  if (!token) {
    return (
      <Typography color="error" align="center" mt={4}>
        Token inválido.
      </Typography>
    );
  }

  const handleSubmit = async () => {
    try {
      setLoading(true);

      console.log("Senhas: ", password, '-',confirmPassword);

      await resetPasswordConfirm({
        token,
        password,
        confirmPassword,
      });

      showSuccess("Senha redefinida com sucesso!");
      navigate("/");
    } catch (error: unknown) {
      let message = "Erro ao redefinir senha.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.default", mt: 2, borderBottom: "1px solid", borderColor: "divider" }}
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
                onClick={() => navigate("/")}
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
              </Stack>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="70vh"
      >
        <Paper sx={{ p: 4, width: 400 }}>
          <Typography variant="h5" mb={2}>
            Redefinir senha
          </Typography>

          <TextField
            fullWidth
            type="password"
            label="Nova senha"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            type="password"
            label="Confirmar senha"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </Button>
        </Paper>

        <Snackbar
          open={snack.open}
          autoHideDuration={3500}
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnack((s) => ({ ...s, open: false }))}
            severity={snack.severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {snack.msg}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
}
