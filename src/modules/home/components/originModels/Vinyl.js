/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Vinyl(props) {
  const { nodes, materials } = useGLTF(
    `${process.env.PUBLIC_URL}/models/vinyl2.glb`
  );
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (hovered) {
      mesh.current.rotation.y += delta;
    } else if (mesh.current.rotation.y > 0.01) {
      mesh.current.rotation.y -= delta;
    }
  });

  return (
    <group
      {...props}
      ref={mesh}
      dispose={null}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh
        geometry={nodes.vinyl.geometry}
        material={materials.vynil_complete}
        scale={3}
      />
    </group>
  );
}

useGLTF.preload(`${process.env.PUBLIC_URL}/models/vinyl2.glb`);
