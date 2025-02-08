"use client";
import * as React from 'react';
import { useState } from 'react';
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import GetProducts from "@/app/components/ProductsAPI/GetProducts";

export default function Home() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("name"); // Default sort by name

    return (
        <div>
            <Sidebar />
            <TopBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} sortBy={sortBy} setSortBy={setSortBy} />
            <GetProducts searchQuery={searchQuery} sortBy={sortBy} />
        </div>
    );
}