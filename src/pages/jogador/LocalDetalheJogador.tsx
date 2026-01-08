import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  IconButton,
  Rating,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import LocalFotos from "../../components/jogador/LocalFotos";
import { PriceTag } from "../../components/jogador/PriceTag";
import type { HorarioFuncionamentoDTO, Modalidade } from "../../types/local";
import { getDisponibilidadePorData } from "../../services/locaisService";
import { criarAgendamento } from "../../services/agendamentoService";

type LocalDetalheDTO = {
  id: number;
  nome: string;
  descricao?: string | null;
  endereco?: string | null;
  cidade?: string | null;
  tipoLocal?: Modalidade | null;
  precoHora?: number | null;
  fotos?: string[];
  rating?: number;
  totalAvaliacoes?: number;
  horarios?: HorarioFuncionamentoDTO[];
  slotsDisponiveis?: string[];
};

const labelTipo: Record<string, string> = {
  society: "Society",
  futsal: "Futsal",
  campo: "Campo",
};

export default function LocalDetalheJogador() {
  const { id } = useParams();
  const navigate = useNavigate();

  const location = useLocation();
  const navState = location.state as { local?: any; filtros?: any } | undefined;

  const [data, setData] = useState<string>(navState?.filtros?.data ?? "");
  const [horario, setHorario] = useState<string>("");

  const [local, setLocal] = useState<LocalDetalheDTO | null>(() => {
    const l = navState?.local;
    if (!l) return null;

    return {
      id: l.id,
      nome: l.nome,
      endereco: l.endereco,
      cidade: l.cidade,
      tipoLocal: l.tipoLocal,
      precoHora: l.precoHora,
      fotos: Array.isArray(l.fotos) ? l.fotos : undefined,
      rating: l.rating,
      totalAvaliacoes: l.totalAvaliacoes,
      descricao: l.descricao ?? undefined,
      slotsDisponiveis: l.slotsDisponiveis ?? [],
    };
  });

  const slotsDisponiveis = local?.slotsDisponiveis ?? [];

  const [reservando, setReservando] = useState(false);
  const [carregandoSlots, setCarregandoSlots] = useState(false);

  useEffect(() => {
    const loadSlots = async () => {
      if (!data || !id) return;
      setCarregandoSlots(true);
      
      try {
        const resp = await getDisponibilidadePorData(Number(id), data);
        const slots = Array.isArray(resp?.slotsDisponiveis)
          ? resp.slotsDisponiveis
          : [];

        setLocal((prev) =>
          prev ? { ...prev, slotsDisponiveis: slots } : prev
        );

        setHorario((prev) => (slots.includes(prev) ? prev : ""));
      } catch (e) {
        console.error(e);
        setLocal((prev) => (prev ? { ...prev, slotsDisponiveis: [] } : prev));
        setHorario("");
      }finally{
        setCarregandoSlots(false);
      }
    };

    loadSlots();
  }, [data, id]);

  const handleReservar = async () => {
    if (!local?.id) return;

    if (!data || !horario) {
      alert("Selecione a data e o horário.");
      return;
    }

    try {
      setReservando(true);

      await criarAgendamento({
        localId: local.id,
        data,
        inicio: horario,
      });

      alert("Reserva confirmada!");

      const resp = await getDisponibilidadePorData(local.id, data);

      const slotsDisponiveis = Array.isArray(resp?.slotsDisponiveis)
        ? resp.slotsDisponiveis
            .filter((s: any) => s.status === "livre")
            .map((s: any) => s.inicio)
        : [];

      setLocal((prev) => (prev ? { ...prev, slotsDisponiveis } : prev));
      setHorario("");
    } catch (e: any) {
      console.error(e);

      const status = e?.response?.status;

      if (status === 409) {
        alert("Esse horário já foi reservado. Selecione outro.");
        return;
      }

      if (status === 401) {
        alert("Sua sessão expirou. Faça login novamente.");
        return;
      }

      alert("Não foi possível realizar a reserva. Tente novamente.");
    } finally {
      setReservando(false);
    }
  };

  if (!local) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", py: 3 }}
      >
        <Container maxWidth="md">
          <Typography>Carregando...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", pb: 5 }}>
      <Container maxWidth="md" sx={{ pt: 2 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton
            onClick={() => navigate(-1)}
            sx={{ color: "#fff", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <ArrowBackRoundedIcon />
          </IconButton>

          <Typography sx={{ fontWeight: 900, fontSize: 16 }} noWrap>
            {local.nome}
          </Typography>
        </Stack>

        <LocalFotos fotos={local.fotos ?? []} />

        <Typography sx={{ mt: 2.5, mb: 1, fontWeight: 900, fontSize: 16 }}>
          Informações principais
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
          }}
        >
          <Stack spacing={1.25}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={2}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 18 }} noWrap>
                  {local.nome}
                </Typography>

                {typeof local.rating === "number" &&
                (local.totalAvaliacoes ?? 0) > 0 ? (
                  <Stack
                    direction="row"
                    spacing={0.75}
                    alignItems="center"
                    sx={{ mt: 0.5 }}
                  >
                    <Rating
                      readOnly
                      value={local.rating ?? 0}
                      precision={0.5}
                      size="small"
                      sx={{ color: "#00E676" }}
                    />
                    <Typography sx={{ fontSize: 12, opacity: 0.75 }}>
                      {(local.rating ?? 0).toFixed(1)} ({local.totalAvaliacoes})
                    </Typography>
                  </Stack>
                ) : (
                  <Typography sx={{ fontSize: 12, opacity: 0.6, mt: 0.5 }}>
                    Sem avaliações
                  </Typography>
                )}
              </Box>

              {/* Preço */}
              <Box sx={{ textAlign: "right" }}>
                <Stack
                  direction="row"
                  spacing={0.6}
                  alignItems="flex-start"
                  justifyContent="flex-end"
                >
                  <PriceTag value={180} />
                </Stack>

                {local.tipoLocal ? (
                  <Chip
                    size="small"
                    label={labelTipo[local.tipoLocal]}
                    sx={{
                      mt: 0.75,
                      bgcolor: "rgba(0,230,118,0.18)",
                      border: "1px solid rgba(0,230,118,0.25)",
                      color: "#fff",
                      fontWeight: 900,
                    }}
                  />
                ) : null}
              </Box>
            </Stack>

            <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

            <Typography sx={{ opacity: 0.85, fontSize: 13 }}>
              {local.endereco ?? ""}
            </Typography>

            {local.descricao ? (
              <Typography sx={{ opacity: 0.7, fontSize: 13 }}>
                {local.descricao}
              </Typography>
            ) : null}
          </Stack>
        </Box>

        {/* 3) Agendamento */}
        <Typography sx={{ mt: 2.5, mb: 1, fontWeight: 900, fontSize: 16 }}>
          Agendamento
        </Typography>

        <Box
          sx={{
            p: 2,
            borderRadius: 3,
            border: "1px solid rgba(255,255,255,0.08)",
            bgcolor: "rgba(255,255,255,0.03)",
          }}
        >
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
              {/* Data */}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 0.5 }}>
                  Data
                </Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{
                    border: "1px solid rgba(255,255,255,0.10)",
                    borderRadius: 2,
                    px: 1.25,
                    py: 1,
                    bgcolor: "rgba(255,255,255,0.02)",
                  }}
                >
                  <CalendarMonthRoundedIcon sx={{ opacity: 0.75 }} />
                  <Box
                    component="input"
                    type="date"
                    value={data}
                    onChange={(e) => {
                      setData(e.target.value);
                      setHorario("");
                    }}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      color: "white",
                      fontSize: 14,
                    }}
                  />
                </Stack>
              </Box>

              {/* Horário */}
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 0.5 }}>
                  Horário
                </Typography>

                {!data ? (
                  <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
                    Selecione uma data para ver os horários disponíveis.
                  </Typography>
                ) : carregandoSlots ? (
                  <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
                    Carregando horários...
                  </Typography>
                ) : slotsDisponiveis.length === 0 ? (
                  <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
                    Sem horários disponíveis para este dia.
                  </Typography>
                ) : (
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {slotsDisponiveis.map((slot) => {
                      const selected = horario === slot;
                      return (
                        <Chip
                          key={slot}
                          label={slot}
                          onClick={() => setHorario(slot)}
                          sx={{
                            mb: 1,
                            bgcolor: selected
                              ? "rgba(0,230,118,0.20)"
                              : "rgba(255,255,255,0.04)",
                            border: selected
                              ? "1px solid rgba(0,230,118,0.55)"
                              : "1px solid rgba(255,255,255,0.10)",
                            color: "#fff",
                            fontWeight: 900,
                          }}
                        />
                      );
                    })}
                  </Stack>
                )}
              </Box>
            </Stack>

            {/* Botão */}
            <Button
              fullWidth
              disabled={reservando || !data || !horario}
              onClick={handleReservar}
              sx={{
                bgcolor: "#00E676",
                color: "#0b0b0b",
                fontWeight: 900,
                borderRadius: 2.5,
                py: 1.2,
                opacity: reservando || !data || !horario ? 0.7 : 1,
                "&:hover": { bgcolor: "#00E676" },
              }}
            >
              {reservando ? "Reservando..." : "Reservar"}
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
