"use client";
import { LockOutlined } from "@mui/icons-material";
import { Container, CssBaseline, Box, Avatar, Typography, TextField, Button, } from "@mui/material";
import { useEffect, useState } from "react";

export default function Page() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch("http://localhost:5100/api/auth/login")
        .then((response) => response.json())
        .then((data) => {
            console.log("API Response:", data);
            setUsername(data.$values);
        })
            .catch((error) => {
                console.error("Error retrieving data:", error);
                setError(error.message);
            });
    }, []);

    const handleLogIn = () => {
        if (!username) {
            console.log("Wrong Username!");
        }
        if (!password) {
            console.log("Wrong Password!");
        }
        setUsername(username);
    }

    return (
        <>
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        mt: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Email Address"
                            name="email"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogIn}
                        >
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}