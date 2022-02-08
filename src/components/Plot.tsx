import {useTexture, Text} from "@react-three/drei";
import {Ref, Suspense, useCallback, useMemo, useState} from "react";
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
  const [showInfo, setShowInfo] = useState(false);
  const onMouseOver = useCallback(() => {
    setShowInfo(true);
  }, []);
  const onMouseLeave = useCallback(() => {
    setShowInfo(false);
  }, []);
  // const [texture] = useTexture(['/turf-auto-lg.png'])
  // return (
  //   <instancedMesh >
  //     <planeBufferGeometry args={[size, size]} />
  //     <meshBasicMaterial map={texture}  />
  //   </instancedMesh>
  // );
  return (
    <>
      {showInfo && (
        <Text
          position={[0, (-1 * size) / 3, 0.2]}
          color={"#EC2D2D"}
          fontSize={12}
          maxWidth={200}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign={"left"}
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {tokenId}
        </Text>
      )}
      <mesh
        position={[0, 0, 0]}
        ref={meshRef}
        onPointerEnter={onMouseOver}
        onPointerLeave={onMouseLeave}
      >
        <planeGeometry attach="geometry" args={[size, size]} />
        {visible ? (
          <UseTexture tokenId={tokenId} />
        ) : (
          <meshPhongMaterial args={[{color: "#049ef4"}]} />
        )}
      </mesh>
    </>
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
