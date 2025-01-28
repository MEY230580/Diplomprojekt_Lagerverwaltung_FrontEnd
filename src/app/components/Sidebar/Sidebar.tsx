"use client";
import React, { useState } from "react";
import { FaUser, FaMapMarkerAlt, FaChartBar, FaCog } from "react-icons/fa";
import Link from "next/link";
import "./sidebar.css";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const menuItems = [
        { text: "User", icon: <FaUser />, link: "/profile" },
        { text: "Location", icon: <FaMapMarkerAlt />, link: "/location" },
        { text: "Analysis", icon: <FaChartBar />, link: "/analysis" },
        { text: "Settings", icon: <FaCog />, link: "/settings" },
    ];

    return (
        <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                {isCollapsed ? "≡" : "x"}
            </button>
            <div className="menu">
                {menuItems.map((item) => (
                    <Link href={item.link} key={item.text} className="link">
                        <div className="menu-item">
                            <span className="icon">{item.icon}</span>
                            {!isCollapsed && <span className="text">{item.text}</span>}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
