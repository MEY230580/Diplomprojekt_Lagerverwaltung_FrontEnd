"use client";
import { Container, CssBaseline, Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { useParams } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";
import * as React from "react";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function LocationChange() {
    const { id } = useParams();

    const apiUrl = `http://localhost:5000/api/Warehouse/${id}`; // ✅ Fixed template string
    const { data, loading, error } = useFetch(apiUrl);
    if (!id) return <Typography color="error">Invalid warehouse ID</Typography>;

    // ✅ Convert 'data' to Warehouse type or set it to null if not valid
    const warehouse: Warehouse | null = data as Warehouse | null;

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">⚠ {error.message} ⚠</Typography>; // ✅ Fixed error display

    return (
        <>
            <Sidebar />
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, textAlign: "center" }}>
                    <Typography variant="h4">{warehouse?.name || "Unknown Warehouse"}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Location: {warehouse?.location || "Unknown"}</Typography>
                    <Box sx={{ mt: 2 }}>
                        {warehouse?.products?.length ? (
                            warehouse.products.map((product: string, index: number) => (
                                <Typography key={index} variant="body1">{product}</Typography>
                            ))
                        ) : (
                            <Typography variant="body1">No products available</Typography>
                        )}
                    </Box>
                </Box>
            </Container>
        </>
    );
}
