"use client";
import * as React from 'react';
import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";

export default function Page() {
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem("authToken"); // Remove token
        router.push("/login"); // Redirect to login page
    };

    return (
        <>
            <Sidebar />
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="h2">Hello User!</Typography>
                        <Button variant="contained" color="error"  onClick={handleLogout}>Log Out</Button>
                    </Box>
                </CardContent>
            </Card>
            <Card sx={{ maxWidth: 600, margin: "auto", mt: 4, padding: 2 }}>
                <CardContent>
                    <Typography variant="body1"> Name: </Typography>
                    <Typography variant="body1"> Email: </Typography>
                </CardContent>
            </Card>
        </>
    );
}