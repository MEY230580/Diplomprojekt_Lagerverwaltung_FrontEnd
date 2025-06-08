"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/services/firebase";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import GetProducts from "@/app/services/api/ProductsAPI/GetProducts";
import GetWarehouses from "@/app/warehouse/getWarehouses";
import { useLocation } from "@/app/location/LocationContext";
import { useSearch } from "@/app/components/TopBar/SearchContext";

export default function Home() {
    const router = useRouter();
    const { selectedLocation } = useLocation();
    const { searchQuery, sortBy } = useSearch();
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (!user) {
                router.push("/login");
            } else {
                setCheckingAuth(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    if (checkingAuth) {
        return <p className="text-center mt-10">⏳ Lade...</p>;
    }

    return (
        <div>
            <Sidebar />
            {!selectedLocation ? (
                <GetWarehouses />
            ) : (
                <>
                    <TopBar />
                    <GetProducts searchQuery={searchQuery} sortBy={sortBy} />
                </>
            )}
        </div>
    );
}
