import { Box, Typography, Stack, IconButton, Divider, Snackbar, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import MensalidadeCard from "../../components/locador/mensalidade/MensalidadeCard";
import MensalidadeDialog from "../../components/locador/mensalidade/DialogMensalidade";
import {
  createMensalidade,
  deleteMensalidade,
  getMensalidadesPorLocal,
  updateMensalidade,
  type Mensalidade,
} from "../../services/mensalidadeService";

const dias = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export default function MensalidadeLocalPage() {
  const { id } = useParams();
  const location = useLocation();

  const nomeLocal = location.state?.nomeLocal;

  const [mensalidades, setMensalidades] = useState<Mensalidade[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<Mensalidade | null>(null);

  const [snack, setSnack] = useState<{
    open: boolean;
    msg: string;
    severity: "success" | "error";
  }>({
    open: false,
    msg: "",
    severity: "success",
  });
  const showError = (msg: string) =>
    setSnack({ open: true, msg, severity: "error" });
  const showSuccess = (msg: string) =>
    setSnack({ open: true, msg, severity: "success" });

  useEffect(() => {
    fetchMensalidades();
  }, [id]);

  const fetchMensalidades = async () => {
    if (!id) return;

    try {
      const data = await getMensalidadesPorLocal(Number(id));
      setMensalidades(data);
    } catch (err) {
      console.error("Erro ao buscar mensalidades", err);
    }
  };

  const handleCreate = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleEdit = (m: Mensalidade) => {
    setEditing(m);
    setOpenDialog(true);
  };

  const handleDelete = async (m: Mensalidade) => {
    try{
      await deleteMensalidade(m.id);
      showSuccess("Mensalidade deletada com sucesso.");
      fetchMensalidades();
    }catch(err: any){
      const message =
        err?.response?.data?.message ||
        "Não foi possível deletar a mensalidade.";
      showError(message);
    }
  }

  const handleSubmit = async (data: Omit<Mensalidade, "id">) => {
    if (!id) return;

    try {
      if (editing) {
        await updateMensalidade(editing.id, {
          ...data,
          localId: Number(id),
        });
        showSuccess("Mensalidade atualizada com sucesso.");
      } else {
        await createMensalidade({
          ...data,
          localId: Number(id),
        });
        showSuccess("Mensalidade criada com sucesso.");
      }

      setOpenDialog(false);
      setEditing(null);
      fetchMensalidades();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Não foi possível salvar a mensalidade.";
      showError(message);
    }
  };

  return (
    <Box sx={{ p: 3, pl: { xs: "20px", md: "90px" } }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography fontSize={22} fontWeight={700}>
          Mensalidades – {nomeLocal ? `${nomeLocal}` : ""}
        </Typography>

        <IconButton
          onClick={handleCreate}
          sx={{
            bgcolor: "#00E676",
            color: "black",
            "&:hover": { bgcolor: "#00c964" },
          }}
        >
          <AddIcon />
        </IconButton>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2}>
        {mensalidades.map((m) => (
          <MensalidadeCard
            key={m.id}
            mensalidade={m}
            diaLabel={dias[m.diaSemana]}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {mensalidades.length === 0 && (
          <Typography sx={{ opacity: 0.6 }}>
            Nenhuma mensalidade cadastrada.
          </Typography>
        )}
      </Stack>

      <MensalidadeDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        initial={editing}
        onSubmit={handleSubmit}
      />
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
