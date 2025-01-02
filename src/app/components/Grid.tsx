import React from 'react';
import data from './WarehouseData.json';

type WarehouseItem = {
    id: number;
    name: string;
    quantity: number;
    location: string;
};

const WarehouseGrid: React.FC = () => {
    return (
        <div style= {{
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            height: '100hv',
            padding: '20px',
        }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                    gap: '20px',
                    width: '40%',
                }}>
                    {data.map((item: WarehouseItem) => (
                        <div key={item.id} style={{
                            border: '0.5px solid black',
                            borderRadius: '8px',
                            padding: '20px',
                            backgroundColor: '#D67A69',
                        }}>
                            <h3 style={{margin: '0 0 10px 0'}}>{item.name}</h3>
                            <p style={{margin: '5px 0'}}>
                                <strong>Location:</strong> {item.location}
                            </p>
                        </div>
                    ))}
                </div>
        </div>
    );
};

export default WarehouseGrid;