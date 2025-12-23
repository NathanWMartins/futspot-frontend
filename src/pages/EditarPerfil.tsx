import { useMemo, useRef, useState } from "react";
import {
    Alert,
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Snackbar,
    Stack,
    TextField,
    Typography,
    useMediaQuery,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import SaveIcon from "@mui/icons-material/Save";
import { useTheme } from "@mui/material/styles";
import HeaderLocador from "../components/locador/HeaderLocador";
import { useAuth } from "../contexts/AuthContext";
import { atualizarPerfil, uploadFotoPerfil } from "../services/userService";

export default function EditarPerfilPage() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const { user, token, signIn } = useAuth();

    const fileRef = useRef<HTMLInputElement | null>(null);

    const firstNameInitial = useMemo(() => {
        const base = user?.nome?.trim()?.[0] ?? user?.email?.[0] ?? "U";
        return base.toUpperCase();
    }, [user?.nome, user?.email]);

    const [nome, setNome] = useState(user?.nome ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [telefone, setTelefone] = useState(user?.telefone ?? "");
    const [fotoPreview, setFotoPreview] = useState<string | null>(user?.fotoUrl || null);
    const [fotoFile, setFotoFile] = useState<File | null>(null);
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [senhaTouched, setSenhaTouched] = useState(false);
    const [confirmTouched, setConfirmTouched] = useState(false);

    const senhasIguais = senha.length === 0 && confirmarSenha.length === 0
        ? true
        : senha === confirmarSenha;

    const mostrarErroSenha = (senhaTouched || confirmTouched) && !senhasIguais;

    const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "success" | "error" }>({
        open: false,
        msg: "",
        severity: "success",
    });

    const showError = (msg: string) => setSnack({ open: true, msg, severity: "error" });
    const showSuccess = (msg: string) => setSnack({ open: true, msg, severity: "success" });

    const handlePickFoto = () => fileRef.current?.click();

    const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setFotoFile(file);
        setFotoPreview(URL.createObjectURL(file));
    };

    const handleSalvar = async () => {
        const senhaTrim = senha.trim();
        const confirmTrim = confirmarSenha.trim();

        const querTrocarSenha = senhaTrim.length > 0 || confirmTrim.length > 0;
        if (querTrocarSenha && senhaTrim !== confirmTrim) {
            showError("As senhas não coincidem.");
            setConfirmTouched(true);
            setSenhaTouched(true);
            return;
        }

        if(telefone == ""){
            showError("O campo telefone não pode estar vazio.");
            return;
        }

        try {
            let fotoUrlFinal: string | undefined;

            if (fotoFile) {
                fotoUrlFinal = await uploadFotoPerfil(fotoFile);
            }

            const payload: any = {
                nome: nome.trim(),
                telefone: telefone.trim(),
            };

            if (fotoUrlFinal) payload.fotoUrl = fotoUrlFinal;
            if (querTrocarSenha && senhaTrim.length > 0) payload.senha = senhaTrim;

            const updatedUser = await atualizarPerfil(payload);

            signIn({ user: updatedUser, token });

            showSuccess("Perfil atualizado com sucesso!");
        } catch (err) {
            console.error(err);
            showError("Erro ao salvar perfil.");
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <HeaderLocador />

            <Box sx={{ maxWidth: 1120, mx: "auto", p: { xs: 2, md: 3 } }}>
                <Typography variant="h5" fontWeight={800}>
                    Editar perfil
                </Typography>
                <Typography sx={{ opacity: 0.7, mt: 0.5 }}>
                    Atualize seus dados e sua foto.
                </Typography>

                <Card
                    sx={{
                        mt: 3,
                        background: "#151515",
                        border: "1px solid rgba(0, 230, 118, 0.15)",
                        borderRadius: 3,
                        overflow: "hidden",
                    }}
                >
                    <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                        <Stack
                            direction={{ xs: "column", md: "row" }}
                            spacing={3}
                            alignItems="stretch"
                        >
                            {/* BLOCO FOTO */}
                            <Box
                                sx={{
                                    width: { xs: "100%", md: 320 },
                                    flexShrink: 0,
                                }}
                            >
                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        bgcolor: "rgba(0,230,118,0.06)",
                                        p: 2,
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        gap: 2,
                                    }}
                                >
                                    <Avatar
                                        src={fotoPreview ?? undefined}
                                        sx={{
                                            width: { xs: 140, md: 200 },
                                            height: { xs: 140, md: 200 },
                                            bgcolor: "#00E676",
                                            boxShadow: "0 0 18px rgba(0, 230, 118, 0.45)",
                                            fontSize: 48,
                                        }}
                                    >
                                        {firstNameInitial}
                                    </Avatar>

                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={handleFotoChange}
                                    />

                                    <Button
                                        variant="outlined"
                                        fullWidth={isMobile}
                                        startIcon={<PhotoCameraIcon />}
                                        sx={{
                                            textTransform: "none",
                                            borderRadius: 10,
                                            borderColor: "rgba(0,230,118,0.45)",
                                            color: "primary.main",
                                        }}
                                        onClick={handlePickFoto}
                                    >
                                        Alterar foto
                                    </Button>
                                </Box>
                            </Box>

                            {/* BLOCO FORM */}
                            <Box sx={{ flex: 1 }}>
                                <Box
                                    sx={{
                                        borderRadius: 3,
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        p: 2,
                                        height: "100%",
                                    }}
                                >
                                    <Typography fontWeight={700} sx={{ mb: 1 }}>
                                        Informações
                                    </Typography>
                                    <Divider sx={{ mb: 2, opacity: 0.15 }} />

                                    <Stack spacing={2}>
                                        <TextField
                                            label="Nome"
                                            value={nome}
                                            onChange={(e) => setNome(e.target.value)}
                                            fullWidth
                                        />
                                        <Stack direction={"row"} spacing={2}>
                                            <TextField
                                                label="E-mail"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                fullWidth
                                                InputProps={{
                                                    readOnly: true,
                                                    sx: {
                                                        color: "text.disabled",
                                                        "& .MuiInputBase-input": {
                                                            WebkitTextFillColor: "rgba(255,255,255,0.45)",
                                                        },
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Telefone"
                                                value={telefone}
                                                onChange={(e) => setTelefone(e.target.value)}
                                                fullWidth
                                            />
                                        </Stack>
                                        <Stack direction={"row"} spacing={2}>
                                            <TextField
                                                label="Senha"
                                                type="password"
                                                value={senha}
                                                onChange={(e) => setSenha(e.target.value)}
                                                onBlur={() => setSenhaTouched(true)}
                                                fullWidth
                                            />

                                            <TextField
                                                label="Confirmar senha"
                                                type="password"
                                                value={confirmarSenha}
                                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                                onBlur={() => setConfirmTouched(true)}
                                                fullWidth
                                                error={mostrarErroSenha}
                                                helperText={
                                                    mostrarErroSenha ? "As senhas não coincidem." : " "
                                                }
                                            />
                                        </Stack>

                                        {/* Botão salvar */}
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 1 }}>
                                            <Button
                                                variant="contained"
                                                startIcon={<SaveIcon />}
                                                sx={{
                                                    textTransform: "none",
                                                    borderRadius: 10,
                                                    px: 2.2,
                                                    boxShadow: "0 0 16px rgba(0, 230, 118, 0.55)",
                                                }}
                                                onClick={handleSalvar}
                                                disabled={!senhasIguais}
                                            >
                                                Salvar
                                            </Button>
                                        </Box>
                                    </Stack>
                                </Box>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>
            </Box>
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
