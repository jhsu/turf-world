import type { NextPage } from "next";

import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import World from "~/components/World/World";
import { viewPlot } from "~/store";
import Overlay from "~/components/Overlay";

const Home: NextPage = () => {
  const snap = useSnapshot(viewPlot);
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas linear camera={{ position: [0, 0, 25] }}>
        <World
          plotId={snap.plotId}
          onSelectPlot={(id) => (viewPlot.plotId = id)}
        />
        <ambientLight intensity={1} position={[0, 0, 10]} />
        <color attach="background" args={["#91D5E4"]} />
      </Canvas>
      <Overlay />
    </div>
  );
};

export default Home;
