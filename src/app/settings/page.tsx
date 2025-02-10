"use client";
import * as React from "react";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import { Card, CardContent, Box, Button, Typography} from "@mui/material";
import Sidebar from "@/app/components/Sidebar";

export default function Page() {
    const { darkMode, toggleTheme } = useTheme();

    return (
        <>
            <Sidebar />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h4"> Appearance </Typography>
                        <Button onClick={toggleTheme} variant="contained">
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}
