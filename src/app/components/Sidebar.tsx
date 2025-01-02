import React from 'react';
import { FaUser, FaMapMarkerAlt, FaChartBar, FaCog } from 'react-icons/fa';
import Link from 'next/link';

const Sidebar: React.FC = () => {
    return (
        <div style={styles.sidebar}>
            <Link href="/profile"><div style={styles.icon}><FaUser /></div></Link>
            <Link href="/location"><div style={styles.icon}><FaMapMarkerAlt /></div></Link>
            <Link href="/analysis"><div style={styles.icon}><FaChartBar /></div></Link>
            <Link href="/settings"><div style={styles.icon}><FaCog /></div></Link>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    sidebar: {
        width: '60px',
        height: '100vh',
        backgroundColor: '#E2D3C6',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        alignItems: 'center',
        paddingTop: '10px',
    },
    icon: {
        fontSize: '24px',
        color: '#fff',
        margin: '20px 0',
        cursor: 'pointer',

    },
};

export default Sidebar;