"use client";
import * as React from "react";
import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";
import { useLocation } from "@/app/location/LocationContext";
import useFetch from "@/app/hooks/useFetch"; // Import context hook

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: { $values: string[] }; // Adjusted to match API response
}

export default function GetWarehouses() {
    const { darkMode } = useTheme();
    const { setSelectedLocation } = useLocation(); // Get location setter from context

    const apiUrl = 'http://localhost:5100/api/Warehouse';
    const { data, loading, error } = useFetch(apiUrl); // Explicitly set type for data

    // If loading, show loading state
    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ error ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h2">Which Location are you currently at?</Typography>
                    <Box sx={{ mt: 3 }}>
                        {/* Ensure data is an array before calling map */}
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map((warehouse: Warehouse) => (
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
                                    onClick={() => setSelectedLocation(warehouse.location)} // Store selected location globally
                                >
                                    {warehouse.name}
                                </Button>
                            ))
                        ) : (
                            <Typography variant="body1">No warehouses available.</Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
