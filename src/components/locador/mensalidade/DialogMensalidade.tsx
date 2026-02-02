import {
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { Mensalidade } from "../../../services/mensalidadeService";
import { formatCelular, formatCPF } from "../../../utils/userInput";

type FormData = Omit<Mensalidade, "id">;

type Props = {
  open: boolean;
  onClose: () => void;
  initial: Mensalidade | null;
  onSubmit: (data: FormData) => void;
};

const dias = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda" },
  { value: 2, label: "Terça" },
  { value: 3, label: "Quarta" },
  { value: 4, label: "Quinta" },
  { value: 5, label: "Sexta" },
  { value: 6, label: "Sábado" },
];

export default function MensalidadeDialog({
  open,
  onClose,
  initial,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<FormData>({
    nomeResponsavel: "",
    cpf: "",
    celular: "",
    diaSemana: 0,
    horaInicio: "",
    valor: 0,
    localId: 0,
  });

  useEffect(() => {
    if (!open) return;

    if (initial) {
      const { id, ...rest } = initial;
      setForm(rest);
    } else {
      setForm({
        nomeResponsavel: "",
        cpf: "",
        celular: "",
        diaSemana: 0,
        horaInicio: "",
        valor: 0,
        localId: 0,
      });
    }
  }, [open, initial]);

  const handleChange = (field: keyof FormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#030303",
          color: "#fff",
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle fontWeight={700}>
        {initial ? "Editar mensalidade" : "Nova mensalidade"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Nome do responsável"
            value={form.nomeResponsavel}
            onChange={(e) => handleChange("nomeResponsavel", e.target.value)}
            fullWidth
          />

          <TextField
            label="CPF"
            value={form.cpf}
            onChange={(e) => handleChange("cpf", formatCPF(e.target.value))}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
          />

          <TextField
            label="Celular"
            value={form.celular}
            onChange={(e) =>
              handleChange("celular", formatCelular(e.target.value))
            }
            inputProps={{ inputMode: "numeric" }}
            fullWidth
          />

          <TextField
            select
            label="Dia da semana"
            value={form.diaSemana}
            onChange={(e) => handleChange("diaSemana", Number(e.target.value))}
            fullWidth
          >
            {dias.map((d) => (
              <MenuItem key={d.value} value={d.value}>
                {d.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Hora início"
              type="time"
              value={form.horaInicio}
              onChange={(e) => handleChange("horaInicio", e.target.value)}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Stack>

          <TextField
            label="Valor mensal"
            type="number"
            value={form.valor}
            onChange={(e) => handleChange("valor", Number(e.target.value))}
            fullWidth
          />

          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#00E676",
              color: "black",
              fontWeight: 700,
              "&:hover": { bgcolor: "#00c964" },
            }}
          >
            {initial ? "Salvar alterações" : "Cadastrar mensalidade"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
