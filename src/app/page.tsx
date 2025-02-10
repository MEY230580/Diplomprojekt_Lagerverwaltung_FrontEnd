"use client";
//import { useEffect } from "react";
//import { useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import GetProducts from "@/app/components/ProductsAPI/GetProducts";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name");
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
            <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} />
            <GetProducts searchQuery={searchQuery} sortBy={sortBy} />
        </div>
    );
}
