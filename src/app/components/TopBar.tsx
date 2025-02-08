"use client";
import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import {MenuItem, Select} from "@mui/material";

interface TopBarProps {
    searchQuery: string;
    setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
    sortBy: string;
    setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

export default function TopBar({ searchQuery, setSearchQuery, sortBy, setSortBy }: TopBarProps) {
    return (
        <div className="flex justify-end items-start m-4">
            { /*Search Input*/ }
            <FormControl sx={{ width: { xs: '100%', md: '25ch' }, position: "absolute", top: 20, right: 150 }} variant="outlined">
                <OutlinedInput
                    size="small"
                    id="search"
                    placeholder="Search…"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)} // Update searchQuery
                    sx={{ flexGrow: 1 }}
                    startAdornment={
                        <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                            <SearchRoundedIcon fontSize="small" />
                        </InputAdornment>
                    }
                    inputProps={{ 'aria-label': 'search' }}
                />
            </FormControl>

            { /*Sorting Dropdown*/ }
            <FormControl sx={{minWidth: 120, position: "absolute", top: 20, right: 20 }}>
                <Select
                    size="small"
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                    displayEmpty
                >
                    <MenuItem value="name">Name</MenuItem>
                    <MenuItem value="quantity">Quantity</MenuItem>
                </Select>
            </FormControl>
        </div>
    );
}
