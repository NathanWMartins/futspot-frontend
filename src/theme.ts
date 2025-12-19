import { createTheme } from "@mui/material/styles";

export const futspotTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#00E676", 
        },
        secondary: {
            main: "#BDBDBD", 
        },
        background: {
            default: "#121212",
            paper: "#1E1E1E", 
        },
        text: {
            primary: "#FAFAFA",
            secondary: "#BDBDBD",
        },
        error: {
            main: "#D32F2F",
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 999,
                    fontWeight: 600,
                },
            },
        },
    },
});
