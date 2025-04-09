"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container, CssBaseline, Box, Typography, Button, Grid } from "@mui/material";

interface Product {
    id: string;
    name: string;
    quantity: number;
    location?: string;
}

interface GetProductsProps {
    searchQuery: string;
    sortBy: string;
}

export default function GetProducts({ searchQuery, sortBy }: GetProductsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [newProduct, setNewProduct] = useState({
        name: "",
        quantity: 0,
        warehouseId: "11111111-1111-1111-1111-111111111111",
        minimumStock: 0
    });
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [role, setRole] = useState<{ role: string; isManager: boolean } | null>(null);
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then(async (response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                const text = await response.text();
                if (!text) throw new Error("Empty response from /products");
                return JSON.parse(text);
            })
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setError("Failed to fetch products");
            });
    }, []);

    useEffect(() => {
        fetch("http://localhost:5000/api/Base/user-role")
            .then(async (response) => {
                if (!response.ok) throw new Error("Network response was not ok");
                const text = await response.text();
                if (!text) throw new Error("Empty response from /roles/user-role");
                return JSON.parse(text);
            })
            .then((data) => {
                setRole(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user role:", error);
                setError("Failed to retrieve user role");
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "quantity") return b.quantity - a.quantity;
        return 0;
    });

    const handleAddProduct = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch("http://localhost:5000/api/Products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newProduct),
            });

            if (!response.ok) {
                throw new Error("Failed to add product");
            }

            const addedProduct = await response.json();
            setProducts(prev => [...prev, addedProduct]);
            setNewProduct({
                name: "",
                quantity: 0,
                warehouseId: "11111111-1111-1111-1111-111111111111",
                minimumStock: 0
            });
            setShowForm(false);
        } catch (error) {
            console.error("Error adding product:", error);
            setError("An error occurred.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {error && <p>{error}</p>}
            <Container maxWidth="sm">
                <CssBaseline />
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    role?.isManager && (
                        <Button
                            variant="outlined"
                            onClick={() => setShowForm((prev) => !prev)}
                            sx={{ width: { xs: "100%", md: "25ch" }, position: "absolute", top: 20, right: 380 }}
                        >
                            {showForm ? "Cancel" : "Add New Product"}
                        </Button>
                    )
                )}

                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    {showForm && (
                        <Box component="form" sx={{ width: "100%", mb: 3 }}>
                            <input
                                type="text"
                                placeholder="Product Name"
                                value={newProduct.name}
                                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                            />
                            <input
                                type="number"
                                placeholder="Quantity"
                                value={newProduct.quantity}
                                onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                            />
                            <input
                                type="number"
                                placeholder="Minimum Stock"
                                value={newProduct.minimumStock}
                                onChange={(e) => setNewProduct({ ...newProduct, minimumStock: Number(e.target.value) })}
                                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                            />
                            <select
                                value={newProduct.warehouseId}
                                onChange={(e) => setNewProduct({ ...newProduct, warehouseId: e.target.value })}
                                style={{ width: "100%", marginBottom: "10px", padding: "8px" }}
                            >
                                <option value="11111111-1111-1111-1111-111111111111">Warehouse A</option>
                                <option value="22222222-2222-2222-2222-222222222222">Warehouse B</option>
                            </select>
                            <Button
                                variant="contained"
                                onClick={handleAddProduct}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? "Adding..." : "Submit Product"}
                            </Button>
                        </Box>
                    )}

                    {/* Product Cards */}
                    <Grid container spacing={3} sx={{ mt: 3 }}>
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
