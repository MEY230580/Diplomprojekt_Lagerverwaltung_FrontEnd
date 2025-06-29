"use client";
import * as React from "react";
import { Button, Box } from "@mui/material";
import Sidebar from "@/app/components/Sidebar";
import { useRouter } from "next/navigation";

export default function Page() {
    const router = useRouter();

    const navigateToReport = (report: string) => {
        router.push(`/analysis/${report}`);
    };

    return (
        <>
            <Sidebar />
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 4 }}>
                <Button variant="contained" onClick={() => navigateToReport("AuditLogs")}>
                    Logs
                </Button>
                <Button variant="contained" onClick={() => navigateToReport("movements-per-day")}>
                    Movements Per Day
                </Button>
                <Button variant="contained" onClick={() => navigateToReport("restocks-per-period")}>
                    Restock Per Period
                </Button>
                <Button variant="contained" onClick={() => navigateToReport("stock-summary")}>
                    Stock Summary
                </Button>
                <Button variant="contained" onClick={() => navigateToReport("top-restock-products")}>
                    Top Restock Products
                </Button>
                <Button variant="contained" onClick={() => navigateToReport("get-movements")}>
                    Movements
                </Button>
            </Box>
        </>
    );
}
