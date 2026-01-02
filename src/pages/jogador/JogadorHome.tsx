import { Box, Container } from "@mui/material";
import HeroJogador from "../../components/jogador/HeroJogador";
import SearchPanelJogador from "../../components/jogador/SearchPanelJogador";
import type { PeriodoDia, Modalidade } from "../../types/local";

export default function HomeJogador() {

  const handleSearch = (filters: {
    cidade: string | null;
    tipos: Modalidade[];
    periodos: PeriodoDia[];
    data: string;
  }) => {
    console.log("SEARCH:", filters);
    // Aqui você chama seu service pra buscar locais com filtros
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212" }}>
      {/* HERO FULL WIDTH */}
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            width: "100%",
            height: { xs: 260, sm: 260, md: 280 },
            overflow: "hidden",
            borderBottomLeftRadius: { xs: 10, md: 0 },
            borderBottomRightRadius: { xs: 10, md: 0 },
          }}
        >
          <HeroJogador />
        </Box>

        <Container
          maxWidth="lg"
          sx={{
            px: { xs: 2, sm: 2, md: 0 },
            zIndex: 2,

            position: { xs: "relative", md: "absolute" },
            left: { md: 0 },
            right: { md: 0 },
            bottom: { md: -90 },

            mt: { xs: -5, sm: -8, md: 0 },
          }}
        >
          <SearchPanelJogador onSearch={handleSearch} />
        </Container>
      </Box>
    </Box>
  );
}
