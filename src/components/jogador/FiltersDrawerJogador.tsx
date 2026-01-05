import * as React from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Slider,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import type { Modalidade, PeriodoDia } from "../../types/local";

type Props = {
  open: boolean;
  onClose: () => void;

  minPreco: number;
  maxPreco: number;

  tmpFaixa: number[];
  setTmpFaixa: React.Dispatch<React.SetStateAction<number[]>>;

  tmpTipos: Modalidade[];
  setTmpTipos: React.Dispatch<React.SetStateAction<Modalidade[]>>;

  tmpPeriodos: PeriodoDia[];
  setTmpPeriodos: React.Dispatch<React.SetStateAction<PeriodoDia[]>>;

  labelTipo: Record<string, string>;
  labelPeriodo: Record<string, string>;

  onClear: () => void;
  onApply: () => void;

  anchor?: "bottom" | "right" | "left" | "top";
};

export default function FiltersDrawerJogador({
  open,
  onClose,
  minPreco,
  maxPreco,
  tmpFaixa,
  setTmpFaixa,
  tmpTipos,
  setTmpTipos,
  tmpPeriodos,
  setTmpPeriodos,
  labelTipo,
  labelPeriodo,
  onClear,
  onApply,
  anchor = "bottom",
}: Props) {
  return (
    <Drawer
      anchor={anchor}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          borderTopLeftRadius: anchor === "bottom" ? 18 : 0,
          borderTopRightRadius: anchor === "bottom" ? 18 : 0,
          border: "1px solid rgba(255,255,255,0.08)",
          px: 2,
          pb: 2,
          pt: 1,
          ...(anchor !== "bottom" ? { width: { xs: "100%", sm: 420 } } : null),
        },
      }}
    >
      {/* Header do drawer */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1 }}
      >
        <Typography fontWeight={900} sx={{ fontSize: 16 }}>
          Filtros
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseRoundedIcon />
        </IconButton>
      </Stack>

      <Box
        sx={{
          p: 2,
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
          bgcolor: "rgba(255,255,255,0.03)",
        }}
      >
        <Stack spacing={2}>
          {/* preço */}
          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Faixa de preço (R$)
            </Typography>
            <Slider
              value={tmpFaixa}
              onChange={(_, v) => setTmpFaixa(v as number[])}
              valueLabelDisplay="auto"
              min={minPreco}
              max={maxPreco || 500}
              disableSwap
            />
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          {/* tipo */}
          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Tipo de quadra
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(["society", "futsal", "campo"] as Modalidade[]).map((t) => {
                const active = tmpTipos.includes(t);
                return (
                  <Chip
                    key={t}
                    label={labelTipo[t]}
                    clickable
                    onClick={() =>
                      setTmpTipos((prev) =>
                        prev.includes(t)
                          ? prev.filter((x) => x !== t)
                          : [...prev, t]
                      )
                    }
                    sx={{
                      bgcolor: active
                        ? "rgba(0,230,118,0.18)"
                        : "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

          {/* período */}
          <Box>
            <Typography fontWeight={800} sx={{ mb: 1 }}>
              Período
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {(["manha", "tarde", "noite"] as PeriodoDia[]).map((p) => {
                const active = tmpPeriodos.includes(p);
                return (
                  <Chip
                    key={p}
                    label={labelPeriodo[p]}
                    clickable
                    onClick={() =>
                      setTmpPeriodos((prev) =>
                        prev.includes(p)
                          ? prev.filter((x) => x !== p)
                          : [...prev, p]
                      )
                    }
                    sx={{
                      bgcolor: active
                        ? "rgba(0,230,118,0.18)"
                        : "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#fff",
                      fontWeight: 800,
                    }}
                  />
                );
              })}
            </Stack>
          </Box>

          {/* ações */}
          <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={onClear}
              sx={{
                borderColor: "rgba(255,255,255,0.18)",
                color: "#fff",
                fontWeight: 900,
              }}
            >
              Limpar
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={onApply}
              sx={{
                bgcolor: "#00E676",
                color: "#0b0b0b",
                fontWeight: 900,
                "&:hover": { bgcolor: "#00E676" },
              }}
            >
              Aplicar
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}