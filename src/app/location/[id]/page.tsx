"use client";
import { Container, CssBaseline, Box, Typography, CircularProgress } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { useParams } from "next/navigation";
import useFetch from "@/app/hooks/useFetch";
import * as React from "react";

interface Product {
    id: string;
    name: string;
    quantity: number;
    minimumStock: number;
    warehouseId: string;
    warehouseName: string;
    unit: string | null;
}

export default function LocationChange() {
    const { id } = useParams();
    const apiUrl = `http://localhost:5000/api/Warehouse/products/${id}`;
    const { data, loading, error } = useFetch(apiUrl);

    if (!id) return <Typography color="error">Invalid warehouse ID</Typography>;
    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">⚠ {error.message} ⚠</Typography>;

    const products = data as Product[] || [];

    const warehouseName = products.length > 0 ? products[0].warehouseName : "Unknown Warehouse";

    return (
        <>
            <Sidebar />
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, textAlign: "center" }}>
                    <Typography variant="h4">{warehouseName}</Typography>
                    <Typography variant="h6" sx={{ mt: 2 }}>Location: Unknown</Typography> {/* Replace if location becomes available */}
                    <Box sx={{ mt: 2 }}>
                        {products.length ? (
                            products.map((product: Product) => (
                                <Typography key={product.id} variant="body1">
                                    {product.name} — Qty: {product.quantity}
                                </Typography>
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
