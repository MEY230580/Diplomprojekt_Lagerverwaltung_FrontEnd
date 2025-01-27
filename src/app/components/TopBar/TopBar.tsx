'use client';
import React, {useState} from 'react';
import './topBar.css'
//import WarehouseData from './WarehouseData.json'

export default function TopBar(){
    const [searchQuery, setSearchQuery] = useState('');
    //const [filteredItems, setFilteredItems] = useState(WarehouseData);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        console.log(`currently searching: ${e.target.value}`);
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            console.log(`searching for: ${searchQuery}`);
        }
    }
    return (
        <div className="top-bar">
            <input
                type="text"
                placeholder="Search Bar"
                className="search"
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
            />
        </div>
    );
}