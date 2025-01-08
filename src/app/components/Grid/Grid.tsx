import React from 'react';
import data from '../WarehouseData.json';
import './grid.css'

type WarehouseItem = {
    id: number;
    name: string;
    quantity: number;
    location: string;
};

const WarehouseGrid: React.FC = () => {
    return (
        <div className="container">
            <div className="grid">
                {data.map((item: WarehouseItem) => (
                    <div key={item.id} className="item">
                        <h3>{item.name}</h3>
                        <p>
                            <strong>Location:</strong> {item.location}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WarehouseGrid;
