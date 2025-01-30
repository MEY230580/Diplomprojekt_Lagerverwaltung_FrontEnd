"use client";
import React, { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaChartBar, FaCog } from "react-icons/fa";
import Link from "next/link";


export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { text: "User", icon: <FaUser />, link: "/profile" },
        { text: "Location", icon: <FaMapMarkerAlt />, link: "/location" },
        { text: "analysis", icon: <FaChartBar />, link: "/analysis" },
        { text: "Settings", icon: <FaCog />, link: "/settings" },
    ];

    return (
        <div className={`w-[200px] h-screen p-4 transition-all duration-300 ease-in-out flex flex-col items-center fixed top-0 left-0 z-50 border-r border-gray-300 bg-white ${isCollapsed ? "w-[90px]" : ""}`}>
            <button className="bg-transparent border-none text-2xl cursor-pointer mb-5" onClick={toggleSidebar}>
                {isCollapsed ? "≡" : "x"}
            </button>
            <div className="w-full">
                {menuItems.map((item) => (
                    <Link href={item.link} key={item.text} className="no-underline text-black w-full">
                        <div className="flex items-center gap-2.5 p-4 rounded-[20px] transition-all duration-300 ease-in-out hover:bg-[#e3d5c6]">
                            <span className="text-xl w-[24px] text-center">{item.icon}</span>
                            {!isCollapsed && <span className="text-[18px]">{item.text}</span>}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}