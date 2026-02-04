import { StrictMode } from "react";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@emotion/react";
import { futspotTheme } from "./theme.ts";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { NotificacaoProvider } from "./contexts/NotificacaoContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <StrictMode>
      <ThemeProvider theme={futspotTheme}>
        <NotificacaoProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificacaoProvider>
      </ThemeProvider>
    </StrictMode>
    ,
  </BrowserRouter>,
);
