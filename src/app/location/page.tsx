"use client";
import * as React from 'react';
import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";
import useFetch from "@/app/hooks/useFetch";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function Page() {
    const router = useRouter();
    const { darkMode } = useTheme();

    const apiUrl = 'http://localhost:5100/api/Warehouse';
    const { data, loading, error } = useFetch(apiUrl);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    // Ensure data is an array before mapping
    const warehouses: Warehouse[] = Array.isArray(data) ? data : [];

    const handleChangeLocation = (id: number) => {
        router.push(`/location/${id}`);
    };

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Typography variant="h2">Location</Typography>
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
                                onClick={() => handleChangeLocation(warehouse.id)}
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
