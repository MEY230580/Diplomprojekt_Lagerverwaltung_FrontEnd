import React from 'react';

const TopBar: React.FC = () => {
    return (
        <div style={styles.topBar}>
            <input type="text" placeholder="Search Bar" style={styles.search} />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    topBar: {
        height: '50px',
        backgroundColor: '#E2D3C6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
    },
    search: {
        flex: 1,
        marginRight: '200px',
        marginLeft: '200px',
        padding: '5px 10px',
        borderRadius: '30px',
        border: '0.5px solid black',
    },
};

export default TopBar;
