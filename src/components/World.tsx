import {Camera, useFrame, useThree} from "@react-three/fiber";
import {useControls} from "leva";

import React, {useEffect} from "react";
import Tile from "./Tile";
import LOCATIONS from "./positions";

const SIZE = 50;
const UNIT = SIZE / 71;
const World = () => {
  const {camera} = useThree();
  const [, set] = useControls(() => ({
    plotId: {
      value: 0,
      min: 0,
      max: 5041,
      step: 1,
      onChange(id: number) {
        if (LOCATIONS[id]) {
          const [x, y] = LOCATIONS[id];
          camera.position.set(x * UNIT, y * UNIT, camera.position.z);
        }
      },
    },
    x: {
      value: camera.position.x,
      onChange(valu) {
        camera.position.x = valu;
      },
    },
    y: {
      value: camera.position.y,
      onChange(valu) {
        camera.position.y = valu;
      },
    },
    z: camera.position.z,
  }));
  useFrame(({camera}) => {
    set({x: camera.position.x, y: camera.position.y, z: camera.position.z});
  });

  return (
    <group>
      <Tile size={SIZE} />
    </group>
  );
};

export default World;
