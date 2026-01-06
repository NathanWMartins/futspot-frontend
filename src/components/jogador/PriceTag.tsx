import { Box, Typography, useMediaQuery, useTheme } from "@mui/material";

export function PriceTag({ value }: { value: number }) {
  const fixed = Number.isFinite(value) ? value.toFixed(2) : "0.00";
  const [intPart, decPart] = fixed.split(".");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 0.5, mt: isMobile ? 0 : 2 }}>
      <Typography sx={{ fontWeight: isMobile ? 700 : 900, fontSize: isMobile ? 22 : 28, lineHeight: 1 }}>
        R$
      </Typography>

      <Typography sx={{ fontWeight: isMobile ? 700 : 900, fontSize: isMobile ? 22 : 28, lineHeight: 1 }}>
        {intPart}
      </Typography>

      <Typography
        sx={{
          fontWeight: isMobile ? 700 : 900,
          fontSize: 14,
          lineHeight: isMobile ? 0.8 : 1,
          mt: 0.45,
          opacity: 0.85,
        }}
      >
        ,{decPart}
      </Typography>
    </Box>
  );
}
