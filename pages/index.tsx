import type {NextPage} from "next";

import {Canvas} from "@react-three/fiber";
import {useSnapshot} from "valtio";
import World from "~/components/World/World";
import {viewPlot} from "~/store";
import Overlay from "~/components/Overlay";
import {useGesture, useWheel} from "@use-gesture/react";
import {Perf} from "r3f-perf";
import {useCallback} from "react";

const Home: NextPage = () => {
  const snap = useSnapshot(viewPlot);
  const bind = useGesture({
    onWheel: ({direction: [, y]}) => {
      viewPlot.z += y === -1 ? -1 : 1;
    },
  });

  const onSelect = useCallback((id: number) => (viewPlot.plotId = id), []);

  return (
    <div style={{width: "100%", height: "100%"}} {...bind()}>
      <Canvas linear camera={{position: [0, 0, 25]}}>
        {/* <Perf /> */}
        <World plotId={snap.plotId} onSelectPlot={onSelect} />
        <color attach="background" args={["#91D5E4"]} />
      </Canvas>
      <Overlay />
    </div>
  );
};

export default Home;
