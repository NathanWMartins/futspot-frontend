import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Paper,
  Avatar,
} from "@mui/material";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LogoFutSpotDark from "../../assets/LogoFutSpotDark.png";
import LogoFutSpotOutlined from "../../assets/LogoFutSpotOutlined.png";
import { useEffect, useState } from "react";

const items = [
  { label: "Locais", value: "/locador/locais", icon: <PlaceOutlinedIcon /> },
  { label: "Agenda", value: "/locador/agenda", icon: <EventOutlinedIcon /> },
  {
    label: "Avisos",
    value: "/user/notificacoes",
    icon: <NotificationsNoneIcon />,
  },
];

const PROFILE_PATH = "/user/perfil";

export default function BottomNavLocador() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [animatedOnce, setAnimatedOnce] = useState<Record<string, boolean>>({});

  const current = location.pathname.startsWith(PROFILE_PATH)
    ? PROFILE_PATH
    : (items.find((i) => location.pathname.startsWith(i.value))?.value ??
      "/locador/home");

  const initial = (
    user?.nome?.trim()?.[0] ??
    user?.email?.[0] ??
    "U"
  ).toUpperCase();

  const isHome = current === "/locador/home";

  useEffect(() => {
    if (!animatedOnce[current]) {
      const timer = setTimeout(() => {
        setAnimatedOnce((prev) => ({ ...prev, [current]: true }));
      }, 700);

      return () => clearTimeout(timer);
    }
  }, [current, animatedOnce]);

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
          value="/locador/home"
          icon={
            <Box
              component="img"
              src={isHome ? LogoFutSpotDark : LogoFutSpotOutlined}
              alt="Início"
              sx={{
                width: 24,
                height: 24,
                opacity: isHome ? 1 : 0.85,
              }}
            />
          }
        />

        {items.map((item) => {
          const shouldAnimate =
            current === item.value && !animatedOnce[item.value];

          return (
            <BottomNavigationAction
              key={item.value}
              label={item.label}
              value={item.value}
              icon={item.icon}
              sx={{
                position: "relative",
                overflow: "hidden",

                ...(shouldAnimate && {
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(120deg, transparent, rgba(0,230,118,0.85), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shine 700ms ease-out",
                    pointerEvents: "none",
                  },
                }),

                "@keyframes shine": {
                  to: {
                    transform: "translateX(100%)",
                  },
                },
              }}
            />
          );
        })}

        <BottomNavigationAction
          label="Perfil"
          value={PROFILE_PATH}
          sx={{
            position: "relative",
            overflow: "hidden",

            ...(current === PROFILE_PATH &&
              !animatedOnce[PROFILE_PATH] && {
                "&::after": {
                  content: '""',
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(120deg, transparent, rgba(0,230,118,0.85), transparent)",
                  transform: "translateX(-100%)",
                  animation: "shine 700ms ease-out",
                },
              }),

            "@keyframes shine": {
              to: {
                transform: "translateX(100%)",
              },
            },
          }}
          icon={
            <Avatar
              src={user?.fotoUrl ?? undefined}
              sx={{
                width: 26,
                height: 26,
                bgcolor: "#333",
                border:
                  current === PROFILE_PATH
                    ? "2px solid #00E676"
                    : "2px solid transparent",
              }}
            >
              {initial}
            </Avatar>
          }
        />
      </BottomNavigation>
    </Paper>
  );
}
