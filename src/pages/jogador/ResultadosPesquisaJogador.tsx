import * as React from "react";
import {
  Box,
  Container,
  Typography,
  Stack,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Rating,
} from "@mui/material";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import { useLocation, useNavigate } from "react-router-dom";
import type {
  LocalCardDTO,
  Modalidade,
  PeriodoDia,
  SearchFilters,
} from "../../types/local";
import { PriceTag } from "../../components/jogador/PriceTag";
import FiltersDrawerJogador from "../../components/jogador/FiltersDrawerJogador";

type State = {
  filtros: SearchFilters;
  locais: LocalCardDTO[];
};

const labelTipo: Record<string, string> = {
  society: "Society",
  futsal: "Futsal",
  campo: "Campo",
};

const labelPeriodo: Record<string, string> = {
  manha: "Manhã",
  tarde: "Tarde",
  noite: "Noite",
};

function formatMoney(v: number) {
  return `R$ ${v.toFixed(0)}`;
}

export default function ResultadosJogador() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as State | undefined;

  if (!state) {
    return (
      <Box
        sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", py: 6 }}
      >
        <Container maxWidth="lg">
          <Typography variant="h5" fontWeight={900} gutterBottom>
            Nada para mostrar
          </Typography>
          <Typography sx={{ opacity: 0.75, mb: 2 }}>
            Volte e faça uma busca para ver os resultados.
          </Typography>
          <Typography
            sx={{ color: "#00E676", cursor: "pointer", fontWeight: 800 }}
            onClick={() => navigate("/jogador")}
          >
            Voltar para a busca
          </Typography>
        </Container>
      </Box>
    );
  }

  const { filtros, locais } = state;

  const precos = locais
    .map((l) => l.precoHora ?? 0)
    .filter((v) => Number.isFinite(v) && v > 0);

  const minPreco = precos.length ? Math.min(...precos) : 0;
  const maxPreco = precos.length ? Math.max(...precos) : 500;

  const [faixaPreco, setFaixaPreco] = React.useState<number[]>([
    minPreco,
    maxPreco,
  ]);
  const [tiposSel, setTiposSel] = React.useState<Modalidade[]>([]);
  const [periodosSel, setPeriodosSel] = React.useState<PeriodoDia[]>([]);

  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [tmpFaixa, setTmpFaixa] = React.useState<number[]>([
    minPreco,
    maxPreco,
  ]);
  const [tmpTipos, setTmpTipos] = React.useState<Modalidade[]>([]);
  const [tmpPeriodos, setTmpPeriodos] = React.useState<PeriodoDia[]>([]);

  React.useEffect(() => {
    setFaixaPreco([minPreco, maxPreco]);
    setTmpFaixa([minPreco, maxPreco]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minPreco, maxPreco, locais.length]);

  const openFilters = () => {
    setTmpFaixa(faixaPreco);
    setTmpTipos(tiposSel);
    setTmpPeriodos(periodosSel);
    setDrawerOpen(true);
  };

  const applyFilters = () => {
    setFaixaPreco(tmpFaixa);
    setTiposSel(tmpTipos);
    setPeriodosSel(tmpPeriodos);
    setDrawerOpen(false);
  };

  const clearFilters = () => {
    setTmpFaixa([minPreco, maxPreco]);
    setTmpTipos([]);
    setTmpPeriodos([]);
  };

  const filtered = locais.filter((l) => {
    const p = l.precoHora ?? 0;
    if (p < faixaPreco[0] || p > faixaPreco[1]) return false;

    if (tiposSel.length && l.tipoLocal && !tiposSel.includes(l.tipoLocal))
      return false;

    return true;
  });

  const dataParts = filtros.data.split("-");
  const dataFormatada =
    dataParts.length === 3
      ? `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`
      : filtros.data;

  const resumoLinha1 = `${filtros.cidade ?? "Cidade"} • ${dataFormatada}`;
  const resumoTipo = tiposSel.length
    ? tiposSel.map((t) => labelTipo[t]).join(", •")
    : "";
  const resumoPeriodo = periodosSel.length
    ? periodosSel.map((p) => labelPeriodo[p]).join(", •")
    : "";
  const resumoPreco = `${formatMoney(faixaPreco[0])}–${formatMoney(
    faixaPreco[1],
  )}/h`;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff", py: 2, pl: { xs: 0, md: "72px" } }}>
      <Container maxWidth="lg" sx={{ pb: { xs: 10, md: 3 } }}>
        <Card
          sx={{
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            overflow: "hidden",
            mb: 2,
          }}
        >
          <CardActionArea onClick={openFilters}>
            <CardContent sx={{ py: 1.5 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <TuneRoundedIcon sx={{ color: "#00E676" }} />

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography fontWeight={700} sx={{ lineHeight: 1.15 }}>
                    {resumoLinha1}
                  </Typography>

                  <Typography sx={{ opacity: 0.8, fontSize: 13 }} noWrap>
                    {resumoTipo} {resumoPeriodo} {resumoPreco}
                  </Typography>
                </Box>

                <Typography
                  sx={{
                    color: "#00E676",
                    fontWeight: 900,
                    fontSize: 13,
                    fontFamily: "'Poppins', sans-serif",
                  }}
                >
                  Filtrar
                </Typography>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        {/* Lista */}
        <Stack spacing={2} sx={{ pb: 2 }}>
          {filtered.map((l) => {
            const fotoUrl =
              (Array.isArray((l as any).fotos) && (l as any).fotos[0]) ||
              (typeof (l as any).fotoUrl === "string"
                ? (l as any).fotoUrl
                : null) ||
              (Array.isArray((l as any).fotoUrl)
                ? (l as any).fotoUrl[0]
                : null);

            return (
              <Card
                key={l.id}
                data-cy="results-card-local"
                sx={{
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  overflow: "hidden",
                }}
              >
                <CardActionArea
                  data-cy="results-card-local-action"
                  onClick={() =>
                    navigate(`/jogador/local/${l.id}`, {
                      state: {
                        local: l,
                        filtros,
                      },
                    })
                  }
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    sx={{ alignItems: "stretch" }}
                  >
                    {/* imagem */}
                    <Box
                      sx={{
                        width: { xs: "100%", md: 170 },
                        height: { xs: 150, sm: 160, md: 120 },
                        bgcolor: "rgba(255,255,255,0.06)",
                        flexShrink: 0,
                      }}
                    >
                      {fotoUrl ? (
                        <Box
                          component="img"
                          src={fotoUrl}
                          alt={l.nome}
                          sx={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : null}
                    </Box>

                    <CardContent sx={{ flex: 1, py: 1.5 }}>
                      <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Box sx={{ minWidth: 0 }}>
                          <Typography fontWeight={900} sx={{ mb: 0.2 }} noWrap>
                            {l.nome}
                          </Typography>
                          {typeof l.rating === "number" ? (
                            <Stack
                              direction="row"
                              spacing={0.75}
                              alignItems="center"
                              sx={{ mt: 1 }}
                            >
                              <Rating
                                value={l.rating ?? 0}
                                precision={0.5}
                                readOnly
                                size="small"
                              />
                              <Typography sx={{ fontSize: 12, opacity: 0.75 }}>
                                {(l.rating ?? 0).toFixed(1)}
                                {l.totalAvaliacoes
                                  ? ` (${l.totalAvaliacoes})`
                                  : ""}
                              </Typography>
                            </Stack>
                          ) : (
                            <Typography sx={{ fontSize: 12, opacity: 0.6 }}>
                              Sem avaliações
                            </Typography>
                          )}

                          <Typography
                            sx={{
                              opacity: 0.75,
                              fontSize: 13,
                              mt: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: { xs: 2, md: 1 },
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {l.endereco ?? ""}
                          </Typography>
                        </Box>

                        <Box sx={{ flexShrink: 0 }}>
                          <Stack
                            spacing={1.2}
                            alignItems="flex-end"
                            sx={{ flexShrink: 0, mt: 1 }}
                          >
                            <PriceTag value={l.precoHora ?? 0} />

                            {l.tipoLocal ? (
                              <Chip
                                size="small"
                                label={labelTipo[l.tipoLocal]}
                                sx={{
                                  bgcolor: "rgba(0,230,118,0.18)",
                                  border: "1px solid rgba(0,230,118,0.25)",
                                  color: "#fff",
                                  fontWeight: 900,
                                }}
                              />
                            ) : null}
                          </Stack>
                        </Box>
                      </Stack>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1, alignItems: "center" }}
                      >
                        {/* {l.tipoLocal ? (
                          <Chip
                            size="small"
                            label={labelTipo[l.tipoLocal]}
                            sx={{
                              bgcolor: "rgba(0,230,118,0.18)",
                              border: "1px solid rgba(0,230,118,0.25)",
                              color: "#fff",
                              fontWeight: 900,
                            }}
                          />
                        ) : null} */}
                      </Stack>
                    </CardContent>
                  </Stack>
                </CardActionArea>
              </Card>
            );
          })}

          {!filtered.length ? (
            <Box
              data-cy="results-empty"
              sx={{
                p: 3,
                borderRadius: 3,
                border: "1px solid rgba(255,255,255,0.08)",
                bgcolor: "rgba(255,255,255,0.03)",
                textAlign: "center",
                opacity: 0.85,
              }}
            >
              Nenhum local encontrado para esses filtros.
            </Box>
          ) : null}
        </Stack>
      </Container>

      <FiltersDrawerJogador
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        minPreco={minPreco}
        maxPreco={maxPreco}
        tmpFaixa={tmpFaixa}
        setTmpFaixa={setTmpFaixa}
        tmpTipos={tmpTipos}
        setTmpTipos={setTmpTipos}
        tmpPeriodos={tmpPeriodos}
        setTmpPeriodos={setTmpPeriodos}
        labelTipo={labelTipo}
        labelPeriodo={labelPeriodo}
        onClear={clearFilters}
        onApply={applyFilters}
      />
    </Box>
  );
}
