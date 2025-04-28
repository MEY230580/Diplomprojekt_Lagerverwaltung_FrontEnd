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
    Box
} from "@mui/material";
import Sidebar from "@/app/components/Sidebar";

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

        fetch(`http://localhost:5002/api/Products/${id}`)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
                setLoading(false);
            });
    }, [id]);

    const handleDelete = () => {
        const token = localStorage.getItem("token"); // <-- get token from localStorage

        if (!token) {
            alert("You must be logged in to delete a product!");
            router.push("/login"); // Optional: redirect to login page if not logged in
            return;
        }

        fetch(`http://localhost:5002/api/Products/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Error deleting product");
                }
                return response.json();
            })
            .then(() => {
                alert(`Product deleted successfully`);
                router.push("/");
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                setError(error.message);
            });
    };

    const handleTakeOut = () => {
        if (!product) return;

        if (takeAmount <= 0 || takeAmount > product.quantity) {
            alert("Invalid quantity to take out");
            return;
        }

        const updatedProduct = {
            name: product.name,
            quantity: product.quantity - takeAmount,
            minimumStock: product.minimumStock || 0,
            unit: product.unit || "units",
        };

        fetch(`http://localhost:5002/api/Products/update-product?productId=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedProduct),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to update product");
                }
                return response.json();
            })
            .then(() => {
                alert("Product updated successfully");
                setProduct((prev) =>
                    prev ? { ...prev, quantity: updatedProduct.quantity } : null
                );
                setTakeAmount(0);
            })
            .catch((error) => {
                console.error("Error updating product:", error);
                setError(error.message);
            });
    };

    if (loading) {
        return (
            <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />
        );
    }

    if (error) {
        return (
            <Typography color="error" align="center">⚠ {error} ⚠</Typography>
        );
    }

    return (
        <>
            <Sidebar />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{product?.name}</Typography>
                    <Typography variant="body1">Quantity: {product?.quantity}</Typography>
                    <Typography variant="body1">Location: {product?.location}</Typography>

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
                            disabled={takeAmount <= 0 || takeAmount > (product?.quantity ?? 0)}
                        >
                            Confirm
                        </Button>
                    </Stack>
                </Box>
            </Modal>
        </>
    );
}