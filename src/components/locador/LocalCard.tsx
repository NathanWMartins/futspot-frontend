import { Card, Box, Typography, Stack, Chip } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import PlaceIcon from "@mui/icons-material/Place";
import LocalActions from "./LocalActions";

interface LocalCardProps {
  local: any;
  onEdit: (local: any) => void;
  onDelete: (local: any) => void;
  onShare: (local: any) => void;
  onMensalidade: (local: any) => void;
  formatTipoLocal: (tipo: any) => string;
  formatCurrency: (value: number) => string;
}

export default function LocalCard({
  local,
  onEdit,
  onDelete,
  onShare,
  onMensalidade,
  formatTipoLocal,
  formatCurrency,
}: LocalCardProps) {
  const fotoPrincipal = local.fotos?.length ? local.fotos[0] : null;

  return (
    <Card
      sx={{
        background: "linear-gradient(145deg, #141414, #111)",
        borderRadius: 4,
        border: "1px solid rgba(0,230,118,0.12)",
        overflow: "hidden",
        transition: "all .3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 30px rgba(0,230,118,0.15)",
          borderColor: "rgba(0,230,118,0.4)",
        },
      }}
    >
      {/* IMAGEM */}
      <Box
        sx={{
          height: 200,
          background: fotoPrincipal
            ? `url(${fotoPrincipal}) center/cover no-repeat`
            : "radial-gradient(circle at top, #00E67633, #111)",
          position: "relative",
        }}
      >
        {!fotoPrincipal && (
          <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: "100%" }}
            spacing={1}
          >
            <SportsSoccerIcon sx={{ fontSize: 42, opacity: 0.6 }} />
            <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
              Sem foto cadastrada
            </Typography>
          </Stack>
        )}

        {/* AÇÕES */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            right: 12,
          }}
        >
          <LocalActions
            local={local}
            onEdit={onEdit}
            onDelete={onDelete}
            onShare={onShare}
            onMensalidade={onMensalidade}
          />
        </Box>
      </Box>

      {/* CONTEÚDO */}
      <Box sx={{ p: 3 }}>
        <Typography fontWeight={600} sx={{ fontSize: 18 }}>
          {local.nome}
        </Typography>

        <Stack
          direction="row"
          spacing={0.5}
          alignItems="flex-start"
          sx={{ mt: 1 }}
        >
          <PlaceIcon sx={{ fontSize: 16, opacity: 0.6, mt: "3px" }} />
          <Typography
            sx={{
              fontSize: 14,
              opacity: 0.7,
              lineHeight: 1.5,
              flex: 1,
            }}
          >
            {local.endereco}
          </Typography>
        </Stack>

        <Chip
          label={formatTipoLocal(local.tipoLocal)}
          size="small"
          sx={{ mt: 1.5 }}
        />

        <Box sx={{ mt: 3 }}>
          <Typography sx={{ fontSize: 13, opacity: 0.6 }}>
            Preço por hora
          </Typography>

          <Typography
            fontWeight={700}
            sx={{
              fontSize: 18,
              mt: 0.5,
            }}
          >
            {formatCurrency(local.precoHora)}
          </Typography>
        </Box>
      </Box>
    </Card>
  );
}
