import { Card, CardContent, Stack, Typography } from "@mui/material";
import type { AgendamentoCardDTO } from "../../../types/agendamento";
import AgendamentoCard from "./AgendamentoCard";
import { useState } from "react";
import MapDialog from "./MapDialog";

type Props = {
  loading: boolean;
  lista: AgendamentoCardDTO[];
  onCancelar: (ag: AgendamentoCardDTO) => void;
};

export default function AgendaProximosTab({
  loading,
  lista,
  onCancelar,
}: Props) {
  const [openMapa, setOpenMapa] = useState(false);
  const [mapInfo, setMapInfo] = useState<{ nome?: string | null; endereco?: string | null }>({});

  if (loading)
    return <Typography sx={{ opacity: 0.75, mt: 2 }}>Carregando...</Typography>;

  if (!lista.length) {
    return (
      <Card
        sx={{
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <CardContent>
          <Typography fontWeight={900}>Sem agendamentos futuros</Typography>
          <Typography sx={{ opacity: 0.75, mt: 0.5, fontSize: 13 }}>
            Quando você reservar uma quadra, ela aparece aqui.
          </Typography>
        </CardContent>
      </Card>
    );
  }

  const abrirMapa = (ag: AgendamentoCardDTO) => {
    setMapInfo({ nome: ag.localNome, endereco: ag.endereco });
    setOpenMapa(true);
  };


  return (
    <Stack spacing={2}>
      {lista.map((ag) => (
        <AgendamentoCard
          key={ag.id}
          ag={ag}
          variant="proximos"
          onOpenLocal={() => abrirMapa(ag)}
          onCancelar={onCancelar}
        />
      ))}

      <MapDialog
        open={openMapa}
        onClose={() => setOpenMapa(false)}
        localNome={mapInfo.nome}
        endereco={mapInfo.endereco}
      />
    </Stack>
  );
}
