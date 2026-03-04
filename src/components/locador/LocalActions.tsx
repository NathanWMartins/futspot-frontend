import { Stack, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import CalendarMonth from "@mui/icons-material/CalendarMonth";
import Share from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";

interface LocalActionsProps {
  local: any;
  onEdit: (local: any) => void;
  onDelete: (local: any) => void;
  onShare: (local: any) => void;
  onMensalidade: (local: any) => void;
}

export default function LocalActions({
  local,
  onEdit,
  onDelete,
  onShare,
  onMensalidade,
}: LocalActionsProps) {
  const actionStyle = (color: string) => ({
    bgcolor: color,
    color: "white",
    width: 34,
    height: 34,
    borderRadius: "50%",
    boxShadow: `0 4px 12px ${color}55`,
    transition: "all .2s ease",
    "&:hover": {
      transform: "scale(1.08)",
    },
  });

  return (
    <Stack direction="row" spacing={1}>
      <IconButton onClick={() => onEdit(local)} sx={actionStyle("#00E676")}>
        <EditIcon sx={{ fontSize: 18 }} />
      </IconButton>

      <IconButton
        onClick={() => onMensalidade(local)}
        sx={actionStyle("#00E676")}
      >
        <CalendarMonth sx={{ fontSize: 18 }} />
      </IconButton>

      <IconButton onClick={() => onShare(local)} sx={actionStyle("#2196F3")}>
        <Share sx={{ fontSize: 18 }} />
      </IconButton>

      <IconButton onClick={() => onDelete(local)} sx={actionStyle("#FF5252")}>
        <DeleteIcon sx={{ fontSize: 18 }} />
      </IconButton>
    </Stack>
  );
}
