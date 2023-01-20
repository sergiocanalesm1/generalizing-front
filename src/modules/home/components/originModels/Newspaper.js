/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Newspaper(props) {
  const { nodes, materials } = useGLTF(
    `${process.env.PUBLIC_URL}models/newspaper2.glb`
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
        geometry={nodes.np_mid.geometry}
        material={materials["newspaper_page-0001"]}
        scale={5}
      />
    </group>
  );
}

useGLTF.preload(`${process.env.PUBLIC_URL}models/newspaper2.glb`);
