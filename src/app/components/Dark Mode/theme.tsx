import { createTheme } from "@mui/material/styles";

const lightTheme = createTheme({
    palette: {
        mode: "light",
        primary: {
            main: "#e3d5c6",
        },
        background: {
            default: "#fff",
        },
    },
});

const darkTheme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#D67A69",
        },
        background: {
            default: "#121212",
        },
    },
});

export { lightTheme, darkTheme };