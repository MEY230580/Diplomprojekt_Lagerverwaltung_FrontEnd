"use client";
import { useEffect, useState } from "react";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function PostWarehouses() {
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5001/api/Warehouse")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging
                setWarehouses(data.$values); // <-- Hier wird das Array extrahiert
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
                {warehouses.map((warehouse) => (
                    <li key={warehouse.id}>
                        <strong>{warehouse.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}