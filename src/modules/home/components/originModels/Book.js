/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const bookModelUrl = `${process.env.REACT_APP_MODELS_BUCKET}/glbs/book.glb`;

export default function Book(props) {
  const { nodes, materials } = useGLTF(bookModelUrl);
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
      <group rotation={[0, Math.PI / 2, 0]}>
        <mesh
          geometry={nodes.pages.geometry}
          material={materials.Material}
          position={[0.01, 0.02, 0.14]}
          scale={[1.38, 0.11, 1.08]}
        />
        <mesh
          geometry={nodes.cover.geometry}
          material={materials.cover}
          position={[0.01, 0.02, 1.26]}
          scale={[1.52, 0.14, 0.05]}
        />
      </group>
    </group>
  );
}

useGLTF.preload(bookModelUrl);
