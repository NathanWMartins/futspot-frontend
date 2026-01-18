import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../../services/api";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import StatCard from "../../components/jogador/StatCard";
import { tempoNoApp } from "../../utils/date";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CancelIcon from "@mui/icons-material/Cancel";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import IconButton from "@mui/material/IconButton";

export default function PerfilJogador() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [dados, setDados] = useState<any>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const nivelExperiencia =
    dados &&
    calcularNivelExperiencia(dados.totalAgendamentos, dados.taxaCancelamento);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get(`/locadores/jogador/${id}/stats`);
        setDados(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={42} />
      </Box>
    );
  }

  return (
    <Box p={3} sx={{ ml: !isMobile ? 10 : 0, mr: !isMobile ? 10 : 0 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            bgcolor: "rgba(255,255,255,0.06)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
          }}
        >
          <ArrowBackIosNewIcon sx={{ fontSize: 18 }} />
        </IconButton>

        <Typography sx={{ fontWeight: 800, fontSize: 16 }}>
          Perfil do jogador
        </Typography>
      </Stack>

      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ alignItems: "flex-start", p: 2 }}
      >
        <Avatar
          src={dados.fotoUrl}
          sx={{ width: 72, height: 72, border: "2px solid #00E676" }}
        />
        <Stack direction="column" sx={{ pt: 1 }}>
          <Typography sx={{ fontWeight: 800 }}>{dados.nome}</Typography>
          <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
            {dados.email}
          </Typography>
        </Stack>
      </Stack>

      <Stack
        direction="column"
        alignItems="center"
        sx={{ alignItems: "flex-start", pb: 1 }}
      >
        <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
          Nível de experiência: <strong>{nivelExperiencia}</strong>
        </Typography>

        <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
          {tempoNoApp(dados.createdAt)} de FutSpot
        </Typography>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack
        sx={{
          bgcolor: "rgba(255,255,255,0.03)",
          borderRadius: 1.5,
          px: 2,
          py: 1,
          mb: 2,
        }}
      >
        <StatCard
          label="Avaliações feitas"
          value={
            dados.mediaAvaliacoes === null ? (
              "Ainda não avaliou"
            ) : (
              <Stack direction="row" spacing={0.5} alignItems="center">
                <Typography sx={{ fontWeight: 700 }}>
                  {dados.mediaAvaliacoes}
                </Typography>

                <StarIcon sx={{ fontSize: 16, color: "#fff", opacity: 0.8 }} />

                <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                  {"(" + dados.totalAvaliacoes}{" "}
                  {dados.totalAvaliacoes === 1 ? "avaliação)" : "avaliações)"}
                </Typography>
              </Stack>
            )
          }
          icon={
            <StarIcon
              sx={{
                fontSize: 18,
                color: dados.mediaAvaliacoes === null ? "opacity.5" : "#FFD700",
              }}
            />
          }
          highlight={dados.mediaAvaliacoes !== null}
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack
        sx={{
          bgcolor: "rgba(255,255,255,0.03)",
          borderRadius: 1.5,
          px: 2,
          py: 1.5,
        }}
      >
        <StatCard
          label="Agendamentos realizados"
          value={dados.totalAgendamentos}
          icon={<EventAvailableIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
        />
        <Divider sx={{ my: 1 }} />
        <StatCard
          label="Taxa de cancelamento"
          value={`${dados.taxaCancelamento}%`}
          icon={<CancelIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
        />
        <Divider sx={{ my: 1 }} />
        <StatCard
          label="Comportamento"
          value={dados.comportamento}
          highlight
          icon={<VerifiedUserIcon sx={{ fontSize: 18, color: "#00E676" }} />}
        />
      </Stack>
    </Box>
  );
}

function calcularNivelExperiencia(
  totalAgendamentos: number,
  taxaCancelamento: number,
) {
  if (totalAgendamentos < 5) {
    return "Iniciante";
  }

  if (totalAgendamentos >= 50 && taxaCancelamento <= 5) {
    return "Muito Confiável";
  }

  if (totalAgendamentos >= 30 && taxaCancelamento <= 15) {
    return "Confiável";
  }

  if (totalAgendamentos >= 15 && taxaCancelamento <= 30) {
    return "Experiente";
  }

  if (totalAgendamentos >= 5 && taxaCancelamento <= 40) {
    return "Ocasional";
  }

  return "Iniciante";
}
