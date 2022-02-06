import {Ref, Suspense} from "react";
import Plot from "./Plot";

const Tile = ({size, meshRef}: {size?: number; meshRef?: Ref<any>}) => {
  return (
    <group>
      <Suspense fallback={null}>
        <Plot size={size} meshRef={meshRef} />
      </Suspense>
    </group>
  );
};

export default Tile;
