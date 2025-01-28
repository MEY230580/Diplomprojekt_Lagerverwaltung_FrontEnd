"use client";
import React, {useState} from 'react';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';

export default function TopBar()  {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        console.log('Searching for: ', searchQuery);
        //TODO -> API von BackEnd einfügen, um handleSearch auch funktionstüchtig zu machen.
    }
    return (
        <div style = {{ display: 'flex', justifyContent: 'end',alignItems: 'start' }}>
            <form onSubmit = {handleSearch}>
                <FormControl sx={{ width: { xs: '100%', md: '25ch' } }} variant="outlined">
                    <OutlinedInput
                        size="small"
                        id="search"
                        placeholder="Search…"
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        sx={{ flexGrow: 1 }}
                        startAdornment={
                            <InputAdornment position="start" sx={{ color: 'text.primary' }}>
                                <SearchRoundedIcon fontSize="small" />
                            </InputAdornment>
                        }
                        inputProps={{
                            'aria-label': 'search',
                        }}
                    />
                </FormControl>
            </form>
        </div>
    );
}
