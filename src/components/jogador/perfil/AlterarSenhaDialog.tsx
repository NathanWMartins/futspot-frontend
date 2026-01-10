import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useState } from "react";

type Props = { open: boolean; onClose: () => void };

export default function AlterarSenhaDialog({ open, onClose }: Props) {
  const [atual, setAtual] = useState("");
  const [nova, setNova] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  const salvar = async () => {
    if (!atual || !nova) return alert("Preencha todos os campos.");
    if (nova !== confirm) return alert("A confirmação não confere.");
    setSaving(true);
    try {
      // TODO: chamar API real
      alert("Senha alterada (implementar API).");
      onClose();
      setAtual("");
      setNova("");
      setConfirm("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => (saving ? null : onClose())}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.10)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900 }}>Alterar senha</DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={1.5}>
          <TextField
            value={atual}
            onChange={(e) => setAtual(e.target.value)}
            label="Senha atual"
            type="password"
            fullWidth
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                color: "#fff",
              },
            }}
          />
          <TextField
            value={nova}
            onChange={(e) => setNova(e.target.value)}
            label="Nova senha"
            type="password"
            fullWidth
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                color: "#fff",
              },
            }}
          />
          <TextField
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            label="Confirmar nova senha"
            type="password"
            fullWidth
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.65)" } }}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                color: "#fff",
              },
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{
            color: "rgba(255,255,255,0.85)",
            fontWeight: 900,
            borderRadius: 2.5,
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={salvar}
          disabled={saving}
          sx={{
            bgcolor: "#00E676",
            color: "#0b0b0b",
            fontWeight: 900,
            borderRadius: 2.5,
            "&:hover": { bgcolor: "#00E676" },
          }}
        >
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
