import React from "react";

import { Text3D } from "@react-three/drei";

import poppins1 from "../../../../../utils/fonts/Poppins_Regular.json";

export default function Texts({text,position}) {

  return (
    <Text3D
        font="https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/droid/droid_sans_regular.typeface.json" 
        position={position}
    >
        {text}
        <lineDashedMaterial color={0x00b7eb}/>
    </Text3D>
  );
}