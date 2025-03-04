"use client";
import * as React from "react";
import { Container, CssBaseline, Box, Typography, Button } from "@mui/material";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";
import { useLocation } from "@/app/location/LocationContext";
import useFetch from "@/app/hooks/useFetch";
import { useRouter } from "next/navigation";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: { $values: string[] };
}

export default function GetWarehouses() {
    const { darkMode } = useTheme();
    const { selectedLocation, setSelectedLocation } = useLocation();
    const router = useRouter();

    const apiUrl = "http://localhost:5100/api/Warehouse";
    const { data, loading, error } = useFetch(apiUrl);
    console.log("API Response:", data); //Debugging: Check API response

    //FIX: Ensure `data` is correctly formatted
    const warehouses: Warehouse[] = (data as { $values: Warehouse[] })?.$values ?? [];

    React.useEffect(() => {
        if (selectedLocation) {
            router.push("/");
        }
    }, [selectedLocation, router]);

    if (loading) return <p>Loading...</p>;

    const handleLocationSelect = (location: string) => {
        setSelectedLocation(location);
        router.push("/");
    };

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ error ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h2">Which Location are you currently at?</Typography>
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
                                    onClick={() => handleLocationSelect(warehouse.location)}
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