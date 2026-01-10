import { Card, Divider, Stack, Typography, Box, useMediaQuery, useTheme } from "@mui/material";
import EventAvailableRoundedIcon from "@mui/icons-material/EventAvailableRounded";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import AccessTimeRoundedIcon from "@mui/icons-material/AccessTimeRounded";

type Props = {
  totalReservas: number;
  locaisDiferentes: number;
  tempoNoAppLabel: string;
};

function StatItem({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
}) {
  return (
    <Stack direction="row" spacing={1.2} alignItems="center" sx={{ minWidth: 0 }}>
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: 2.5,
          display: "grid",
          placeItems: "center",
          bgcolor: "rgba(0,230,118,0.10)",
          border: "1px solid rgba(0,230,118,0.20)",
          color: "#00E676",
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>

        <Typography sx={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>
          {value}
        </Typography>
        <Typography sx={{ opacity: 0.75, fontSize: 12, lineHeight: 1.2, pt: 1 }} noWrap>
          {label}
        </Typography>
    </Stack>
  );
}

export default function PerfilStatsCard({
  totalReservas,
  locaisDiferentes,
  tempoNoAppLabel,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      sx={{
        borderRadius: 2,
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        px: { xs: 2, sm: 3 },
        py: 1.8,
        overflow: "hidden",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 2.5 }}
        alignItems={{ xs: "stretch", sm: "center" }}
        divider={
          isMobile ? undefined : (
            <Divider
              flexItem
              orientation="vertical"
              sx={{ borderColor: "rgba(255,255,255,0.10)" }}
            />
          )
        }
      >
        <StatItem
          icon={<EventAvailableRoundedIcon fontSize="small" />}
          value={totalReservas}
          label={totalReservas == 1 ? "reserva" : "reservas"}
        />

        <StatItem
          icon={<PlaceRoundedIcon fontSize="small" />}
          value={locaisDiferentes}
          label={locaisDiferentes == 1 ? "local diferente" : "locais diferentes"}
        />

        <StatItem
          icon={<AccessTimeRoundedIcon fontSize="small" />}
          value={tempoNoAppLabel}
          label="no app"
        />
      </Stack>
    </Card>
  );
}
