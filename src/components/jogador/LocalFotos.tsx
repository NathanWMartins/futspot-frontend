import { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

type Props = {
  fotos: string[];
  height?: { xs: number; sm: number; md: number };
  autoplayMs?: number;
};

export default function LocalFotos({
  fotos,
  height = { xs: 220, sm: 280, md: 380 },
  autoplayMs = 4500,
}: Props) {
  const mdUp = useMediaQuery("(min-width:900px)");
  const [open, setOpen] = useState(false);

  const safeFotos = useMemo(() => fotos?.filter(Boolean) ?? [], [fotos]);

  return (
    <>
      {mdUp ? (
        <DesktopGrid
          fotos={safeFotos}
          height={height.md}
          onOpenAll={() => setOpen(true)}
        />
      ) : (
        <MobileSwipe
          fotos={safeFotos}
          height={{ xs: height.xs, sm: height.sm }}
          autoplayMs={autoplayMs}
          onOpenAll={() => setOpen(true)}
        />
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogContent sx={{ bgcolor: "#121212", p: 2 }}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography sx={{ fontWeight: 900, color: "#fff" }}>
              Fotos do local
            </Typography>
            <IconButton onClick={() => setOpen(false)} sx={{ color: "#fff" }}>
              <CloseRoundedIcon />
            </IconButton>
          </Stack>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            {safeFotos.map((url, i) => (
              <Box
                key={i}
                component="img"
                src={url}
                alt={`Foto ${i + 1}`}
                sx={{
                  width: "100%",
                  height: { xs: 220, sm: 240 },
                  objectFit: "cover",
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              />
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}

/** -------- Desktop: Grid estilo Airbnb -------- */
function DesktopGrid({
  fotos,
  height,
  onOpenAll,
}: {
  fotos: string[];
  height: number;
  onOpenAll: () => void;
}) {
  const items = fotos.slice(0, 5);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.03)",
      }}
    >
      <Box
        sx={{
          height,
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr",
          gridTemplateRows: "1fr 1fr",
          gap: 0.75,
          p: 0.75,
          bgcolor: "rgba(0,0,0,0.25)",
        }}
      >
        {/* Foto grande */}
        <Foto
          url={items[0]}
          sx={{
            gridColumn: "1 / span 1",
            gridRow: "1 / span 2",
            borderRadius: 2.25,
          }}
        />

        {/* 4 pequenas */}
        <Foto
          url={items[1]}
          sx={{ gridColumn: "2", gridRow: "1", borderRadius: 2.25 }}
        />
        <Foto
          url={items[2]}
          sx={{ gridColumn: "3", gridRow: "1", borderRadius: 2.25 }}
        />
        <Foto
          url={items[3]}
          sx={{ gridColumn: "2", gridRow: "2", borderRadius: 2.25 }}
        />
        <Foto
          url={items[4]}
          sx={{ gridColumn: "3", gridRow: "2", borderRadius: 2.25 }}
        />
      </Box>

      {/* botão "ver todas" */}
      <Button
        onClick={onOpenAll}
        sx={{
          position: "absolute",
          right: 16,
          bottom: 16,
          bgcolor: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontWeight: 900,
          borderRadius: 2,
          px: 2,
          py: 0.9,
          border: "1px solid rgba(255,255,255,0.16)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        Ver todas as fotos
      </Button>
    </Box>
  );
}

/** -------- Mobile: Swipe + autoplay, sem setas -------- */
function MobileSwipe({
  fotos,
  height,
  autoplayMs,
  onOpenAll,
}: {
  fotos: string[];
  height: { xs: number; sm: number };
  autoplayMs: number;
  onOpenAll: () => void;
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const [pauseUntil, setPauseUntil] = useState<number>(0);

  const total = fotos.length;

  // Atualiza index pelo scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const w = el.clientWidth;
      const nextIndex = w ? Math.round(el.scrollLeft / w) : 0;
      setIndex(Math.max(0, Math.min(nextIndex, total - 1)));
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [total]);

  // Autoplay (pausa quando o usuário interage)
  useEffect(() => {
    if (total <= 1) return;

    const t = window.setInterval(() => {
      const el = scrollerRef.current;
      if (!el) return;

      if (Date.now() < pauseUntil) return;

      const w = el.clientWidth;
      if (!w) return;

      const next = (index + 1) % total;
      el.scrollTo({ left: next * w, behavior: "smooth" });
    }, autoplayMs);

    return () => window.clearInterval(t);
  }, [autoplayMs, index, pauseUntil, total]);

  const pause = () => setPauseUntil(Date.now() + 3500);

  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: 3,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.03)",
      }}
    >
      <Box
        ref={scrollerRef}
        onTouchStart={pause}
        onMouseDown={pause}
        sx={{
          height,
          display: "flex",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          scrollBehavior: "smooth",
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
        }}
      >
        {fotos.map((url, i) => (
          <Box
            key={i}
            sx={{
              flex: "0 0 100%",
              height: "100%",
              scrollSnapAlign: "start",
              position: "relative",
              bgcolor: "rgba(255,255,255,0.06)",
            }}
          >
            <Box
              component="img"
              src={url}
              alt={`Foto ${i + 1}`}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
            {/* overlay leve */}
            <Box
              sx={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.45) 100%)",
              }}
            />
          </Box>
        ))}
      </Box>

      {/* bolinhas */}
      {total > 1 && (
        <Stack
          direction="row"
          spacing={0.75}
          sx={{
            position: "absolute",
            left: "50%",
            bottom: 10,
            transform: "translateX(-50%)",
          }}
        >
          {fotos.map((_, i) => (
            <Box
              key={i}
              sx={{
                width: i === index ? 18 : 8,
                height: 8,
                borderRadius: 99,
                bgcolor: i === index ? "#00E676" : "rgba(255,255,255,0.45)",
                transition: "all .15s ease",
              }}
            />
          ))}
        </Stack>
      )}

      {/* botão "ver todas" */}
      <Button
        onClick={onOpenAll}
        sx={{
          position: "absolute",
          right: 12,
          top: 12,
          bgcolor: "rgba(0,0,0,0.55)",
          color: "#fff",
          fontWeight: 900,
          borderRadius: 2,
          px: 1.5,
          py: 0.6,
          border: "1px solid rgba(255,255,255,0.16)",
          "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
        }}
      >
        Ver todas
      </Button>
    </Box>
  );
}

function Foto({ url, sx }: { url?: string; sx?: any }) {
  return url ? (
    <Box
      component="img"
      src={url}
      alt="Foto"
      sx={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        ...sx,
      }}
    />
  ) : (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        bgcolor: "rgba(255,255,255,0.06)",
        ...sx,
      }}
    />
  );
}
