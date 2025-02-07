"use client";
import {useEffect, useState} from "react";
import {Container, CssBaseline, Box, Typography, CircularProgress} from "@mui/material";
import Sidebar from "@/app/components/Sidebar/Sidebar";
import {useParams} from "next/navigation";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function LocationChange() {
    const { id } = useParams();
    const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:5100/api/Warehouse/${id}`)
            .then(response => response.json())
            .then ((data) => {
                console.log("API Response:", data);
                setWarehouse(data);
                setLoading(false);
            })
            .catch ((error) => {
               console.error("Error retrieving Data:", error);
               setError(error.message);
               setLoading(false);
            });
    }, [id]);

    if (loading) return <CircularProgress sx={{display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">⚠ {error} ⚠</Typography>;

    return (
        <>
            <Sidebar />
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, textAlign: "center" }}>
                    <Typography variant="h4">{warehouse?.name}</Typography>
                    <Typography variant="h6" sx={{ mt:2 }}>Location: {warehouse?.location}</Typography>
                    <Box sx={{ mt: 2 }}>
                        {warehouse?.products.length ? (
                            warehouse.products.map((product, index) => (
                                <Typography key={index} variant="body1" >{product}</Typography>
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