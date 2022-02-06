import {useTexture} from "@react-three/drei";
import {Ref} from "react";
import {Mesh} from "three";

import textureUrl from "../turf-auto.png";

const Plot = ({size = 50, meshRef}: {size?: number; meshRef?: Ref<Mesh>}) => {
  const [texture] = useTexture([textureUrl]);
  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <planeGeometry attach="geometry" args={[size, size]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

export default Plot;
