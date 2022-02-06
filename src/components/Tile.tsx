import {Ref, Suspense} from "react";
import {Mesh} from "three";
import Plot from "./Plot";

const Tile = ({size, meshRef}: {size?: number; meshRef?: Ref<Mesh>}) => {
  return (
    <group>
      <Suspense fallback={null}>
        <Plot size={size} meshRef={meshRef} />
      </Suspense>
    </group>
  );
};

export default Tile;
