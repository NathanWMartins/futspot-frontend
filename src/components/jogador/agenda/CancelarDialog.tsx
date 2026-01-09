import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import type { AgendamentoCardDTO } from "../../../types/agendamento";
import { formatarDataBR } from "../../../utils/date";


type Props = {
  open: boolean;
  loading: boolean;
  ag?: AgendamentoCardDTO | null;
  onClose: () => void;
  onConfirm: () => void;
};

export default function CancelarDialog({
  open,
  loading,
  ag,
  onClose,
  onConfirm,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => (loading ? null : onClose())}
      fullWidth
      maxWidth="xs"
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.10)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Cancelar agendamento?</DialogTitle>

      <DialogContent>
        <Typography sx={{ opacity: 0.8, fontSize: 13 }}>
          {ag
            ? `${ag.localNome} — ${formatarDataBR(ag.data)} às ${ag.inicio}`
            : ""}
        </Typography>
        <Typography sx={{ opacity: 0.7, fontSize: 12, mt: 1 }}>
          Essa ação não pode ser desfeita.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontWeight: 900,
            borderRadius: 2.5,
          }}
        >
          Voltar
        </Button>

        <Button
          onClick={onConfirm}
          disabled={loading}
          sx={{
            bgcolor: "rgba(255,255,255,0.10)",
            border: "1px solid rgba(255,255,255,0.15)",
            "&:hover": {bgcolor: "error.main"},
            color: "#fff",
            fontWeight: 900,
            borderRadius: 2.5,
          }}
        >
          {loading ? "Cancelando..." : "Confirmar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
