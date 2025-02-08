"use client";
import * as React from "react";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import { Button } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";

export default function Page() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <>
            <Sidebar />
            <Button onClick={toggleTheme} variant="contained" sx={{ position: "absolute", top: 20, right: 20 }}>
                {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
        </>
    );
}
