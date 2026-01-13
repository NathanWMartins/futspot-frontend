import { Box, Stack, Typography, Avatar } from "@mui/material";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { MenuItem } from "./menus";
import logo from "../../assets/LogoFutSpotDark.png";
import { SidebarItem } from "./SidebarItem";

type SidebarProps = {
  menu: MenuItem[];
  user: {
    nome: string;
    fotoUrl: string;
    tipoUsuario: string;
  };
};

export function Sidebar({ menu, user }: SidebarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Box
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      sx={{
        position: "fixed",
        left: 0,
        top: 0,
        height: "100vh",
        width: open ? 220 : 72,
        bgcolor: open
      ? "rgba(18,18,18,0.78)"
      : "#121212",
    backdropFilter: open ? "blur(8px)" : "none",
    borderRight: "1px solid rgba(255,255,255,0.08)",
    transition: `
      width 260ms cubic-bezier(0.4, 0, 0.2, 1),
      background-color 200ms ease,
      backdrop-filter 200ms ease
    `,
        display: "flex",
        flexDirection: "column",
        zIndex: 1200,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{ p: 2, height: 64, cursor: "pointer" }}
        onClick={() => {
          user.tipoUsuario == "jogador"
            ? navigate("/jogador/home")
            : navigate("/locador/home");
        }}
      >
        <Box
          component="img"
          src={logo}
          alt="FutSpot"
          sx={{ width: 32, height: 32 }}
        />

        {open && (
          <Typography
            variant="h6"
            fontWeight={800}
            sx={{
              fontFamily: "'Poppins', sans-serif",
              userSelect: "none",
              color: "#00E676",
              letterSpacing: 0.4,
            }}
          >
            Fut<span style={{ color: "#fff" }}>Spot</span>
          </Typography>
        )}
      </Stack>

      <Stack spacing={0.5} sx={{ px: 1, mt: 1 }}>
        {menu.map((item) => (
          <SidebarItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            active={location.pathname === item.path}
            open={open}
            onClick={() => navigate(item.path)}
          />
        ))}
      </Stack>

      {user && (
        <Box sx={{ mt: "auto", p: 2 }}>
          <Stack
            direction="row"
            spacing={1.5}
            alignItems="center"
            sx={{
              cursor: "pointer",
              borderRadius: 1,
              p: 1,
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.06)",
              },
            }}
            onClick={() => navigate("/user/perfil")}
          >
            <Avatar src={user.fotoUrl} sx={{ width: 36, height: 36 }} />

            {open && (
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                {user.nome}
              </Typography>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}
