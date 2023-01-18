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
import { tempLessons, tempOrigins, tempRelations } from '../../../../utils/temp';

const rad = 10;
const lineAmp = rad/3;
const steps = 30;
const y0 = 0.1;

// for hdrs https://polyhaven.com/hdris

export default function RelationsOriginsGraph({setOpenList, setFilters}) {

  /*
  
  
  const lessons = useHookstate(lessonsState);
  const origins = useHookstate(originsState);
  const originToId = useMemo(()=>invertResource(origins.get(),"origin"),[origins])
  const relationsToList = useHookstate(relationsToListState);
  const relations = useHookstate(relationsState);
  
  */
 const origins = tempOrigins;
 const lessons = tempLessons;
 const relations = tempRelations;
 const originToId = invertResource(origins, "origin");

    // origins.get()
    const dTheta = useMemo(()=>( 2*Math.PI )/(Object.keys(origins).length),[origins]);

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
    const originsRelations = useMemo(()=> mapOriginsToRelations(relations, lessons),[relations, lessons]);

    const getPointsGeometry = useCallback((X,Z) => {
    const points = [];

    const dx = (X[1]-X[0])/steps;
    const dz = (Z[1]-Z[0])/steps;

    for (let t = 0; t <= steps; t += 1) {
      const x = X[0] + dx * t;
      const z = Z[0] + dz * t;
      const y = y0 + lineAmp * Math.sin((Math.PI * t) / steps);
      points.push(new THREE.Vector3(x, -y, z));
    }

    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <Canvas
      camera={{ position: [0,30, 70], fov: 15 }}
    >
      <Environment
        background
        files="./imgs/hilly_terrain_01_puresky_1k.hdr"
        blur={0}
        
      />
      <ambientLight intensity={1} />
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

                return (
                    <group>
                        <Component 
                            key={ originToId[ originsComponentOrder[i] ]}
                            position={[X[0],0,Z[0]]}
                        />
                        {
                            originsRelatedWithOrigin1?.map( origin2Id => {
                                // primero deme el segundo origin
                                // get()
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
                                const lineWidth = Math.floor((originsRelations[ originId1 ][ origin2Id ].length)*(2/7)) + 2;

                                return(
                                  <Line
                                    color={Math.random()* 0xffffff}
                                    points={getPointsGeometry(X,Z)}
                                    lineWidth={lineWidth}
                                    handleClick={()=>{
                                      // get()
                                      setFilters(`${origins[originId1].origin}, ${origin2name}`);
                                      setOpenList(true);
                                      // relationsToList.set( originsRelations[ originId1 ][ origin2Id ] );
                                    }}
                                  />
                                )
                            })
                        }
                    </group>
                )
            })
        }
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
}