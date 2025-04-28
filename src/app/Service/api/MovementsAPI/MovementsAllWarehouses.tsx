"use client";
import { useEffect, useState } from "react";

interface Movement {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function PostMovements() {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5002/api/Movements/all-warehouses")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data); // Debugging
                setMovements(data.$values); // <-- Hier wird das Array extrahiert
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
                {movements.map((movement) => (
                    <li className="flex items-center justify-center" key={movement.id}>
                        <strong>{movement.name}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}