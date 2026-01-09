import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";

type Props = {
  open: boolean;
  onClose: () => void;
  localNome?: string | null;
  endereco?: string | null;
};

type Geo = { lat: number; lon: number };

async function geocodeNominatim(endereco: string): Promise<Geo | null> {
  const q = encodeURIComponent(endereco);
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`;

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data: any[] = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;

  const lat = Number(data[0].lat);
  const lon = Number(data[0].lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lon)) return null;
  return { lat, lon };
}

function buildGoogleMapsLink(endereco: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    endereco
  )}`;
}

function buildOsmEmbed(lat: number, lon: number) {
  const delta = 0.005;
  const left = lon - delta;
  const right = lon + delta;
  const top = lat + delta;
  const bottom = lat - delta;

  const bbox = `${left},${bottom},${right},${top}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(
    bbox
  )}&layer=mapnik&marker=${lat},${lon}`;
}

export default function MapDialog({
  open,
  onClose,
  localNome,
  endereco,
}: Props) {
  const [geo, setGeo] = useState<Geo | null>(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const cacheKey = useMemo(() => {
    if (!endereco) return null;
    return `geo:${endereco}`;
  }, [endereco]);

  useEffect(() => {
    if (!open) return;

    if (!endereco) {
      setGeo(null);
      setErro("Endereço não disponível.");
      return;
    }

    // cache simples pra não consultar sempre o Nominatim
    const cached = cacheKey ? localStorage.getItem(cacheKey) : null;
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Geo;
        if (parsed?.lat && parsed?.lon) {
          setGeo(parsed);
          setErro(null);
          return;
        }
      } catch {}
    }

    let cancelled = false;

    (async () => {
      setLoading(true);
      setErro(null);
      setGeo(null);

      try {
        const r = await geocodeNominatim(endereco);
        if (cancelled) return;

        if (!r) {
          setErro("Não foi possível localizar no mapa.");
          return;
        }

        setGeo(r);
        if (cacheKey) localStorage.setItem(cacheKey, JSON.stringify(r));
      } catch (e) {
        if (!cancelled) setErro("Erro ao carregar o mapa.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, endereco, cacheKey]);

  const googleLink = endereco ? buildGoogleMapsLink(endereco) : null;
  const embedUrl = geo ? buildOsmEmbed(geo.lat, geo.lon) : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "#121212",
          color: "#fff",
          borderRadius: 4,
          border: "1px solid rgba(255,255,255,0.10)",
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 900, pr: 6 }}>
        {localNome ?? "Localização"}

        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 10,
            top: 10,
            color: "rgba(255,255,255,0.85)",
          }}
          aria-label="Fechar"
        >
          <CloseRoundedIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={1.25}>
          <Typography sx={{ opacity: 0.8, fontSize: 13 }}>
            {endereco ?? "Endereço não informado"}
          </Typography>

          <Box
            sx={{
              borderRadius: isMobile ? 3 : 3,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: isMobile ? "16px 16px 0 0" : 3,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.10)",
                borderBottom: isMobile ? "none" : undefined,
                bgcolor: "rgba(255,255,255,0.03)",
                height: 360,
              }}
            >
              {loading ? (
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ opacity: 0.75 }}>
                    Carregando mapa...
                  </Typography>
                </Box>
              ) : erro ? (
                <Box sx={{ p: 2 }}>
                  <Typography sx={{ opacity: 0.75 }}>{erro}</Typography>
                </Box>
              ) : embedUrl ? (
                <Box
                  component="iframe"
                  title="Mapa"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  style={{ border: 0, display: "block" }}
                />
              ) : null}

              {!isMobile && googleLink && (
                <Box
                  sx={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 14,
                    display: "flex",
                    justifyContent: "center",
                    zIndex: 10,
                  }}
                >
                  <Button
                    component="a"
                    href={googleLink}
                    target="_blank"
                    rel="noreferrer"
                    startIcon={<OpenInNewRoundedIcon />}
                    sx={{
                      height: 44,
                      px: 3.5,
                      borderRadius: 999,
                      textTransform: "none",
                      fontWeight: 900,
                      fontSize: 15,
                      bgcolor: "#00c767ff",
                      color: "#fff",
                      boxShadow: "0 10px 26px rgba(0,230,118,0.35)",
                      "&:hover": {
                        bgcolor: "#00E676",
                        boxShadow: "0 12px 30px rgba(0,230,118,0.45)",
                      },
                    }}
                  >
                    Abrir no Google Maps
                  </Button>
                </Box>
              )}
            </Box>

            {isMobile && googleLink && (
              <Button
                component="a"
                href={googleLink}
                target="_blank"
                rel="noreferrer"
                startIcon={<OpenInNewRoundedIcon />}
                fullWidth
                sx={{
                  borderRadius: "0 0 16px 16px",
                  height: 46,
                  textTransform: "none",
                  fontWeight: 900,
                  fontSize: 15,
                  bgcolor: "#00c767ff",
                  color: "#fff",
                  boxShadow: "0 10px 26px rgba(0,230,118,0.28)",
                  "&:hover": { bgcolor: "#00E676" },
                }}
              >
                Abrir no Maps
              </Button>
            )}
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
