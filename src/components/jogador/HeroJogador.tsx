import { Box, Typography } from "@mui/material";
import heroImg from "../../assets/hero-football-web.png";

export default function HeroJogador() {
  return (
    <Box
      sx={{
        width: "100%", 
        height: "100%",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        component="img"
        src={heroImg}
        alt="Futebol"
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",        
          display: "block",
        }}
      />

      {/* overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.15) 100%)",
        }}
      />

      {/* texto */}
      <Box
        sx={{
          position: "absolute",
          top: { xs: 50, sm: 30, md: 64 },
          left: 0,
          right: 0,
          zIndex: 2,
          display: "flex",
          justifyContent: { xs: "center", md: "flex-start" },
          px: { xs: 2, md: 6 },
          pointerEvents: "none",
        }}
      >
        <Typography
          sx={{
            color: "rgba(255,255,255,0.95)",
            fontWeight: 900,
            textAlign: { xs: "center", md: "left" },
            letterSpacing: -0.3,
            fontSize: { xs: 18, sm: 20, md: 34 },
            lineHeight: { xs: 1.15, md: 1.1 },
            textShadow: "0 10px 25px rgba(0,0,0,0.55)",
            maxWidth: { xs: 320, md: 700 },
          }}
        >
          Reserve sua quadra em poucos toques.
        </Typography>
      </Box>
    </Box>
  );
}
