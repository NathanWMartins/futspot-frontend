import { useEffect, useMemo, useRef, useState } from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloseIcon from "@mui/icons-material/Close";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import { ListItemIcon, ListItemText } from "@mui/material";
import type { TipoLocal } from "../../services/locadoresService";
import { fetchAddressByCep } from "../../services/cepService";
import { isValidCEP } from "../../utils/cep";

export type DiaSemana = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type HorarioDia = {
    diaSemana: DiaSemana;
    aberto: boolean;
    inicio: string;
    fim: string;
};

export type LocalFormValues = {
    id?: number;
    nome: string;
    descricao: string;
    endereco: string;
    numero: string;
    cep: string;
    tipoLocal: TipoLocal;
    precoHora: number;
    fotos: string[];
    horarios: HorarioDia[];
    novasFotos: File[];
    novasFotosPreview: string[];
};

type Props = {
    open: boolean;
    mode: "create" | "edit";
    initial?: Partial<LocalFormValues> | null;
    onClose: () => void;
    onSubmit: (values: LocalFormValues) => Promise<void> | void;
};

const dias: { id: DiaSemana; label: string }[] = [
    { id: 0, label: "Dom" },
    { id: 1, label: "Seg" },
    { id: 2, label: "Ter" },
    { id: 3, label: "Qua" },
    { id: 4, label: "Qui" },
    { id: 5, label: "Sex" },
    { id: 6, label: "Sáb" },
];

function formatTipo(tipo: TipoLocal) {
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
}

function buildDefaultHorarios(initial?: Partial<LocalFormValues> | null): HorarioDia[] {
    const fromInitial = (initial?.horarios as HorarioDia[] | undefined) ?? undefined;
    if (fromInitial?.length) return fromInitial;

    return dias.map((d) => ({
        diaSemana: d.id,
        aberto: d.id !== 0,
        inicio: "10:00",
        fim: "22:00",
    }));
}

function isValidTimeRange(inicio: string, fim: string) {
    return inicio && fim && inicio < fim;
}

export default function LocalDialog({ open, mode, initial, onClose, onSubmit }: Props) {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    const fileRef = useRef<HTMLInputElement | null>(null);

    const defaultValues: LocalFormValues = useMemo(
        () => ({
            id: initial?.id,
            nome: initial?.nome ?? "",
            descricao: initial?.descricao ?? "",
            endereco: initial?.endereco ?? "",
            numero: initial?.numero ?? "",
            cep: initial?.cep ?? "",
            tipoLocal: (initial?.tipoLocal as TipoLocal) ?? "society",
            precoHora: typeof initial?.precoHora === "number" ? initial.precoHora : 0,
            fotos: initial?.fotos ?? [],
            horarios: buildDefaultHorarios(initial ?? null),
            novasFotos: [],
            novasFotosPreview: [],
        }),
        [initial],
    );

    const [values, setValues] = useState<LocalFormValues>(defaultValues);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
    const [saving, setSaving] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);

    useEffect(() => {
        if (!open) return;

        values.novasFotosPreview?.forEach((u) => {
            if (u.startsWith("blob:")) URL.revokeObjectURL(u);
        });

        setValues(defaultValues);
        setSelectedPhotoIndex(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, defaultValues]);

    const allFotos = useMemo(
        () => [...(values.fotos ?? []), ...(values.novasFotosPreview ?? [])],
        [values.fotos, values.novasFotosPreview],
    );

    const fotoPrincipal = allFotos?.[selectedPhotoIndex] || null;
    const title = mode === "create" ? "Cadastrar local" : "Editar local";

    const handleChange = <K extends keyof LocalFormValues>(key: K, val: LocalFormValues[K]) => {
        setValues((prev) => ({ ...prev, [key]: val }));
    };

    const handlePickFile = () => {
        fileRef.current?.click();
    };

    const handleAddPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const previewUrl = URL.createObjectURL(file);

        setValues((prev) => ({
            ...prev,
            novasFotos: [...(prev.novasFotos ?? []), file],
            novasFotosPreview: [...(prev.novasFotosPreview ?? []), previewUrl],
        }));

        setSelectedPhotoIndex(() => {
            const existingCount = values.fotos?.length ?? 0;
            const newCount = (values.novasFotosPreview?.length ?? 0) + 1
            return existingCount + newCount - 1;
        });

        e.target.value = "";
    };

    const handleRemoveSelectedPhoto = () => {
        if (!allFotos?.length) return;

        setValues((prev) => {
            const existingCount = prev.fotos?.length ?? 0;

            if (selectedPhotoIndex < existingCount) {
                const newFotos = prev.fotos.filter((_, i) => i !== selectedPhotoIndex);
                const newAllLen = newFotos.length + (prev.novasFotosPreview?.length ?? 0);
                const newIndex = Math.max(0, Math.min(selectedPhotoIndex, newAllLen - 1));
                setSelectedPhotoIndex(newIndex);

                return { ...prev, fotos: newFotos };
            }

            const offset = selectedPhotoIndex - existingCount;
            const previewToRemove = prev.novasFotosPreview?.[offset];
            if (previewToRemove?.startsWith("blob:")) URL.revokeObjectURL(previewToRemove);

            const newNovasFotos = prev.novasFotos.filter((_, i) => i !== offset);
            const newNovasPreview = prev.novasFotosPreview.filter((_, i) => i !== offset);

            const newAllLen = existingCount + newNovasPreview.length;
            const newIndex = Math.max(0, Math.min(selectedPhotoIndex, newAllLen - 1));
            setSelectedPhotoIndex(newIndex);

            return {
                ...prev,
                novasFotos: newNovasFotos,
                novasFotosPreview: newNovasPreview,
            };
        });
    };

    const setHorario = (dia: DiaSemana, patch: Partial<HorarioDia>) => {
        setValues((prev) => ({
            ...prev,
            horarios: prev.horarios.map((h) => (h.diaSemana === dia ? { ...h, ...patch } : h)),
        }));
    };

    const validate = () => {
        if (!values.nome.trim()) return "Informe o nome do local.";
        if (!values.endereco.trim()) return "Informe o endereço.";
        if (!values.tipoLocal) return "Selecione o tipo do local.";
        if (!values.precoHora || values.precoHora <= 0) return "Informe um preço por hora válido.";

        for (const h of values.horarios) {
            if (!h.aberto) continue;
            if (!h.inicio || !h.fim) return "Preencha início e fim nos dias abertos.";
            if (!isValidTimeRange(h.inicio, h.fim))
                return "Horário inválido: o início precisa ser menor que o fim.";
        }

        return null;
    };

    const handleSubmit = async () => {
        const err = validate();
        if (err) {
            alert(err);
            return;
        }

        try {
            setSaving(true);
            const enderecoFinal = [
                values.endereco,
                values.numero ? `nº ${values.numero}` : "",
                values.cep ? `CEP ${values.cep}` : "",
            ].filter(Boolean).join(" • ");

            const payload = { ...values, endereco: enderecoFinal };
            await onSubmit(payload);


            values.novasFotosPreview?.forEach((u) => {
                if (u.startsWith("blob:")) URL.revokeObjectURL(u);
            });

            onClose();
        } finally {
            setSaving(false);
        }
    };

    const handleFetchCep = async () => {
        if (!isValidCEP(values.cep ?? "")) {
            alert("CEP inválido. Informe 8 dígitos.");
            return;
        }

        try {
            setCepLoading(true);

            const data = await fetchAddressByCep(values.cep);

            const enderecoBase = [
                data.logradouro,
                data.bairro,
                `${data.localidade} - ${data.uf}`,
            ]
                .filter(Boolean)
                .join(", ");

            handleChange("endereco", enderecoBase);
        } catch (error: any) {
            alert(error.message || "Falha ao consultar CEP.");
        } finally {
            setCepLoading(false);
        }
    };



    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullScreen={isMobile}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "#121212",
                    borderRadius: isMobile ? 0 : 3,
                    border: "1px solid rgba(0, 230, 118, 0.15)",
                },
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography fontWeight={800} sx={{ fontSize: 18 }}>
                            {title}
                        </Typography>
                        <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                            {mode === "create"
                                ? "Cadastre o local e defina o horário de funcionamento semanal."
                                : "Atualize dados e horários do seu local."}
                        </Typography>
                    </Box>

                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider sx={{ opacity: 0.08 }} />

            <DialogContent sx={{ pt: 2, px: { xs: 1, sm: 2 }, }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="stretch">
                    {/* COLUNA ESQUERDA — FOTOS */}
                    <Box
                        sx={{
                            width: { xs: "100%", md: 280 },
                            flexShrink: 0,
                        }}
                    >
                        <Box
                            sx={{
                                borderRadius: 3,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,0.08)",
                                background: fotoPrincipal
                                    ? `url(${fotoPrincipal}) center/cover no-repeat`
                                    : "radial-gradient(circle at top, rgba(0,230,118,0.22), #111)",
                                height: 220,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                            }}
                        >
                            {!fotoPrincipal && (
                                <Stack alignItems="center" spacing={1}>
                                    <SportsSoccerIcon sx={{ fontSize: 44, opacity: 0.7 }} />
                                    <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                                        Sem foto cadastrada
                                    </Typography>
                                </Stack>
                            )}

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    position: "absolute",
                                    right: 10,
                                    bottom: 10,
                                }}
                            >
                                <IconButton
                                    onClick={handlePickFile}
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
                                    <AddIcon />
                                </IconButton>

                                <IconButton
                                    onClick={handleRemoveSelectedPhoto}
                                    disabled={!allFotos?.length}
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.08)",
                                        color: "white",
                                        width: 40,
                                        height: 40,
                                        borderRadius: "50%",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.12)" },
                                        "&.Mui-disabled": { opacity: 0.35 },
                                    }}
                                >
                                    <DeleteOutlineIcon />
                                </IconButton>
                            </Stack>

                            <input
                                ref={fileRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleAddPhoto}
                            />
                        </Box>

                        {allFotos?.length > 1 && (
                            <Stack direction="row" spacing={1} sx={{ mt: 1, overflowX: "auto", pb: 0.5 }}>
                                {allFotos.map((url, idx) => (
                                    <Box
                                        key={`${url}-${idx}`}
                                        onClick={() => setSelectedPhotoIndex(idx)}
                                        sx={{
                                            width: 56,
                                            height: 56,
                                            borderRadius: 2,
                                            flexShrink: 0,
                                            cursor: "pointer",
                                            border:
                                                idx === selectedPhotoIndex
                                                    ? "2px solid #00E676"
                                                    : "1px solid rgba(255,255,255,0.10)",
                                            background: `url(${url}) center/cover no-repeat`,
                                        }}
                                    />
                                ))}
                            </Stack>
                        )}
                    </Box>

                    {/* COLUNA DIREITA — CAMPOS */}
                    <Box sx={{ flex: 1, mt: 1 }}>
                        <Stack spacing={2}>
                            <TextField
                                label="Nome do local"
                                value={values.nome}
                                onChange={(e) => handleChange("nome", e.target.value)}
                                fullWidth
                                size="medium"
                            />

                            <TextField
                                label="Descrição"
                                value={values.descricao}
                                onChange={(e) => handleChange("descricao", e.target.value)}
                                fullWidth
                                size="medium"
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    label="CEP"
                                    value={values.cep ?? ""}
                                    onChange={(e) => handleChange("cep", e.target.value)}
                                    fullWidth
                                    size="medium"
                                    placeholder="00000-000"
                                    inputProps={{ inputMode: "numeric" }}
                                />

                                <Button
                                    variant="contained"
                                    onClick={handleFetchCep}
                                    disabled={saving}
                                    sx={{
                                        textTransform: "none",
                                        minWidth: { xs: "100%", sm: 140 },
                                        height: { xs: 44, sm: "auto" },
                                        alignSelf: { xs: "stretch", sm: "center" },
                                    }}
                                >
                                    {cepLoading ? "Buscando..." : "Buscar"}
                                </Button>
                            </Stack>

                            <TextField
                                label="Endereço (rua, bairro, cidade/UF)"
                                value={values.endereco}
                                onChange={(e) => handleChange("endereco", e.target.value)}
                                fullWidth
                                size="medium"
                            />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <TextField
                                    label="Número"
                                    value={values.numero ?? ""}
                                    onChange={(e) => handleChange("numero", e.target.value)}
                                    fullWidth
                                    size="medium"
                                />
                            </Stack>

                            <Stack direction={"row"} spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel id="tipo-local-label">Tipo do local</InputLabel>
                                    <Select
                                        labelId="tipo-local-label"
                                        label="Tipo do local"
                                        value={values.tipoLocal}
                                        onChange={(e) => handleChange("tipoLocal", e.target.value as TipoLocal)}
                                    >
                                        <MenuItem value="society">{formatTipo("society")}</MenuItem>
                                        <MenuItem value="futsal">{formatTipo("futsal")}</MenuItem>
                                        <MenuItem value="campo">{formatTipo("campo")}</MenuItem>
                                    </Select>
                                </FormControl>

                                <TextField
                                    label="Preço por hora (R$)"
                                    type="number"
                                    value={values.precoHora}
                                    onChange={(e) => handleChange("precoHora", Number(e.target.value))}
                                    fullWidth
                                    inputProps={{ min: 0, step: 1 }}
                                />
                            </Stack>

                            <Divider sx={{ opacity: 0.08, my: 0.5 }} />

                            <Typography fontWeight={800} sx={{ fontSize: 14 }}>
                                Horário de funcionamento (semanal)
                            </Typography>

                            <Stack spacing={1}>
                                {dias.map((d) => {
                                    const h = values.horarios.find((x) => x.diaSemana === d.id)!;

                                    return (
                                        <Stack
                                            key={d.id}
                                            direction="row"
                                            spacing={1}
                                            alignItems="center"
                                            sx={{
                                                p: 1,
                                                borderRadius: 2,
                                                border: "1px solid rgba(255,255,255,0.08)",
                                            }}
                                        >
                                            <Box sx={{ width: 46 }}>
                                                <Typography sx={{ fontSize: 13, opacity: 0.85 }}>{d.label}</Typography>
                                            </Box>

                                            <FormControl sx={{
                                                minWidth: isMobile ? 65 : 120,
                                                "& .MuiSelect-select": {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    overflow: "visible",
                                                    textOverflow: "unset",
                                                    paddingRight: "28px",
                                                },
                                            }}>
                                                <Select
                                                    size="small"
                                                    value={h.aberto ? "aberto" : "fechado"}
                                                    onChange={(e) => setHorario(d.id, { aberto: e.target.value === "aberto" })}
                                                    renderValue={(value) => {
                                                        if (!isMobile) return value === "aberto" ? "Aberto" : "Fechado";

                                                        return value === "aberto" ? (
                                                            <CheckCircleRoundedIcon sx={{ color: "#00E676" }} fontSize="small" />
                                                        ) : (
                                                            <CancelRoundedIcon sx={{ color: "rgba(245, 3, 3)" }} fontSize="small" />
                                                        );
                                                    }}
                                                >
                                                    <MenuItem value="aberto">
                                                        <ListItemIcon sx={{ minWidth: 34 }}>
                                                            <CheckCircleRoundedIcon sx={{ color: "#00E676" }} fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Aberto" />
                                                    </MenuItem>

                                                    <MenuItem value="fechado">
                                                        <ListItemIcon sx={{ minWidth: 34 }}>
                                                            <CancelRoundedIcon sx={{ color: "rgba(245, 3, 3)" }} fontSize="small" />
                                                        </ListItemIcon>
                                                        <ListItemText primary="Fechado" />
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>

                                            <TextField
                                                type="time"
                                                size="small"
                                                label="Início"
                                                InputLabelProps={{ shrink: true }}
                                                value={h.inicio}
                                                onChange={(e) => setHorario(d.id, { inicio: e.target.value })}
                                                disabled={!h.aberto}
                                                sx={{ width: 140 }}
                                            />

                                            <TextField
                                                type="time"
                                                size="small"
                                                label="Fim"
                                                InputLabelProps={{ shrink: true }}
                                                value={h.fim}
                                                onChange={(e) => setHorario(d.id, { fim: e.target.value })}
                                                disabled={!h.aberto}
                                                sx={{ width: 140 }}
                                            />
                                        </Stack>
                                    );
                                })}
                            </Stack>
                        </Stack>
                    </Box>
                </Stack>
            </DialogContent>

            <Divider sx={{ opacity: 0.08 }} />

            <DialogActions sx={{ p: 2 }}>
                <Button variant="text" onClick={onClose} sx={{ textTransform: "none" }} disabled={saving}>
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{ textTransform: "none" }}
                    disabled={saving}
                >
                    {saving ? "Salvando..." : "Salvar alterações"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
