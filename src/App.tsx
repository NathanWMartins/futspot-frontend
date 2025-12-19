import { Box } from "@mui/material";
import { LandingPage } from "./pages/LandingPage";
import { Route, Routes } from "react-router-dom";
import JogadorHome from "./pages/jogador/JogadorHome";
import LocadorHome from "./pages/locador/LocadorHome";
import LocadorLocais from "./pages/locador/LocadorLocais";

function App() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home-jogador" element={<JogadorHome />} />
        <Route path="/home-locador" element={<LocadorHome />} />
        <Route path="/locador/locais" element={<LocadorLocais />} />
      </Routes>
    </Box>
  );
}

export default App;

