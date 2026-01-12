import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PhotoCameraRoundedIcon from "@mui/icons-material/PhotoCameraRounded";
import { atualizarPerfil, uploadFotoPerfil } from "../../../services/userService";
import type { AuthUser } from "../../../services/authService";


type Props = {
  open: boolean;
  onClose: () => void;
  user: AuthUser;
  onSaved: (u: AuthUser) => void;
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function EditarPerfilDialog({ open, onClose, user, onSaved }: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [nome, setNome] = useState(user.nome ?? "");
  const [telefone, setTelefone] = useState(user.telefone ?? "");
  const [email, setEmail] = useState(user.email ?? "");

  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  useEffect(() => {
    if (!open) return;

    setNome(user.nome ?? "");
    setTelefone(user.telefone ?? "");
    setEmail(user.email ?? "");
    setFile(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handlePickFile = (f?: File | null) => {
    if (!f) return;

    const okTypes = ["image/png", "image/jpeg", "image/webp"];
    if (!okTypes.includes(f.type)) {
      alert("Envie uma imagem PNG, JPG ou WEBP.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.");
      return;
    }

    setFile(f);
  };

  const salvar = async () => {
    const nomeFinal = nome.trim();
    const telefoneFinal = telefone.trim();
    const emailFinal = email.trim().toLowerCase();

    if (!nomeFinal) return alert("Informe seu nome.");
    if (!emailFinal) return alert("Informe seu e-mail.");
    if (!isValidEmail(emailFinal)) return alert("Informe um e-mail válido.");

    setSaving(true);
    try {
      let fotoUrl: string | null | undefined = undefined;
      if (file) {
        fotoUrl = await uploadFotoPerfil(file);
      }

      const updatedUser = await atualizarPerfil({
        nome: nomeFinal,
        telefone: telefoneFinal ? telefoneFinal : undefined,
        email: emailFinal, 
        fotoUrl: fotoUrl ?? undefined, 
      });

      onSaved(updatedUser);
      onClose();
    } catch (e: any) {
      console.error(e);
      const status = e?.response?.status;

      if (status === 409) return alert("Este e-mail já está em uso.");
      if (status === 401) return alert("Sessão expirada. Faça login novamente.");

      alert(e?.response?.data?.message ?? "Não foi possível salvar.");
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
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, pr: 6 }}>
        Editar perfil
        <IconButton
          onClick={() => (saving ? null : onClose())}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "rgba(255,255,255,0.85)",
          }}
          aria-label="Fechar"
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1.5 }}>
        <Stack spacing={2}>
          {/* FOTO */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar
              src={previewUrl ?? (user.fotoUrl ?? undefined)}
              sx={{
                width: 56,
                height: 56,
                border: "2px solid rgba(0,230,118,0.28)",
                bgcolor: "rgba(255,255,255,0.08)",
                fontWeight: 900,
              }}
            >
              {(user.nome ?? "U")
                .split(" ")
                .slice(0, 2)
                .map((p: any) => p[0]?.toUpperCase())
                .join("")}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                Foto de perfil
              </Typography>
            </Box>

            <Button
              component="label"
              startIcon={<PhotoCameraRoundedIcon />}
              sx={{
                borderRadius: 999,
                textTransform: "none",
                fontWeight: 900,
                bgcolor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "#fff",
                "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
              }}
            >
              {isMobile ? "Foto" : "Trocar foto"}
              <input
                hidden
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(e) => handlePickFile(e.target.files?.[0])}
              />
            </Button>
          </Stack>

          <TextField
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            label="Nome"
            fullWidth
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.70)" } }}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                color: "#fff",
              },
            }}
          />

          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="E-mail"
            fullWidth
            type="email"
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.70)" } }}
            InputProps={{
              sx: {
                bgcolor: "rgba(255,255,255,0.04)",
                borderRadius: 3,
                color: "#fff",
              },
            }}
          />

          <TextField
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            label="Telefone (opcional)"
            fullWidth
            InputLabelProps={{ sx: { color: "rgba(255,255,255,0.70)" } }}
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
