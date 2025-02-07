"use client";
import * as React from 'react';
import { useEffect, useState } from "react";

interface Warehouse {
    id: number;
    name: string;
    location: string;
    products: string[];
}

export default function Page(){
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5001/api/Warehouse")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setWarehouses(data.$values);
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    return (
        <div>
            <h1 className="flex items-center justify-center  text-lg  font-bold">Location</h1>
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
            <ul>
                {warehouses.map((warehouse) => (
                    <li className="flex items-center justify-center"key={warehouse.id}>
                        <strong>{warehouse.name}</strong>
                        <strong>{warehouse.id}</strong>
                    </li>
                ))}
            </ul>
        </div>
    );
}