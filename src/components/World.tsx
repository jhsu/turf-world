import {useThree} from "@react-three/fiber";
import {useControls} from "leva";

import {useRef} from "react";
import Tile from "./Tile";
import LOCATIONS from "./positions";
import {Mesh} from "three";

const SIZE = 150 * 71;
function scale(value: number) {
  return value * (SIZE / 71);
}

const World = () => {
  const {camera} = useThree();
  const meshRef = useRef<Mesh>();

  const [, set] = useControls(() => ({
    plotId: {
      value: 0,
      min: 0,
      max: 5041,
      step: 1,
      onChange(id: number) {
        if (LOCATIONS[id]) {
          const [x, y] = LOCATIONS[id];
          camera.position.set(scale(x), scale(y), camera.position.z);
        }
      },
    },
  }));
  // Originally was going to use a seperate tile for each plot
  return (
    <group>
      <Tile size={SIZE} />
    </group>
  );
};

export default World;
