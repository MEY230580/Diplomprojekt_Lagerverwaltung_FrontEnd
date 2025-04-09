"use client";
import { useEffect, useState } from "react";

// Definiere das Artikel-Interface entsprechend deiner API
interface Product {
    id: number;
    name: string;
    quantity: number;
    warehouseID: number;
    warehouse: string;
}

export default function PostProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5000/api/Products")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging
                setProducts(data.$values); // <-- Hier wird das Array extrahiert
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    return (
        <div>
            <h2 className="flex items-center justify-center  text-lg  font-bold">Article-List</h2>
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        <strong>{product.name}</strong> - {product.quantity} Pieces
                    </li>
                ))}
            </ul>
        </div>
    );
}