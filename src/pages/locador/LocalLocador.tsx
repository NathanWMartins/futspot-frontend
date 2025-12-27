import { useEffect, useState } from "react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    IconButton,
    MobileStepper,
    Snackbar,
    Alert,
    Stack,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PlaceIcon from "@mui/icons-material/Place";
import DialogEditarLocal, { type DiaSemana, type HorarioDia, type LocalFormValues } from "../../components/locador/DialogEditarLocal";
import { api } from "../../services/api";
import { atualizarLocal, criarLocal, uploadFoto, type Local, type TipoLocal } from "../../services/locadoresService";

const dias: { id: DiaSemana; label: string }[] = [
    { id: 0, label: "Dom" },
    { id: 1, label: "Seg" },
    { id: 2, label: "Ter" },
    { id: 3, label: "Qua" },
    { id: 4, label: "Qui" },
    { id: 5, label: "Sex" },
    { id: 6, label: "Sáb" },
];

export function buildDefaultHorarios(fromBackend?: HorarioDia[] | undefined): HorarioDia[] {
    if (fromBackend?.length) return fromBackend;

    return dias.map((d) => ({
        diaSemana: d.id,
        aberto: d.id !== 0,
        inicio: "10:00",
        fim: "22:00",
    }));
}

function LocadorLocais() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [locais, setLocais] = useState<Local[]>([]);
    const [loading, setLoading] = useState(true);

    // modal
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
        });
        setOpenDialog(true);
    };

    const openEdit = (local: Local) => {
        setDialogMode("edit");
        setSelectedLocal({
            id: local.id,
            nome: local.nome,
            descricao: local.descricao,
            endereco: local.endereco,
            tipoLocal: local.tipoLocal,
            precoHora: local.precoHora,
            fotos: local.fotos ?? [],
            horarios: buildDefaultHorarios(local.horarios),
            novasFotos: [],
            novasFotosPreview: [],
        });
        setOpenDialog(true);
    };

    const fetchLocais = async () => {
        try {
            setLoading(true);
            const { data } = await api.get<Local[]>("/locais");
            setLocais(Array.isArray(data) ? data : []);
        } catch (err: any) {
            console.error(err);
            setLocais([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocais();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // carrossel mobile
    const [activeIndex, setActiveIndex] = useState(0);
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchEndX, setTouchEndX] = useState<number | null>(null);

    // se lista mudar, garante índice válido
    useEffect(() => {
        if (activeIndex > locais.length - 1) setActiveIndex(Math.max(0, locais.length - 1));
    }, [locais.length, activeIndex]);

    const handleTouchStart = (e: React.TouchEvent) => setTouchStartX(e.touches[0].clientX);
    const handleTouchMove = (e: React.TouchEvent) => setTouchEndX(e.touches[0].clientX);

    const handleTouchEnd = () => {
        if (touchStartX === null || touchEndX === null) return;

        const diff = touchStartX - touchEndX;
        const SWIPE_THRESHOLD = 50;

        if (diff > SWIPE_THRESHOLD && activeIndex < locais.length - 1) setActiveIndex((prev) => prev + 1);
        else if (diff < -SWIPE_THRESHOLD && activeIndex > 0) setActiveIndex((prev) => prev - 1);

        setTouchStartX(null);
        setTouchEndX(null);
    };

    const formatTipoLocal = (tipo: TipoLocal) => {
        switch (tipo) {
            case "society":
                return "Society";
            case "futsal":
                return "Futsal";
            case "campo":
                return "Campo";
            default:
                return tipo;
        }
    };

    const formatCurrency = (valor: number) =>
        new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
        }).format(valor);

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

    const hasLocais = locais.length > 0;

    return (
        <>
            <Box
                sx={{
                    maxWidth: 1120,
                    mx: "auto",
                    p: 3,
                    pb: 5,
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                {/* LOADING */}
                {loading && (
                    <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
                        <CircularProgress />
                    </Box>
                )}

                {/* SEM LOCAIS */}
                {!loading && !hasLocais && (
                    <Box sx={{ py: 4, textAlign: "center", opacity: 0.9 }}>
                        <Typography>Você ainda não cadastrou nenhum local.</Typography>
                        <Typography sx={{ fontSize: 14, opacity: 0.7, mt: 0.5 }}>
                            Comece cadastrando sua primeira quadra para liberar horários.
                        </Typography>
                        <Button
                            variant="contained"
                            sx={{ mt: 2, textTransform: "none", borderRadius: 10 }}
                            onClick={openCreate}
                        >
                            Cadastrar novo local
                        </Button>
                    </Box>
                )}

                {/* COM LOCAIS */}
                {!loading && hasLocais && (
                    <>
                        {/* Cabeçalho */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mb: 1 }}>
                            <Box>
                                <Typography variant="h6" fontWeight={700}>
                                    Meus locais
                                </Typography>
                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                    {locais.length} {locais.length === 1 ? "local cadastrado" : "locais cadastrados"}
                                </Typography>
                                {isMobile && locais.length > 1 && (
                                    <Typography sx={{ fontSize: 12, opacity: 0.6, mt: 0.3 }}>
                                        Arraste para o lado para ver outros locais.
                                    </Typography>
                                )}
                            </Box>

                            {isMobile ? (
                                <IconButton
                                    onClick={openCreate}
                                    sx={{
                                        bgcolor: "#00E676",
                                        color: "black",
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        boxShadow: "0 0 12px rgba(0, 230, 118, 0.7)",
                                        "&:hover": { bgcolor: "#00c964" },
                                    }}
                                >
                                    +
                                </IconButton>
                            ) : (
                                <Button
                                    variant="contained"
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 10,
                                        px: 3,
                                        boxShadow: "0 0 16px rgba(0, 230, 118, 0.6)",
                                    }}
                                    onClick={openCreate}
                                >
                                    Cadastrar novo local
                                </Button>
                            )}
                        </Stack>

                        {/* DESKTOP */}
                        {!isMobile && (
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "flex-start" }}>
                                {locais.map((local) => {
                                    const fotoPrincipal = local.fotos && local.fotos.length > 0 ? local.fotos[0] : null;

                                    return (
                                        <Card
                                            key={local.id}
                                            sx={{
                                                background: "#151515",
                                                borderRadius: 3,
                                                width: "350px",
                                                border: "1px solid rgba(0, 230, 118, 0.15)",
                                                overflow: "hidden",
                                            }}
                                        >
                                            <CardContent sx={{ p: 0 }}>
                                                <Box
                                                    sx={{
                                                        height: 200,
                                                        background: fotoPrincipal
                                                            ? `url(${fotoPrincipal}) center/cover no-repeat`
                                                            : "radial-gradient(circle at top, #00E67633, #111)",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    {!fotoPrincipal && (
                                                        <Stack alignItems="center" spacing={1}>
                                                            <SportsSoccerIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                                                            <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                                                                Sem foto cadastrada
                                                            </Typography>
                                                        </Stack>
                                                    )}
                                                </Box>

                                                <Box sx={{ p: 2.5 }}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                        <Box sx={{ flex: 1 }}>
                                                            <Typography fontWeight={600}>{local.nome}</Typography>
                                                            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                                                <PlaceIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>{local.endereco}</Typography>
                                                            </Stack>

                                                            <Chip label={formatTipoLocal(local.tipoLocal)} size="small" sx={{ mt: 1 }} />
                                                        </Box>

                                                        <IconButton
                                                            onClick={() => openEdit(local)}
                                                            sx={{
                                                                bgcolor: "#00E676",
                                                                color: "black",
                                                                width: 34,
                                                                height: 34,
                                                                borderRadius: "50%",
                                                                boxShadow: "0 0 12px rgba(0, 230, 118, 0.7)",
                                                                ml: 1,
                                                                "&:hover": { bgcolor: "#00c964" },
                                                            }}
                                                        >
                                                            <EditIcon sx={{ fontSize: 18 }} />
                                                        </IconButton>
                                                    </Stack>

                                                    <Box sx={{ mt: 2 }}>
                                                        <Typography sx={{ fontSize: 13, opacity: 0.7 }}>Preço por hora</Typography>
                                                        <Typography fontWeight={700} sx={{ mt: 0.3 }}>
                                                            {formatCurrency(local.precoHora)}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Box>
                        )}

                        {/* MOBILE – carrossel swipe */}
                        {isMobile && (
                            <Box sx={{ mt: 2 }}>
                                <Box
                                    onTouchStart={handleTouchStart}
                                    onTouchMove={handleTouchMove}
                                    onTouchEnd={handleTouchEnd}
                                    sx={{ overflow: "hidden" }}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            transform: `translateX(-${activeIndex * 100}%)`,
                                            transition: "transform 0.35s ease-out",
                                        }}
                                    >
                                        {locais.map((local) => {
                                            const fotoPrincipal =
                                                local.fotos && local.fotos.length > 0 ? local.fotos[0] : null;

                                            return (
                                                <Box key={local.id} sx={{ flex: "0 0 100%" }}>
                                                    <Box
                                                        sx={{
                                                            height: 200,
                                                            background: fotoPrincipal
                                                                ? `url(${fotoPrincipal}) center/cover no-repeat`
                                                                : "radial-gradient(circle at top, #00E67633, #111)",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                        }}
                                                    >
                                                        {!fotoPrincipal && (
                                                            <Stack alignItems="center" spacing={1}>
                                                                <SportsSoccerIcon sx={{ fontSize: 40, opacity: 0.7 }} />
                                                                <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                                                                    Sem foto cadastrada
                                                                </Typography>
                                                            </Stack>
                                                        )}
                                                    </Box>

                                                    <Card
                                                        sx={{
                                                            borderRadius: "24px 24px 0 0",
                                                            mt: -3,
                                                            pt: 3,
                                                            background: "#151515",
                                                            borderTop: "1px solid rgba(0, 230, 118, 0.25)",
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                                <Box>
                                                                    <Typography fontWeight={600}>{local.nome}</Typography>
                                                                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                                                                        <PlaceIcon sx={{ fontSize: 16, opacity: 0.7 }} />
                                                                        <Typography sx={{ fontSize: 14, opacity: 0.7 }}>{local.endereco}</Typography>
                                                                    </Stack>
                                                                </Box>

                                                                <Chip label={formatTipoLocal(local.tipoLocal)} size="small" />
                                                            </Stack>

                                                            <Box sx={{ mt: 2 }}>
                                                                <Typography sx={{ fontSize: 13, opacity: 0.7 }}>Preço por hora</Typography>
                                                                <Typography fontWeight={700} sx={{ mt: 0.3 }}>
                                                                    {formatCurrency(local.precoHora)}
                                                                </Typography>
                                                            </Box>

                                                            <IconButton
                                                                onClick={() => openEdit(local)}
                                                                sx={{
                                                                    bgcolor: "#00E676",
                                                                    color: "black",
                                                                    width: 40,
                                                                    height: 40,
                                                                    mt: 3,
                                                                    borderRadius: "50%",
                                                                    boxShadow: "0 0 12px rgba(0, 230, 118, 0.7)",
                                                                    "&:hover": { bgcolor: "#00c964" },
                                                                    marginRight: "auto",
                                                                }}
                                                            >
                                                                <EditIcon sx={{ fontSize: 20, opacity: 0.6, color: "black" }} />
                                                            </IconButton>
                                                        </CardContent>
                                                    </Card>
                                                </Box>
                                            );
                                        })}
                                    </Box>
                                </Box>

                                <MobileStepper
                                    variant="dots"
                                    steps={locais.length}
                                    position="static"
                                    activeStep={activeIndex}
                                    nextButton={null}
                                    backButton={null}
                                    sx={{
                                        mt: 1,
                                        bgcolor: "transparent",
                                        "& .MuiMobileStepper-dot": { bgcolor: "rgba(255,255,255,0.3)" },
                                        "& .MuiMobileStepper-dotActive": { bgcolor: "#00E676" },
                                    }}
                                />
                            </Box>
                        )}
                    </>
                )}

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
            </Box>
        </>
    );
}

export default LocadorLocais;
