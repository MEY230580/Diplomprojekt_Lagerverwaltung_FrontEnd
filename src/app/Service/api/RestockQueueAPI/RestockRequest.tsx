"use client";
import { useEffect, useState } from "react";

interface Restock {
    productId: number;
    quantity: number;
}

export default function GetRestocks() {
    const [restocks, setRestocks] = useState<Restock[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5100/api/restock/request")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging
                setRestocks(data.$values); // <-- Hier wird das Array extrahiert
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
                {restocks.map((restock) => (
                    <li className="flex items-center justify-center" key={restock.productId}>
                        {restock.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
}