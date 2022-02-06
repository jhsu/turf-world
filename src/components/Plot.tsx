import {useTexture} from "@react-three/drei";
import {Ref, Suspense} from "react";

import textureUrl from "../turf-auto.png";
import textureHdURL from "../turf-auto-lg.png";

const HighDef = ({size = 50}: {size?: number}) => {
  const [texture] = useTexture([textureHdURL]);
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry attach="geometry" args={[size, size]} />
      <meshBasicMaterial attach="material" map={texture} />
    </mesh>
  );
};

const Plot = ({size = 50, meshRef}: {size?: number; meshRef?: Ref<any>}) => {
  const [texture] = useTexture([textureUrl]);
  return (
    <Suspense
      fallback={
        <mesh position={[0, 0, 0]} ref={meshRef}>
          <planeGeometry attach="geometry" args={[size, size]} />
          <meshBasicMaterial attach="material" map={texture} />
        </mesh>
      }
    >
      <HighDef size={size} />
    </Suspense>
  );
};

export default Plot;
