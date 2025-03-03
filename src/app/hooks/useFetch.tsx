import { useState, useEffect } from "react";

export default function useFetch<T = unknown>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`Network response was not okay (Status: ${response.status})`);
                }
                const jsonData: T = await response.json(); // Ensure correct type inference
                setData(jsonData);
            } catch (error) {
                setError(error instanceof Error ? error : new Error("An unknown error occurred"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, loading, error };
}
