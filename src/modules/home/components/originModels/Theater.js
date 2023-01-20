/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Theater(props) {
  const { nodes, materials } = useGLTF(`models/theater.glb`);
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
        rotation={[0, Math.PI / 4, 0]}
        geometry={nodes.masks.geometry}
        material={materials["tragcom-removebg-preview"]}
        scale={3}
      />
    </group>
  );
}

useGLTF.preload(`models/theater.glb`);
