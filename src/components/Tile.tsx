import React, {Suspense} from "react";
import Plot from "./Plot";

const Tile = ({size}: {size?: number}) => {
  return (
    <group>
      <Suspense fallback={null}>
        <Plot size={size} />
      </Suspense>
    </group>
  );
};

export default Tile;
