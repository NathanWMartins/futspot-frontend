import { Box, Stack, Typography } from "@mui/material";
import { chipLivre, chipOcupado, chipSolicitado } from "../../utils/ChipsInfoAgendamento";

export function SlotTile({
  inicio,
  status,
  onSelect,
}: {
  inicio: string;
  status: "livre" | "ocupado" | "solicitado";
  onSelect: () => void;
}) {
  const isLivre = status === "livre";
  const isSolicitado = status === "solicitado";

  return (
    <Box
      onClick={onSelect}
      sx={{
        position: "relative",
        borderRadius: 1,
        p: 1.2,
        minHeight: 64,
        bgcolor: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        cursor: "pointer",
        transition: "all .15s ease",
        "&:hover": {
          bgcolor: "rgba(255,255,255,0.06)",
          transform: "translateY(-2px)",
        },
        "&::before": {
          content: '""',
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 4,
          borderRadius: "4px 0 0 4px",
          bgcolor: isLivre ? "#00E676" : isSolicitado ? "#ffbb00" : "#ff5252",
          opacity: 0.9,
        },
      }}
    >
      <Stack spacing={0.8} alignItems="center">
        <Typography sx={{ fontWeight: 800, fontSize: 15 }}>{inicio}</Typography>

        {isLivre ? chipLivre() : isSolicitado ? chipSolicitado() : chipOcupado()}
      </Stack>
    </Box>
  );
}
