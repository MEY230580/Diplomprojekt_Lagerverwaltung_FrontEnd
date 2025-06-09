// app/services/getAuthHeader.ts
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export async function getAuthHeader(): Promise<Record<string, string>> {
    const user = auth.currentUser;

    if (user) {
        const token = await user.getIdToken(true);
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }

    // 🧠 Warten auf Initialisierung, falls user == null
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
            unsubscribe(); // cleanup listener

            if (!newUser) return reject(new Error("Nicht eingeloggt."));

            const token = await newUser.getIdToken(true);
            resolve({
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            });
        });
    });
}
