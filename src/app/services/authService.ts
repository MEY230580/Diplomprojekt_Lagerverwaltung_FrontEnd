// authService.ts
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "./firebase";

// Login
export async function login(email: string, password: string) {
    await signInWithEmailAndPassword(auth, email, password);
}

// Logout
export async function logout() {
    await signOut(auth);
}
