"use client";
import * as React from "react";
import { useState, useEffect } from "react";
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
    InputLabel,
    TextField,
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

type RestockQueueItem = {
    id: string;
    productName: string;
    quantity: number;
    requestedAt: string;
    processed: boolean;
};

const modalStyle = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
};

export default function Page() {
    const router = useRouter();
    const {darkMode, toggleTheme} = useTheme();

    // Modal states
    const [modalOpen, setModalOpen] = useState(false); // Low Stock Products modal
    const [restockModalOpen, setRestockModalOpen] = useState(false); // Request Restock modal
    const [restockQueueModalOpen, setRestockQueueModalOpen] = useState(false); // Restock Queue modal

    // New modals for delete and mark processed
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [markProcessedModalOpen, setMarkProcessedModalOpen] = useState(false);

    // Data states
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [restockQueue, setRestockQueue] = useState<RestockQueueItem[]>([]);

    // Form states for restock request
    const [selectedProductId, setSelectedProductId] = useState<string | "">("");
    const [restockQuantity, setRestockQuantity] = useState<number>(1);

    // Form states for delete and mark processed modals
    const [selectedRestockItemIdForDelete, setSelectedRestockItemIdForDelete] =
        useState<string | "">("");
    const [selectedRestockItemIdForMark, setSelectedRestockItemIdForMark] =
        useState<string | "">("");

    // Handlers for modals
    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleOpenRestockModal = () => setRestockModalOpen(true);
    const handleCloseRestockModal = () => {
        setRestockModalOpen(false);
        setSelectedProductId("");
        setRestockQuantity(1);
    };

    const handleOpenRestockQueueModal = () => setRestockQueueModalOpen(true);
    const handleCloseRestockQueueModal = () => setRestockQueueModalOpen(false);

    const handleOpenDeleteModal = () => setDeleteModalOpen(true);
    const handleCloseDeleteModal = () => {
        setDeleteModalOpen(false);
        setSelectedRestockItemIdForDelete("");
    };

    const handleOpenMarkProcessedModal = () => setMarkProcessedModalOpen(true);
    const handleCloseMarkProcessedModal = () => {
        setMarkProcessedModalOpen(false);
        setSelectedRestockItemIdForMark("");
    };

    // Logout
    const handleLogout = () => {
        router.push("/login");
    };

    // Fetch products for restock request dropdown
    const fetchProducts = async () => {
        try {
            const headers = await getAuthHeader();
            const res = await fetch("http://localhost/api/Products", {headers});
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Produkte:", err);
        }
    };

    // Fetch low stock products
    useEffect(() => {
        if (modalOpen) {
            const fetchLowStock = async () => {
                try {
                    const headers = await getAuthHeader();
                    const res = await fetch("http://localhost/api/Products/low-stock", {
                        headers,
                    });
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

    // Fetch products when opening restock request modal
    useEffect(() => {
        if (restockModalOpen) {
            fetchProducts();
        }
    }, [restockModalOpen]);

    // Fetch restock queue when opening restock queue modal or delete/mark modals
    const fetchRestockQueue = async () => {
        try {
            const headers = await getAuthHeader();
            const res = await fetch("http://localhost/api/RestockQueue", {headers});
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            setRestockQueue(data);
        } catch (err) {
            console.error("❌ Fehler beim Laden der Restock Queue:", err);
            setRestockQueue([]);
        }
    };

    useEffect(() => {
        if (
            restockQueueModalOpen ||
            deleteModalOpen ||
            markProcessedModalOpen
        ) {
            fetchRestockQueue();
        }
    }, [restockQueueModalOpen, deleteModalOpen, markProcessedModalOpen]);

    // Handle restock request submit
    const handleRestockRequest = async () => {
        if (!selectedProductId) return;

        if (restockQuantity < 1) {
            alert("Die Menge muss mindestens 1 sein.");
            return;
        }

        try {
            const headers = await getAuthHeader();
            headers["Content-Type"] = "application/json";

            const res = await fetch("http://localhost/api/RestockQueue/request", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    productId: selectedProductId,
                    quantity: restockQuantity,
                }),
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

    // Handle delete restock queue item
    const handleDeleteRestockItem = async () => {
        if (!selectedRestockItemIdForDelete) return;

        if (
            !confirm(
                "Möchten Sie dieses Produkt wirklich aus der Restock Queue löschen?"
            )
        )
            return;

        try {
            const headers = await getAuthHeader();

            const res = await fetch(
                `http://localhost/api/RestockQueue/${selectedRestockItemIdForDelete}`,
                {
                    method: "DELETE",
                    headers,
                }
            );

            if (!res.ok) throw new Error(`Fehler beim Löschen: ${res.status}`);

            alert("Produkt wurde erfolgreich aus der Restock Queue gelöscht.");
            handleCloseDeleteModal();
            fetchRestockQueue();
        } catch (err) {
            console.error("❌ Fehler beim Löschen aus der Restock Queue:", err);
            alert("Fehler beim Löschen des Produkts.");
        }
    };

    // Handle mark as processed
    const handleMarkProcessed = async () => {
        if (!selectedRestockItemIdForMark) return;

        try {
            const headers = await getAuthHeader();

            const res = await fetch(
                `http://localhost/api/RestockQueue/mark-processed/${selectedRestockItemIdForMark}`,
                {
                    method: "POST",
                    headers,
                }
            );

            if (!res.ok) throw new Error(`Fehler beim Markieren als processed: ${res.status}`);

            alert("Produkt wurde als processed markiert.");
            handleCloseMarkProcessedModal();
            fetchRestockQueue();
        } catch (err) {
            console.error("❌ Fehler beim Markieren als processed:", err);
            alert("Fehler beim Markieren des Produkts als processed.");
        }
    };

    return (
        <>
            <Sidebar/>

            <Card sx={{maxWidth: 600, margin: "auto", mt: 4, padding: 2}}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h2">Hello User!</Typography>
                        <Button variant="contained" color="error" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            <Card sx={{maxWidth: 600, margin: "auto", mt: 4, padding: 2}}>
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <Typography variant="h4">Appearance</Typography>
                        <Button onClick={toggleTheme} variant="contained">
                            {darkMode ? "Light Mode" : "Dark Mode"}
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Low Stock Button */}
            <Card sx={{maxWidth: 600, margin: "auto", mt: 4, padding: 2, height: 150}}>
                <CardContent sx={{height: "100%"}}>
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
                                "&:hover": {backgroundColor: "#d4c1b2"},
                            }}
                        >
                            View Low Stock Products
                        </Button>
                    </Box>
                </CardContent>
            </Card>

            {/* Buttons: Restock Queue & Request Restock */}
            <Card
                sx={{
                    maxWidth: 600,
                    margin: "auto",
                    mt: 4,
                    padding: 2,
                    minHeight: 280,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-around",
                }}
            >
                <CardContent>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 2,
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleOpenRestockQueueModal}
                            sx={{
                                backgroundColor: "#ffd699",
                                color: "#000",
                                "&:hover": {backgroundColor: "#ffcc80"},
                                width: "100%",
                            }}
                        >
                            View Restock Queue
                        </Button>

                        <Button
                            variant="contained"
                            onClick={handleOpenRestockModal}
                            sx={{
                                backgroundColor: "#b3d9ff",
                                color: "#000",
                                "&:hover": {backgroundColor: "#99ccff"},
                                width: "100%",
                            }}
                        >
                            Request Restock
                        </Button>

                        {/* Neu: Delete from Restock Queue */}
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleOpenDeleteModal}
                            sx={{width: "100%"}}
                        >
                            Delete Product from Restock Queue
                        </Button>

                        {/* Neu: Mark as processed */}
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleOpenMarkProcessedModal}
                            sx={{width: "100%"}}
                        >
                            Mark Product as Processed
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
                    <FormControl fullWidth sx={{mt: 2}}>
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

                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        sx={{mt: 2}}
                        value={restockQuantity}
                        onChange={(e) => setRestockQuantity(Number(e.target.value))}
                        inputProps={{min: 1}}
                    />

                    <Button
                        variant="contained"
                        color="primary"
                        sx={{mt: 3}}
                        onClick={handleRestockRequest}
                        disabled={!selectedProductId || restockQuantity < 1}
                    >
                        Submit Request
                    </Button>
                </Box>
            </Modal>

            {/* Modal: Restock Queue */}
            <Modal open={restockQueueModalOpen} onClose={handleCloseRestockQueueModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Restock Queue
                    </Typography>
                    {restockQueue.length > 0 ? (
                        <List>
                            {restockQueue.map((item) => (
                                <ListItem key={item.id}>
                                    <ListItemText
                                        primary={item.productName}
                                        secondary={`Quantity: ${item.quantity} | Requested At: ${new Date(
                                            item.requestedAt
                                        ).toLocaleString()} | Processed: ${
                                            item.processed ? "Yes" : "No"
                                        }`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography>No restock requests found.</Typography>
                    )}
                </Box>
            </Modal>

            {/* Modal: Delete from Restock Queue */}
            <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Delete Product from Restock Queue
                    </Typography>
                    {restockQueue.length > 0 ? (
                        <FormControl fullWidth sx={{mt: 2}}>
                            <InputLabel id="delete-select-label">
                                Select Product to Delete
                            </InputLabel>
                            <Select
                                labelId="delete-select-label"
                                value={selectedRestockItemIdForDelete}
                                label="Select Product to Delete"
                                onChange={(e) =>
                                    setSelectedRestockItemIdForDelete(e.target.value)
                                }
                            >
                                {restockQueue.map((item) => (
                                    <MenuItem key={item.id} value={item.id}>
                                        {item.productName} (Qty: {item.quantity})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <Typography>No products in restock queue.</Typography>
                    )}

                    <Button
                        variant="contained"
                        color="error"
                        sx={{mt: 3}}
                        onClick={handleDeleteRestockItem}
                        disabled={!selectedRestockItemIdForDelete}
                    >
                        Delete Selected Product
                    </Button>
                </Box>
            </Modal>

            {/* Modal: Mark as Processed */}
            <Modal open={markProcessedModalOpen} onClose={handleCloseMarkProcessedModal}>
                <Box sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                        Mark Product as Processed
                    </Typography>
                    {restockQueue.length > 0 ? (
                        <FormControl fullWidth sx={{mt: 2}}>
                            <InputLabel id="mark-select-label">
                                Select Product to Mark as Processed
                            </InputLabel>
                            <Select
                                labelId="mark-select-label"
                                value={selectedRestockItemIdForMark}
                                label="Select Product to Mark as Processed"
                                onChange={(e) => setSelectedRestockItemIdForMark(e.target.value)}
                            >
                                {restockQueue
                                    .filter((item) => !item.processed)
                                    .map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.productName} (Qty: {item.quantity})
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <Typography>No products in restock queue.</Typography>
                    )}
                    <Button
                        variant="contained"
                        color="success"
                        sx={{mt: 3}}
                        onClick={handleMarkProcessed}
                        disabled={!selectedRestockItemIdForMark}
                    >
                        Mark as Processed
                    </Button>
                </Box>
            </Modal>
        </>
    );
}