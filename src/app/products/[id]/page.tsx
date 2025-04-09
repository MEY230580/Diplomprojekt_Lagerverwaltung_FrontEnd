"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, Typography, CircularProgress, Button } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";

interface Product {
    id: number;
    name: string;
    quantity: number;
    location: string;
}

export default function ProductDetails() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) return;

        fetch(`http://localhost:5000/api/Products/${id}`)
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
        fetch(`http://localhost:5000/api/Products/${id}`, {
            method: "DELETE",
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

    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error" align="center">⚠ {error} ⚠</Typography>;

    return (
        <>
            <Sidebar />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>{product?.name}</Typography>
                    <Typography variant="body1">Quantity: {product?.quantity}</Typography>
                    <Typography variant="body1">Location: {product?.location}</Typography>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        color="error"
                        sx={{mt: 2 }}
                    >
                        Delete Product
                    </Button>
                </CardContent>
            </Card>
        </>
    );
}
