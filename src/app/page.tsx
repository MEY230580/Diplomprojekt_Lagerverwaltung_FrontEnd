"use client";
import * as React from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import GetProducts from "@/app/Service/api/ProductsAPI/GetProducts";
import GetWarehouses from "@/app/warehouse/getWarehouses";
import { useLocation } from "@/app/location/LocationContext";
import { useSearch } from "@/app/components/TopBar/SearchContext";

export default function Home() {
    const router = useRouter();
    const { selectedLocation } = useLocation();
    const { searchQuery, sortBy } = useSearch();

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

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
