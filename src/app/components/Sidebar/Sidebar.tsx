"use client";
import React, { useState } from "react";
import { Drawer, List, ListItemButton, ListItemIcon, ListItemText, IconButton } from "@mui/material";
import { Home, Person, LocationOn, BarChart, Settings, Menu, Close } from "@mui/icons-material";
import Link from "next/link";

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
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
                    backgroundColor: "#fff",
                    borderRight: "1px solid #ccc",
                }
            }}
        >
            {/* Toggle Button */}
            <IconButton onClick={toggleSidebar} sx={{ m: 2, alignSelf: "center" }}>
                {isCollapsed ? <Menu /> : <Close />}
            </IconButton>

            {/* Sidebar Menu */}
            <List>
                {menuItems.map((item) => (
                    <Link href={item.link} key={item.text} passHref>
                        <ListItemButton sx={{ borderRadius: 3, "&:hover": { backgroundColor: "#e3d5c6" } }}>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            {!isCollapsed && <ListItemText primary={item.text} />}
                        </ListItemButton>
                    </Link>
                ))}
            </List>
        </Drawer>
    );
}
