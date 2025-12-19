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
    Chip,
    useMediaQuery,
    useTheme,
} from "@mui/material";

import ChevronLeftRoundedIcon from "@mui/icons-material/ChevronLeftRounded";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import TodayRoundedIcon from "@mui/icons-material/TodayRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import EventBusyRoundedIcon from "@mui/icons-material/EventBusyRounded";
import LockRoundedIcon from "@mui/icons-material/LockRounded";

import { api } from "../../services/api"; // ajuste se precisar
import HeaderLocador from "../../components/locador/HeaderLocador";
import { SlotTile } from "../../components/locador/SlotTile";

type TipoLocal = "society" | "futsal" | "campo";

type LocalResumo = {
    id: number;
    nome: string;
    endereco: string;
    tipoLocal: TipoLocal;
};

type SlotStatus = "livre" | "ocupado";

type Slot = {
    inicio: string; // "10:00"
    fim: string;    // "11:00"
    status: SlotStatus;
    reservadoPor?: string;
};

type DisponibilidadeResponse = {
    fechado: boolean;
    slots: Slot[];
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

function chipLivre() {
    return (
        <Chip
            size="small"
            icon={<CheckCircleRoundedIcon />}
            label="Livre"
            sx={{ bgcolor: "rgba(0,230,118,0.14)", color: "#00E676" }}
        />
    );
}
function chipOcupado() {
    return (
        <Chip
            size="small"
            icon={<EventBusyRoundedIcon />}
            label="Ocupado"
            sx={{ bgcolor: "rgba(255,82,82,0.14)", color: "#ff5252" }}
        />
    );
}
function chipFechado() {
    return (
        <Chip
            size="small"
            icon={<LockRoundedIcon />}
            label="Fechado"
            sx={{ bgcolor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.75)" }}
        />
    );
}

export default function LocadorAgenda() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Etapa 1: listar locais (resumo)
    const [loadingLocais, setLoadingLocais] = useState(true);
    const [locais, setLocais] = useState<LocalResumo[]>([]);
    const [localId, setLocalId] = useState<number | "">("");

    // Etapa 2: disponibilidade do local selecionado
    const [date, setDate] = useState<Date>(new Date());
    const [loadingAgenda, setLoadingAgenda] = useState(false);
    const [fechado, setFechado] = useState(false);
    const [slots, setSlots] = useState<Slot[]>([]);
    const [errorAgenda, setErrorAgenda] = useState<string | null>(null);

    const selectedLocal = useMemo(
        () => locais.find((l) => l.id === localId) ?? null,
        [locais, localId]
    );

    useEffect(() => {
        (async () => {
            try {
                setLoadingLocais(true);

                const { data } = await api.get<LocalResumo[]>("/locais");

                const list = Array.isArray(data) ? data : [];
                setLocais(list);

                if (list.length > 0) setLocalId(list[0].id);
            } catch (e) {
                console.error(e);
                setLocais([]);
            } finally {
                setLoadingLocais(false);
            }
        })();
    }, []);

    useEffect(() => {
        if (!localId) return;

        (async () => {
            try {
                setLoadingAgenda(true);
                setErrorAgenda(null);

                const yyyyMMdd = formatDateYYYYMMDD(date);

                const { data } = await api.get<DisponibilidadeResponse>(
                    `/locais/${localId}/disponibilidade`,
                    { params: { data: yyyyMMdd } }
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

    const dateLabel = useMemo(() => formatDateLabel(date), [date]);

    return (
        <>
            <HeaderLocador />
            <Box sx={{ px: { xs: 1.5, sm: 3 }, py: 2 }}>
                <Stack spacing={2}>
                    <Box>
                        <Typography sx={{ fontSize: 18, fontWeight: 900 }}>Agenda</Typography>
                        <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                            Selecione um local e veja os slots do dia (1h).
                        </Typography>
                    </Box>

                    {/* Filtros */}
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
                                <FormControl fullWidth={isMobile} sx={{ minWidth: { sm: 260 } }}>
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

                                <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
                                    <Button
                                        variant="outlined"
                                        onClick={() => setDate((d) => addDays(d, -1))}
                                        sx={{ minWidth: 44, px: 1 }}
                                    >
                                        <ChevronLeftRoundedIcon />
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<TodayRoundedIcon />}
                                        onClick={() => setDate(new Date())}
                                        sx={{ textTransform: "none" }}
                                    >
                                        {dateLabel}
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        onClick={() => setDate((d) => addDays(d, 1))}
                                        sx={{ minWidth: 44, px: 1 }}
                                    >
                                        <ChevronRightRoundedIcon />
                                    </Button>
                                </Stack>
                            </Stack>

                            <Divider sx={{ my: 2, opacity: 0.08 }} />

                            <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                                <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                                    {selectedLocal ? selectedLocal.endereco : "—"}
                                </Typography>

                                {fechado ? chipFechado() : null}
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Conteúdo */}
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
                                        // 📱 MOBILE: lista (mantém como estava)
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
                                                    }}
                                                >
                                                    <Typography sx={{ fontWeight: 900, fontSize: 14 }}>
                                                        {s.inicio} – {s.fim}
                                                    </Typography>

                                                    {s.status === "livre" ? chipLivre() : chipOcupado()}
                                                </Box>
                                            ))}
                                        </Stack>
                                    ) : (
                                        // DESKTOP
                                        <Box
                                            sx={{
                                                display: "grid",
                                                gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
                                                gap: 1,
                                            }}
                                        >
                                            {slots.map((s) => (
                                                <SlotTile
                                                    key={`${s.inicio}-${s.fim}`}
                                                    inicio={s.inicio}
                                                    fim={s.fim}
                                                    status={s.status}
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
        </>
    );
}
