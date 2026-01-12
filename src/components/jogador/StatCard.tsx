import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatRowProps = {
  label: string;
  value: ReactNode;
  highlight?: boolean;
  icon: ReactNode;
};

export default function StatCard({ label, value, highlight, icon }: StatRowProps) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      sx={{ py: 1 }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        {icon}
        <Typography sx={{ fontSize: 14, opacity: 0.7 }}>
          {label}
        </Typography>
      </Stack>

      <Typography
        sx={{
          fontSize: 15,
          fontWeight: 600,
          color: highlight ? "#00E676" : "inherit",
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
