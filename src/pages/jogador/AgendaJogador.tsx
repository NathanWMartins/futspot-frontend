import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Container,
  IconButton,
  Snackbar,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import { useNavigate } from "react-router-dom";

import type {
  AgendamentoCardDTO,
  AgendaResponse,
} from "../../types/agendamento";
import {
  cancelarAgendamento,
  getMinhaAgenda,
} from "../../services/agendamentoService";
import { criarAvaliacao } from "../../services/avaliacaoService";

import AgendaProximosTab from "../../components/jogador/agenda/AgendaProximosTab";
import AgendaHistoricoTab from "../../components/jogador/agenda/AgendaHistoricoTab";
import AvaliarDialog from "../../components/jogador/agenda/AvaliarDialog";
import CancelarDialog from "../../components/jogador/agenda/CancelarDialog";

export default function AgendaJogador() {
  const navigate = useNavigate();

  const [aba, setAba] = useState<0 | 1>(0);
  const [agenda, setAgenda] = useState<AgendaResponse>({
    proximos: [],
    historico: [],
  });
  const [loading, setLoading] = useState(true);

  // snack
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

  // avaliar
  const [openAvaliar, setOpenAvaliar] = useState(false);
  const [avaliando, setAvaliando] = useState(false);
  const [agSelecionado, setAgSelecionado] = useState<AgendamentoCardDTO | null>(
    null
  );
  const [nota, setNota] = useState<number | null>(5);
  const [comentario, setComentario] = useState("");

  // cancelar
  const [openCancelar, setOpenCancelar] = useState(false);
  const [cancelando, setCancelando] = useState(false);
  const [agParaCancelar, setAgParaCancelar] =
    useState<AgendamentoCardDTO | null>(null);

  const listaProximos = useMemo(() => agenda.proximos, [agenda]);
  const listaHistorico = useMemo(() => agenda.historico, [agenda]);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getMinhaAgenda();
      setAgenda(data);
    } catch (e) {
      console.error(e);
      setAgenda({ proximos: [], historico: [] });
      showError("Não foi possível carregar sua agenda.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCancelar = (ag: AgendamentoCardDTO) => {
    setAgParaCancelar(ag);
    setOpenCancelar(true);
  };

  const confirmarCancelar = async () => {
    if (!agParaCancelar) return;
    try {
      setCancelando(true);
      await cancelarAgendamento(agParaCancelar.id);
      setOpenCancelar(false);
      setAgParaCancelar(null);
      await load();
      showSuccess("Agendamento cancelado.");
    } catch (e: any) {
      console.error(e);
      const status = e?.response?.status;
      if (status === 401)
        return showError("Sessão expirada. Faça login novamente.");
      showError("Não foi possível cancelar.");
    } finally {
      setCancelando(false);
    }
  };

  const onAvaliar = (ag: AgendamentoCardDTO) => {
    setAgSelecionado(ag);
    setNota(ag.avaliacao?.nota ?? 5);
    setComentario(ag.avaliacao?.comentario ?? "");
    setOpenAvaliar(true);
  };

  const enviarAvaliacao = async () => {
    if (!agSelecionado) return;
    const notaFinal = typeof nota === "number" ? nota : 0;

    if (notaFinal < 0 || notaFinal > 5)
      return showError("Selecione uma nota entre 0 e 5.");

    try {
      setAvaliando(true);
      await criarAvaliacao({
        agendamentoId: agSelecionado.id,
        nota: notaFinal,
        comentario: comentario.trim() ? comentario.trim() : null,
      });

      setOpenAvaliar(false);
      setAgSelecionado(null);
      await load();
      showSuccess("Avaliação enviada!");
    } catch (e: any) {
      console.error(e);
      const status = e?.response?.status;
      if (status === 409) {
        showError("Este agendamento já foi avaliado.");
        await load();
        return;
      }
      if (status === 400)
        return showError(
          e?.response?.data?.message ?? "Não foi possível avaliar."
        );
      if (status === 401)
        return showError("Sessão expirada. Faça login novamente.");
      showError("Erro ao enviar avaliação.");
    } finally {
      setAvaliando(false);
    }
  };

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
            Minha agenda
          </Typography>
        </Stack>

        {/* Segmented tabs */}
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
                  <EventAvailableRoundedIcon fontSize="small" />
                  <span>Próximos</span>
                </Stack>
              }
            />
            <Tab
              value={1}
              label={
                <Stack direction="row" spacing={0.8} alignItems="center">
                  <HistoryRoundedIcon fontSize="small" />
                  <span>Histórico</span>
                </Stack>
              }
            />
          </Tabs>
        </Box>

        {aba === 0 ? (
          <AgendaProximosTab
            loading={loading}
            lista={listaProximos}
            onCancelar={onCancelar}
          />
        ) : (
          <AgendaHistoricoTab
            loading={loading}
            lista={listaHistorico}
            onAvaliar={onAvaliar}
          />
        )}
      </Container>

      <AvaliarDialog
        open={openAvaliar}
        loading={avaliando}
        localNome={agSelecionado?.localNome}
        nota={nota}
        comentario={comentario}
        onClose={() => setOpenAvaliar(false)}
        onChangeNota={setNota}
        onChangeComentario={setComentario}
        onSubmit={enviarAvaliacao}
      />

      <CancelarDialog
        open={openCancelar}
        loading={cancelando}
        ag={agParaCancelar}
        onClose={() => setOpenCancelar(false)}
        onConfirm={confirmarCancelar}
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
