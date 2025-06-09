"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Button,
    TextField,
    Stack,
    Modal,
    Box,
} from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { getAuthHeader } from "@/app/services/getAuthHeader";
import { getIdTokenResult } from "firebase/auth";
import { auth } from "@/app/services/firebase";

interface Product {
    id: number;
    name: string;
    quantity: number;
    location: string;
    minimumStock?: number;
    unit?: string;
}

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [takeAmount, setTakeAmount] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchProduct = async () => {
            try {
                const headers = await getAuthHeader();

                const response = await fetch(`http://localhost/api/Products/${id}`, {
                    headers,
                });

                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Fehler beim Laden: ${response.status} - ${text}`);
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                console.error("❌ Fehler beim Produktabruf:", err);
                setError(err instanceof Error ? err.message : "Unbekannter Fehler");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleDelete = async () => {
        try {
            const user = auth.currentUser;
            if (!user) {
                throw new Error("Kein Benutzer eingeloggt.");
            }

            // 🔍 UID & Claims anzeigen
            const tokenResult = await getIdTokenResult(user, true);
            console.log("🔑 Token Claims:", tokenResult.claims);
            console.log("🧾 Token UID:", tokenResult.claims.user_id || tokenResult.claims.uid);

            const token = await user.getIdToken(true);
            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            console.log("📤 DELETE-Header:", headers);

            const response = await fetch(`http://localhost/api/Products/${id}`, {
                method: "DELETE",
                headers,
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Fehler beim Löschen: ${response.status} - ${text}`);
            }

            alert("Produkt erfolgreich gelöscht.");
            router.push("/");
        } catch (err) {
            console.error("❌ Fehler beim Löschen:", err);
            setError(err instanceof Error ? err.message : "Unbekannter Fehler beim Löschen");
        }
    };

    const handleTakeOut = async () => {
        if (!product) return;

        if (takeAmount <= 0 || takeAmount > product.quantity) {
            alert("Ungültige Entnahmemenge");
            return;
        }

        const updatedProduct = {
            name: product.name,
            quantity: product.quantity - takeAmount,
            minimumStock: product.minimumStock || 0,
            unit: product.unit || "units",
        };

        try {
            const headers = await getAuthHeader();

            const response = await fetch(
                `http://localhost/api/Products/update-product?productId=${id}`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify(updatedProduct),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                throw new Error(`Fehler beim Aktualisieren: ${response.status} - ${text}`);
            }

            alert("Produkt erfolgreich aktualisiert.");
            setProduct((prev) =>
                prev ? { ...prev, quantity: updatedProduct.quantity } : null
            );
            setTakeAmount(0);
        } catch (err) {
            console.error("❌ Fehler beim Aktualisieren:", err);
            setError(err instanceof Error ? err.message : "Unbekannter Fehler beim Aktualisieren");
        }
    };

    if (loading) {
        return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    }

    if (error) {
        return (
            <Typography color="error" align="center">
                ⚠ {error} ⚠
            </Typography>
        );
    }

    return (
        <>
            <Sidebar />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        {product?.name}
                    </Typography>
                    <Typography variant="body1">
                        Quantity: {product?.quantity}
                    </Typography>
                    <Typography variant="body1">
                        Location: {product?.location}
                    </Typography>

                    <Stack spacing={2} mt={3}>
                        <Button
                            onClick={() => setModalOpen(true)}
                            variant="contained"
                            color="primary"
                        >
                            Take Out Product
                        </Button>

                        <Button
                            onClick={handleDelete}
                            variant="contained"
                            color="error"
                        >
                            Delete Product
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Modal for Take Out */}
            <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        borderRadius: 2,
                        boxShadow: 24,
                        p: 4,
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        Take Out Quantity
                    </Typography>
                    <TextField
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={takeAmount}
                        onChange={(e) => setTakeAmount(Number(e.target.value))}
                        inputProps={{ min: 1, max: product?.quantity }}
                        sx={{ mt: 2 }}
                    />
                    <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
                        <Button onClick={() => setModalOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                        <Button
                            onClick={() => {
                                handleTakeOut();
                                setModalOpen(false);
                            }}
                            variant="contained"
                            color="primary"
                            disabled={
                                takeAmount <= 0 || takeAmount > (product?.quantity ?? 0)
                            }
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}