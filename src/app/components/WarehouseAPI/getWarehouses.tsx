"use client";
import * as React from 'react';
import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

interface GetWarehousesProps {
    setSelectedLocation: (location: string) => void;
}

export default function GetWarehouses({ setSelectedLocation }: GetWarehousesProps) {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { darkMode } = useTheme();

    useEffect(() => {
        fetch("http://localhost:5100/api/Warehouse")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setWarehouses(data.$values);
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h2">Which Location are you currently at? </Typography>
                    <Box sx={{ mt: 3 }}>
                        {warehouses.map((warehouse) => (
                            <Button
                                key={warehouse.id}
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: darkMode ? "#333" : "#fff",
                                    color: darkMode ? "#fff" : "#000",
                                    "&:hover": {
                                        backgroundColor: darkMode ? "#D67A69" : "#e3d5c6",
                                        color: darkMode ? "#333" : "#000",
                                    },
                                }}
                                onClick={() => setSelectedLocation(warehouse.location)} // Store selected location
                            >
                                {warehouse.name}
                            </Button>
                        ))}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
