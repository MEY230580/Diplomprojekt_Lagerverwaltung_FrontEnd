"use client";
import { Avatar, Box, Button, Container, CssBaseline, Grid, TextField, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import {useState, useEffect } from "react";

export default function Page() {
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5100/api/auth/register")
        .then(res => res.json())
        .then((data) => {
            console.log("API Ressponse:", data);
            setUsername(data.$values);
        })
        .catch((error) => {
            console.error("Error retieving data:", error);
            setError(error.message);
        })
    }, []);

    const handleRegister = async () => {};

    return (
        <>
            {error && <p className="flex items-center justify-center  text-lg  text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="xs">
                <CssBaseline />
                <Box sx = {{mt: 20, display: "flex", flexDirection: "column", alignItems: "center", }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Register</Typography>
                    <Box sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="fullname"
                                    label="Full Name"
                                    autoFocus
                                    value={fullname}
                                    onChange={(e) => setFullname(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="username"
                                    label="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="email"
                                    label="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </Grid>
                        </Grid>
                        <Button fullWidth variant="contained" sx={{ mt:3, mb: 2 }} onClick={handleRegister}>Register</Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}