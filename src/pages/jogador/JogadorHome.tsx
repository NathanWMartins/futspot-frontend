import {
    Box,
    Typography,
    Card,
    CardContent,
    Chip,
    Stack,
    Button,
    Avatar,
    IconButton,
    useTheme,
    AppBar,
    Toolbar
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function JogadorHome() {
    const theme = useTheme();

    // 🔥 Mock inicial — depois trocamos pelo backend
    const partidas = [
        {
            id: 1,
            data: "12/12",
            hora: "20:00",
            quadra: "Arena Fut7 Blumenau",
            tipo: "Society",
            status: "Confirmado",
        },
        {
            id: 2,
            data: "14/12",
            hora: "19:00",
            quadra: "Quadra Top Ball",
            tipo: "Futsal",
            status: "Pendente",
        },
    ];

    return (
        <>
            <AppBar position="sticky" elevation={0}>
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <SportsSoccerIcon />
                        <Typography variant="h6" fontWeight={700}>
                            FutSpot
                        </Typography>
                    </Stack>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton color="primary">
                            <NotificationsIcon />
                        </IconButton>
                        <Avatar sx={{ bgcolor: "#00E676" }}>J</Avatar>
                    </Box>
                </Toolbar>
            </AppBar>

            <Box
                sx={{
                    p: 3,
                    maxWidth: "900px",
                    margin: "0 auto",
                    color: theme.palette.text.primary
                }}
            >

                {/* ---------------- "Próximas partidas" ---------------- */}
                <Card
                    sx={{
                        mb: 3,
                        background: "#151515",
                        border: "1px solid rgba(0, 230, 118, 0.15)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Próximas partidas
                        </Typography>

                        {partidas.length === 0 ? (
                            <Typography sx={{ opacity: 0.7 }}>
                                Você ainda não tem partidas agendadas.
                                <br />Que tal marcar uma partida agora?
                            </Typography>
                        ) : (
                            <Stack spacing={2}>
                                {partidas.map((p) => (
                                    <Box
                                        key={p.id}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: "#1E1E1E",
                                            border: "1px solid rgba(0, 230, 118, 0.1)",
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between">
                                            <Stack>
                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <CalendarMonthIcon fontSize="small" />
                                                    <Typography>{p.data}</Typography>
                                                </Stack>

                                                <Stack direction="row" alignItems="center" spacing={1}>
                                                    <AccessTimeIcon fontSize="small" />
                                                    <Typography>{p.hora}</Typography>
                                                </Stack>

                                                <Typography sx={{ mt: 1, fontWeight: 600 }}>
                                                    {p.quadra}
                                                </Typography>

                                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                                    {p.tipo}
                                                </Typography>
                                            </Stack>

                                            {/* Status */}
                                            <Chip
                                                label={p.status}
                                                color={
                                                    p.status === "Confirmado"
                                                        ? "success"
                                                        : p.status === "Pendente"
                                                            ? "warning"
                                                            : "error"
                                                }
                                                sx={{ height: 28 }}
                                            />
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        )}

                        <Button
                            fullWidth
                            sx={{ mt: 2, textTransform: "none" }}
                            color="primary"
                        >
                            Ver agenda completa
                        </Button>
                    </CardContent>
                </Card>

                {/* ---------------- Atalhos ---------------- */}
                <Card
                    sx={{
                        mb: 3,
                        background: "#151515",
                        border: "1px solid rgba(0, 230, 118, 0.15)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Ações rápidas
                        </Typography>

                        <Stack spacing={2}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{
                                    textTransform: "none",
                                    borderRadius: 10,
                                    py: 1.5,
                                    boxShadow: "0 0 12px rgba(0, 230, 118, 0.4)"
                                }}
                                startIcon={<SportsSoccerIcon />}
                            >
                                Marcar nova partida
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                sx={{ textTransform: "none", borderRadius: 10 }}
                            >
                                Quadras favoritas
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {/* ---------------- Sugestões de quadras ---------------- */}
                <Card
                    sx={{
                        background: "#151515",
                        border: "1px solid rgba(0, 230, 118, 0.15)",
                    }}
                >
                    <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                            Sugestões de quadras
                        </Typography>

                        <Stack spacing={2}>
                            <Box
                                sx={{
                                    p: 2,
                                    background: "#1E1E1E",
                                    borderRadius: 2,
                                    border: "1px solid rgba(0, 230, 118, 0.1)",
                                }}
                            >
                                <Typography sx={{ fontWeight: 600 }}>
                                    Arena Fut7 Blumenau
                                </Typography>
                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                    Society – Bairro Itoupava
                                </Typography>
                            </Box>

                            <Box
                                sx={{
                                    p: 2,
                                    background: "#1E1E1E",
                                    borderRadius: 2,
                                    border: "1px solid rgba(0, 230, 118, 0.1)",
                                }}
                            >
                                <Typography sx={{ fontWeight: 600 }}>
                                    Quadra Esportiva Nova Era
                                </Typography>
                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                    Futsal – Centro
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

            </Box>
        </>
    );
}
