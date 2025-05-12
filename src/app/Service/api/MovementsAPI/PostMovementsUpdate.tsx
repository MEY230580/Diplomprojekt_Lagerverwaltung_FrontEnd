"use client";
import {useEffect, useState } from "react";

interface Movement {
    productsID: number;
    quantity: number;
    movementsType: string;
    user: string;
}

export default function PostMovements() {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost/api/Movements/update")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setMovements(data.$values);
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
                    <li key={movement.productsID}>
                    </li>
                ))}
            </ul>
        </div>
    );
}