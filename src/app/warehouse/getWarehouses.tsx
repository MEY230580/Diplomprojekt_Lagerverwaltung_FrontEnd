"use client";
import * as React from "react";
import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";
import useFetch from "@/app/hooks/useFetch";
import { useRouter } from "next/navigation";

interface Warehouse {
    id: string;
    name: string;
    location: string;
}

export default function GetWarehouses() {
    const { darkMode } = useTheme();
    const router = useRouter();

    const apiUrl = "http://localhost/api/Warehouse";
    const { data, loading, error } = useFetch(apiUrl);
    const warehouses: Warehouse[] = Array.isArray(data) ? data : [];
    if (loading) return <p>Loading...</p>;
    console.log(warehouses);

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ error ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h2" gutterBottom>
                        Select a Warehouse
                    </Typography>
                    <Box sx={{ mt: 3 }}>
                        {warehouses.length > 0 ? (
                            warehouses.map((warehouse: Warehouse) => (
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
                                    onClick={() => {
                                        router.push(`/warehouse/${warehouse.id}`);
                                    }}
                                >
                                    {warehouse.name}
                                </Button>
                            ))
                        ) : (
                            <Typography variant="body1">⚠ No warehouses available.</Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
