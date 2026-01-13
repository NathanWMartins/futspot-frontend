import { Box } from "@mui/material";
import { LandingPage } from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import LocadorHome from "./pages/locador/HomeLocador";
import LocadorLocais from "./pages/locador/LocalLocador";
import AgendaLocador from "./pages/locador/AgendaLocador";
import LocadorLayout from "./pages/locador/LocadorLayout";
import RequireAuth from "./routes/RequireAuth";
import JogadorHome from "./pages/jogador/JogadorHome";
import JogadorLayout from "./pages/jogador/JogadorLayout";
import ResultadosJogador from "./pages/jogador/ResultadosJogador";
import LocalDetalheJogador from "./pages/jogador/LocalDetalheJogador";
import AgendaJogador from "./pages/jogador/AgendaJogador";
import Perfil from "./pages/Perfil";
import UserLayout from "./pages/UserLayout";
import PerfilJogador from "./pages/jogador/PerfilJogador";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user" element={<UserLayout />}>
          <Route path="perfil" element={<Perfil />} />
        </Route>
        <Route element={<RequireAuth />}>
          {/* Locador Routes */}
          <Route path="/locador" element={<LocadorLayout />}>
            <Route path="home" element={<LocadorHome />} />
            <Route path="locais" element={<LocadorLocais />} />
            <Route path="agenda" element={<AgendaLocador />} />
            <Route path="jogador/:id" element={<PerfilJogador />} />
          </Route>
          {/* Jogador Routes */}
          <Route path="/jogador" element={<JogadorLayout />}>
            <Route path="home" element={<JogadorHome />} />
            <Route path="resultados" element={<ResultadosJogador />} />
            <Route path="local/:id" element={<LocalDetalheJogador />} />
            <Route path="agenda" element={<AgendaJogador />} />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;
