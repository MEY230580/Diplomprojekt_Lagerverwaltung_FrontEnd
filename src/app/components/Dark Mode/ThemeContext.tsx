"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./theme";

//TypeScript-Typen für den Context
interface ThemeContextType {
    darkMode: boolean;
    toggleTheme: () => void;
}

//Context erstellen (mit Default-Werten)
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

//ThemeProvider-Wrapper für die gesamte App
export const ThemeProviderWrapper = ({ children }: { children: ReactNode }) => {
    const [darkMode, setDarkMode] = useState<boolean | null>(null); //Initial state is null (waiting for client-side check)

    //Check if it's the client side and get theme from localStorage
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) {
            setDarkMode(savedTheme === "dark");
        } else {
            setDarkMode(false); //Default to light theme if no theme is found in localStorage
        }
    }, []);

    //Toggle theme between dark and light
    const toggleTheme = () => {
        const newMode = !darkMode;
        setDarkMode(newMode);
        localStorage.setItem("theme", newMode ? "dark" : "light");
    };

    //If darkMode is still null, we haven't determined the theme yet, so we render nothing (waiting for client-side JS)
    if (darkMode === null) {
        return null;
    }

    return (
        <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
            <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
                <CssBaseline />
                {children}
            </ThemeProvider>
        </ThemeContext.Provider>
    );
};

//Custom Hook for accessing the theme in other components
export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProviderWrapper");
    }
    return context;
};
