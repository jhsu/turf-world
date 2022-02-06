import {useTexture} from "@react-three/drei";
import React from "react";

import textureUrl from "../turf-auto.png";

const Plot = ({size = 50}: {size?: number}) => {
  const [texture] = useTexture([textureUrl]);
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry attach="geometry" args={[size, size]} />
      <meshBasicMaterial attach="material" map={texture} an />
    </mesh>
  );
};

export default Plot;
