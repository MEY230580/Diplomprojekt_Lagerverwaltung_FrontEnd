import { auth } from "./firebase";

export async function apiRequest(endpoint: string, method = "GET", body?: object) {
    const user = auth.currentUser;
    if (!user) throw new Error("Nicht eingeloggt");

    const token = await user.getIdToken(); // automatisch aktuell

    const res = await fetch(`http://localhost/api/${endpoint}`, {
        method,
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        throw new Error(`Fehler beim Aufruf: ${res.statusText}`);
    }

    // 🛠️ Wenn 204: kein Content zum Parsen
    if (res.status === 204) {
        return null;
    }

    // 🛠️ Falls kein Content-Type: application/json, nicht versuchen zu parsen
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        return null;
    }

    return await res.json();
}
