import { useFrame } from "@react-three/fiber";
import React, { useCallback } from "react";
import { steps, totalTime, y0 } from "../RelationsOriginsGraph";

export default function RelationsMovement({ points, relationIds, refs }) {
  const asignMovement = useCallback(
    (refPos, t) => {
      let i;
      let delta;
      const factor = steps / totalTime;
      // indexPosition maps the time to a position array index
      const indexPosition = Math.floor((t % totalTime) * factor);

      if (t % (2 * totalTime) < totalTime) {
        i = indexPosition;
        delta = 1;
      } else {
        i = steps - indexPosition;
        delta = -1;
      }

      refPos.x = points[i + delta].x;
      refPos.y = points[i + delta].y;
      refPos.z = points[i + delta].z;
    },
    [points]
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    relationIds.forEach(id => {
      const ref = refs.current.get(id);
      if (ref.position.y !== y0) {
        asignMovement(ref.position, t - ref.userData.waitTime);
      } else if (Math.random() > 0.995) {
        // initial position
        ref.userData.waitTime = t;
        asignMovement(ref.position, 0);
      } else {
        // wait for next frame
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
          scale={0.08}
          userData={{ waitTime: 0 }}
        >
          <sphereGeometry />
          <meshStandardMaterial color={Math.random() * 0xffffff} />
        </mesh>
      ))}
    </group>
  );
}
