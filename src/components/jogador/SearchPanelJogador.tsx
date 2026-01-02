import { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Checkbox,
  ListItemText,
  Popover,
  Autocomplete,
} from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import type { PeriodoDia, Modalidade } from "../../types/local";
import { PERIODOS, TIPOS_QUADRA } from "../../types/local";

type Props = {
  onSearch: (filters: {
    cidade: string | null;
    tipos: Modalidade[];
    periodos: PeriodoDia[];
    data: string;
  }) => void;
};

export default function SearchPanelJogador({ onSearch }: Props) {
  const [cidade, setCidade] = useState<string | null>(null);
  const [cidadeInput, setCidadeInput] = useState("");
  const [cidadeOptions, setCidadeOptions] = useState<string[]>([]);

  const cacheRef = useRef<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const normalize = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();

  const [tipos, setTipos] = useState<Modalidade[]>([]);
  const [periodos, setPeriodos] = useState<PeriodoDia[]>([]);

  const [anchorLoc, setAnchorLoc] = useState<null | HTMLElement>(null);
  const [anchorTipo, setAnchorTipo] = useState<null | HTMLElement>(null);
  const [anchorPeriodo, setAnchorPeriodo] = useState<null | HTMLElement>(null);

  const openTipo = Boolean(anchorTipo);
  const openPeriodo = Boolean(anchorPeriodo);

  const [dataText, setDataText] = useState("");
  const [dataISO, setDataISO] = useState("");

  const tipoLabel =
    tipos.length === 0
      ? "Tipo"
      : TIPOS_QUADRA.filter((t) => tipos.includes(t.key))
          .map((t) => t.label)
          .join(", ");

  const periodoLabel =
    periodos.length === 0
      ? "Período"
      : PERIODOS.filter((p) => periodos.includes(p.key))
          .map((p) => p.label)
          .join(", ");

  async function ensureIbgeLoaded() {
    if (cacheRef.current) return;
    setLoading(true);
    try {
      const res = await fetch(
        "https://servicodados.ibge.gov.br/api/v1/localidades/municipios"
      );
      if (!res.ok) throw new Error("IBGE error");
      const data: Array<{ id: number; nome: string }> = await res.json();
      cacheRef.current = data.map((m) => m.nome);
    } finally {
      setLoading(false);
    }
  }

  function filterIbgeCities(query: string, limit = 12) {
    const q = normalize(query);
    if (!cacheRef.current || q.length < 3) return [];

    const starts: string[] = [];
    const includes: string[] = [];

    for (const nome of cacheRef.current) {
      const n = normalize(nome);
      if (n.startsWith(q)) starts.push(nome);
      else if (n.includes(q)) includes.push(nome);
    }

    return [...starts, ...includes].slice(0, limit);
  }

  useEffect(() => {
    const q = cidadeInput.trim();

    if (q.length < 3) {
      setCidadeOptions([]);
      return;
    }

    let alive = true;

    const t = window.setTimeout(async () => {
      try {
        await ensureIbgeLoaded();
        if (!alive) return;
        setCidadeOptions(filterIbgeCities(q, 12));
      } catch {
        if (!alive) return;
        setCidadeOptions([]);
      }
    }, 300);

    return () => {
      alive = false;
      window.clearTimeout(t);
    };
  }, [cidadeInput]);

  const toggleTipo = (t: Modalidade) => {
    setTipos((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]
    );
  };

  const togglePeriodo = (p: PeriodoDia) => {
    setPeriodos((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]
    );
  };

  const handleUseMyLocation = () => {
    setAnchorLoc(null);

    if (!navigator.geolocation) {
      alert("Seu navegador não suporta localização.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
          );

          if (!res.ok) {
            throw new Error("Erro ao buscar endereço");
          }

          const data = await res.json();

          const address = data.address || {};

          const cidade =
            address.city ||
            address.town ||
            address.village ||
            address.municipality;

          if (!cidade) {
            alert("Não foi possível identificar a cidade.");
            return;
          }

          setCidade(cidade);
          setCidadeInput(cidade);
        } catch (err) {
          alert("Erro ao obter sua cidade pela localização.");
        }
      },
      () => {
        alert(
          "Não foi possível obter sua localização. Verifique as permissões."
        );
      }
    );
  };

  const brToISO = (br: string) => {
    const v = br.replace(/\D/g, "").slice(0, 8);
    if (v.length < 8) return "";
    const dd = v.slice(0, 2);
    const mm = v.slice(2, 4);
    const yyyy = v.slice(4, 8);

    const d = Number(dd);
    const m = Number(mm);
    const y = Number(yyyy);

    if (!d || !m || !y) return "";
    if (m < 1 || m > 12) return "";
    if (d < 1 || d > 31) return "";

    return `${yyyy}-${mm}-${dd}`;
  };

  return (
    <Box
      sx={{
        borderRadius: { xs: 2, md: 2 },
        bgcolor: "#1E1E1E",
        border: "1px solid rgba(255,255,255,0.10)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ p: { xs: 2, md: 2.5 } }}>
        {/* Desktop (md+) */}
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Stack spacing={2}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box sx={{ flex: 2 }}>
                <Autocomplete
                  options={cidadeOptions}
                  loading={loading}
                  value={cidade}
                  inputValue={cidadeInput}
                  onChange={(_, v) => {
                    setCidade(v);
                    if (v) setCidadeInput(v);
                  }}
                  onInputChange={(_, v, reason) => {
                    if (reason === "input") {
                      setCidadeInput(v);
                    }
                  }}
                  noOptionsText={
                    cidadeInput.trim().length < 3
                      ? "Digite 3 letras"
                      : "Nenhuma cidade encontrada"
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Local (cidade)" />
                  )}
                />
              </Box>
              <IconButton
                onClick={(e) => setAnchorLoc(e.currentTarget)}
                sx={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  bgcolor: "rgba(255,255,255,0.04)",
                  borderRadius: 2,
                  width: 52,
                  height: 52,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.10)",
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                }}
              >
                <MyLocationIcon />
              </IconButton>
              <Box sx={{ flex: 1.1, minWidth: 190 }}>
                <TextField
                  placeholder="Data (dd/mm/aaaa)"
                  value={dataText}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const digits = raw.replace(/\D/g, "").slice(0, 8);

                    let formatted = "";
                    if (digits.length <= 2) {
                      formatted = digits;
                    } else if (digits.length <= 4) {
                      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
                    } else {
                      formatted = `${digits.slice(0, 2)}/${digits.slice(
                        2,
                        4
                      )}/${digits.slice(4)}`;
                    }

                    setDataText(formatted);

                    if (digits.length === 8) {
                      const iso = brToISO(formatted);
                      setDataISO(iso || "");
                    } else {
                      setDataISO("");
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <AccessTimeOutlinedIcon
                        sx={{ mr: 1, color: "rgba(255,255,255,0.7)" }}
                      />
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      bgcolor: "rgba(255,255,255,0.04)",
                      borderRadius: 2,
                      height: 52,
                    },
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={(e) => setAnchorTipo(e.currentTarget)}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 2, // ✅
                  textTransform: "none",
                  minWidth: 160,
                  height: 52,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.10)",
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                }}
                startIcon={<FilterAltOutlinedIcon />}
              >
                {tipoLabel}
              </Button>
              <Button
                variant="outlined"
                onClick={(e) => setAnchorPeriodo(e.currentTarget)}
                sx={{
                  color: "#fff",
                  bgcolor: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 2, // ✅
                  textTransform: "none",
                  minWidth: 160,
                  height: 52,
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.10)",
                    borderColor: "rgba(255,255,255,0.25)",
                  },
                }}
                startIcon={<AccessTimeOutlinedIcon />}
              >
                {periodoLabel}
              </Button>
              ={" "}
              <Button
                variant="contained"
                onClick={() =>
                  onSearch({ cidade, tipos, periodos, data: dataISO })
                }
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 900,
                  px: 4,
                  height: 52,
                  bgcolor: "#00C853",
                  color: "#ffffffff",
                  "&:hover": { bgcolor: "#01a847ff" },
                }}
              >
                Procurar
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* Mobile (xs/sm) */}
        <Box sx={{ display: { xs: "block", md: "none" } }}>
          <Stack spacing={0}>
            <Stack
              direction={{ xs: "row", md: "row" }}
              spacing={0}
              alignItems={{ md: "center" }}
            >
              <Box sx={{ flex: 1 }}>
                <Autocomplete
                  options={cidadeOptions}
                  loading={loading}
                  value={cidade}
                  inputValue={cidadeInput}
                  onChange={(_, v) => {
                    setCidade(v);
                    if (v) setCidadeInput(v);
                  }}
                  onInputChange={(_, v, reason) => {
                    if (reason === "input") {
                      setCidadeInput(v);
                    }
                  }}
                  noOptionsText={
                    cidadeInput.trim().length < 3
                      ? "Digite 3 letras"
                      : "Nenhuma cidade encontrada"
                  }
                  renderInput={(params) => (
                    <TextField {...params} placeholder="Local (cidade)" />
                  )}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                    "& .MuiInputLabel-root": {
                      color: "rgba(255,255,255,0.70)",
                    },
                  }}
                />

                <Divider
                  sx={{ my: 0.75, borderColor: "rgba(255,255,255,0.08)" }}
                />
              </Box>

              <Box>
                <IconButton
                  onClick={(e) => setAnchorLoc(e.currentTarget)}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 2,
                    mt: 1,
                  }}
                >
                  <MyLocationIcon />
                </IconButton>
              </Box>
            </Stack>

            <TextField
              type="date"
              value={dataISO}
              onChange={(e) => setDataISO(e.target.value)}
              InputLabelProps={{ shrink: true }}
              label="Data"
              sx={{
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                mt: 1.5,
              }}
            />

            <Divider sx={{ my: 0.75, borderColor: "rgba(255,255,255,0.08)" }} />

            <Stack direction={{ xs: "column", md: "row" }} spacing={0}>
              {/* Tipo (clean select) */}
              <TextField
                select
                label="Tipo de quadra"
                value={tipos}
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    const arr = Array.isArray(selected) ? selected : [];
                    return arr.length ? arr.join(", ") : "Selecionar";
                  },
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  const arr =
                    typeof value === "string" ? value.split(",") : value;
                  setTipos(arr as Modalidade[]);
                }}
              >
                {TIPOS_QUADRA.map((t) => (
                  <MenuItem key={t.key} value={t.key}>
                    <Checkbox checked={tipos.includes(t.key)} />
                    {t.label}
                  </MenuItem>
                ))}
              </TextField>

              <Divider
                sx={{ my: 0.75, borderColor: "rgba(255,255,255,0.08)" }}
              />

              {/* Período (clean select) */}
              <TextField
                select
                label="Período"
                value={periodos}
                sx={{
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.75)" },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => {
                    const arr = Array.isArray(selected) ? selected : [];
                    return arr.length ? arr.join(", ") : "Selecionar";
                  },
                }}
                onChange={(e) => {
                  const value = e.target.value;
                  const arr =
                    typeof value === "string" ? value.split(",") : value;
                  setPeriodos(arr as PeriodoDia[]);
                }}
              >
                {PERIODOS.map((p) => (
                  <MenuItem key={p.key} value={p.key}>
                    <Checkbox checked={periodos.includes(p.key)} />
                    {p.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <Box sx={{ mt: 1.5, mx: -2, mb: -2 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() =>
                  onSearch({ cidade, tipos, periodos, data: dataISO })
                }
                sx={{
                  borderRadius: "0 0 16px 16px",
                  textTransform: "none",
                  fontWeight: 900,
                  py: 1.7,
                  bgcolor: "#00E676",
                  color: "#101010",
                  "&:hover": { bgcolor: "#00C853" },
                }}
              >
                Procurar
              </Button>
            </Box>
          </Stack>
        </Box>

        {/*MENUS DE LOCALIZAÇÃO */}
        <Menu
          anchorEl={anchorLoc}
          open={Boolean(anchorLoc)}
          onClose={() => setAnchorLoc(null)}
        >
          <MenuItem onClick={handleUseMyLocation}>
            Usar minha localização
          </MenuItem>
          <MenuItem
            onClick={() => {
              setAnchorLoc(null);
              setCidade(null);
            }}
          >
            Limpar local
          </MenuItem>
        </Menu>

        <Popover
          open={openTipo}
          anchorEl={anchorTipo}
          onClose={() => setAnchorTipo(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 1 }}>
            {TIPOS_QUADRA.map((t) => (
              <MenuItem key={t.key} onClick={() => toggleTipo(t.key)}>
                <Checkbox checked={tipos.includes(t.key)} />
                <ListItemText primary={t.label} />
              </MenuItem>
            ))}
          </Box>
        </Popover>

        <Popover
          open={openPeriodo}
          anchorEl={anchorPeriodo}
          onClose={() => setAnchorPeriodo(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
          <Box sx={{ p: 1 }}>
            {PERIODOS.map((p) => (
              <MenuItem key={p.key} onClick={() => togglePeriodo(p.key)}>
                <Checkbox checked={periodos.includes(p.key)} />
                <ListItemText primary={p.label} />
              </MenuItem>
            ))}
          </Box>
        </Popover>
      </Box>
    </Box>
  );
}
