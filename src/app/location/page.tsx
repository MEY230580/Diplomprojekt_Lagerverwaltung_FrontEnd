"use client";
import * as React from 'react';
import { Container, CssBaseline, Box, Typography, Button, } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar  from "@/app/components/Sidebar/Sidebar";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function Page(){
    const router = useRouter();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [error, setError] = useState<string | null>(null);

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

    const handleChangeLocation =  (id : number) => {
        router.push(`/location/${id}`);
    };

    return (
        <>
            <Sidebar />
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx = {{mt: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
                    <Typography variant="h2">Location</Typography>
                    <Box sx={{ mt:3 }}>
                        {warehouses.map((warehouse) => (
                            <Button
                                key={warehouse.id}
                                fullWidth
                                variant="contained"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    "&:hover": {
                                        backgroundColor: "#e3d5c6",
                                        color: "black" }
                                }}
                                onClick={() => handleChangeLocation(warehouse.id)} // Pass the warehouse ID
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