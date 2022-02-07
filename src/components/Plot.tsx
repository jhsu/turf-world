import {useTexture} from "@react-three/drei";
import {Ref, Suspense, useMemo} from "react";
import {LinearFilter, Mesh, Object3D} from "three";

import textureUrl from "../turf-auto.png";
import textureHdURL from "../turf-auto-lg.png";

const HighDef = ({tokenId}: {tokenId: number}) => {
  const path = useMemo(() => `/plots/${tokenId}_lg.png`, [tokenId]);
  const [texture] = useTexture([path]);
  // texture.minFilter = LinearFilter;
  return <meshBasicMaterial attach="material" map={texture} />;
};

const Plot = ({
  size = 50,
  meshRef,
  tokenId,
  visible = true,
}: {
  size?: number;
  meshRef?: Ref<Object3D>;
  tokenId: number;
  visible?: boolean;
}) => {
  return (
    <mesh position={[0, 0, 0]} ref={meshRef}>
      <planeGeometry attach="geometry" args={[size, size]} />
      {visible ? (
        <UseTexture tokenId={tokenId} />
      ) : (
        <meshPhongMaterial args={[{color: "#049ef4"}]} />
      )}
    </mesh>
  );
};

const UseTexture = ({tokenId}: {tokenId: number}) => {
  const path = useMemo(() => `/plots/${tokenId}.png`, [tokenId]);
  const [texture] = useTexture([path]);
  // texture.minFilter = LinearFilter;
  return (
    <Suspense fallback={<meshBasicMaterial attach="material" map={texture} />}>
      <HighDef tokenId={tokenId} />
    </Suspense>
  );
};

export default Plot;
