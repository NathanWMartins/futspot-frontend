import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import SportsSoccerRoundedIcon from "@mui/icons-material/SportsSoccerRounded";
import { useState } from "react";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";

export type SlotStatus = "livre" | "ocupado";

export type SlotInfo = {
  inicio: string;
  fim: string;
  status: SlotStatus;
  agendamentoId?: number;
  jogador?: {
    id: number;
    nome: string;
    email: string;
    fotoUrl: string;
  };
};

export type LocalInfo = {
  id: number;
  nome: string;
  endereco: string;
  fotos?: string[];
};

type Props = {
  open: boolean;
  onClose: () => void;
  slot: SlotInfo | null;
  local: LocalInfo | null;
};

export default function SlotInfoDialog({ open, onClose, slot, local }: Props) {
  if (!slot) return null;

  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const foto = local?.fotos?.[0] ?? "";
  const hasFoto = Boolean(foto);

  const onCancelar = () => {
    api.delete(`/agendamentos/${slot.agendamentoId}`);
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: "rgba(18,18,18,0.95)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Detalhes do horário</DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          <Stack spacing={2}>
            <Card
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
                overflow: "hidden",
              }}
            >
              {hasFoto ? (
                <CardMedia
                  component="img"
                  height="180"
                  image={foto}
                  alt="Foto do local"
                  sx={{ objectFit: "cover" }}
                />
              ) : (
                <Box
                  sx={{
                    height: 180,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexDirection: "column",
                    gap: 1,
                    background:
                      "radial-gradient(1000px 300px at 50% 0%, rgba(0,230,118,0.28), rgba(0,0,0,0) 60%), rgba(0,0,0,0.25)",
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <SportsSoccerRoundedIcon
                    sx={{ fontSize: 44, color: "rgba(255,255,255,0.75)" }}
                  />
                  <Typography sx={{ fontSize: 14, opacity: 0.75 }}>
                    Sem foto cadastrada
                  </Typography>
                </Box>
              )}

              <CardContent>
                <Typography sx={{ fontWeight: 900 }}>
                  {local?.nome ?? "Local"}
                </Typography>
                <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                  {local?.endereco ?? ""}
                </Typography>
              </CardContent>
            </Card>

            <Box
              sx={{
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                p: 2,
              }}
            >
              <Typography sx={{ fontWeight: 900 }}>
                {slot.inicio} – {slot.fim}
              </Typography>
              <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                Status: {slot.status === "livre" ? "Livre" : "Ocupado"}
              </Typography>
            </Box>

            {slot.status === "ocupado" ? (
              <Box
                sx={{
                  borderRadius: 3,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  p: 2,cursor: "pointer", "&:hover": {bgcolor: "#343434"}
                }}
                  onClick={() => {
                    if (slot.jogador?.id) {
                      navigate(`/locador/jogador/${slot.jogador.id}`);
                    }
                  }}
              >
                <Typography sx={{ fontWeight: 900, mb: 1 }}>Jogador</Typography>

                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"                  
                >
                  <Avatar
                    sx={{ bgcolor: "rgba(0,230,118,0.20)", color: "#00E676" }}
                  >
                    {slot.jogador?.fotoUrl != null ? (
                      <Avatar
                        src={slot.jogador?.fotoUrl ?? undefined}
                        sx={{
                          width: 26,
                          height: 26,
                          bgcolor: "#333333ff",
                          border: "2px solid #00E676",
                        }}
                        imgProps={{ referrerPolicy: "no-referrer" }}
                      />
                    ) : (
                      <PersonRoundedIcon />
                    )}
                  </Avatar>

                  <Box>
                    <Typography sx={{ fontWeight: 800 }}>
                      {slot.jogador?.nome ?? "—"}
                    </Typography>
                    <Typography sx={{ fontSize: 13, opacity: 0.75 }}>
                      {slot.jogador?.email ?? ""}
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            ) : (
              <Typography sx={{ fontSize: 13, opacity: 0.7 }}>
                Este horário está livre.
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          {slot.status === "ocupado" ? (
            <Button
              variant="outlined"
              color="error"
              startIcon={<CancelIcon />}
              onClick={() => setConfirmOpen(true)}
            >
              Cancelar
            </Button>
          ) : null}
          <Button onClick={onClose} variant="outlined">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 900 }}>Cancelar agendamento</DialogTitle>

        <DialogContent>
          <Typography>
            Tem certeza que deseja cancelar este agendamento?
          </Typography>
          <Typography sx={{ fontSize: 13, opacity: 0.7, mt: 1 }}>
            Esta ação não pode ser desfeita.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Voltar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              setConfirmOpen(false);
              onCancelar();
            }}
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
