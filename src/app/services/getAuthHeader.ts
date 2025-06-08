// app/services/getAuthHeader.ts
import { auth } from "./firebase";

export async function getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error("Nicht eingeloggt.");

    console.log("👤 Aktueller Firebase-Benutzer:", user); // Optional für Debug

    const token = await user.getIdToken(true); // ⬅ Force refresh für aktuelle UID
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}
