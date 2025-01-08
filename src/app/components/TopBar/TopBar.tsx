import React from 'react';
import './topBar.css'

const TopBar: React.FC = () => {
    return (
        <div className="top-bar">
            <input type="text" placeholder="Search Bar" className="search" />
        </div>
    );
};

export default TopBar;
