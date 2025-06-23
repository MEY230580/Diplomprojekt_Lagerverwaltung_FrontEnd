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
import { getAuthHeader } from "@/app/services/getAuthHeader";
import { getIdTokenResult } from "firebase/auth";
import { auth } from "@/app/services/firebase";

interface Product {
    id: string;
    name: string;
    quantity: number;
    minimumStock: number;
    warehouseId: string;
    warehouseName: string;
    unit: string | null;
    version: number; // 👈 Add this
}

export default function LocationChange() {
    const { id } = useParams();
    const router = useRouter();
    const apiUrl = `http://localhost/api/Warehouse/products/${id}`;
    const { data: rawData, loading, error } = useFetch(apiUrl);

    // State für Warehouses zum Move-Ziel
    const [warehouses, setWarehouses] = React.useState<{ id: string; name: string }[]>([]);
    const [selectedDestinationWarehouseId, setSelectedDestinationWarehouseId] = React.useState<string>("");

    const [searchQuery, setSearchQuery] = React.useState("");
    const [sortBy, setSortBy] = React.useState("name");
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openMoveDialog, setOpenMoveDialog] = React.useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = React.useState(false);
    const [newName, setNewName] = React.useState("");
    const [newQuantity, setNewQuantity] = React.useState<number | "">("");
    const [moveQuantity, setMoveQuantity] = React.useState<number | "">("");
    const [updateQuantity, setUpdateQuantity] = React.useState<number | "">("");
    const [selectedProductId, setSelectedProductId] = React.useState<string>("");
    const [selectedUpdateProductId, setSelectedUpdateProductId] = React.useState<string>("");
    const [submitError, setSubmitError] = React.useState<string | null>(null);
    const [moveError, setMoveError] = React.useState<string | null>(null);
    const [updateError, setUpdateError] = React.useState<string | null>(null);
    const [newMinimumStock, setNewMinimumStock] = React.useState<number | "">("");

    React.useEffect(() => {
        const checkUserRole = async () => {
            const user = auth.currentUser;
            if (user) {
                const tokenResult = await getIdTokenResult(user, true);
                console.log("🎭 Firebase Custom Claims:", tokenResult.claims);
            }
        };
        checkUserRole();
    }, []);

    // Warehouses laden für Move-Ziel Auswahl
    React.useEffect(() => {
        const fetchWarehouses = async () => {
            try {
                const res = await fetch("http://localhost/api/Warehouse");
                if (!res.ok) throw new Error("Failed to fetch warehouses");
                const data = await res.json();
                setWarehouses(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchWarehouses();
    }, []);

    const products = (rawData as Product[]) || [];
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
            const headers = await getAuthHeader();

            const roleRes = await fetch("http://localhost/api/Products/user-role", {
                method: "GET",
                headers,
            });

            const roleContentType = roleRes.headers.get("content-type");
            if (!roleContentType?.includes("application/json")) {
                const roleText = await roleRes.text();
                console.error("Unerwartete Rollenantwort:", roleText);
                throw new Error("Fehler beim Abrufen der Benutzerrolle.");
            }

            const roleData = await roleRes.json();
            const userRole = (roleData.role || "").toLowerCase();
            if (userRole !== "manager") {
                setSubmitError("Only managers can add products.");
                return;
            }

            const res = await fetch("http://localhost/api/Products", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    name: newName,
                    quantity: Number(newQuantity),
                    minimumStock: Number(newMinimumStock),
                    warehouseId: id,
                    unit: "units",
                }),
            });

            const contentType = res.headers.get("content-type");

            if (!res.ok) {
                const errorText = await res.text();
                console.error("❌ Fehlerantwort beim Hinzufügen:", errorText);
                throw new Error("Failed to add product.");
            }

            if (!contentType?.includes("application/json")) {
                const rawText = await res.text();
                console.warn("⚠️ Antwort ist kein JSON:", rawText);
                throw new Error("Serverantwort ist kein gültiges JSON.");
            }

            await res.json();
            setOpenDialog(false);
            setNewName("");
            setNewQuantity("");
            setNewMinimumStock("");
            window.location.reload();
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "Something went wrong.");
        }
    };

    const submitMove = async () => {
        const selectedProduct = products.find((p) => p.id === selectedProductId);
        if (!selectedProduct || moveQuantity === "" || moveQuantity <= 0) {
            setMoveError("Please select a product and enter a valid quantity.");
            return;
        }

        if (!selectedDestinationWarehouseId) {
            setMoveError("Please select a destination warehouse.");
            return;
        }

        if (moveQuantity > selectedProduct.quantity) {
            setMoveError("Cannot move more than available stock.");
            return;
        }

        try {
            const headers = await getAuthHeader();

            await fetch("http://localhost/api/movements/create", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    id: crypto.randomUUID(),
                    productId: selectedProduct.id,
                    productName: selectedProduct.name,
                    fromWarehouseId: id,
                    toWarehouseId: selectedDestinationWarehouseId,
                    quantity: moveQuantity,
                    movementsDate: new Date().toISOString(),
                }),
            });

            await fetch("http://localhost/api/movements/update-stock", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    productId: selectedProduct.id,
                    quantity: -moveQuantity,
                    movementType: "Move",
                    user: "system",
                }),
            });

            setOpenMoveDialog(false);
            setSelectedProductId("");
            setMoveQuantity("");
            setSelectedDestinationWarehouseId("");
            window.location.reload();
        } catch (err) {
            setMoveError(err instanceof Error ? err.message : "Something went wrong during the move.");
        }
    };

    const handleUpdateProduct = async () => {
        const headers = await getAuthHeader();
        headers["Content-Type"] = "application/json";

        try {
            const productRes = await fetch(`http://localhost/api/Products/${selectedUpdateProductId}`, {
                headers,
            });

            if (!productRes.ok) throw new Error("Failed to fetch latest product version.");

            const latestProduct: Product = await productRes.json();

            const newTotalQuantity = latestProduct.quantity + Number(updateQuantity);
            if (newTotalQuantity < 0) {
                setUpdateError("Quantity cannot be less than 0.");
                return;
            }

            const updatedProduct = {
                name: latestProduct.name,
                quantity: newTotalQuantity,
                minimumStock: latestProduct.minimumStock,
                unit: latestProduct.unit || "units",
                version: latestProduct.version, // ✅ fresh version
            };

            const res = await fetch(`http://localhost/api/Products/${selectedUpdateProductId}`, {
                method: "PUT",
                headers,
                body: JSON.stringify(updatedProduct),
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(`Failed to update product: ${errorText}`);
            }

            setOpenUpdateDialog(false);
            setSelectedUpdateProductId("");
            setUpdateQuantity("");
            window.location.reload();
        } catch (err) {
            setUpdateError(err instanceof Error ? err.message : "Something went wrong.");
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
                        <Button variant="outlined" onClick={() => setOpenDialog(true)}>Add New Product</Button>
                        <Button variant="outlined" onClick={() => setOpenUpdateDialog(true)}>Update Product</Button>
                        <Button variant="outlined" onClick={() => setOpenMoveDialog(true)}>Move Product</Button>
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
                            <Typography>No products found</Typography>
                        )}
                    </Grid>
                </Box>

                {/* Dialog zum Hinzufügen neuer Produkte */}
                <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <TextField
                            label="Name"
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
                        <TextField
                            label="Minimum Stock"
                            type="number"
                            value={newMinimumStock}
                            onChange={(e) => setNewMinimumStock(Number(e.target.value))}
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
                        <Button variant="contained" onClick={handleAddProduct} disabled={!newName || !newQuantity || !newMinimumStock}>
                            Add
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog für Produkt-Update */}
                <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
                    <DialogTitle>Update Product Quantity</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Product</InputLabel>
                            <Select
                                value={selectedUpdateProductId}
                                label="Select Product"
                                onChange={(e) => setSelectedUpdateProductId(e.target.value)}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name} (Available: {product.quantity})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <TextField
                            label="Quantity to Add/Remove"
                            type="number"
                            value={updateQuantity}
                            onChange={(e) => setUpdateQuantity(Number(e.target.value))}
                            fullWidth
                        />
                        {updateError && (
                            <Typography color="error" variant="body2">
                                ⚠ {updateError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenUpdateDialog(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={handleUpdateProduct}
                            disabled={!selectedUpdateProductId || updateQuantity === ""}
                        >
                            Update
                        </Button>
                    </DialogActions>
                </Dialog>

                {/* Dialog für Product Move mit Dropdown für Ziel-Warehouse */}
                <Dialog open={openMoveDialog} onClose={() => setOpenMoveDialog(false)}>
                    <DialogTitle>Move Product to Other Warehouse</DialogTitle>
                    <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                        <FormControl fullWidth>
                            <InputLabel>Select Product</InputLabel>
                            <Select
                                value={selectedProductId}
                                label="Select Product"
                                onChange={(e) => setSelectedProductId(e.target.value)}
                            >
                                {products.map((product) => (
                                    <MenuItem key={product.id} value={product.id}>
                                        {product.name} (Available: {product.quantity})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel>Destination Warehouse</InputLabel>
                            <Select
                                value={selectedDestinationWarehouseId}
                                label="Destination Warehouse"
                                onChange={(e) => setSelectedDestinationWarehouseId(e.target.value)}
                            >
                                {warehouses
                                    .filter((w) => w.id !== id) // Ziel darf nicht das gleiche Warehouse sein
                                    .map((warehouse) => (
                                        <MenuItem key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <TextField
                            label="Quantity to Move"
                            type="number"
                            value={moveQuantity}
                            onChange={(e) => setMoveQuantity(Number(e.target.value))}
                            fullWidth
                        />
                        {moveError && (
                            <Typography color="error" variant="body2">
                                ⚠ {moveError}
                            </Typography>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenMoveDialog(false)}>Cancel</Button>
                        <Button
                            variant="contained"
                            onClick={submitMove}
                            disabled={!selectedProductId || moveQuantity === "" || !selectedDestinationWarehouseId}
                        >
                            Move
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </>
    );
}