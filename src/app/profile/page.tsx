"use client";
import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Modal,
    List,
    ListItem,
    ListItemText,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from "@mui/material";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";

// Define the Product type
type Product = {
    id: number;  // Added 'id' to be able to send in POST
    name: string;
    stock: number;
};

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
};

export default function Page() {
    const router = useRouter();
    const { darkMode, toggleTheme } = useTheme();

    const [modalOpen, setModalOpen] = useState(false);
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);

    // New states for Restock Request
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/login");
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleOpenRestockModal = () => {
        setRestockModalOpen(true);
    };

    const handleCloseRestockModal = () => {
        setRestockModalOpen(false);
        setSelectedProductId(null);
    };

    const fetchProducts = () => {
        fetch("http://localhost:5002/api/Products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.error("Error fetching products:", err));
    };

    const handleRestockRequest = () => {
        if (selectedProductId !== null) {
            fetch("http://localhost:5002/api/RestockQueue/request", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ productId: selectedProductId }),
            })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to request restock");
                    return response.json();
                })
                .then(data => {
                    console.log("Restock requested:", data);
                    handleCloseRestockModal();
                    alert("Restock requested successfully!");
                })
                .catch(err => {
                    console.error("Error requesting restock:", err);
                    alert("Failed to request restock.");
                });
        }
    };

    useEffect(() => {
        if (modalOpen) {
            fetch("http://localhost:5002/api/Products/low-stock")
                .then(res => res.json())
                .then(data => setLowStockProducts(data))
                .catch(err => console.error("Error fetching low stock products:", err));
        }
    }, [modalOpen]);

    useEffect(() => {
        if (restockModalOpen) {
            fetchProducts();
        }
    }, [restockModalOpen]);

    return (
        <>
            <Sidebar />

            {/* Welcome Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h2">Hello User!</Typography>
                        <Button variant="contained" color="error" onClick={handleLogout}>Log Out</Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Info Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant="body1">Name:</Typography>
                    <Typography variant="body1">Email:</Typography>
                </CardContent>
            </Card>

            {/* Theme Switcher Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h4">Appearance</Typography>
                        <Button onClick={toggleTheme} variant="contained">
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Low Stock Products Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2, height: 150 }}>
                <CardContent sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleOpenModal}
                            sx={{
                                backgroundColor: "#e3d5c6",
                                color: "#000",
                                "&:hover": { backgroundColor: "#d4c1b2" }
                            }}
                        >
                            View Low Stock Products
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* NEW Request Restock Card */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2, height: 150 }}>
                <CardContent sx={{ height: "100%" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleOpenRestockModal}
                            sx={{
                                backgroundColor: "#b3d9ff",
                                color: "#000",
                                "&:hover": { backgroundColor: "#99ccff" }
                            }}
                        >
                            Request Restock
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Modal for Low Stock Products */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Low Stock Products
                    </Typography>
                    {lowStockProducts.length > 0 ? (
                        <List>
                            {lowStockProducts.map((product, index) => (
                                <ListItem key={index}>
                                    <ListItemText
                                        primary={product.name}
                                        secondary={`Stock: ${product.stock}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No low stock products found.</Typography>
                    )}
                </Box>
            </Modal>

            {/* Modal for Requesting Restock */}
            <Modal open={restockModalOpen} onClose={handleCloseRestockModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Request Product Restock
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="select-product-label">Select Product</InputLabel>
                        <Select
                            labelId="select-product-label"
                            value={selectedProductId ?? ""}
                            label="Select Product"
                            onChange={(e) => setSelectedProductId(Number(e.target.value))}
                        >
                            {products.map((product) => (
                                <MenuItem key={product.id} value={product.id}>
                                    {product.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button
                        variant="contained"
                        color="primary"
                        sx={{ mt: 3 }}
                        onClick={handleRestockRequest}
                        disabled={selectedProductId === null}
                    >
                        Submit Request
                    </Button>
                </Box>
            </Modal>
        </>
    );
}