import { Alert, Box, Container, Snackbar } from "@mui/material";
import HeroJogador from "../../components/jogador/HeroJogador";
import SearchPanelJogador from "../../components/jogador/SearchPanelJogador";
import type { PeriodoDia, Modalidade, LocalCardDTO } from "../../types/local";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { searchLocais } from "../../services/locaisService";

export default function HomeJogador() {
  const navigate = useNavigate();

  const [snack, setSnack] = useState<{ open: boolean; msg: string; severity: "info" | "error" }>({
    open: false,
    msg: "",
    severity: "info",
  });

  const [loadingSearch, setLoadingSearch] = useState(false);

  const handleSearch = async (filters: {
    cidade: string | null;
    tipos: Modalidade[];
    periodos: PeriodoDia[];
    data: string;
  }) => {
    if (!filters.cidade) {
      setSnack({ open: true, msg: "Selecione uma cidade para buscar.", severity: "info" });
      return;
    }
    if (!filters.data) {
      setSnack({ open: true, msg: "Selecione uma data para buscar.", severity: "info" });
      return;
    }

    try {
      setLoadingSearch(true);

      const locais: LocalCardDTO[] = await searchLocais(filters);

      if (!locais.length) {
        setSnack({
          open: true,
          msg: "Nenhum local disponível encontrado para esses filtros.",
          severity: "info",
        });
        return;
      }

      navigate("/jogador/resultados", {
        state: { filtros: filters, locais },
      });
    } catch (e) {
      setSnack({
        open: true,
        msg: "Erro ao buscar locais. Tente novamente.",
        severity: "error",
      });
    } finally {
      setLoadingSearch(false);
    }
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
          <SearchPanelJogador onSearch={handleSearch} loadingSearch={loadingSearch}/>
        </Container>
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3500}
        onClose={() => setSnack((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnack((s) => ({ ...s, open: false }))}
          severity={snack.severity}
          variant="filled"
        >
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
