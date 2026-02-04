import {
  Box,
  Container,
  Stack,
  IconButton,
  Typography,
  Tabs,
  Tab,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  getNotificacoesLidas,
  getNotificacoesNaoLidas,
  getNotificacoesNaoLidasCount,
  marcarNotificacaoComoLida,
} from "../services/notificacoesService";
import NotificacoesNaoLidasTab from "../components/avisos/NotificacoesNaoLidasTab";
import NotificacoesLidasTab from "../components/avisos/NotificacoesLidasTab";
import { useNotificacao } from "../contexts/NotificacaoContext";

export function NotificacoesPage() {
  const navigate = useNavigate();

  const [aba, setAba] = useState(0);
  const [loading, setLoading] = useState(false);

  const [naoLidas, setNaoLidas] = useState<any[]>([]);
  const [lidas, setLidas] = useState<any[]>([]);

  const [pullStartY, setPullStartY] = useState<number | null>(null);
  const [isPulling, setIsPulling] = useState(false);

  const [snack, setSnack] = useState({
    open: false,
    msg: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });

  const { setNaoLidasCount } = useNotificacao();

  async function load() {
    try {
      setLoading(true);

      const [nl, l, count] = await Promise.all([
        getNotificacoesNaoLidas(),
        getNotificacoesLidas(),
        getNotificacoesNaoLidasCount(),
      ]);

      setNaoLidas(nl);
      setLidas(l);
      setNaoLidasCount(count);
    } catch (e) {
      setSnack({
        open: true,
        msg: "Erro ao carregar notificações",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }

  const marcarComoLida = async (id: string) => {
    await marcarNotificacaoComoLida(id);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", pb: 6 }}>
      <Container maxWidth="md" sx={{ pt: 2 }}>
        {/* Top bar */}
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 900, fontSize: 16 }} noWrap>
            Notificações
          </Typography>

          <Box sx={{ flex: 1 }} />

          <IconButton
            onClick={load}
            disabled={loading}
            sx={{
              color: "#00E676",
              border: "1px solid rgba(0,230,118,0.35)",
            }}
          >
            <RefreshRoundedIcon />
          </IconButton>
        </Stack>

        {/* Pull to refresh wrapper */}
        <Box
          onTouchStart={(e) => {
            if (window.scrollY === 0) {
              setPullStartY(e.touches[0].clientY);
            }
          }}
          onTouchMove={(e) => {
            if (pullStartY !== null) {
              const diff = e.touches[0].clientY - pullStartY;
              if (diff > 60) setIsPulling(true);
            }
          }}
          onTouchEnd={() => {
            if (isPulling) load();
            setPullStartY(null);
            setIsPulling(false);
          }}
        >
          {isPulling && (
            <Typography sx={{ textAlign: "center", opacity: 0.6, mb: 1 }}>
              Atualizando...
            </Typography>
          )}

          {/* Tabs */}
          <Box
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              bgcolor: "rgba(255,255,255,0.03)",
              p: 0.5,
              mb: 2,
            }}
          >
            <Tabs
              value={aba}
              onChange={(_, v) => setAba(v)}
              variant="fullWidth"
              TabIndicatorProps={{ style: { display: "none" } }}
              sx={{
                minHeight: 42,
                "& .MuiTab-root": {
                  minHeight: 42,
                  borderRadius: 2.5,
                  textTransform: "none",
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.75)",
                },
                "& .Mui-selected": {
                  bgcolor: "rgba(0,230,118,0.18)",
                  border: "1px solid rgba(0,230,118,0.30)",
                  color: "#fff",
                },
              }}
            >
              <Tab
                value={0}
                label={
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <NotificationsActiveRoundedIcon fontSize="small" />
                    <span>Não lidas</span>
                  </Stack>
                }
              />
              <Tab
                value={1}
                label={
                  <Stack direction="row" spacing={0.8} alignItems="center">
                    <DoneAllRoundedIcon fontSize="small" />
                    <span>Lidas</span>
                  </Stack>
                }
              />
            </Tabs>
          </Box>

          {aba === 0 ? (
            <NotificacoesNaoLidasTab
              loading={loading}
              lista={naoLidas}
              onMarcarComoLida={marcarComoLida}
            />
          ) : (
            <NotificacoesLidasTab loading={loading} lista={lidas} />
          )}
        </Box>
      </Container>

      {/* Snackbar */}
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
  );
}
