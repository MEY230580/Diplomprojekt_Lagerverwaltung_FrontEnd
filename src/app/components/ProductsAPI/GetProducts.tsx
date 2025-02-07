"use client";
import { useEffect, useState } from "react";
import {useRouter} from "next/navigation";
import { Container, CssBaseline, Box, Typography, Button, Grid, } from "@mui/material";

interface Product {
    id: number;
    name: string;
    quantity: number;
    location: string;
}

interface GetProductsProps {
    searchQuery: string;
    sortBy: string;
}

export default function GetProducts({ searchQuery, sortBy }: GetProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:5100/api/products")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setProducts(data.$values);
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    // Filter products based on search query
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sort products based on the selected sorting option
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "quantity") return b.quantity - a.quantity;
        return 0;
    });

    return (
        <>
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{mt: 20, display: "flex", flexDirection: 'column', alignItems: "center", }}>
                    <Typography variant="h4"> Article List</Typography>
                    <Grid container spacing={ 3 } sx={{ mt: 3 }}>
                        {sortedProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "#fff",
                                        color: "#000",
                                        "&:hover": { backgroundColor: "#e3d5c6", color: "black" },
                                    }}
                                    onClick={() => router.push(`/products/${product.id}`)}
                                >
                                    <Typography variant="h6">{product.name}</Typography>
                                </Button>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            </Container>
        </>
    );
}