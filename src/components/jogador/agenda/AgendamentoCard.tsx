import {
  Avatar,
  Box,
  Card,
  CardActionArea,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import PlaceRoundedIcon from "@mui/icons-material/PlaceRounded";
import CancelIcon from "@mui/icons-material/Cancel";
import type { AgendamentoCardDTO } from "../../../types/agendamento";
import { formatarDataBR } from "../../../utils/date";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Tooltip } from "@mui/material";
import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";

type Props = {
  ag: AgendamentoCardDTO;
  variant: "proximos" | "historico";
  onOpenLocal: (localId: number) => void;
  onCancelar?: (ag: AgendamentoCardDTO) => void;
  onAvaliar?: (ag: AgendamentoCardDTO) => void;
};

export default function AgendamentoCard({
  ag,
  variant,
  onOpenLocal,
  onCancelar,
  onAvaliar,
}: Props) {
  const isConfirmado = ag.status === "confirmado";

  return (
    <Card
      sx={{
        bgcolor: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
        overflow: "hidden",
        borderRadius: 4,
      }}
    >
      <CardActionArea onClick={() => onOpenLocal(ag.localId)}>
        {/* ====================== MOBILE (xs) ====================== */}
        <Box sx={{ display: { xs: "block", sm: "none" }, p: 1.5 }}>
          {/* Linha 1: thumb + topo (nome/data) + ações */}
          <Stack direction="row" spacing={1.2} alignItems="flex-start">
            {/* Thumb */}
            <Avatar
              src={ag.localFotoUrl ?? undefined}
              variant="rounded"
              sx={{
                width: 62,
                height: 62,
                borderRadius: 3,
                bgcolor: "rgba(255,255,255,0.06)",
                flexShrink: 0,
              }}
            />

            {/* Coluna direita */}
            <Box sx={{ minWidth: 0, flex: 1 }}>
              {/* Top row: nome/data à esquerda | chip/ações à direita */}
              <Stack direction="row" spacing={1} alignItems="flex-start">
                {/* Texto (com mais espaço) */}
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    fontWeight={900}
                    sx={{
                      fontSize: 14,
                      lineHeight: 1.15,
                      display: "-webkit-box",
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {ag.localNome}
                  </Typography>

                  <Typography sx={{ opacity: 0.85, mt: 0.3, fontSize: 13 }}>
                    {formatarDataBR(ag.data)} • {ag.inicio}
                  </Typography>
                </Box>

                {/* Ações */}
                <Stack
                  direction="row"
                  spacing={0.6}
                  alignItems="center"
                  sx={{ flexShrink: 0 }}
                >
                  {variant === "proximos" ? (
                    <Chip
                      size="small"
                      label={isConfirmado ? "Confirmado" : "Cancelado"}
                      sx={{
                        bgcolor: isConfirmado
                          ? "rgba(0,230,118,0.18)"
                          : "rgba(255,255,255,0.10)",
                        border: isConfirmado
                          ? "1px solid rgba(0,230,118,0.35)"
                          : "1px solid rgba(255,255,255,0.15)",
                        color: "#fff",
                        fontWeight: 900,
                        height: 24,
                      }}
                    />
                  ) : null}

                  {/* cancelar (próximos) */}
                  {variant === "proximos" && isConfirmado ? (
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelar?.(ag);
                      }}
                      sx={{
                        color: "error.main",
                        p: 0.35,
                        "&:hover": { color: "#fe5353ff" },
                      }}
                    >
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  ) : null}

                  {/* histórico: avaliar (ícone) — se você já implementou */}
                  {variant === "historico" ? (
                    ag.avaliacao ? (
                      <Stack
                        direction="row"
                        spacing={0.8}
                        alignItems="center"
                        sx={{ mt: -0.2 }}
                      >
                        <StarRoundedIcon color="warning" />
                        <Typography
                          sx={{
                            fontSize: 12,
                            opacity: 0.85,
                            fontWeight: 900,
                            pr: 2,
                          }}
                        >
                          {ag.avaliacao.nota.toFixed(1)}
                        </Typography>
                      </Stack>
                    ) : ag.status !== "confirmado" ? (
                      <Stack direction="row">
                        <DoNotDisturbIcon
                          fontSize="small"
                          sx={{ color: "#9c9c9cff" }}
                        />
                        <Typography
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            fontSize: 12,
                            opacity: 0.7,
                            pr: 1,
                            mt: 0.2,
                            ml: 0.5,
                          }}
                        >
                          Cancelado
                        </Typography>
                      </Stack>
                    ) : ag.podeAvaliar ? (
                      <Stack direction="row">
                        <IconButton
                          disableRipple
                          disableFocusRipple
                          onClick={(e) => {
                            e.stopPropagation();
                            onAvaliar?.(ag);
                          }}
                          sx={{
                            mt: -0.7,
                            borderRadius: 2,
                            bgcolor: "transparent",
                            "&:hover": {
                              bgcolor: "transparent",
                              color: "rgba(0,230,118,0.75)",
                            },
                          }}
                        >
                          <StarBorderIcon fontSize="medium" />
                          <Typography
                            sx={{
                              fontFamily: "'Poppins', sans-serif",
                              "&:hover": {
                                bgcolor: "transparent",
                                color: "rgba(0,230,118,0.75)",
                              },
                              fontSize: 13,
                              letterSpacing: 0.4,
                              mr: 0.2,
                              ml: 0.2,
                              mt: 0.3,
                            }}
                          >
                            Avaliar
                          </Typography>
                        </IconButton>
                      </Stack>
                    ) : null
                  ) : null}
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* Linha 2: Endereço embaixo da foto (largura total) */}
          {ag.endereco ? (
            <Stack
              direction="row"
              spacing={0.6}
              alignItems="flex-start"
              sx={{ mt: 1 }}
            >
              <PlaceRoundedIcon
                sx={{ fontSize: 16, opacity: 0.75, mt: "2px" }}
              />
              <Typography
                sx={{
                  opacity: 0.75,
                  fontSize: 12,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {ag.endereco}
              </Typography>
            </Stack>
          ) : null}

          {/* CTA alinhado à direita */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 0.9 }}>
            <Typography sx={{ fontSize: 11, opacity: 0.55 }}>
              Toque para ver o local
            </Typography>
          </Box>
        </Box>

        {/* ====================== DESKTOP (sm+) ====================== */}
        <Stack
          direction="row"
          sx={{
            display: { xs: "none", sm: "flex" },
            height: 140,
          }}
        >
          {/* imagem grande lateral */}
          <Box
            sx={{
              width: 140,
              height: "100%",
              flexShrink: 0,
              bgcolor: "rgba(255,255,255,0.06)",
            }}
          >
            {ag.localFotoUrl ? (
              <Box
                component="img"
                src={ag.localFotoUrl}
                alt={ag.localNome}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
            ) : null}
          </Box>

          {/* conteúdo desktop */}
          <Box
            sx={{
              flex: 1,
              p: 1.75,
              display: "flex",
              flexDirection: "column",
              minWidth: 0,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="flex-start">
              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography fontWeight={900} noWrap>
                  {ag.localNome}
                </Typography>

                <Typography sx={{ opacity: 0.85, mt: 0.5, fontSize: 13 }}>
                  {formatarDataBR(ag.data)} • {ag.inicio}
                </Typography>

                {ag.endereco ? (
                  <Stack
                    direction="row"
                    spacing={0.6}
                    alignItems="center"
                    sx={{ mt: 0.75 }}
                  >
                    <PlaceRoundedIcon sx={{ fontSize: 16, opacity: 0.75 }} />
                    <Typography
                      sx={{
                        opacity: 0.75,
                        fontSize: 12,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {ag.endereco}
                    </Typography>
                  </Stack>
                ) : null}
              </Box>

              <Stack
                direction="row"
                spacing={0.8}
                alignItems="center"
                sx={{ flexShrink: 0 }}
              >
                {variant === "proximos" ? (
                  <Chip
                    size="small"
                    label={isConfirmado ? "Confirmado" : "Cancelado"}
                    sx={{
                      bgcolor: isConfirmado
                        ? "rgba(0,230,118,0.18)"
                        : "rgba(255,255,255,0.10)",
                      border: isConfirmado
                        ? "1px solid rgba(0,230,118,0.35)"
                        : "1px solid rgba(255,255,255,0.15)",
                      color: "#fff",
                      fontWeight: 900,
                      height: 24,
                    }}
                  />
                ) : null}

                {variant === "proximos" && isConfirmado ? (
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onCancelar?.(ag);
                    }}
                    sx={{
                      color: "error.main",
                      p: 0.45,
                      "&:hover": { color: "#fe5353ff" },
                    }}
                    aria-label="Cancelar agendamento"
                  >
                    <CancelIcon fontSize="small" />
                  </IconButton>
                ) : null}

                {variant === "historico" ? (
                  ag.avaliacao ? (
                    <Stack
                      direction="row"
                      spacing={0.8}
                      alignItems="center"
                      sx={{ mt: -0.2 }}
                    >
                      <StarRoundedIcon color="warning" />
                      <Typography
                        sx={{
                          fontSize: 12,
                          opacity: 0.85,
                          fontWeight: 900,
                          pr: 2,
                        }}
                      >
                        {ag.avaliacao.nota.toFixed(1)}
                      </Typography>
                    </Stack>
                  ) : ag.status !== "confirmado" ? (
                    <Stack direction="row">
                      <DoNotDisturbIcon
                        fontSize="small"
                        sx={{ color: "#9c9c9cff" }}
                      />
                      <Typography
                        sx={{
                          fontFamily: "'Poppins', sans-serif",
                          fontSize: 12,
                          opacity: 0.7,
                          pr: 1,
                          mt: 0.2,
                          ml: 0.5,
                        }}
                      >
                        Cancelado
                      </Typography>
                    </Stack>
                  ) : ag.podeAvaliar ? (
                    <Stack direction="row">
                      <IconButton
                        disableRipple
                        disableFocusRipple
                        onClick={(e) => {
                          e.stopPropagation();
                          onAvaliar?.(ag);
                        }}
                        sx={{
                          mt: -0.5,
                          borderRadius: 2,
                          bgcolor: "transparent",
                          "&:hover": {
                            bgcolor: "transparent",
                            color: "rgba(0,230,118,0.75)",
                          },
                        }}
                      >
                        <StarBorderIcon fontSize="medium" />
                        <Typography
                          sx={{
                            fontFamily: "'Poppins', sans-serif",
                            "&:hover": {
                              bgcolor: "transparent",
                              color: "rgba(0,230,118,0.75)",
                            },
                            fontSize: 13,
                            letterSpacing: 0.4,
                            mr: 0.2,
                            ml: 0.2,
                            mt: 0.3,
                          }}
                        >
                          Avaliar
                        </Typography>
                      </IconButton>
                    </Stack>
                  ) : (
                    <Tooltip title="Disponível após o horário" arrow>
                      <span>
                        <IconButton
                          disabled
                          sx={{ color: "rgba(255,255,255,0.25)", p: 0.45 }}
                          aria-label="Avaliar indisponível"
                        >
                          <RateReviewRoundedIcon fontSize="small" />
                        </IconButton>
                      </span>
                    </Tooltip>
                  )
                ) : null}
              </Stack>
            </Stack>

            <Box sx={{ flex: 1 }} />

            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <Typography sx={{ fontSize: 11, opacity: 0.6, mr: 2 }}>
                Toque para ver o local
              </Typography>
            </Box>
          </Box>
        </Stack>
      </CardActionArea>
    </Card>
  );
}
