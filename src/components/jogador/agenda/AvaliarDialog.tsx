import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Rating,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

type Props = {
  open: boolean;
  loading: boolean;
  localNome?: string;
  nota: number | null;
  comentario: string;
  onClose: () => void;
  onChangeNota: (v: number | null) => void;
  onChangeComentario: (v: string) => void;
  onSubmit: () => void;
};

export default function AvaliarDialog({
  open,
  loading,
  localNome,
  nota,
  comentario,
  onClose,
  onChangeNota,
  onChangeComentario,
  onSubmit,
}: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => (loading ? null : onClose())}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 2,
          border: "1px solid rgba(255,255,255,0.10)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900 }}>
        Avaliar {localNome ?? ""}
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ fontSize: 13, opacity: 0.75, mb: 1 }}>
          Dê uma nota e (se quiser) deixe um comentário.
        </Typography>

        <Stack spacing={2} sx={{ mt: 1 }}>
          <Box>
            <Typography sx={{ fontSize: 12, opacity: 0.7, mb: 0.5 }}>
              Nota
            </Typography>
            <Rating
              value={nota ?? 0}
              precision={0.5}
              onChange={(_, v) => onChangeNota(v)}
              sx={{ color: "#ffd900ff" }}
            />
          </Box>

          <TextField
            value={comentario}
            onChange={(e) => onChangeComentario(e.target.value)}
            placeholder="Comentário (opcional)"
            multiline
            minRows={3}
            fullWidth
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 1,
                color: "#fff",
              },
            }}
          />
        </Stack>
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
          Cancelar
        </Button>

        <Button
          onClick={onSubmit}
          disabled={loading}
          sx={{
            fontFamily: "'Poppins', sans-serif",
            bgcolor: "#00E676",
            color: "#fff",
            fontWeight: 900,
            width: 80,
            borderRadius: 2.5,
            "&:hover": { bgcolor: "#01b55eff" },
          }}
        >
          {loading ? "Enviando..." : "Enviar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
