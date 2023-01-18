/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function PersonalXP(props) {

  const { nodes, materials } = useGLTF('/models/personal xp.glb');
  const mesh = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    if( hovered ){
      mesh.current.rotation.y += delta
    }
    else if(mesh.current.rotation.y > 0.01 ){
      mesh.current.rotation.y -= delta
    }
  })

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
        castShadow
        receiveShadow
        geometry={nodes.Cube.geometry}
        material={materials.Material}
        position={[0.02, 0.61, -0.06]}
        scale={0.62}
      />
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.head.geometry}
        material={nodes.head.material}
        position={[1.2, 3.37, -0.15]}
        rotation={[0, 0, -0.53]}
        scale={[0.43, 0.43, 0.4]}
      />
    </group>
  );
}

useGLTF.preload('/models/personal xp.glb');
