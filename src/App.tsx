import "./App.css";
import {MapControls, OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

import World from "./components/World";
import {WheelEvent} from "react";
import Overlay from "./components/Overlay/Overlay";
import {useSnapshot} from "valtio";
import {viewPlot} from "./store";

export default function App() {
  const {plotId} = useSnapshot(viewPlot);
  const handleWheel = (event: WheelEvent<HTMLElement>) => {};

  return (
    <div style={{width: "100%", height: "100%"}}>
      <Canvas
        // orthographic
        linear
        flat
        camera={{position: [0, 0, 25]}}
      >
        {/* <OrbitControls /> */}

        {/* <mesh position={[0, 0, 1]}>
          <planeBufferGeometry attach="geometry" args={[10, 10]} />
          <meshPhongMaterial attach="material" color="red" />
        </mesh> */}
        {/* <MapControls
          up={[0, 0, 1]}
          // screenSpacePanning={true}
          // enableRotate={false}
        /> */}
        <ambientLight intensity={1} position={[0, 0, 10]} />
        <World
          plotId={plotId}
          onSelectPlot={(id) => {
            viewPlot.plotId = id;
            viewPlot.showDetails = true;
          }}
        />
        <color attach="background" args={["#91D5E4"]} />
        {/* <color attach="background" args={["#000000"]} /> */}
      </Canvas>
      <Overlay />
    </div>
  );
}
