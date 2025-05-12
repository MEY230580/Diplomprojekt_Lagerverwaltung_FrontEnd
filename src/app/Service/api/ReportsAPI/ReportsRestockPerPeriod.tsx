"use client";
import { useEffect, useState } from "react";
import * as React from "react";

export default function GetMovements() {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost/api/Reports/restocks-per-period?period=month")
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
            })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    return (
        <div>
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
        </div>
    );
}