// services/getAuthHeader.ts
import { auth } from "./firebase";

export async function getAuthHeader() {
    const user = auth.currentUser;
    if (!user) throw new Error("Nicht eingeloggt.");

    const token = await user.getIdToken();
    return {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
    };
}
