"use client";
import * as React from "react";
import { useEffect, useState } from "react";
import {
    Container,
    CssBaseline,
    Box,
    Typography,
    Button,
    TextField,
    Modal,
    IconButton,
    ListItem,
    ListItemText,
} from "@mui/material";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";
import Sidebar from "@/app/components/Sidebar";
import { auth } from "@/app/services/firebase";
import { apiRequest } from "@/app/services/api";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

interface Product {
    id: number;
    name: string;
    quantity: number;
    minimumStock: number;
    warehouseId: number;
    warehouseName: string;
    unit: string;
}

export default function Page() {
    const { darkMode } = useTheme();

    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<string | null>(null);
    const [openAdd, setOpenAdd] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
    const [name, setName] = useState("");
    const [location, setLocation] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const user = auth.currentUser;
                if (!user) return;

                const token = await user.getIdToken();

                const response = await fetch("http://localhost/api/roles/user-role", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Fehler beim Abrufen der Rolle");

                const data = await response.json();
                // data = { role: "admin" } oder z.B. { role: "user" }
                setUserRole(data.role);
                console.log("User role from API:", data.role);
            } catch (error) {
                console.error(error);
                setError("Fehler beim Laden der Benutzerrolle");
            }
        };

        const fetchWarehouses = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    setError("Nicht eingeloggt");
                    return;
                }

                const token = await user.getIdToken();
                const response = await fetch("http://localhost/api/Warehouse", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) throw new Error(`Fehler beim Laden: ${response.status}`);

                const data: Warehouse[] = await response.json();
                setWarehouses(data);
            } catch (err) {
                console.error(err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchWarehouses();
    }, []);

    const reloadWarehouses = async () => {
        try {
            const user = auth.currentUser;
            if (!user) return;

            const token = await user.getIdToken();
            const response = await fetch("http://localhost/api/Warehouse", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const data: Warehouse[] = await response.json();
                setWarehouses(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWarehouseProducts = async (warehouseId: number) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Nicht eingeloggt");
                return;
            }

            const token = await user.getIdToken();
            const res = await fetch(`http://localhost/api/Warehouse/products/${warehouseId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) throw new Error(`Fehler beim Abrufen der Produkte (${res.status})`);

            const products: Product[] = await res.json();
            setSelectedProducts(products);
        } catch (err) {
            alert((err as Error).message);
        }
    };

    const handleAddWarehouse = async () => {
        try {
            await apiRequest("Warehouse", "POST", { name, location });
            setOpenAdd(false);
            setName("");
            setLocation("");
            await reloadWarehouses();
        } catch {
            alert("Fehler beim Hinzufügen");
        }
    };

    const handleEditWarehouse = async () => {
        if (!selectedWarehouse) return;
        try {
            await apiRequest(`Warehouse/${selectedWarehouse.id}`, "PUT", {
                name,
                location,
            });
            setOpenEdit(false);
            await reloadWarehouses();
        } catch {
            alert("Fehler beim Bearbeiten");
        }
    };

    const handleDeleteWarehouse = async () => {
        if (!selectedWarehouse) return;
        try {
            await apiRequest(`Warehouse/${selectedWarehouse.id}`, "DELETE");
            setOpenDelete(false);
            await reloadWarehouses();
        } catch {
            alert("Fehler beim Löschen");
        }
    };

    return (
        <>
            <Sidebar />
            <Container maxWidth="sm">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography variant="h2">Warehouses</Typography>

                    {error && <Typography color="error">{error}</Typography>}
                    {loading && <Typography>Loading...</Typography>}

                    <Box sx={{ mt: 3, width: "100%" }}>
                        {warehouses.map((warehouse) => (
                            <ListItem
                                key={warehouse.id}
                                sx={{
                                    backgroundColor: darkMode ? "#333" : "#f3f3f3",
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                                secondaryAction={
                                    userRole === "admin" && (
                                        <>
                                            <IconButton
                                                edge="end"
                                                aria-label="edit"
                                                onClick={() => {
                                                    setSelectedWarehouse(warehouse);
                                                    setName(warehouse.name);
                                                    setLocation(warehouse.location);
                                                    setOpenEdit(true);
                                                }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                edge="end"
                                                aria-label="delete"
                                                onClick={() => {
                                                    setSelectedWarehouse(warehouse);
                                                    setOpenDelete(true);
                                                }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </>
                                    )
                                }
                            >
                                <ListItemText
                                    primary={warehouse.name}
                                    secondary={warehouse.location}
                                    onClick={() => fetchWarehouseProducts(warehouse.id)}
                                    sx={{ cursor: "pointer" }}
                                />
                            </ListItem>
                        ))}
                    </Box>

                    {selectedProducts.length > 0 && (
                        <Box sx={{ mt: 4, width: "100%" }}>
                            <Typography variant="h6">Produkte im Warehouse:</Typography>
                            {selectedProducts.map((product) => (
                                <Box key={product.id} sx={{ mb: 1 }}>
                                    <Typography variant="body1">
                                        • {product.name} – {product.quantity} {product.unit} (Min: {product.minimumStock})
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {userRole === "admin" && (
                        <Button sx={{ mt: 4 }} variant="contained" onClick={() => setOpenAdd(true)}>
                            Neues Warehouse hinzufügen
                        </Button>
                    )}
                </Box>
            </Container>

            {/* Modal für Add/Edit */}
            <Modal
                open={openAdd || openEdit}
                onClose={() => {
                    setOpenAdd(false);
                    setOpenEdit(false);
                }}
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        minWidth: 300,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {openAdd ? "Warehouse hinzufügen" : "Warehouse bearbeiten"}
                    </Typography>
                    <TextField
                        fullWidth
                        label="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        sx={{ mb: 2 }}
                    />
                    <Button
                        variant="contained"
                        fullWidth
                        onClick={openAdd ? handleAddWarehouse : handleEditWarehouse}
                    >
                        Speichern
                    </Button>
                </Box>
            </Modal>

            {/* Modal für Delete */}
            <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        p: 4,
                        borderRadius: 2,
                        minWidth: 300,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Warehouse wirklich löschen?
                    </Typography>
                    <Typography gutterBottom>
                        {selectedWarehouse?.name} ({selectedWarehouse?.location})
                    </Typography>
                    <Button
                        color="error"
                        variant="contained"
                        fullWidth
                        onClick={handleDeleteWarehouse}
                    >
                        Löschen
                    </Button>
                </Box>
            </Modal>
        </>
    );
}
