"use client";
import * as React from 'react';
import { Typography, MenuItem, Select, CircularProgress, FormControl } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { useState } from "react";

export default function Page() {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleApiRequest = (url: string) => {
        setLoading(true);
        setError(null); // Reset the error message when a new request starts

        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                console.log("API Response:", data);
                setLoading(false); // Stop loading when data is fetched
            })
            .catch((error) => {
                console.error("Error retrieving Data:", error);
                setError(error.message); // Set the error message
                setLoading(false); // Stop loading when an error occurs
            });
    };

    const handleLowStock = () => {
        handleApiRequest('http://localhost:5100/api/Reports/low-stock-products');
    };

    const handleMovementsPerDay = () => {
        handleApiRequest('http://localhost:5100/api/Reports/movements-per-day');
    };

    const handleRestockPerPeriod = () => {
        handleApiRequest('http://localhost:5100/api/Reports/restocks-per-period?period=month');
    };

    const handleStockSummary = () => {
        handleApiRequest('http://localhost:5100/api/Reports/stock-summary');
    };

    const handleTopRestockProducts = () => {
        handleApiRequest('http://localhost:5100/api/Reports/top-restock-products');
    };

    // Show loading spinner if data is being fetched
    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;

    // Show error message if there's an error
    if (error) return <Typography color="error" align="center">⚠ {error} ⚠</Typography>;

    return (
        <>
            <Sidebar />
            <FormControl sx={{ minWidth: 200, position: "absolute", top: 20, right: 20 }}>
                <Select size="medium" displayEmpty>
                    <MenuItem onClick={handleLowStock}>Low Stock</MenuItem>
                    <MenuItem onClick={handleMovementsPerDay}>Movements Per Day</MenuItem>
                    <MenuItem onClick={handleRestockPerPeriod}>Restock Per Period</MenuItem>
                    <MenuItem onClick={handleStockSummary}>Stock Summary</MenuItem>
                    <MenuItem onClick={handleTopRestockProducts}>Top Restock Products</MenuItem>
                </Select>
            </FormControl>
        </>
    );
}
