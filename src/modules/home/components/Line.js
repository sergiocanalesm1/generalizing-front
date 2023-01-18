import React, { useState } from 'react';
import { tempOrigins } from '../../../utils/temp';

export default function Line({points, lineWidth, handleClick,color}){

    const [hovered, setHovered] = useState(false);
    const [active, setActive] = useState(false);


    return(
        <line 
            geometry={points}
            onClick={handleClick}
            onPointerOver={(event) => setHovered(true)}
            onPointerOut={(event) => setHovered(false)}
        >
            <lineBasicMaterial color={hovered ? color : "white"} linewidth={hovered ? 7 : lineWidth} />
        </line>
    )
}