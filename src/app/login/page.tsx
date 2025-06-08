"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/services/authService";
import { Box, Container, CssBaseline, TextField, Button, Avatar, Typography } from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        try {
            await login(email, password);
            router.push("/");
        } catch (err) {
            console.error(err);
            setError("Login fehlgeschlagen.");
        }
    };

    return (
        <>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <Container maxWidth="xs">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            fullWidth
                            label="E-Mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Passwort"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            margin="normal"
                            required
                        />
                        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogin}>
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
