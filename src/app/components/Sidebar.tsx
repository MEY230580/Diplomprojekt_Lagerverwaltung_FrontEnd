"use client";
import React, { useState, useEffect } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Home, Person, LocationOn, BarChart, Settings, Menu, Close } from "@mui/icons-material";
import Link from "next/link";
import { useTheme } from "@/app/components/Dark Mode/ThemeContext";

export default function Sidebar() {
    const { darkMode } = useTheme(); // Get dark mode state

    // 🟢 Initialize the sidebar collapsed state from localStorage
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

    // 🟢 Check localStorage on initial render to get the saved collapsed state
    useEffect(() => {
        const savedCollapsedState = localStorage.getItem("sidebarCollapsed");
        if (savedCollapsedState) {
            setIsCollapsed(savedCollapsedState === "true"); // If it's "true", collapse the sidebar
        }
    }, []);

    // 🟢 Toggle the collapsed state and save it to localStorage
    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const newState = !prev;
            localStorage.setItem("sidebarCollapsed", newState.toString()); // Save state in localStorage
            return newState;
        });
    };

    const menuItems = [
        { text: "Home", icon: <Home />, link: "/" },
        { text: "User", icon: <Person />, link: "/profile" },
        { text: "Location", icon: <LocationOn />, link: "/location" },
        { text: "Analysis", icon: <BarChart />, link: "/analysis" },
        { text: "Settings", icon: <Settings />, link: "/settings" },
    ];

    return (
        <Drawer
            variant="permanent"
            open={!isCollapsed}
            sx={{
                width: isCollapsed ? 90 : 200,
                flexShrink: 0,
                "& .MuiDrawer-paper": {
                    width: isCollapsed ? 90 : 200,
                    transition: "width 0.3s",
                    backgroundColor: darkMode ? "#121212" : "#fff", // Dark Mode Support
                    color: darkMode ? "#fff" : "#333",
                    borderRight: `1px solid ${darkMode ? "#333" : "#ccc"}`,
                },
            }}
        >
            {/* Toggle Button */}
            <IconButton
                onClick={toggleSidebar}
                sx={{
                    m: 2,
                    alignSelf: "center",
                    color: darkMode ? "#fff" : "#000", // Change button color
                }}
            >
                {isCollapsed ? <Menu /> : <Close />}
            </IconButton>

            {/* Sidebar Menu */}
            <List>
                {menuItems.map((item) => (
                    <Link href={item.link} key={item.text} passHref>
                        <ListItemButton
                            sx={{
                                borderRadius: 3,
                                color: darkMode ? "#fff" : "#333", // Adjust text color
                                "&:hover": { backgroundColor: darkMode ? "#D67A69" : "#e3d5c6" }, // Adjust hover effect
                            }}
                        >
                            <ListItemIcon sx={{ color: darkMode ? "#fff" : "#000" }}>{item.icon}</ListItemIcon>
                            {!isCollapsed && <ListItemText primary={item.text} />}
                        </ListItemButton>
                    </Link>
                ))}
            </List>
        </Drawer>
    );
}
