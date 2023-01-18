/* eslint-disable react/jsx-key */
import React, { Suspense, useCallback, useMemo } from 'react';

import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useHookstate } from '@hookstate/core';

import { lessonsState, originsState, relationsState,relationsToListState } from '../../../../globalState/globalState';
import Models, {originsComponentOrder} from '../Models';
import { mapOriginsToRelations } from '../../../../helpers/relations_helper';
// import { tempLessons, tempOrigins, tempRelations } from '../../../../utils/temp';
import { invertResource } from '../../../../helpers/data_helper';
import Line from '../Line';
import { filterByOrigins } from '../../../../utils/filters';

const rad = 10;
const lineAmp = rad / 2;

export default function RelationsOriginsGraph({setOpenList, setFilters}) {

  /*
  const origins = tempOrigins;
  const lessons = tempLessons;
  const relations = tempRelations;
  const originToId = invertResource(origins, "origin");
  */
  const relations = useHookstate(relationsState);
  const lessons = useHookstate(lessonsState);
  const origins = useHookstate(originsState);
  const originToId = useMemo(()=>invertResource(origins.get(),"origin"),[origins])
  const relationsToList = useHookstate(relationsToListState);


    // origins.get()
    const dTheta = useMemo(()=>( 2*Math.PI )/(Object.keys(origins.get()).length),[origins]);

    const components = useMemo(()=> Models,[]);

    /*
        originsRelations = {
            originId1: {
              originId2: [relationid1, relationid2...],
              originId3: [relationid1, relationid2...]
            },
        }  
    */
    // relations.get(), lessons.get()
    const originsRelations = useMemo(()=> mapOriginsToRelations(relations.get(), lessons.get()),[relations, lessons]);


    const getPointsGeometry = useCallback((X,Z) => {
    const points = [];
    let x,y,z;
    const steps = 30;
    const dx = (X[1]-X[0])/steps;
    const dz = (Z[1]-Z[0])/steps;
    // const dx = 2 * (lineRad / steps);
    for (let t = 0; t <= steps; t += 1) {
      x = X[0] + dx * t;
      z = Z[0] + dz * t;
      y = lineAmp * Math.sin((Math.PI * t) / steps);
      points.push(new THREE.Vector3(x, y, z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 20, 50], fov: 15 }}
    >
      <Environment
        background
        files="./imgs/drakensberg_solitary_mountain_puresky_1k.hdr"
        blur={0.5}
      />
      <ambientLight intensity={0.1} />
      <Suspense fallback={null}>
        {
            components.map( (Component, i) => {
               
                const X=[],Z=[];
                X[0] = rad * Math.cos(dTheta * i);
                Z[0] = rad * Math.sin(dTheta * i);
                const originId1 = originToId[ originsComponentOrder[i] ];
                let originsRelatedWithOrigin1;
                if(originsRelations[ originId1 ]){
                  originsRelatedWithOrigin1 = Object.keys(originsRelations[ originId1 ]);
                }

                console.log(originsRelations)

                return (
                    <group>
                        <Component 
                            key={ originToId[ originsComponentOrder[i] ]}
                            position={[X[0],0,Z[0]]}
                        />
                        {
                            originsRelatedWithOrigin1?.map( origin2Id => {
                                // primero deme el segundo origin
                                const origin2name = origins[ origin2Id ].origin;
                                // indice del segundo origin
                                const j = originsComponentOrder.indexOf(origin2name);
                                if( i === j ){
                                  const phi = Math.PI /60;
                                  X[0] = rad * Math.cos(dTheta * i + phi);
                                  Z[0] = rad * Math.sin(dTheta * i + phi);
                                }

                                X[1] = rad * Math.cos(dTheta * j);
                                Z[1] = rad * Math.sin(dTheta * j);

                                // TODO compute maximun amount of relations between a pair of origins
                                // this places the width between 2 and 5
                                const lineWidth = Math.floor((originsRelations[ originId1 ][ origin2Id ].length)*(3/7)) + 2;

                                return(
                                  <Line
                                    color={Math.random()* 0xffffff}
                                    points={getPointsGeometry(X,Z)}
                                    lineWidth={lineWidth}
                                    handleClick={()=>{
                                      setFilters(`${origins[originId1].origin}, ${origin2name}`);
                                      setOpenList(true);
                                      // relations.get()
                                      const r = filterByOrigins( relations.get(), originsRelations, originId1, origin2Id  )
                                      relationsToList.set( filterByOrigins( relations.get(), originsRelations, originId1, origin2Id  ) )
                                    }}
                                  />
                                )
                            })
                        }
                    </group>
                )
            })
        }
        {/* <Chalkboard position={[0, 0, -rad]} />
        <Newspaper
          position={[
            rad * Math.cos(Math.PI / 4),
            0,
            -rad * Math.sin(Math.PI / 4),
          ]}
        />
        <Vinyl position={[rad, 0, 0]} scale={[3, 3, 3]} />
        <Book
          position={[
            rad * Math.cos(Math.PI / 4),
            0,
            rad * Math.sin(Math.PI / 4),
          ]}
        />
        <Videogame position={[0, 0, rad]} />
        <PersonalXP
          position={[
            -rad * Math.cos(Math.PI / 4),
            0,
            rad * Math.sin(Math.PI / 4),
          ]}
          scale={[0.5, 0.5, 0.5]}
        />
        <Theater position={[-rad, 0, 0]} />
        <Video
          position={[
            -rad * Math.cos(Math.PI / 4),
            0,
            -rad * Math.sin(Math.PI / 4),
          ]}
          scale={[0.75, 0.75, 0.75]}
        />  */}
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}