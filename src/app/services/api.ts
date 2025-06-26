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
        throw new Error(`Fehler beim Aufruf: ${res.status} ${res.statusText}`);
    }

    if (res.status === 204) {
        return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        console.warn("Warnung: Unerwarteter Content-Type", contentType);
        return null;
    }

    const json = await res.json();
    return json;
}
