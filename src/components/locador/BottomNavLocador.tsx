import { BottomNavigation, BottomNavigationAction, Box, Paper } from "@mui/material";
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import { useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import LogoFutSpotDark from "../../assets/LogoFutSpotDark.png";
import LogoFutSpotOutlined from "../../assets/LogoFutSpotOutlined.png";

const items = [
    { label: "Locais", value: "/locador/locais", icon: <PlaceOutlinedIcon /> },
    { label: "Agenda", value: "/locador/agenda", icon: <EventOutlinedIcon /> },
];

const PROFILE_PATH = "/user/editar-perfil";

export default function BottomNavLocador() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const current =
        location.pathname.startsWith(PROFILE_PATH)
            ? PROFILE_PATH
            : items.find((i) => location.pathname.startsWith(i.value))?.value ?? "/locador/home";

    const initial = (user?.nome?.trim()?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

    const isHome = current === "/locador/home";

    return (
        <Paper
            elevation={8}
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                borderTop: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "#101010",
                borderRadius: 0,
                zIndex: (t) => t.zIndex.appBar,
            }}
        >
            <BottomNavigation
                value={current}
                onChange={(_, value) => navigate(value)}
                showLabels
                sx={{
                    bgcolor: "transparent",
                    "& .MuiBottomNavigationAction-root": {
                        minWidth: 0,
                        color: "rgba(255,255,255,0.65)",
                    },
                    "& .MuiBottomNavigationAction-root.Mui-selected": {
                        color: "#00E676",
                    },
                    "& .MuiBottomNavigationAction-label": {
                        fontSize: 12,
                        transition: "none",
                    },
                }}
            >
                <BottomNavigationAction
                    label="Início"
                    value={"/locador/home"}
                    icon={
                        <Box
                            component="img"
                            src={isHome ? LogoFutSpotDark : LogoFutSpotOutlined}
                            alt="Início"
                            sx={{
                                width: 24,
                                height: 24,
                                display: "block",
                                opacity: isHome ? 1 : 0.85,
                                transform: isHome ? "scale(1.0)" : "scale(0.95)",
                            }}
                        />

                    }
                />
                {items.map((i) => (
                    <BottomNavigationAction
                        key={i.value}
                        label={i.label}
                        value={i.value}
                        icon={i.icon}
                    />
                ))}

                <BottomNavigationAction
                    label="Perfil"
                    value={PROFILE_PATH}
                    icon={
                        <Avatar
                            src={user?.fotoUrl ?? undefined}
                            sx={{
                                width: 26,
                                height: 26,
                                bgcolor: "#333333ff",
                                border: current === PROFILE_PATH ? "2px solid #00E676" : "2px solid transparent",
                            }}
                            imgProps={{ referrerPolicy: "no-referrer" }}
                        >
                            {initial}
                        </Avatar>
                    }
                />
            </BottomNavigation>
        </Paper>
    );
}
