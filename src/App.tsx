import { Box } from "@mui/material";
import { LandingPage } from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import JogadorHome from "./pages/jogador/JogadorHome";
import LocadorHome from "./pages/locador/HomeLocador";
import LocadorLocais from "./pages/locador/LocalLocador";
import AgendaLocador from "./pages/locador/AgendaLocador";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home-jogador" element={<JogadorHome />} />
        <Route path="/locador/home" element={<LocadorHome />} />
        <Route path="/locador/locais" element={<LocadorLocais />} />
        <Route path="/locador/agenda" element={<AgendaLocador />} />
      </Routes>
    </Box>
  );
}

export default App;

