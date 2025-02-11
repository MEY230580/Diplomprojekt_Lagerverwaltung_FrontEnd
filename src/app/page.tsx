"use client";
import * as React from "react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import GetProducts from "@/app/components/ProductsAPI/GetProducts";
import GetWarehouses from "@/app/components/WarehouseAPI/getWarehouses";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null); // Store selected location

    {/*
    const router = useRouter();
    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (!token) {
            router.replace("/login"); // Use replace instead of push to avoid back button issues
        }
    }, [router]);
    */}

    return (
        <div>
            <Sidebar />
            {!selectedLocation ? (
                //Show location selection first
                <GetWarehouses setSelectedLocation={setSelectedLocation} />
            ) : (
                //Once location is selected, show top bar & products
                <>
                    <TopBar
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                    />
                    <GetProducts searchQuery={searchQuery} sortBy={sortBy} selectedLocation={selectedLocation} />
                </>
            )}
        </div>
    );
}

