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
import { getAuthHeader } from "@/app/services/getAuthHeader";

type Product = {
    id: string;
    name: string;
    unit: string | null;
    quantity: number;
    minimumStock: number;
    warehouseId: string;
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
    const [restockModalOpen, setRestockModalOpen] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProductId, setSelectedProductId] = useState<string | "">("");

    const handleLogout = () => {
        router.push("/login");
    };

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);
    const handleOpenRestockModal = () => setRestockModalOpen(true);
    const handleCloseRestockModal = () => {
        setRestockModalOpen(false);
        setSelectedProductId("");
    };

    const fetchProducts = async () => {
        try {
            const headers = await getAuthHeader();
            const res = await fetch("http://localhost/api/Products", { headers });
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Produkte:", err);
        }
    };

    const handleRestockRequest = async () => {
        if (!selectedProductId) return;

        try {
            const headers = await getAuthHeader();

            const res = await fetch("http://localhost/api/RestockQueue/request", {
                method: "POST",
                headers,
                body: JSON.stringify({ productId: selectedProductId }),
            });

            if (!res.ok) throw new Error(`Fehler beim Anfordern: ${res.status}`);

            const data = await res.json();
            console.log("✅ Restock angefragt:", data);
            alert("Restock wurde erfolgreich angefordert.");
            handleCloseRestockModal();
        } catch (err) {
            console.error("❌ Fehler beim Restock-Request:", err);
            alert("Fehler beim Anfordern des Restocks.");
        }
    };

    useEffect(() => {
        if (modalOpen) {
            const fetchLowStock = async () => {
                try {
                    const headers = await getAuthHeader();
                    const res = await fetch("http://localhost/api/Products/low-stock", { headers });
                    if (!res.ok) throw new Error(`HTTP ${res.status}`);
                    const text = await res.text();
                    const data = text ? JSON.parse(text) : [];
                    setLowStockProducts(data);
                } catch (err) {
                    console.error("❌ Fehler beim Laden von Low-Stock:", err);
                    setLowStockProducts([]);
                }
            };
            fetchLowStock();
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

            {/* Theme Switcher */}
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

            {/* Low Stock Button */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2, height: 150 }}>
                <CardContent sx={{ height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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

            {/* Request Restock Button */}
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2, height: 150 }}>
                <CardContent sx={{ height: "100%" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
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

            {/* Modal: Low Stock Products */}
            <Modal open={modalOpen} onClose={handleCloseModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Low Stock Products
                    </Typography>
                    {lowStockProducts.length > 0 ? (
                        <List>
                            {lowStockProducts.map((product) => (
                                <ListItem key={product.id}>
                                    <ListItemText
                                        primary={product.name}
                                        secondary={`Quantity: ${product.quantity} / Min: ${product.minimumStock}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No low stock products found.</Typography>
                    )}
                </Box>
            </Modal>

            {/* Modal: Request Restock */}
            <Modal open={restockModalOpen} onClose={handleCloseRestockModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Request Product Restock
                    </Typography>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <InputLabel id="select-product-label">Select Product</InputLabel>
                        <Select
                            labelId="select-product-label"
                            value={selectedProductId}
                            label="Select Product"
                            onChange={(e) => setSelectedProductId(e.target.value)}
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
                        disabled={!selectedProductId}
                    >
                        Submit Request
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
