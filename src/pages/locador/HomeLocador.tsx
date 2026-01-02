import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Snackbar,
    Stack,
    Typography,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import { listarMeusLocais, type LocalApi } from "../../services/locaisService";
import { atualizarLocal, criarLocal, getOcupacaoDoDia, uploadFoto, type OcupacaoItem } from "../../services/locadoresService";
import { useNavigate } from "react-router-dom";
import { buildDefaultHorarios } from "./LocalLocador";
import DialogEditarLocal, {type LocalFormValues } from "../../components/locador/DialogEditarLocal";
import { useAuth } from "../../contexts/AuthContext";

function formatTipoLocal(tipo: string) {
    const t = (tipo ?? "").toLowerCase();
    if (t === "society") return "Society";
    if (t === "futsal") return "Futsal";
    if (t === "campo") return "Campo";
    return tipo;
}

function formatBRL(value: number) {
    try {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    } catch {
        return `R$ ${value}`;
    }
}

function formatDatePtBR(date = new Date()) {
    return date.toLocaleDateString("pt-BR");
}

function todayISO(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}


export default function LocadorHome() {
    const [locais, setLocais] = useState<LocalApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [ocupacaoByLocalId, setOcupacaoByLocalId] = useState<Record<number, OcupacaoItem>>({});
    const [loadingOcupacao, setLoadingOcupacao] = useState(false);

    const [openDialog, setOpenDialog] = useState(false);
    const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
    const [selectedLocal, setSelectedLocal] = useState<LocalFormValues | null>(null);

    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({
        open: false,
        msg: "",
        severity: "success",
    });    

    const showError = (msg: string) => setSnack({ open: true, msg, severity: "error" });
    const showSuccess = (msg: string) => setSnack({ open: true, msg, severity: "success" });

    const {user} = useAuth();
    const firstName = user?.nome?.trim().split(" ")[0];
    const navigate = useNavigate();

    const resumoHoje = useMemo(() => {
        return {
            data: formatDatePtBR(new Date()),
            locaisCadastrados: locais.length,
        };
    }, [locais.length]);

    async function carregarLocais() {
        setLoading(true);
        setErrorMsg(null);

        try {
            const data = await listarMeusLocais();
            setLocais(data);
        } catch (e: any) {
            const msg =
                e?.response?.data?.message ??
                e?.message ??
                "Erro ao carregar locais.";
            setErrorMsg(msg);
            setLocais([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregarLocais();
        carregarHome();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function carregarHome() {
        setLoading(true);
        setErrorMsg(null);

        try {
            const dataLocais = await listarMeusLocais();
            setLocais(dataLocais);

            setLoadingOcupacao(true);
            const dataISO = todayISO();
            const ocupacaoResp = await getOcupacaoDoDia(dataISO);

            const map: Record<number, OcupacaoItem> = {};
            for (const item of ocupacaoResp.itens ?? []) {
                map[item.localId] = item;
            }
            setOcupacaoByLocalId(map);
        } catch (e: any) {
            const msg = e?.response?.data?.message ?? e?.message ?? "Erro ao carregar dados.";
            setErrorMsg(msg);
            setLocais([]);
            setOcupacaoByLocalId({});
        } finally {
            setLoading(false);
            setLoadingOcupacao(false);
        }
    }

    const openCreate = () => {
        setDialogMode("create");
        setSelectedLocal({
            nome: "",
            endereco: "",
            descricao: "",
            tipoLocal: "society",
            precoHora: 0,
            fotos: [],
            horarios: buildDefaultHorarios(undefined),
            novasFotos: [],
            novasFotosPreview: [],
            numero: "",
            cep: "",
        });
        setOpenDialog(true);
    };

    const handleSubmitDialog = async (values: LocalFormValues): Promise<void> => {
        try {
            const uploadedUrls =
                values.novasFotos?.length
                    ? await Promise.all(values.novasFotos.map(uploadFoto))
                    : [];

            const fotosFinal = [...(values.fotos ?? []), ...uploadedUrls];

            const payload = {
                nome: values.nome,
                descricao: values.descricao,
                endereco: values.endereco,
                tipoLocal: values.tipoLocal,
                precoHora: values.precoHora,
                fotos: fotosFinal,
                horarios: values.horarios,
            };

            const saved =
                dialogMode === "create"
                    ? await criarLocal(payload)
                    : await atualizarLocal(values.id!, payload);

            // cada tela decide como atualizar a lista
            if (dialogMode === "create") setLocais((prev) => [saved, ...prev]);
            else setLocais((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));

            showSuccess(dialogMode === "create" ? "Local cadastrado com sucesso!" : "Local atualizado com sucesso!");
        } catch (err) {
            console.error(err);
            showError("Erro ao salvar local.");
            throw err;
        }
    };

    return (
        <>
            <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
                <Box
                    sx={{
                        maxWidth: 1120,
                        mx: "auto",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                    }}
                >
                    <Box>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h5" fontWeight={700}>
                                Olá, {firstName ?? "Locador"}!
                            </Typography>

                            <WavingHandIcon sx={{ color: "primary.main", fontSize: 30 }} />
                        </Stack>
                        <Typography sx={{ opacity: 0.7, mt: 0.5 }}>
                            Gerencie seus locais e acompanhe sua agenda em um só lugar.
                        </Typography>
                    </Box>

                    {loading && (
                        <Box>
                            <LinearProgress
                                sx={{
                                    height: 8,
                                    borderRadius: 999,
                                    bgcolor: "rgba(255,255,255,0.08)",
                                    "& .MuiLinearProgress-bar": { borderRadius: 999 },
                                }}
                            />
                        </Box>
                    )}

                    {errorMsg && (
                        <Alert
                            severity="error"
                            action={
                                <Button
                                    color="inherit"
                                    size="small"
                                    onClick={carregarLocais}
                                    sx={{ textTransform: "none" }}
                                >
                                    Tentar novamente
                                </Button>
                            }
                        >
                            {errorMsg}
                        </Alert>
                    )}

                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6" fontWeight={600}>
                                Informações
                            </Typography>

                            <Chip
                                icon={<CalendarMonthIcon fontSize="small" />}
                                label={resumoHoje.data}
                                size="small"
                                sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                            />
                        </Stack>

                        <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="flex-end"
                            gap={2}
                        >
                            <Box>
                                <Typography sx={{ opacity: 0.7 }}>
                                    Locais cadastrados
                                </Typography>
                                <Typography
                                    variant="h3"
                                    fontWeight={800}
                                    sx={{ lineHeight: 1, mt: 0.5 }}
                                >
                                    {resumoHoje.locaisCadastrados}
                                </Typography>
                            </Box>

                            <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
                                <Button
                                    variant="contained"
                                    size="small"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 10,
                                        px: 1.6,
                                        boxShadow: "0 0 14px rgba(0, 230, 118, 0.55)",
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={openCreate}
                                >
                                    Novo local
                                </Button>

                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AccessTimeIcon />}
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 10,
                                        px: 1.4,
                                        whiteSpace: "nowrap",
                                    }}
                                    onClick={() => navigate(`/locador/agenda`)}
                                >
                                    Horários
                                </Button>
                            </Stack>
                        </Stack>
                    </CardContent>


                    {/* Lista de locais */}
                    <Card
                        sx={{
                            background: "#151515",
                            border: "1px solid rgba(0, 230, 118, 0.15)",
                        }}
                    >
                        <CardContent>
                            <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={2}
                            >
                                <Typography variant="h6" fontWeight={600}>
                                    Meus locais
                                </Typography>
                            </Stack>

                            {!loading && locais.length === 0 ? (
                                <Box sx={{ py: 4, textAlign: "center", opacity: 0.85 }}>
                                    <Typography>Você ainda não cadastrou nenhum local.</Typography>
                                    <Typography sx={{ fontSize: 14, opacity: 0.7, mt: 0.5 }}>
                                        Cadastre sua primeira quadra para liberar horários e receber reservas.
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        sx={{ mt: 2, textTransform: "none", borderRadius: 10 }}
                                        onClick={() => { }}
                                    >
                                        Cadastrar novo local
                                    </Button>
                                </Box>
                            ) : (
                                <Stack spacing={2}>
                                    {locais.map((local) => {
                                        const fotoCapa = local.fotos?.[0];

                                        const occ = ocupacaoByLocalId[local.id];
                                        const total = occ?.totalSlots ?? 0;
                                        const ocupados = occ?.ocupados ?? 0;
                                        const progress =
                                            occ && !occ.fechado && total > 0
                                                ? Math.round((ocupados / total) * 100)
                                                : 0;

                                        return (
                                            <Box
                                                key={local.id}
                                                sx={{
                                                    p: 2,
                                                    borderRadius: 2,
                                                    background: "#1E1E1E",
                                                    border: "1px solid rgba(0, 230, 118, 0.1)",
                                                    display: "flex",
                                                    flexDirection: { xs: "column", sm: "row" }, // ✅ MOBILE: coluna
                                                    alignItems: { xs: "stretch", sm: "stretch" },
                                                    gap: 2,
                                                }}
                                            >
                                                {/* IMAGEM */}
                                                <Box
                                                    sx={{
                                                        width: { xs: "100%", sm: 120 },              // ✅ mobile ocupa largura total
                                                        height: { xs: 150, sm: "auto" },             // ✅ altura fixa no mobile
                                                        minHeight: { sm: 120 },
                                                        borderRadius: 2,
                                                        overflow: "hidden",
                                                        border: "1px solid rgba(0, 230, 118, 0.18)",
                                                        bgcolor: "rgba(0, 230, 118, 0.06)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        flexShrink: 0,
                                                    }}
                                                >
                                                    {fotoCapa ? (
                                                        <Box
                                                            component="img"
                                                            src={fotoCapa}
                                                            alt={local.nome}
                                                            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                        />
                                                    ) : (
                                                        <SportsSoccerIcon sx={{ color: "primary.main", fontSize: 36 }} />
                                                    )}
                                                </Box>

                                                {/* INFORMAÇÕES */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography fontWeight={700} sx={{ fontSize: 18 }}>
                                                        {local.nome}
                                                    </Typography>

                                                    <Stack
                                                        direction="row"
                                                        spacing={1}
                                                        sx={{ mt: 0.8, alignItems: "center", flexWrap: "wrap" }}
                                                    >
                                                        <Chip
                                                            size="small"
                                                            label={formatTipoLocal(local.tipoLocal)}
                                                            sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                                                        />

                                                        <Typography
                                                            sx={{
                                                                fontSize: 14,
                                                                opacity: 0.75,
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {local.endereco}
                                                        </Typography>
                                                    </Stack>

                                                    <Typography sx={{ fontSize: 14, opacity: 0.85, mt: 1 }}>
                                                        {formatBRL(local.precoHora)} / hora
                                                    </Typography>
                                                </Box>

                                                {/* OCUPAÇÃO + AÇÕES */}
                                                <Box
                                                    sx={{
                                                        width: { xs: "100%", sm: 240 },
                                                        minWidth: { sm: 240 },
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        justifyContent: "center",
                                                        alignItems: { xs: "stretch", sm: "flex-end" },
                                                        gap: 1.2,
                                                        pt: { xs: 1.2, sm: 0 },
                                                        borderTop: { xs: "1px solid rgba(0, 230, 118, 0.12)", sm: "none" },
                                                    }}
                                                >
                                                    {/* Ocupação */}
                                                    <Box sx={{ width: "100%" }}>
                                                        <Stack direction="row" justifyContent="space-between">
                                                            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                                                                Ocupação hoje
                                                            </Typography>

                                                            <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                                                                {!occ ? "—/—" : occ.fechado ? "Fechado" : `${ocupados}/${total} horários`}
                                                            </Typography>
                                                        </Stack>

                                                        <LinearProgress
                                                            variant="determinate"
                                                            value={progress}
                                                            sx={{
                                                                mt: 0.6,
                                                                height: 8,
                                                                borderRadius: 999,
                                                                bgcolor: "rgba(255,255,255,0.08)",
                                                                "& .MuiLinearProgress-bar": {
                                                                    borderRadius: 999,
                                                                    boxShadow: "0 0 14px rgba(0, 230, 118, 0.55)",
                                                                },
                                                            }}
                                                        />

                                                        <Typography sx={{ mt: 0.4, fontSize: 12.5, opacity: 0.65 }}>
                                                            {occ?.fechado ? "Local fechado hoje" : ""}
                                                        </Typography>
                                                    </Box>

                                                    <Stack
                                                        direction={{ xs: "row", sm: "column" }}
                                                        spacing={1}
                                                        sx={{ width: "100%" }}
                                                    >
                                                        <Button
                                                            variant="outlined"
                                                            size="small"
                                                            fullWidth
                                                            sx={{ textTransform: "none", borderRadius: 10 }}
                                                            startIcon={<AccessTimeIcon />}
                                                            onClick={() => navigate(`/locador/agenda`)}
                                                        >
                                                            Ver agenda
                                                        </Button>

                                                        <Button
                                                            variant="text"
                                                            size="small"
                                                            fullWidth
                                                            sx={{ textTransform: "none" }}
                                                            onClick={() => navigate(`/locador/locais`)}
                                                        >
                                                            Ver detalhes
                                                        </Button>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        );
                                    })}


                                </Stack>
                            )}
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            <DialogEditarLocal
                open={openDialog}
                mode={dialogMode}
                initial={selectedLocal}
                onClose={() => setOpenDialog(false)}
                onSubmit={handleSubmitDialog}
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
        </>
    );
}
