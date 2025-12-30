import React from 'react';
import { Loader } from 'lucide-react';

const Spinner = ({ size = 24, color = 'white' }) => {
    return (
        <div className="animate-spin" style={{ display: 'inline-flex' }}>
            <Loader size={size} color={color} />
        </div>
    );
};

export default Spinner;
