"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { apiRequest } from "@/app/services/api";

interface Product {
    id: string;
    name: string;
    quantityAvailable: number;
    minimumQuantity: number;
    warehouseId: string;
    restockedQuantity: number;
}

interface Restock {
    date: string;
    product: Product;
}

interface ReportData {
    [key: string]: string | number | boolean | null | object | object[];
}

export default function ReportPage() {
    const params = useParams();
    const report = Array.isArray(params.report) ? params.report[0] : params.report;

    const [data, setData] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!report) return;

        const checkUserRole = async (): Promise<boolean> => {
            try {
                const result = await apiRequest("roles/user-role");
                console.log("🔐 User Role Response:", result);
                return result?.role?.toLowerCase() === "manager";
            } catch (err) {
                console.error("❌ Fehler beim User-Role-Check:", err);
                throw new Error("User role check failed");
            }
        };

        const fetchData = async () => {
            if (!report) return;

            const validReports: Record<string, string> = {
                "AuditLogs": "audit-logs",
                "movements-per-day": "Reports/movements-per-day",
                "restocks-per-period": "Reports/restocks-by-period",
                "stock-summary": "Reports/stock-summary",
                "top-restock-products": "Reports/top-restock-products",
                "get-movements": "movements",
            };

            const endpoint = validReports[report];
            if (!endpoint) {
                setError("Invalid [report] type.");
                setLoading(false);
                return;
            }

            if (report === "AuditLogs") {
                try {
                    const isManager = await checkUserRole();
                    if (!isManager) {
                        setError("Access denied: Only managers can view audit logs.");
                        setLoading(false);
                        return;
                    }
                } catch (err) {
                    setError((err as Error).message);
                    setLoading(false);
                    return;
                }
            }

            try {
                const fullEndpoint =
                    report === "restocks-per-period"
                        ? `${endpoint}?period=y`
                        : endpoint;

                const result = await apiRequest(fullEndpoint);
                const extractedData = Array.isArray(result) ? result : [];

                const filteredData = extractedData.map((item) =>
                    Object.fromEntries(
                        Object.entries(item).filter(
                            ([key]) => !["id", "Id", "_id", "$id"].includes(key.toLowerCase())
                        )
                    )
                );

                setData(filteredData as ReportData[]);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [report]);

    if (!report) return <Typography align="center">No report selected.</Typography>;
    if (loading) return <CircularProgress sx={{ display: "block", margin: "auto", mt: 4 }} />;
    if (error) return <Typography color="error" align="center">⚠ {error} ⚠</Typography>;
    if (data.length === 0) {
        return (
            <Typography variant="h6" align="center" sx={{ mt: 4 }}>
                No reports available.
            </Typography>
        );
    }

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom>
                {report.replace(/-/g, " ").toUpperCase()} Report
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 3, maxWidth: "90%", margin: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {data.length > 0 &&
                                Object.keys(data[0])
                                    .filter((column) => !["id", "Id", "_id"].includes(column.toLowerCase()))
                                    .map((column) => (
                                        <TableCell key={column}>
                                            <strong>{column.toUpperCase()}</strong>
                                        </TableCell>
                                    ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {Object.entries(row)
                                    .filter(([key]) => !["id", "Id", "_id"].includes(key.toLowerCase()))
                                    .map(([key, value]) => {
                                        if (
                                            report === "restocks-per-period" &&
                                            key.toLowerCase() === "restocks" &&
                                            Array.isArray(value)
                                        ) {
                                            return (
                                                <TableCell key={key} sx={{ whiteSpace: "normal", maxWidth: 400 }}>
                                                    <ul style={{ paddingLeft: "1rem", margin: 0 }}>
                                                        {(value as Restock[]).map((restock, i) => (
                                                            <li key={i}>
                                                                {restock.date}: {restock.product.name} — Menge:{" "}
                                                                {restock.product.restockedQuantity}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </TableCell>
                                            );
                                        }

                                        return (
                                            <TableCell key={key} sx={{ whiteSpace: "normal" }}>
                                                {typeof value === "object" && value !== null
                                                    ? JSON.stringify(value)
                                                    : value?.toString() || "N/A"}
                                            </TableCell>
                                        );
                                    })}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
