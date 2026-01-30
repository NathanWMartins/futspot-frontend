import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Avatar,
  Paper,
  IconButton,
} from "@mui/material";
import MarkEmailReadOutlinedIcon from "@mui/icons-material/MarkEmailReadOutlined";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import type { Notificacao } from "../../services/notificacoesService";
import { useNavigate } from "react-router-dom";
import { getNavigatePath } from "../../utils/notificacoesHelpers";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";

interface Props {
  loading: boolean;
  lista: Notificacao[];
  onMarcarComoLida?: (id: string) => void;
}

export default function NotificacoesNaoLidasTab({
  loading,
  lista,
  onMarcarComoLida,
}: Props) {
  const navigate = useNavigate();
  const user = useAuth();
  const [hoverEnabled, setHoverEnabled] = useState(true);

  if (loading) {
    return (
      <Box sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress color="success" />
      </Box>
    );
  }

  if (!lista.length) {
    return (
      <Box
        sx={{
          py: 8,
          textAlign: "center",
          opacity: 0.65,
        }}
      >
        <NotificationsNoneRoundedIcon sx={{ fontSize: 56, mb: 1 }} />
        <Typography fontWeight={900}>Nenhuma notificação nova</Typography>
      </Box>
    );
  }

  const getAvatarPessoa = (n: Notificacao) => {
    switch (n.tipo) {
      case "AGENDAMENTO_ACEITO":
        return n.local;
      case "AGENDAMENTO_RECUSADO":
        return n.local;
      case "AGENDAMENTO_SOLICITADO":
        return n.jogador;
      case "AGENDAMENTO_CANCELADO":
        if (user.user?.tipoUsuario === "jogador") return n.local;
        else return n.jogador;
      default:
        return n.local ?? n.jogador;
    }
  };

  const getIndicadorNotificacao = (tipo: string) => {
    switch (tipo) {
      case "AGENDAMENTO_SOLICITADO":
        return {
          color: "#FFC107",
          bg: "rgba(255,193,7,0.08)",
        };

      case "AGENDAMENTO_ACEITO":
        return {
          color: "#00E676",
          bg: "rgba(0,230,118,0.08)",
        };

      case "AGENDAMENTO_CANCELADO":
      case "AGENDAMENTO_RECUSADO":
        return {
          color: "#FF5252",
          bg: "rgba(255,82,82,0.08)",
        };

      default:
        return {
          color: "transparent",
          bg: "transparent",
        };
    }
  };

  return (
    <Stack spacing={1.2}>
      {lista.map((n) => {
        const pessoa = getAvatarPessoa(n);

        const path = getNavigatePath(n, user.user?.tipoUsuario);

        const clicavel = Boolean(path);
        const indicador = getIndicadorNotificacao(n.tipo);

        return (
          <Paper
            key={n.id}
            onClick={() => {
              if (!clicavel) return;
              navigate(path!);
            }}
            sx={{
              p: 1.2,
              borderRadius: "0 10px 10px 0",
              position: "relative",
              bgcolor: "rgba(255,255,255,0.04)",

              ...(hoverEnabled &&
                clicavel && {
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.2)",
                  },
                }),

              cursor: clicavel ? "pointer" : "default",
              opacity: clicavel ? 1 : 0.75,

              "&::before": indicador.color
                ? {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    ml: -0.2,
                    borderRadius: "10px 0 0 10px",
                    bgcolor: indicador.color,
                  }
                : undefined,
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="flex-start">
              <Avatar
                src={pessoa?.fotoUrl}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: "#1b1b1b",
                  fontWeight: 900,
                }}
              >
                {pessoa?.nome?.[0]}
              </Avatar>

              <Box sx={{ flex: 1 }}>
                <Typography fontWeight={900} fontSize={14}>
                  {n.titulo}
                </Typography>

                {pessoa && (
                  <Typography fontSize={12} sx={{ opacity: 0.7 }}>
                    {pessoa.nome}
                  </Typography>
                )}

                <Typography fontSize={13} sx={{ mt: 0.5, opacity: 0.85 }}>
                  {n.mensagem}{" "}
                  <span style={{ fontWeight: 700 }}>({n.local?.nome}).</span>
                </Typography>
              </Box>

              {onMarcarComoLida && (
                <IconButton
                  disableRipple
                  disableFocusRipple
                  onMouseEnter={() => setHoverEnabled(false)}
                  onMouseLeave={() => setHoverEnabled(true)}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarcarComoLida(n.id);
                  }}
                  sx={{
                    color: "#00E676",
                    border: "1px solid rgba(0,230,118,0.35)",
                    ml: 0.5,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.2)",
                    },
                  }}
                >
                  <MarkEmailReadOutlinedIcon fontSize="small" />
                </IconButton>
              )}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
