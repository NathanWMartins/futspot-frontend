import { useEffect, useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  Alert,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import {
  type DiaSemana,
  type HorarioDia,
  type LocalFormValues,
} from "../../components/locador/DialogEditarLocal";
import { api } from "../../services/api";
import {
  atualizarLocal,
  criarLocal,
  uploadFoto,
  type Local,
  type LocalPayload,
  type TipoLocal,
} from "../../services/locadoresService";
import LocalDialog from "../../components/locador/DialogEditarLocal";
import { useNavigate } from "react-router-dom";
import LocalCard from "../../components/locador/LocalCard";

const dias: { id: DiaSemana; label: string }[] = [
  { id: 0, label: "Dom" },
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
];

export function buildDefaultHorarios(
  fromBackend?: HorarioDia[] | undefined,
): HorarioDia[] {
  if (fromBackend?.length) return fromBackend;

  return dias.map((d) => ({
    diaSemana: d.id,
    aberto: d.id !== 0,
    inicio: "10:00",
    fim: "22:00",
  }));
}

function LocadorLocais() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [locais, setLocais] = useState<Local[]>([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedLocal, setSelectedLocal] = useState<LocalFormValues | null>(
    null,
  );

  const [openDelete, setOpenDelete] = useState(false);
  const [localSelecionado, setLocalSelecionado] = useState<any>(null);
  const [loadingDelete, setLoadingDelete] = useState(false);

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

  const openCreate = () => {
    setDialogMode("create");
    setSelectedLocal({
      nome: "",
      cidade: "",
      cep: "",
      numero: "",
      endereco: "",
      descricao: "",
      tipoLocal: "society",
      precoHora: 0,
      fotos: [],
      horarios: buildDefaultHorarios(undefined),
      novasFotos: [],
      novasFotosPreview: [],
    });
    setOpenDialog(true);
  };

  const openEdit = (local: Local) => {
    setDialogMode("edit");
    setSelectedLocal({
      id: local.id,
      nome: local.nome,
      descricao: local.descricao,
      cidade: local.cidade,
      cep: local.cep,
      endereco: local.endereco,
      numero: local.numero,
      tipoLocal: local.tipoLocal,
      precoHora: local.precoHora,
      fotos: local.fotos ?? [],
      horarios: buildDefaultHorarios(local.horarios),
      novasFotos: [],
      novasFotosPreview: [],
    });
    setOpenDialog(true);
  };

  const fetchLocais = async () => {
    try {
      setLoading(true);
      const { data } = await api.get<Local[]>("/locais");
      setLocais(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error(err);
      setLocais([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocais();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatTipoLocal = (tipo: TipoLocal) => {
    switch (tipo) {
      case "society":
        return "Society";
      case "futsal":
        return "Futsal";
      case "campo":
        return "Campo";
      default:
        return tipo;
    }
  };

  const formatCurrency = (valor: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    }).format(valor);

  const handleCreate = async (
    payload: LocalPayload,
    extras: { novasFotos: File[] },
  ) => {
    try {
      const uploadedUrls = extras.novasFotos?.length
        ? await Promise.all(extras.novasFotos.map(uploadFoto))
        : [];

      const fotosFinal = [...(payload.fotos ?? []), ...uploadedUrls];

      const saved = await criarLocal({ ...payload, fotos: fotosFinal });

      setLocais((prev) => [saved, ...prev]);
      showSuccess("Local cadastrado com sucesso!");
    } catch (err) {
      console.error(err);
      showError("Erro ao cadastrar local.");
      throw err;
    }
  };

  const handleUpdate = async (
    id: number,
    payload: LocalPayload,
    extras: { novasFotos: File[] },
  ) => {
    try {
      const uploadedUrls = extras.novasFotos?.length
        ? await Promise.all(extras.novasFotos.map(uploadFoto))
        : [];

      const fotosFinal = [...(payload.fotos ?? []), ...uploadedUrls];

      const saved = await atualizarLocal(id, { ...payload, fotos: fotosFinal });

      setLocais((prev) => prev.map((l) => (l.id === saved.id ? saved : l)));
      showSuccess("Local atualizado com sucesso!");
    } catch (err) {
      console.error(err);
      showError("Erro ao atualizar local.");
      throw err;
    }
  };

  const handleConfirmDelete = async () => {
    if (!localSelecionado) return;

    try {
      setLoadingDelete(true);

      await api.delete(`/locais/${localSelecionado.id}`);

      showSuccess("Local removido com sucesso!");

      setLocais((prev) => prev.filter((l) => l.id !== localSelecionado.id));

      setOpenDelete(false);
      setLocalSelecionado(null);
    } catch (err: any) {
      showError(
        err?.response?.data?.message ||
          "Erro ao remover local. Tente novamente mais tarde.",
      );
      console.error(err);
    } finally {
      setLoadingDelete(false);
    }
  };

  const hasLocais = locais.length > 0;

  const handleShare = async (local: any) => {
    const url = `${window.location.origin}/jogador/local/${local.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: local.nome,
          text: `Confira o local ${local.nome} para jogar!`,
          url: url,
        });
      } catch (err) {
        console.log("Compartilhamento cancelado");
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copiado para a área de transferência!");
    }
  };

  return (
    <>
      <Box
        sx={{
          maxWidth: 1120,
          mx: "auto",
          p: 3,
          pb: 5,
          display: "flex",
          flexDirection: "column",
          gap: 3,
          pl: { xs: 2, sm: 8 },
        }}
      >
        {/* LOADING */}
        {loading && (
          <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        )}

        {/* SEM LOCAIS */}
        {!loading && !hasLocais && (
          <Box sx={{ py: 4, textAlign: "center", opacity: 0.9 }}>
            <Typography>Você ainda não cadastrou nenhum local.</Typography>
            <Typography sx={{ fontSize: 14, opacity: 0.7, mt: 0.5 }}>
              Comece cadastrando sua primeira quadra para liberar horários.
            </Typography>
            <Button
              variant="contained"
              sx={{ mt: 2, textTransform: "none", borderRadius: 10 }}
              onClick={openCreate}
            >
              Cadastrar novo local
            </Button>
          </Box>
        )}

        {/* COM LOCAIS */}
        {!loading && hasLocais && (
          <>
            {/* Cabeçalho */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mb: 1 }}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight={700}
                  fontFamily={"'Poppins', sans-serif"}
                >
                  Meus locais
                </Typography>
                <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
                  {locais.length}{" "}
                  {locais.length === 1
                    ? "local cadastrado"
                    : "locais cadastrados"}
                </Typography>
                {isMobile && locais.length > 1 && (
                  <Typography sx={{ fontSize: 12, opacity: 0.6, mt: 0.3 }}>
                    Arraste para o lado para ver outros locais.
                  </Typography>
                )}
              </Box>

              {isMobile ? (
                <IconButton
                  onClick={openCreate}
                  sx={{
                    bgcolor: "#00E676",
                    color: "black",
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    boxShadow: "0 0 12px rgba(0, 230, 118, 0.7)",
                    "&:hover": { bgcolor: "#00c964" },
                  }}
                >
                  +
                </IconButton>
              ) : (
                <Button
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    borderRadius: 10,
                    px: 3,
                    boxShadow: "0 0 16px rgba(0, 230, 118, 0.6)",
                    fontFamily: "'Poppins', sans-serif",
                  }}
                  onClick={openCreate}
                >
                  Cadastrar novo local
                </Button>
              )}
            </Stack>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(auto-fill, minmax(320px, 1fr))",
                },
                gap: 3,
              }}
            >
              {locais.map((local) => (
                <LocalCard
                  key={local.id}
                  local={local}
                  onEdit={openEdit}
                  onDelete={(local) => {
                    setLocalSelecionado(local);
                    setOpenDelete(true);
                  }}
                  onShare={handleShare}
                  onMensalidade={(local) =>
                    navigate(`/locador/locais/${local.id}/mensalidade`, {
                      state: { nomeLocal: local.nome },
                    })
                  }
                  formatTipoLocal={formatTipoLocal}
                  formatCurrency={formatCurrency}
                />
              ))}
            </Box>
          </>
        )}

        <LocalDialog
          open={openDialog}
          mode={dialogMode}
          initial={selectedLocal}
          onClose={() => setOpenDialog(false)}
          onCreate={handleCreate}
          onUpdate={handleUpdate}
        />

        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
          <DialogTitle>Remover local</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja remover o local{" "}
              <strong>{localSelecionado?.nome}</strong>?
              <br />
              Essa ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>

          <DialogActions>
            <Button
              onClick={() => setOpenDelete(false)}
              disabled={loadingDelete}
            >
              Cancelar
            </Button>

            <Button
              color="error"
              variant="contained"
              onClick={handleConfirmDelete}
              disabled={loadingDelete}
            >
              {loadingDelete ? "Removendo..." : "Remover"}
            </Button>
          </DialogActions>
        </Dialog>

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
    </>
  );
}

export default LocadorLocais;
