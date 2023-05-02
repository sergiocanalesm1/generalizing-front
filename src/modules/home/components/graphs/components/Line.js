import React, { useState } from "react";

export default function Line({ points, handleClick, color }) {
  const [hovered, setHovered] = useState(false);

  return (
    <line
      geometry={points}
      onClick={ e => {
        e.stopPropagation();
        handleClick();
      }}
      onPointerOver={ e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={ () => setHovered(false)}
    >
      <lineBasicMaterial color={hovered ? color : 0x00b7eb} linewidth={7} />
    </line>
  );
}
