import { useState, useEffect, useCallback } from "react";

export default function useFetch<T = unknown>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Network response was not okay (Status: ${response.status})`);
            }
            const jsonData: T = await response.json();
            setData(jsonData);
            setError(null);
        } catch (error) {
            setError(error instanceof Error ? error : new Error("An unknown error occurred"));
        } finally {
            setLoading(false);
        }
    }, [url]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}
