"use client";
import * as React from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar/TopBar";
import GetProducts from "@/app/Service/api/ProductsAPI/GetProducts";
import GetWarehouses from "@/app/warehouse/getWarehouses";
import { useLocation } from "@/app/location/LocationContext";// Import Context Hook
import { useSearch } from "@/app/components/TopBar/SearchContext";

export default function Home() {
    const { selectedLocation } = useLocation();
    const { searchQuery, sortBy } = useSearch(); // ✅ Use context

   /* return (
        <div>
            <Sidebar />
            <TopBar />
            <GetProducts searchQuery={searchQuery} sortBy={sortBy}/>
        </div>
    );*/
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
