/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function PersonalXP(props) {
  const { nodes, materials } = useGLTF("/models/personal xp.glb");
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
      scale={0.7}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <mesh
        geometry={nodes.Cube.geometry}
        material={materials.material}
        position={[0.15, 0.61, 0.04]}
        rotation={[0, 0.52, 0]}
        scale={0.62}
      />
      <mesh
        geometry={nodes.man.geometry}
        material={materials.material}
        position={[0.81, 1.97, -0.49]}
        rotation={[0, 0.52, -0.53]}
        scale={[0.43, 0.43, 0.4]}
      />
    </group>
  );
}

useGLTF.preload("/models/personal xp.glb");
