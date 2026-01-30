import {
  Box,
  CircularProgress,
  Stack,
  Typography,
  Avatar,
  Paper,
} from "@mui/material";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import NotificationsOffRoundedIcon from "@mui/icons-material/NotificationsOffRounded";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";
import type { Notificacao } from "../../services/notificacoesService";
import { getNavigatePath } from "../../utils/notificacoesHelpers";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

interface Props {
  loading: boolean;
  lista: Notificacao[];
}

export default function NotificacoesLidasTab({ loading, lista }: Props) {
  const navigate = useNavigate();
  const user = useAuth();

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
          opacity: 0.55,
        }}
      >
        <NotificationsOffRoundedIcon sx={{ fontSize: 56, mb: 1 }} />
        <Typography fontWeight={900}>Nenhuma notificação lida</Typography>
        <Typography fontSize={13}>
          Quando você ler algo, aparece aqui
        </Typography>
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

  return (
    <Stack spacing={1.1}>
      {lista.map((n) => {
        const pessoa = getAvatarPessoa(n);

        const path = getNavigatePath(n, user.user?.tipoUsuario);

        const clicavel = Boolean(path);

        return (
          <Paper
            key={n.id}
            onClick={() => {
              if (!clicavel) return;
              navigate(path!);
            }}
            sx={{
              p: 1.2,
              borderRadius: 3,
              bgcolor: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              opacity: 0.75,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.04)",
              },
              cursor: "pointer",
            }}
          >
            <Stack direction="row" spacing={1.2} alignItems="flex-start">
              <Avatar
                src={pessoa?.fotoUrl}
                sx={{
                  width: 42,
                  height: 42,
                  bgcolor: "#1b1b1b",
                  fontWeight: 900,
                  filter: "grayscale(20%)",
                }}
              >
                {pessoa?.nome?.[0]}
              </Avatar>

              {/* CONTEÚDO + ÍCONE */}
              <Stack
                direction="row"
                spacing={1}
                alignItems="flex-start"
                sx={{ flex: 1 }}
                justifyContent="space-between"
              >
                {/* TEXTO */}
                <Box>
                  <Typography fontWeight={900} fontSize={14}>
                    {n.titulo}
                  </Typography>

                  {pessoa && (
                    <Typography fontSize={12} sx={{ opacity: 0.6 }}>
                      {pessoa.nome}
                    </Typography>
                  )}

                  <Typography fontSize={13} sx={{ mt: 0.4, opacity: 0.7 }}>
                    {n.mensagem}
                  </Typography>

                  <Typography fontSize={11} sx={{ mt: 0.5, opacity: 0.45 }}>
                    {dayjs(n.criadaEm).fromNow()}
                  </Typography>
                </Box>

                <DoneAllRoundedIcon
                  sx={{
                    fontSize: 18,
                    color: "#01c563",
                    opacity: 0.85,
                    mt: 0.3,
                    flexShrink: 0,
                    pr: 2
                  }}
                />
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
