import {
  AppBar,
  Box,
  Container,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import FutspotLogo from "../assets/LogoFutSpotDark.png";

export default function TermosUso() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: "background.default", mt: 2 }}
      >
        <Toolbar disableGutters>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 6, lg: 8 } }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => navigate("/")}
              >
                <Box
                  component="img"
                  src={FutspotLogo}
                  alt="FutSpot"
                  sx={{ height: 40 }}
                />

                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    fontFamily: "'Poppins', sans-serif",
                    color: "#00E676",
                    pr: 5,
                  }}
                >
                  Fut<span style={{ color: "#fff" }}>Spot</span>
                </Typography>
              </Stack>
            </Stack>
          </Container>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box mb={6}>
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Termos de Uso
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Última atualização: 24 de fevereiro de 2026
          </Typography>
        </Box>

        <Section
          title="1. Sobre a Plataforma"
          content={[
            `O FutSpot é uma plataforma digital que conecta locadores de espaços esportivos a jogadores interessados em realizar agendamentos.`,
            `O FutSpot atua exclusivamente como intermediador tecnológico, não sendo proprietário ou responsável direto pelos locais cadastrados.`,
          ]}
        />

        <Section
          title="2. Cadastro de Usuários"
          content={[
            `Para utilizar a plataforma, o usuário deverá fornecer informações verdadeiras e atualizadas.`,
          ]}
          list={[
            "Locadores podem cadastrar múltiplos locais.",
            "Jogadores podem solicitar agendamentos.",
          ]}
        />

        <Section
          title="3. Responsabilidades do Locador"
          list={[
            "Garantir veracidade das informações do local.",
            "Manter disponibilidade real dos horários ofertados.",
            "Assegurar condições adequadas de uso e segurança.",
          ]}
        />

        <Section
          title="4. Responsabilidades do Jogador"
          list={[
            "Respeitar horários agendados.",
            "Utilizar o espaço de forma adequada.",
            "Cumprir regras estabelecidas pelo locador.",
          ]}
        />

        <Section
          title="5. Limitação de Responsabilidade"
          content={[
            "O FutSpot não participa da relação contratual direta entre locador e jogador.",
            "O FutSpot não se responsabiliza por danos, acidentes, cancelamentos ou conflitos ocorridos entre as partes.",
          ]}
        />

        <Section
          title="6. Cancelamentos"
          content={[
            "As regras de cancelamento são definidas pelo locador.",
            "O FutSpot não se responsabiliza por reembolsos ou acordos financeiros entre as partes.",
          ]}
        />

        <Section
          title="7. Suspensão de Conta"
          content={[
            "O FutSpot poderá suspender ou remover contas que violem estes Termos de Uso.",
          ]}
        />

        <Section
          title="8. Contato"
          content={[
            "Para dúvidas, entre em contato pelo e-mail: futspot.app@gmail.com",
          ]}
        />
      </Container>
    </>
  );
}

function Section({
  title,
  content,
  list,
}: {
  title: string;
  content?: string[];
  list?: string[];
}) {
  return (
    <Box mb={5}>
      <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
        {title}
      </Typography>

      {content &&
        content.map((text, index) => (
          <Typography
            key={index}
            variant="body1"
            paragraph
            sx={{ color: "text.primary", lineHeight: 1.8 }}
          >
            {text}
          </Typography>
        ))}

      {list && (
        <Box component="ul" sx={{ pl: 3, mt: 1 }}>
          {list.map((item, index) => (
            <Box component="li" key={index} sx={{ mb: 1 }}>
              <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
