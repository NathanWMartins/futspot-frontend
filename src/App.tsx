import { Box } from "@mui/material";
import { LandingPage } from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import LocadorHome from "./pages/locador/HomeLocador";
import LocadorLocais from "./pages/locador/LocalLocador";
import AgendaLocador from "./pages/locador/AgendaLocador";
import EditarPerfilPage from "./pages/EditarPerfil";
import LocadorLayout from "./pages/locador/LocadorLayout";
import RequireAuth from "./routes/RequireAuth";
import JogadorHome from "./pages/jogador/JogadorHome";
import JogadorLayout from "./pages/jogador/JogadorLayout";
import ResultadosJogador from "./pages/jogador/ResultadosJogador";
import LocalDetalheJogador from "./pages/jogador/LocalDetalheJogador";
import AgendaJogador from "./pages/jogador/AgendaJogador";
import PerfilJogador from "./pages/jogador/PerfilJogador";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route element={<RequireAuth />}>
          {/* Locador Routes */}
          <Route path="/locador" element={<LocadorLayout />}>
            <Route path="home" element={<LocadorHome />} />
            <Route path="locais" element={<LocadorLocais />} />
            <Route path="agenda" element={<AgendaLocador />} />
            <Route path="editar-perfil" element={<EditarPerfilPage />} />
          </Route>
          <Route path="/jogador" element={<JogadorLayout/>}>
            <Route path="home" element={<JogadorHome/>} />
            <Route path="resultados" element={<ResultadosJogador />} />
            <Route path="local/:id" element={<LocalDetalheJogador />} />
            <Route path="agenda" element={<AgendaJogador />} />
            <Route path="editar-perfil" element={<PerfilJogador/> } />
          </Route>
        </Route>
      </Routes>
    </Box>
  );
}

export default App;

