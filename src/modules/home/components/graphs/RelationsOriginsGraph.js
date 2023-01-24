import React, { Suspense, useCallback, useMemo, useRef } from "react";

import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { useHookstate } from "@hookstate/core";

import {
  filtersState,
  lessonsState,
  lessonsToListState,
  originsState,
  relationsState,
  relationsToListState,
} from "../../../../globalState/globalState";
import { mapOriginsToRelations } from "../../../../helpers/relations_helper";
import { invertResource } from "../../../../helpers/data_helper";
import { filterByOrigin } from "../../../../utils/filters";
import Models, { originsComponentOrder } from "./components/Models";
import Line from "./components/Line";
import RelationsMovement from "./components/RelationsMovement";

const hdrUrl = `${process.env.REACT_APP_MODELS_BUCKET}/imgs/unfinished_office_1k.hdr`;
const rad = 10;
const lineAmp = rad / 2;
export const steps = 40;
export const totalTime = 3;
export const y0 = 0.1;

// for hdrs https://polyhaven.com/hdris

function Graph({ setOpenRelationsList, setOpenLessonsList }) {
  // ref.current.get(id) -> node
  const relationMovementRefs = useRef(new Map());

  const lessons = useHookstate(lessonsState);
  const origins = useHookstate(originsState);
  const originToId = useMemo(
    () => invertResource(origins.get(), "origin"),
    [origins]
  );
  const relationsToList = useHookstate(relationsToListState);
  const relations = useHookstate(relationsState);
  const lessonsToList = useHookstate(lessonsToListState);
  const filters = useHookstate(filtersState);

  const dTheta = useMemo(
    () => (2 * Math.PI) / Object.keys(origins.get()).length,
    [origins]
  );

  const components = useMemo(() => Models, []);

  /*
    originsRelations = {
        originId1: {
          originId2: [relationid1, relationid2...],
          originId3: [relationid1, relationid2...]
        },
    }  
    */
  const originsRelations = useMemo(
    () => mapOriginsToRelations(relations.get(), lessons.get()),
    [relations, lessons]
  );

  const computePoints = useCallback((X, Z) => {
    const points = [];
    const dx = (X[1] - X[0]) / steps;
    const dz = (Z[1] - Z[0]) / steps;

    for (let t = 0; t <= steps; t += 1) {
      const x = X[0] + dx * t;
      const z = Z[0] + dz * t;
      const y = y0 + lineAmp * Math.sin((Math.PI * t) / steps);
      points.push(new THREE.Vector3(x, -y, z));
    }

    return points;
  }, []);

  return (
    <group>
      {components.map((Component, i) => {
        const X = [],
          Z = [];
        X[0] = rad * Math.cos(dTheta * i);
        Z[0] = rad * Math.sin(dTheta * i);
        const originId1 = originToId[originsComponentOrder[i]];
        let originsRelatedWithOrigin1;
        if (originsRelations[originId1]) {
          originsRelatedWithOrigin1 = Object.keys(originsRelations[originId1]);
        }

        return (
          <group key={originToId[originsComponentOrder[i]]}>
            <Component
              position={[X[0], 0, Z[0]]}
              onClick={() => {
                filters.set(originsComponentOrder[i]);
                lessonsToList.set(
                  filterByOrigin(
                    lessons.get(),
                    originToId[originsComponentOrder[i]]
                  )
                );
                setOpenLessonsList(true);
              }}
            />
            {originsRelatedWithOrigin1?.map(origin2Id => {
              // primero deme el segundo origin
              const origin2name = origins.get()[origin2Id].origin;
              // indice del segundo origin
              const j = originsComponentOrder.indexOf(origin2name);
              if (i === j) {
                const phi = Math.PI / 60;
                X[0] = rad * Math.cos(dTheta * i + phi);
                Z[0] = rad * Math.sin(dTheta * i + phi);
              }

              X[1] = rad * Math.cos(dTheta * j);
              Z[1] = rad * Math.sin(dTheta * j);

              // TODO compute maximun amount of relations between a pair of origins
              const points = computePoints(X, Z);
              return (
                <group
                  key={`${origins.get()[originId1].origin}, ${origin2name}`}
                >
                  <Line
                    color={Math.random() * 0xffffff}
                    points={new THREE.BufferGeometry().setFromPoints(points)}
                    handleClick={() => {
                      filters.set(
                        `${origins.get()[originId1].origin}, ${origin2name}`
                      );
                      setOpenRelationsList(true);
                      relationsToList.set(
                        originsRelations[originId1][origin2Id]
                      );
                    }}
                  />
                  <RelationsMovement
                    points={points}
                    relationIds={originsRelations[originId1][origin2Id]}
                    refs={relationMovementRefs}
                  />
                </group>
              );
            })}
          </group>
        );
      })}
    </group>
  );
}

export default function RelationsOriginsGraph({
  setOpenRelationsList,
  setOpenLessonsList,
}) {
  return (
    <Canvas
      camera={{
        position: [0, 4 * rad, 8 * rad],
        fov: 15,
      }}
    >
      <Environment
        background
        files={hdrUrl}
        // preset="city"
        blur={1}
      />
      <ambientLight intensity={0.5} />
      <Suspense fallback={null}>
        <Graph
          setOpenRelationsList={setOpenRelationsList}
          setOpenLessonsList={setOpenLessonsList}
        />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}
