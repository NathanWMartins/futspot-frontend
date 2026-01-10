// src/pages/jogador/PerfilJogador.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useNavigate } from "react-router-dom";

import ProfileHeaderCard from "../../components/jogador/perfil/ProfileHeaderCard";
import ProfileTabs from "../../components/jogador/perfil/ProfileTabs";
import ContaSection from "../../components/jogador/perfil/ContaSection";
import EditarPerfilDialog from "../../components/jogador/perfil/EditarPerfilDialog";
import AlterarSenhaDialog from "../../components/jogador/perfil/AlterarSenhaDialog";
import PerfilStatsCard from "../../components/jogador/perfil/PerfilStatsCard";
import { getMeStats, type UserStatsResponse } from "../../services/userService";
import { tempoNoApp } from "../../utils/date";
import { useAuth } from "../../contexts/AuthContext";
import type { UserDTO } from "../../types/perfil";

type SnackState = {
  open: boolean;
  msg: string;
  severity: "success" | "error" | "info";
};

export default function PerfilJogador() {
  const navigate = useNavigate();
  const { user: authUser, token, signOut, signIn, isAuthenticated } = useAuth();

  const [stats, setStats] = useState<UserStatsResponse | null>(null);
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
    if (!isAuthenticated) {
      navigate("/");
      return;
    }

    (async () => {
      try {
        const s = await getMeStats();
        setStats(s);
      } catch (e) {
        console.error(e);
        setStats(null);
      }
    })();
  }, [isAuthenticated, navigate]);

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
      <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", py: 3 }}>
        <Container maxWidth="md">
          <Typography sx={{ opacity: 0.75 }}>Carregando...</Typography>
        </Container>
      </Box>
    );
  }

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
            Perfil
          </Typography>
        </Stack>

        <Stack spacing={2}>
          <ProfileHeaderCard user={user} onEdit={() => setOpenEdit(true)} />
          <ProfileTabs value={tab} onChange={setTab} />

          {tab === 0 ? (
            stats ? (
              <PerfilStatsCard
                totalReservas={stats.totalReservas}
                locaisDiferentes={stats.locaisDiferentes}
                tempoNoAppLabel={tempoNoApp(stats.createdAt)}
              />
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

      <AlterarSenhaDialog open={openSenha} onClose={() => setOpenSenha(false)} />

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
