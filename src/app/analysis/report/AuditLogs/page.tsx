"use client";
import useFetch from "@/app/hooks/useFetch";
import * as React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from "@mui/material";

// Define a TypeScript interface for the audit log data
interface AuditLog {
    id: string;
    entity: string;
    action: string;
    productId: string;
    quantityChange: number;
    user: string;
    timestamp: string;
}

export default function AuditLogs() {
    const apiUrl = "http://localhost:5100/api/AuditLogs";
    const { data: logs, loading, error } = useFetch<AuditLog[]>(apiUrl); // Specify expected response type

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <Typography variant="h4" gutterBottom>
                Stock Movements
            </Typography>
            <TableContainer component={Paper} elevation={3}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: "#f5f5f5" }}>
                            <TableCell><strong>Entity</strong></TableCell>
                            <TableCell><strong>Action</strong></TableCell>
                            <TableCell><strong>Product ID</strong></TableCell>
                            <TableCell><strong>Quantity Change</strong></TableCell>
                            <TableCell><strong>User</strong></TableCell>
                            <TableCell><strong>Timestamp</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs?.map((log) => ( // Ensure `logs` is defined before mapping
                            <TableRow key={log.id}>
                                <TableCell>{log.entity}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.productId}</TableCell>
                                <TableCell>{log.quantityChange}</TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
