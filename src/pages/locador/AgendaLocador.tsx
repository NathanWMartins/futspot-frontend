import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import { api } from "../../services/api";
import { SlotTile } from "../../components/locador/SlotTile";
import type {
  LocalInfo,
  SlotInfo,
} from "../../components/locador/DialogInfoAgendamento";
import SlotInfoDialog from "../../components/locador/DialogInfoAgendamento";
import {
  chipLivre,
  chipOcupado,
  chipSolicitado,
} from "../../utils/ChipsInfoAgendamento";
import { useSearchParams } from "react-router-dom";
import { normalizeHora } from "../../utils/notificacoesHelpers";

type DisponibilidadeResponse = {
  fechado: boolean;
  slots: SlotInfo[];
};

function pad2(n: number) {
  return String(n).padStart(2, "0");
}
function formatDateYYYYMMDD(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}
function formatDateLabel(d: Date) {
  return `${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export default function LocadorAgenda() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [loadingLocais, setLoadingLocais] = useState(true);
  const [locais, setLocais] = useState<LocalInfo[]>([]);
  const [localId, setLocalId] = useState<number | "">("");

  const [date, setDate] = useState<Date>(new Date());
  const [loadingAgenda, setLoadingAgenda] = useState(false);
  const [fechado, setFechado] = useState(false);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [errorAgenda, setErrorAgenda] = useState<string | null>(null);

  const [openSlotDialog, setOpenSlotDialog] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const selectedLocal = useMemo(
    () => locais.find((l) => l.id === localId) ?? null,
    [locais, localId],
  );

  const [searchParams] = useSearchParams();

  const localIdFromUrl = searchParams.get("localId");
  const dataFromUrl = searchParams.get("data");
  const horaFromUrl = searchParams.get("hora");

  const dateLabel = useMemo(() => formatDateLabel(date), [date]);

  const [_, setSearchParams] = useSearchParams();
  const [autoOpened, setAutoOpened] = useState(false);

  const openDialog = (slot: SlotInfo) => {
    setSelectedSlot(slot);
    setOpenSlotDialog(true);
  };

  const closeDialog = () => {
    setOpenSlotDialog(false);
    setSelectedSlot(null);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoadingLocais(true);

        const { data } = await api.get<LocalInfo[]>("/locais");
        const list = Array.isArray(data) ? data : [];
        setLocais(list);

        if (!localIdFromUrl && list.length > 0) {
          setLocalId(list[0].id);
        }
      } catch (e) {
        console.error(e);
        setLocais([]);
      } finally {
        setLoadingLocais(false);
      }
    })();
  }, [localIdFromUrl]);

  useEffect(() => {
    if (!localId) return;

    (async () => {
      try {
        setLoadingAgenda(true);
        setErrorAgenda(null);

        const yyyyMMdd = formatDateYYYYMMDD(date);

        const { data } = await api.get<DisponibilidadeResponse>(
          `/locais/${localId}/disponibilidade`,
          { params: { data: yyyyMMdd } },
        );

        setFechado(!!data?.fechado);
        setSlots(Array.isArray(data?.slots) ? data.slots : []);
      } catch (e: any) {
        console.error(e);
        setErrorAgenda("Erro ao carregar a agenda do dia.");
        setFechado(false);
        setSlots([]);
      } finally {
        setLoadingAgenda(false);
      }
    })();
  }, [localId, date]);

  useEffect(() => {
    if (!localIdFromUrl || locais.length === 0) return;

    const parsedId = Number(localIdFromUrl);
    if (Number.isNaN(parsedId)) return;

    const existe = locais.some((l) => l.id === parsedId);
    if (existe) {
      setLocalId(parsedId);
    }
  }, [localIdFromUrl, locais]);

  useEffect(() => {
    if (!dataFromUrl) return;

    const [year, month, day] = dataFromUrl.split("-").map(Number);

    const parsed = new Date(year, month - 1, day);

    setDate(parsed);
  }, [dataFromUrl]);

  useEffect(() => {
    if (autoOpened) return;
    if (!horaFromUrl) return;
    if (!slots.length) return;
    if (!localId) return;

    const horaNormalizada = normalizeHora(horaFromUrl);

    const slot = slots.find((s) => s.inicio === horaNormalizada);

    if (slot) {
      setSelectedSlot(slot);
      setOpenSlotDialog(true);
      setAutoOpened(true);
    }
  }, [horaFromUrl, slots, localId, autoOpened]);

  useEffect(() => {
    if (openSlotDialog) {
      setSearchParams({});
    }
  }, [openSlotDialog]);

  return (
    <>
      <Box sx={{ px: { xs: 1.5, sm: 15 }, py: 3 }}>
        <Stack spacing={2}>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 900 }}>
              Agenda
            </Typography>
            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
              Selecione um local e veja os slots do dia.
            </Typography>
          </Box>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            <CardContent>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
                justifyContent="space-between"
              >
                <FormControl
                  fullWidth={isMobile}
                  sx={{ minWidth: { sm: 260 } }}
                >
                  <InputLabel id="local-label">Local</InputLabel>
                  <Select
                    labelId="local-label"
                    label="Local"
                    value={localId}
                    onChange={(e) => setLocalId(e.target.value as number)}
                    disabled={loadingLocais || locais.length === 0}
                  >
                    {locais.map((l) => (
                      <MenuItem key={l.id} value={l.id}>
                        {l.nome}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  justifyContent={isMobile ? "center" : "flex-end"}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setDate((d) => addDays(d, -1))}
                    sx={{
                      minWidth: 44,
                      px: 1,
                      color: "#ffffff8c",
                      borderColor: "#ffffff8c",
                    }}
                  >
                    <ChevronLeftRoundedIcon />
                  </Button>

                  <Button
                    variant="outlined"
                    startIcon={<TodayRoundedIcon />}
                    onClick={() => setDate(new Date())}
                    sx={{
                      textTransform: "none",
                      color: "#ffffff",
                      borderColor: "#ffffff8c",
                    }}
                    color="inherit"
                  >
                    {dateLabel}
                  </Button>

                  <Button
                    variant="outlined"
                    onClick={() => setDate((d) => addDays(d, 1))}
                    sx={{
                      minWidth: 44,
                      px: 1,
                      color: "#ffffff8c",
                      borderColor: "#ffffff8c",
                    }}
                  >
                    <ChevronRightRoundedIcon />
                  </Button>
                </Stack>
              </Stack>

              <Divider sx={{ my: 2, opacity: 0.08 }} />

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                  {selectedLocal ? selectedLocal.endereco : "—"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Card
            sx={{
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <CardContent>
              {loadingAgenda ? (
                <Stack alignItems="center" py={4}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1, fontSize: 13, opacity: 0.7 }}>
                    Carregando agenda...
                  </Typography>
                </Stack>
              ) : errorAgenda ? (
                <Stack alignItems="center" py={4}>
                  <Typography sx={{ fontSize: 14 }}>{errorAgenda}</Typography>
                </Stack>
              ) : !localId ? (
                <Stack alignItems="center" py={4}>
                  <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
                    Selecione um local para ver a agenda.
                  </Typography>
                </Stack>
              ) : fechado ? (
                <Stack alignItems="center" py={4}>
                  <Typography sx={{ fontSize: 14, fontWeight: 900 }}>
                    Fechado neste dia
                  </Typography>
                  <Typography sx={{ fontSize: 13, opacity: 0.7, mt: 0.5 }}>
                    Ajuste o horário de funcionamento no cadastro do local.
                  </Typography>
                </Stack>
              ) : slots.length === 0 ? (
                <Stack alignItems="center" py={4}>
                  <Typography sx={{ fontSize: 14, opacity: 0.8 }}>
                    Nenhum slot disponível para este dia.
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={1}>
                  {isMobile ? (
                    // MOBILE
                    <Stack spacing={1}>
                      {slots.map((s) => (
                        <Box
                          key={`${s.inicio}-${s.fim}`}
                          sx={{
                            borderRadius: 2.5,
                            border: "1px solid rgba(255,255,255,0.08)",
                            p: 1.25,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            gap: 1,
                            cursor: "pointer",
                          }}
                          onClick={() => openDialog(s)}
                        >
                          <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                            {s.inicio} – {s.fim}
                          </Typography>

                          {s.status === "livre"
                            ? chipLivre()
                            : s.status === "solicitado"
                              ? chipSolicitado()
                              : chipOcupado()}
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    // DESKTOP
                    <Box
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fill, minmax(110px, 1fr))",
                        gap: 1,
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: 12,
                          opacity: 0.7,
                          gridColumn: "1 / -1",
                        }}
                      >
                        Clique nos slots para ver detalhes.
                      </Typography>
                      {slots.map((s) => (
                        <SlotTile
                          key={`${s.inicio}-${s.fim}`}
                          inicio={s.inicio}
                          status={s.status}
                          onSelect={() => openDialog(s)}
                        />
                      ))}
                    </Box>
                  )}
                </Stack>
              )}
            </CardContent>
          </Card>
        </Stack>
      </Box>
      <SlotInfoDialog
        open={openSlotDialog}
        onClose={closeDialog}
        slot={selectedSlot}
        local={selectedLocal}
      />
    </>
  );
}
