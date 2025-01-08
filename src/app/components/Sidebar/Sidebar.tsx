"use client";

import React from 'react';
import { FaUser, FaMapMarkerAlt, FaChartBar, FaCog } from 'react-icons/fa';
import Link from 'next/link';
import './sidebar.css';


const Sidebar: React.FC = () => {
    const  [isCollapsed, setIsCollapsed] = React.useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <button className="toggle-Button" onClick={toggleSidebar}>
                {isCollapsed ? '>>' : '<<'}
            </button>
            <div className="menu">
            <Link href="/src/app/Profile" className="link">
                <div className="menuItem">
                    <FaUser className="icon" />
                    {!isCollapsed && <span className="text">User</span>}
                </div>
            </Link>
            <Link href="/src/app/Location" className="link">
                <div className="menuItem">
                    <FaMapMarkerAlt className="icon" />
                    {!isCollapsed && <span className="text">Location</span>}
                </div>
            </Link>
            <Link href="/analysis" className="link">
                <div className="menuItem">
                    <FaChartBar className="icon" />
                    {!isCollapsed && <span className="text">Analysis</span>}
                </div>
            </Link>
            <Link href="/settings" className="link">
                <div className="menuItem">
                    <FaCog className="icon" />
                    {!isCollapsed && <span className="text">Settings</span>}
                </div>
            </Link>
        </div>
        </div>
    );
};

export default Sidebar;