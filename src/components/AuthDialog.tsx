import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Tabs,
    Tab,
    Box,
    TextField,
    Button,
    ToggleButtonGroup,
    ToggleButton,
    Stack,
    Snackbar,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { extractToken, loginRequest, registerRequest } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";


type AuthDialogProps = {
    open: boolean;
    onClose: () => void;
};

export const AuthDialog: React.FC<AuthDialogProps> = ({ open, onClose }) => {
    const [tab, setTab] = useState<"login" | "register">("login");
    const [tipoUsuario, setTipoUsuario] = useState<"cliente" | "dono">("cliente");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [nome, setNome] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const navigate = useNavigate();


    const handleTabChange = (_: React.SyntheticEvent, newValue: "login" | "register") => {
        if (newValue) setTab(newValue);
    };

    const handleTipoChange = (_: React.MouseEvent<HTMLElement>, newTipo: "cliente" | "dono" | null) => {
        if (newTipo) setTipoUsuario(newTipo);
    };

    const showError = (msg: string) => {
        setSnackbarMessage(msg);
        setSnackbarOpen(true);
    };

    const isLogin = tab === "login";
    const isCliente = tipoUsuario === "cliente";

    const { signIn } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const tipo = tipoUsuario === "cliente" ? "jogador" : "locador";

            const data =
                tab === "login"
                    ? await loginRequest({ email, senha, tipoUsuario: tipo })
                    : await registerRequest({ nome, email, senha, tipoUsuario: tipo });

            const token = extractToken(data);

            signIn({ user: data.user, token });

            if (data.user.tipoUsuario === "jogador") navigate("/jogador/home");
            else navigate("/locador/home");

            onClose();
        } catch (err: any) {
            console.error("ERR AO REGISTRAR:", err?.response?.data || err);

            const serverError = err?.response?.data;
            if (serverError?.message) {
                const msg = Array.isArray(serverError.message) ? serverError.message[0] : serverError.message;
                showError(msg);
            } else {
                showError("Erro ao comunicar com o servidor.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: "background.paper",
                        backgroundImage:
                            "linear-gradient(145deg, #101010 0%, #1b1b1b 50%, #050505 100%)",
                        borderRadius: 4,
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        textAlign: "center",
                        fontWeight: 600,
                        letterSpacing: 0.5,
                    }}
                >
                    {isLogin ? "Entrar no FutSpot" : "Criar conta no FutSpot"}
                </DialogTitle>

                <DialogContent sx={{ pt: 1 }}>
                    <Box sx={{ mb: 2 }}>
                        <ToggleButtonGroup
                            value={tipoUsuario}
                            exclusive
                            onChange={handleTipoChange}
                            fullWidth
                            sx={{
                                mb: 2,
                                bgcolor: "rgba(255,255,255,0.03)",
                                borderRadius: 999,
                                p: 0.5,
                                "& .MuiToggleButton-root": {
                                    flex: 1,
                                    border: "none",
                                    borderRadius: 999,
                                    color: "text.secondary",
                                    fontWeight: 500,
                                    textTransform: "none",
                                    "&:hover": {
                                        bgcolor: "rgba(255,255,255,0.04)",
                                    },
                                    "&.Mui-selected": {
                                        bgcolor: "primary.main",
                                        color: "#000",
                                        boxShadow: "0 0 14px rgba(0, 230, 118, 0.7)",
                                        "&:hover": {
                                            bgcolor: "#00ff80",
                                        },
                                    },
                                },
                            }}
                        >
                            <ToggleButton value="cliente">Sou Jogador</ToggleButton>
                            <ToggleButton value="dono">Sou Locador</ToggleButton>
                        </ToggleButtonGroup>

                        <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            variant="fullWidth"
                            sx={{
                                mb: 2,
                                "& .MuiTab-root": {
                                    color: "text.secondary",
                                    fontWeight: 500,
                                },
                                "& .MuiTab-root.Mui-selected": {
                                    color: "primary.main",
                                },
                                "& .MuiTabs-indicator": {
                                    backgroundColor: "primary.main",
                                    height: 2,
                                    borderRadius: 999,
                                },
                            }}
                        >
                            <Tab label="Login" value="login" />
                            <Tab label="Cadastro" value="register" />
                        </Tabs>
                    </Box>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={1.8}>
                            {!isLogin && (
                                <>
                                    <TextField
                                        label={
                                            isCliente ? "Nome do jogador" : "Nome do responsável/locador"
                                        }
                                        fullWidth
                                        size="small"
                                        variant="filled"
                                        onChange={(e) => setNome(e.target.value)}
                                        InputProps={{
                                            disableUnderline: true,
                                            sx: {
                                                borderRadius: 2,
                                                bgcolor: "rgba(255,255,255,0.03)",
                                                "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                                                "&.Mui-focused": {
                                                    boxShadow: "0 0 0 1px rgba(0, 230, 118, 0.8)",
                                                },
                                            },
                                        }}
                                    />
                                </>
                            )}

                            <TextField
                                label="E-mail"
                                type="email"
                                fullWidth
                                size="small"
                                variant="filled"
                                onChange={(e) => setEmail(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        borderRadius: 2,
                                        bgcolor: "rgba(255,255,255,0.03)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                                        "&.Mui-focused": {
                                            boxShadow: "0 0 0 1px rgba(0, 230, 118, 0.8)",
                                        },
                                    },
                                }}
                            />

                            <TextField
                                label="Senha"
                                type="password"
                                fullWidth
                                size="small"
                                variant="filled"
                                onChange={(e) => setSenha(e.target.value)}
                                InputProps={{
                                    disableUnderline: true,
                                    sx: {
                                        borderRadius: 2,
                                        bgcolor: "rgba(255,255,255,0.03)",
                                        "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                                        "&.Mui-focused": {
                                            boxShadow: "0 0 0 1px rgba(0, 230, 118, 0.8)",
                                        },
                                    },
                                }}
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                sx={{
                                    mt: 1,
                                    py: 1.2,
                                    fontWeight: 700,
                                    fontSize: 15,
                                    boxShadow: "0 0 20px rgba(0, 230, 118, 0.55)",
                                    ":hover": {
                                        boxShadow: "0 0 30px rgba(0, 230, 118, 0.8)",
                                    },
                                }}
                            >
                                {isLogin ? "Entrar" : "Criar conta"}
                            </Button>
                        </Stack>
                    </Box>
                </DialogContent>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity="error"
                    variant="filled"
                    onClose={() => setSnackbarOpen(false)}
                    sx={{ bgcolor: "#f52121ff" }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>

        </>
    );

};