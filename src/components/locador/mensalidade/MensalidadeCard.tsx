import {
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  IconButton,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Mensalidade } from "../../../services/mensalidadeService";
import { Delete } from "@mui/icons-material";
import { useState } from "react";

type Props = {
  mensalidade: Mensalidade;
  diaLabel: string;
  onEdit: (mensalidade: Mensalidade) => void;
  onDelete: (mensalidade: Mensalidade) => void;
};

export default function MensalidadeCard({
  mensalidade,
  diaLabel,
  onEdit,
  onDelete,
}: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleConfirmDelete = () => {
    onDelete(mensalidade);
    setOpenDeleteDialog(false);
  };
  return (
    <Card
      sx={{
        background: "#151515",
        borderRadius: 3,
        border: "1px solid rgba(0,230,118,0.2)",
      }}
    >
      <CardContent>
        {/* HEADER */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <PersonIcon sx={{ opacity: 0.7 }} />
            <Typography fontWeight={600}>
              {mensalidade.nomeResponsavel}
            </Typography>
          </Stack>

          <IconButton
            size="medium"
            onClick={() => onEdit(mensalidade)}
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              "&:hover": { bgcolor: "rgba(0,230,118,0.2)" },
              ml: "auto",
            }}
          >
            <EditIcon sx={{ fontSize: 18 }} />
          </IconButton>
          <IconButton
            size="medium"
            onClick={() => setOpenDeleteDialog(true)}
            color="error"
            sx={{
              bgcolor: "rgba(255,255,255,0.06)",
              "&:hover": { bgcolor: "rgba(255,0,0,0.15)" },
              ml: 1,
            }}
          >
            <Delete sx={{ fontSize: 18 }} />
          </IconButton>
        </Stack>

        <Divider sx={{ my: 1.5, opacity: 0.15 }} />

        {/* BODY */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
          <Stack spacing={1} flex={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <BadgeIcon sx={{ fontSize: 18, opacity: 0.7 }} />
              <Typography fontSize={14}>CPF: {mensalidade.cpf}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <PhoneIcon sx={{ fontSize: 18, opacity: 0.7 }} />
              <Typography fontSize={14}>{mensalidade.celular}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={1} flex={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarMonthIcon sx={{ fontSize: 18, opacity: 0.7 }} />
              <Typography fontSize={14}>{diaLabel}</Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <ScheduleIcon sx={{ fontSize: 18, opacity: 0.7 }} />
              <Typography fontSize={14}>{mensalidade.horaInicio}</Typography>
            </Stack>
          </Stack>

          <Stack spacing={1} flex={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AttachMoneyIcon sx={{ opacity: 0.7 }} />
              <Typography fontWeight={700} sx={{ color: "#00E676" }}>
                R$ {mensalidade.valor}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Excluir mensalidade</DialogTitle>

        <DialogContent>
          <DialogContentText>
            Tem certeza que deseja excluir a mensalidade de{" "}
            <strong>{mensalidade.nomeResponsavel}</strong>?
            <br />
            Essa ação não pode ser desfeita.
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancelar</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleConfirmDelete}
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}
