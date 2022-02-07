import {useMemo, useRef} from "react";
import {useThree} from "@react-three/fiber";
import {useControls} from "leva";

import Tile from "./Tile";
import LOCATIONS from "./positions";

// const SIZE = 150 * 71;
function scale(value: number) {
  return value * (SIZE / 71);
}
const SIZE = 150;
const TOKENS = 5041;

const World = () => {
  const {camera} = useThree();

  // const [, set] = useControls(() => ({
  //   plotId: {
  //     value: 0,
  //     min: 0,
  //     max: 5041,
  //     step: 1,
  //     onChange(id: number) {
  //       if (LOCATIONS[id]) {
  //         const [x, y] = LOCATIONS[id];
  //         camera.position.set(scale(x), scale(y), camera.position.z);
  //       }
  //     },
  //   },
  // }));

  const tokens = useMemo(() => {
    let ids = [];
    for (let i = 0; i < TOKENS; i++) {
      ids.push({id: i, position: LOCATIONS[i]});
    }
    return ids;
  }, []);

  return (
    <group>
      {tokens.map((plot) => (
        <Tile
          key={plot.id}
          size={SIZE}
          tokenId={plot.id}
          position={
            plot.position
              ? [SIZE * plot.position[0], SIZE * plot.position[1]]
              : [0, 0]
          }
        />
      ))}
      {/* <Tile size={SIZE} tokenId={} /> */}
    </group>
  );
};

export default World;
