import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Typography,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import HeaderLocador from "../../components/locador/HeaderLocador";

function LocadorHome() {

    const resumoHoje = {
        data: "12/12",
        partidasHoje: 5,
        ocupacao: 72, 
    };

    const locais = [
        {
            id: 1,
            nome: "Arena Fut7 Blumenau",
            tipo: "Society",
            bairro: "Itoupava",
            partidasHoje: 3,
            ocupacao: 80,
            status: "Ativo",
        },
        {
            id: 2,
            nome: "Quadra Esportiva Nova Era",
            tipo: "Futsal",
            bairro: "Centro",
            partidasHoje: 2,
            ocupacao: 60,
            status: "Ativo",
        },
        {
            id: 3,
            nome: "Campo do Morro",
            tipo: "Campo",
            bairro: "Garcia",
            partidasHoje: 0,
            ocupacao: 0,
            status: "Inativo",
        },
    ];

    return (
        <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
            <HeaderLocador />

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
                            Olá, Locador
                        </Typography>

                        <WavingHandIcon
                            sx={{
                                color: "primary.main",
                                fontSize: 30
                            }}
                        />
                    </Stack>
                    <Typography sx={{ opacity: 0.7, mt: 0.5 }}>
                        Acompanhe as partidas de hoje e gerencie suas quadras em um só lugar.
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={3}
                    alignItems="stretch"
                >
                    {/* Card de resumo do dia */}
                    <Card
                        sx={{
                            flex: 1,
                            background: "#151515",
                            border: "1px solid rgba(0, 230, 118, 0.15)",
                        }}
                    >
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" mb={2}>
                                <Typography variant="h6" fontWeight={600}>
                                    Hoje nos seus locais
                                </Typography>
                                <Chip
                                    icon={<CalendarMonthIcon fontSize="small" />}
                                    label={resumoHoje.data}
                                    size="small"
                                    sx={{ bgcolor: "rgba(255,255,255,0.06)" }}
                                />
                            </Stack>

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ opacity: 0.7 }}>Partidas de hoje</Typography>
                                    <Typography variant="h4" fontWeight={700}>
                                        {resumoHoje.partidasHoje}
                                    </Typography>
                                </Box>

                                <Box sx={{ flex: 1 }}>
                                    <Typography sx={{ opacity: 0.7, mb: 0.5 }}>
                                        Ocupação das quadras
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={resumoHoje.ocupacao}
                                        sx={{
                                            height: 10,
                                            borderRadius: 999,
                                            bgcolor: "rgba(255,255,255,0.08)",
                                            "& .MuiLinearProgress-bar": {
                                                borderRadius: 999,
                                            },
                                        }}
                                    />
                                    <Typography sx={{ mt: 0.5, fontSize: 14, opacity: 0.8 }}>
                                        {resumoHoje.ocupacao}% dos horários preenchidos
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>

                    {/* Card de ações rápidas */}
                    <Card
                        sx={{
                            width: { xs: "100%", md: 320 },
                            background: "#151515",
                            border: "1px solid rgba(0, 230, 118, 0.15)",
                        }}
                    >
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Ações rápidas
                            </Typography>
                            <Stack spacing={2}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        textTransform: "none",
                                        borderRadius: 10,
                                        py: 1.3,
                                        boxShadow: "0 0 16px rgba(0, 230, 118, 0.6)",
                                    }}
                                >
                                    Cadastrar novo local
                                </Button>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ textTransform: "none", borderRadius: 10 }}
                                    startIcon={<AccessTimeIcon />}
                                >
                                    Gerenciar horários
                                </Button>
                            </Stack>
                        </CardContent>
                    </Card>
                </Stack>

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
                                Minhas quadras / locais
                            </Typography>
                            <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                {locais.length} locais cadastrados
                            </Typography>
                        </Stack>

                        {locais.length === 0 ? (
                            <Box sx={{ py: 4, textAlign: "center", opacity: 0.8 }}>
                                <Typography>
                                    Você ainda não cadastrou nenhum local.
                                </Typography>
                                <Typography sx={{ fontSize: 14, opacity: 0.7, mt: 0.5 }}>
                                    Comece cadastrando sua primeira quadra para liberar horários.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 2, textTransform: "none", borderRadius: 10 }}
                                >
                                    Cadastrar novo local
                                </Button>
                            </Box>
                        ) : (
                            <Stack spacing={2}>
                                {locais.map((local) => (
                                    <Box
                                        key={local.id}
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: "#1E1E1E",
                                            border: "1px solid rgba(0, 230, 118, 0.1)",
                                        }}
                                    >
                                        <Stack
                                            direction={{ xs: "column", sm: "row" }}
                                            justifyContent="space-between"
                                            spacing={2}
                                        >
                                            <Box>
                                                <Typography fontWeight={600}>
                                                    {local.nome}
                                                </Typography>
                                                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                                                    {local.tipo} – {local.bairro}
                                                </Typography>

                                                <Stack direction="row" spacing={2} mt={1}>
                                                    <Stack direction="row" spacing={0.5} alignItems="center">
                                                        <SportsSoccerIcon fontSize="small" />
                                                        <Typography sx={{ fontSize: 13, opacity: 0.8 }}>
                                                            {local.partidasHoje} partidas hoje
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                            </Box>

                                            <Stack
                                                alignItems={{ xs: "flex-start", sm: "flex-end" }}
                                                spacing={1}
                                            >
                                                <Chip
                                                    label={local.status}
                                                    color={
                                                        local.status === "Ativo"
                                                            ? "success"
                                                            : "default"
                                                    }
                                                    size="small"
                                                />
                                                <Box sx={{ width: 180 }}>
                                                    <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
                                                        Ocupação hoje
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={local.ocupacao}
                                                        sx={{
                                                            height: 8,
                                                            borderRadius: 999,
                                                            bgcolor: "rgba(255,255,255,0.08)",
                                                            "& .MuiLinearProgress-bar": {
                                                                borderRadius: 999,
                                                            },
                                                        }}
                                                    />
                                                </Box>

                                                <Button
                                                    variant="text"
                                                    size="small"
                                                    sx={{ textTransform: "none" }}
                                                >
                                                    Ver detalhes
                                                </Button>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                ))}
                            </Stack>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}

export default LocadorHome;
