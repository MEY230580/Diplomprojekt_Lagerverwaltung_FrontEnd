"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";

//Define an interface based on your API response structure
interface ReportData {
    [key: string]: string | number | boolean | null | object | object[];
}

//API endpoints mapping
const reportApiMap: Record<string, string> = {
    "AuditLogs": "http://localhost:5100/api/AuditLogs",
    "low-stock-products": "http://localhost:5100/api/Reports/low-stock-products",
    "movements-per-day": "http://localhost:5100/api/Reports/movements-per-day",
    "restocks-per-period": "http://localhost:5100/api/Reports/restocks-per-period",
    "stock-summary": "http://localhost:5100/api/Reports/stock-summary",
    "top-restock-products": "http://localhost:5100/api/Reports/top-restock-products",
};

export default function ReportPage() {
    const params = useParams();
    const report = Array.isArray(params.report) ? params.report[0] : params.report; // Ensure it's a string

    const [data, setData] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!report) return;

        let apiUrl = reportApiMap[report];
        if (!apiUrl) {
            setError("Invalid [report] type.");
            setLoading(false);
            return;
        }

        if (report === "restocks-per-period") {
            apiUrl += "?period=month";
        }

        const fetchData = async () => {
            try {
                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error("Failed to fetch data");
                const result: ReportData = await response.json();

                // Ensure $values is treated as an array, otherwise set an empty array
                const extractedData = Array.isArray(result.$values) ? result.$values : [];

                setData(extractedData as ReportData[]);
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

    return (
        <div>
            <Typography variant="h4" align="center" gutterBottom>
                {report.replace(/-/g, " ").toUpperCase()} Report
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 3, maxWidth: "90%", margin: "auto" }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {data.length > 0 && Object.keys(data[0]).map((column) => (
                                <TableCell key={column}><strong>{column.toUpperCase()}</strong></TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow key={index}>
                                {Object.entries(row).map(([key, value]) => (
                                    <TableCell key={key}>
                                        <strong>{key}:</strong> {typeof value === "object" && value !== null ? JSON.stringify(value) : value?.toString() || "N/A"}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}