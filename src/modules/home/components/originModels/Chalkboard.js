/*
Auto-generated by: https://github.com/pmndrs/gltfjsx 
https://gltf.pmnd.rs/
*/

import React, { useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
const lectureModelUrl = `${process.env.REACT_APP_MODELS_BUCKET}/glbs/chalkboard2.glb`;

export default function Chalkboard(props) {
  const { nodes, materials } = useGLTF(lectureModelUrl);
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if (hovered) {
      mesh.current.rotation.y += delta*0.5;
    } else if (mesh.current.rotation.y > 0.01) {
      mesh.current.rotation.y -= delta;
    }
  });

  return (
    <group
      {...props}
      ref={mesh}
      dispose={null}
      onPointerOver={ e => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <group scale={[2.2, 1, 1]} rotation={[0, Math.PI / 4, 0]}>
        <mesh geometry={nodes.Plane001.geometry} material={materials.board} />
        <mesh
          geometry={nodes.Plane001_1.geometry}
          material={materials.border}
        />
      </group>
    </group>
  );
}

useGLTF.preload(lectureModelUrl);
