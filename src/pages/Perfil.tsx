// src/pages/jogador/PerfilJogador.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  Divider,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

import ProfileHeaderCard from "../components/jogador/perfil/ProfileHeaderCard";
import ProfileTabs from "../components/jogador/perfil/ProfileTabs";
import ContaSection from "../components/jogador/perfil/ContaSection";
import EditarPerfilDialog from "../components/jogador/perfil/EditarPerfilDialog";
import AlterarSenhaDialog from "../components/jogador/perfil/AlterarSenhaDialog";
import {
  getJogadorStats,
  getLocadorStats,
  type LocadorStatsResponse,
  type UserStatsResponse,
} from "../services/userService";
import { tempoNoApp } from "../utils/date";
import { useAuth } from "../contexts/AuthContext";
import type { UserDTO } from "../types/perfil";
import StatCard from "../components/jogador/StatCard";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import StarIcon from "@mui/icons-material/Star";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";
import EventAvailableOutlinedIcon from '@mui/icons-material/EventAvailableOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

type SnackState = {
  open: boolean;
  msg: string;
  severity: "success" | "error" | "info";
};

export default function Perfil() {
  const navigate = useNavigate();
  const { user: authUser, token, signOut, signIn, isAuthenticated } = useAuth();

  const [stats, setStats] = useState<
    UserStatsResponse | LocadorStatsResponse | null
  >();
  const [tab, setTab] = useState<0 | 1>(0);

  const [openEdit, setOpenEdit] = useState(false);
  const [openSenha, setOpenSenha] = useState(false);

  const [snack, setSnack] = useState<SnackState>({
    open: false,
    msg: "",
    severity: "info",
  });

  const show = (msg: string, severity: SnackState["severity"]) =>
    setSnack({ open: true, msg, severity });

  const user: UserDTO | null = useMemo(() => {
    if (!authUser) return null;

    return {
      id: authUser.id,
      nome: authUser.nome ?? "",
      email: authUser.email,
      telefone: authUser.telefone ?? "",
      fotoUrl: authUser.fotoUrl ?? "",
      tipoUsuario: authUser.tipoUsuario,
    } as any;
  }, [authUser]);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        if (user.tipoUsuario === "jogador") {
          const s = await getJogadorStats();
          console.log(s);
          setStats(s);
        }

        if (user.tipoUsuario === "locador") {
          const s = await getLocadorStats();
          setStats(s);
        }
      } catch (e) {
        console.error(e);
        setStats(null);
      }
    })();
  }, [isAuthenticated, user, navigate]);

  const logout = () => {
    signOut();
    show("Você saiu da conta.", "success");
    navigate("/");
  };

  const deleteAccount = () => {
    alert("Excluir conta (implementar com confirmação + API).");
  };

  if (!user) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", py: 3 }}
      >
        <Container maxWidth="md">
          <Typography sx={{ opacity: 0.75 }}>Carregando...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", color: "#fff", pb: 6 }}>
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 900, fontSize: 16 }} noWrap>
            Perfil
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <ProfileHeaderCard user={user} onEdit={() => setOpenEdit(true)} />
          <ProfileTabs value={tab} onChange={setTab} />

          {tab === 0 ? (
            stats ? (
              <PerfilStatsSection user={user} stats={stats} />
            ) : (
              <Typography sx={{ opacity: 0.75, mt: 1 }}>
                Carregando estatísticas...
              </Typography>
            )
          ) : (
            <ContaSection
              onOpenDados={() => setOpenEdit(true)}
              onOpenSenha={() => setOpenSenha(true)}
              onLogout={logout}
              onDelete={deleteAccount}
            />
          )}
        </Stack>
      </Container>

      <EditarPerfilDialog
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        user={user}
        onSaved={(updatedAuthUser: any) => {
          signIn({ user: updatedAuthUser, token });
          show("Dados atualizados.", "success");
          setOpenEdit(false);
        }}
      />

      <AlterarSenhaDialog
        open={openSenha}
        onClose={() => setOpenSenha(false)}
      />

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

function PerfilStatsSection({ user, stats }: { user: any; stats: any }) {
  if (!stats) {
    return (
      <Typography sx={{ opacity: 0.75, mt: 1 }}>
        Carregando estatísticas...
      </Typography>
    );
  }

  if (user.tipoUsuario === "jogador") {
    return (
      <>
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
              stats.mediaAvaliacoes === null ? (
                "Ainda não avaliou"
              ) : (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography sx={{ fontWeight: 700 }}>
                    {stats.mediaAvaliacoes}
                  </Typography>

                  <StarIcon
                    sx={{ fontSize: 16, color: "#fff", opacity: 0.8 }}
                  />

                  <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                    {"(" + stats.totalAvaliacoes}{" "}
                    {stats.totalAvaliacoes === 1 ? "avaliação)" : "avaliações)"}
                  </Typography>
                </Stack>
              )
            }
            icon={
              <StarIcon
                sx={{
                  fontSize: 18,
                  color:
                    stats.mediaAvaliacoes === null ? "opacity.5" : "#FFD700",
                }}
              />
            }
            highlight={stats.mediaAvaliacoes !== null}
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
            label="Tempo no App"
            value={tempoNoApp(stats.createdAt)}
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Agendamentos realizados"
            value={stats.totalReservas}
            icon={<EventAvailableIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Locais Diferentes"
            value={stats.locaisDiferentes}
            icon={<PlaceOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Taxa de cancelamento"
            value={`${stats.taxaCancelamento}%`}
            icon={<CancelOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Comportamento"
            value={stats.comportamento}
            highlight
            icon={<VerifiedUserIcon sx={{ fontSize: 18, color: "#00E676" }} />}
          />
        </Stack>
      </>
    );
  }

  if (user.tipoUsuario === "locador") {
    return (
      <>
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
            label="Avaliações recebidas"
            value={
              stats.mediaAvaliacoes === null ? (
                "Ainda não avaliou"
              ) : (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Typography sx={{ fontWeight: 700 }}>
                    {stats.mediaAvaliacoes}
                  </Typography>

                  <StarIcon
                    sx={{ fontSize: 16, color: "#fff", opacity: 0.8 }}
                  />

                  <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                    {"(" + stats.totalAvaliacoes}{" "}
                    {stats.totalAvaliacoes === 1 ? "avaliação)" : "avaliações)"}
                  </Typography>
                </Stack>
              )
            }
            icon={
              <StarIcon
                sx={{
                  fontSize: 18,
                  color:
                    stats.mediaAvaliacoes === null ? "opacity.5" : "#FFD700",
                }}
              />
            }
            highlight={stats.mediaAvaliacoes !== null}
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
            label="Tempo no app"
            value={tempoNoApp(stats.createdAt)}
            icon={<AccessTimeRoundedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Locais cadastrados"
            value={stats.locaisCadastrados}
            icon={<PlaceOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Reservas recebidas"
            value={stats.totalReservas}
            icon={<EventAvailableOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Faturamento total"
            value={stats.totalFaturamento}
            icon={<MonetizationOnOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Taxa de cancelamento"
            value={`${stats.taxaCancelamento}%`}
            icon={<CancelOutlinedIcon sx={{ fontSize: 18, opacity: 0.6 }} />}
          />
          <Divider sx={{ my: 1 }} />
          <StatCard
            label="Comportamento"
            value={stats.comportamento}
            highlight
            icon={<VerifiedUserIcon sx={{ fontSize: 18, color: "#00E676" }} />}
          />
        </Stack>
      </>
    );
  }

  return null;
}
