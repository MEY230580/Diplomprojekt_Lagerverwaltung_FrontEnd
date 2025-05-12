"use client";
import { useRouter } from "next/navigation";
import { LockOutlined } from "@mui/icons-material";
import {
    Container,
    CssBaseline,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
} from "@mui/material";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/firebase"; // Make sure this path is correct

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogIn = async () => {
        try {
            // Step 1: Firebase authentication
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const idToken = await userCredential.user.getIdToken();

            // Step 2: Send token to backend for verification
            const response = await fetch("http://localhost/api/auth/verify-firebase-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ idToken }),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Backend error:", text);
                throw new Error("Token verification failed");
            }

            // Optional: Store token or user data
            localStorage.setItem("authToken", idToken);

            // Redirect
            router.push("/");
        } catch (err) {
            console.error("Login error:", err);
            setError(err instanceof Error ? err.message : "An unknown error occurred.");
        }
    };

    return (
        <>
            {error && <p className="flex items-center justify-center text-lg text-red-500">⚠ {error} ⚠</p>}
            <Container maxWidth="xs">
                <CssBaseline />
                <Box sx={{ mt: 20, display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Button fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} onClick={handleLogIn}>
                            Login
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}