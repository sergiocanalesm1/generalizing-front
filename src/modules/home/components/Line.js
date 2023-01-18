import React, { useState } from 'react';

export default function Line({points, lineWidth, handleClick,color}){

    const [hovered, setHovered] = useState(false);


    return(
        <line 
            geometry={points}
            onClick={handleClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <lineBasicMaterial color={hovered ? color : "white"} linewidth={hovered ? 7 : lineWidth} />
        </line>
    )
}