"use client";

import {
    Container,
    CssBaseline,
    Box,
    Typography,
    CircularProgress,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Grid,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { useParams, useRouter } from "next/navigation";
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
    const router = useRouter();
    const apiUrl = `http://localhost:5000/api/Warehouse/products/${id}`;
    const { data, loading, error } = useFetch(apiUrl);

    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newQuantity, setNewQuantity] = React.useState<number | "">("");
    const [submitError, setSubmitError] = React.useState<string | null>(null);

    const products = (data as Product[]) || [];
    const warehouseName = products.length > 0 ? products[0].warehouseName : "Unknown Warehouse";

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "quantity") return b.quantity - a.quantity;
        return 0;
    });

    const handleAddProduct = async () => {
        setSubmitError(null);
        try {
            const roleRes = await fetch("http://localhost:5000/api/Products/user-role");
            const roleData = await roleRes.json();

            if (!roleData.isManager) {
                setSubmitError("Only managers can add products.");
                return;
            }

            const res = await fetch("http://localhost:5000/api/Products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: newName,
                    quantity: Number(newQuantity),
                    warehouseId: id,
                }),
            });

            if (!res.ok) throw new Error("Failed to add product");

            setOpenDialog(false);
            setNewName("");
            setNewQuantity("");
            window.location.reload(); // refresh to show new product
        } catch (err) {
            if (err instanceof Error) {
                setSubmitError(err.message);
            } else {
                setSubmitError("Something went wrong.");
            }
        }
    };

    if (!id) return <Typography color="error">Invalid warehouse ID</Typography>;
    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error">⚠ {error.message} ⚠</Typography>;

    return (
        <>
            <Sidebar />
            <Container maxWidth="lg">
                <CssBaseline />
                <Box sx={{ mt: 6, ml: { sm: 10, md: 20 } }}>
                    <Typography variant="h4" sx={{ mb: 2 }}>
                        {warehouseName}
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            gap: 2,
                            mb: 4,
                        }}
                    >
                        <Button variant="outlined" onClick={() => setOpenDialog(true)}>
                            Add New Product
                        </Button>
                        <TextField
                            size="small"
                            placeholder="Search…"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <FormControl size="small">
                            <InputLabel>Sort</InputLabel>
                            <Select
                                value={sortBy}
                                label="Sort"
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <MenuItem value="name">Name</MenuItem>
                                <MenuItem value="quantity">Quantity</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Grid container spacing={3} justifyContent="center">
                        {sortedProducts.length ? (
                            sortedProducts.map((product) => (
                                <Grid item xs={12} sm={6} md={3} key={product.id}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => router.push(`/products/${product.id}`)}
                                        sx={{
                                            backgroundColor: "#fff",
                                            color: "#000",
                                            fontWeight: "bold",
                                            "&:hover": {
                                                backgroundColor: "#e3d5c6",
                                                color: "black",
                                            },
                                        }}
                                    >
                                        {product.name}
                                    </Button>
                                </Grid>
                            ))
                        ) : (
                            <Typography variant="body1">No products available</Typography>
                        )}
                    </Grid>
                </Box>
            </Container>

            {/* Add Product Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                    <TextField
                        label="Product Name"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="Quantity"
                        type="number"
                        value={newQuantity}
                        onChange={(e) => setNewQuantity(Number(e.target.value))}
                        fullWidth
                    />
                    {submitError && (
                        <Typography color="error" variant="body2">
                            ⚠ {submitError}
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleAddProduct} disabled={!newName || !newQuantity}>
                        Submit
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}