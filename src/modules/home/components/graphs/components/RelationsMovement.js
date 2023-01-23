import { useFrame } from "@react-three/fiber";
import React, { useCallback } from "react";
import { steps, totalTime, y0 } from "../RelationsOriginsGraph";

export default function RelationsMovement({ points, relationIds, refs }) {
  const asignMovement = useCallback(
    (refPos, indexPosition, t) => {
      let i;

      if (t % (2 * totalTime) < totalTime) {
        i = indexPosition;
      } else {
        i = steps - indexPosition;
      }

      refPos.x = points[i].x;
      refPos.y = points[i].y;
      refPos.z = points[i].z;
    },
    [points]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const factor = steps / totalTime;
    const indexPosition = Math.floor((t % totalTime) * factor);

    relationIds.forEach(id => {
      const refPos = refs.current.get(id).position;
      if (refPos.y === y0) {
        // initial position, must "wait" random time
        if (Math.random() > 0.99) {
          asignMovement(refPos, indexPosition, t);
        }
      } else {
        asignMovement(refPos, indexPosition, t);
      }
    });
  });
  return (
    <group>
      {relationIds.map(id => (
        <mesh
          key={id}
          ref={node => {
            if (node) {
              refs.current.set(id, node);
            } else {
              refs.current.delete(id);
            }
          }}
          position={points[0]}
          scale={0.05}
        >
          <sphereGeometry />
          <meshStandardMaterial color={Math.random() * 0xffffff} />
        </mesh>
      ))}
    </group>
  );
}
