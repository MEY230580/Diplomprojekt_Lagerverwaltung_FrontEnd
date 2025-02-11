"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, CssBaseline, Box, Typography, Button, Grid } from "@mui/material";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";

interface Product {
    id: number;
    name: string;
    quantity: number;
    location: string;
}

interface GetProductsProps {
    searchQuery: string;
    sortBy: string;
    selectedLocation: string;
}

export default function GetProducts({ searchQuery, sortBy, selectedLocation }: GetProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { darkMode } = useTheme();

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

    //Filter products by selected location
    const filteredProducts = products.filter(
        (product) => product.location === selectedLocation && product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //Sort products
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
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: darkMode ? "#121212" : "#fff", color: darkMode ? "#fff" : "#333" }}>
                    <Typography variant="h4">Products at {selectedLocation}</Typography>
                    <Grid container spacing={3} sx={{ mt: 3 }}>
                        {sortedProducts.map((product) => (
                            <Grid item xs={12} sm={6} md={4} key={product.id}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: darkMode ? "#333" : "#fff",
                                        color: darkMode ? "#fff" : "#000",
                                        "&:hover": {
                                            backgroundColor: darkMode ? "#D67A69" : "#e3d5c6",
                                            color: darkMode ? "#333" : "#000",
                                        },
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
