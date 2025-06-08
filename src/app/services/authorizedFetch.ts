// services/authorizedFetch.ts
import { getAuthHeader } from "./getAuthHeader";

export async function authorizedFetch(url: string, options: RequestInit = {}) {
    const headers = await getAuthHeader();

    return fetch(url, {
        ...options,
        headers: {
            ...headers,
            ...(options.headers || {}),
        },
    });
}
