import { Box, Stack, Tab, Tabs } from "@mui/material";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

type Props = {
  value: 0 | 1;
  onChange: (v: 0 | 1) => void;
};

export default function ProfileTabs({ value, onChange }: Props) {
  return (
    <Box
      sx={{
        borderRadius: 3,
        border: "1px solid rgba(255,255,255,0.08)",
        bgcolor: "rgba(255,255,255,0.03)",
        p: 0.5,
      }}
    >
      <Tabs
        value={value}
        onChange={(_, v) => onChange(v)}
        variant="fullWidth"
        TabIndicatorProps={{ style: { display: "none" } }}
        sx={{
          minHeight: 42,
          "& .MuiTab-root": {
            minHeight: 42,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 900,
            color: "rgba(255,255,255,0.75)",
          },
          "& .Mui-selected": {
            bgcolor: "rgba(0,230,118,0.18)",
            border: "1px solid rgba(0,230,118,0.30)",
            color: "#fff",
          },
        }}
      >
        <Tab
          value={0}
          label={
            <Stack direction="row" spacing={0.8} alignItems="center">
              <PersonRoundedIcon fontSize="small" />
              <span>Sobre você</span>
            </Stack>
          }
        />
        <Tab
          value={1}
          label={
            <Stack direction="row" spacing={0.8} alignItems="center">
              <SettingsRoundedIcon fontSize="small" />
              <span>Conta</span>
            </Stack>
          }
        />
      </Tabs>
    </Box>
  );
}
