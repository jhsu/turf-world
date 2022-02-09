import "./App.css";
import {MapControls, OrbitControls} from "@react-three/drei";
import {Canvas, useFrame} from "@react-three/fiber";

import World from "./components/World";
import {WheelEvent} from "react";
import Overlay from "./components/Overlay/Overlay";
import {useSnapshot} from "valtio";
import {viewPlot} from "./store";

const ZoomCamera = ({zoom}: {zoom: number}) => {
  useFrame(({camera}) => {
    camera.zoom = zoom;
  });
  return null;
};

export default function App() {
  const {plotId} = useSnapshot(viewPlot);
  const handleWheel = (event: WheelEvent<HTMLElement>) => {};

  return (
    <div style={{width: "100%", height: "100%"}} onWheel={handleWheel}>
      <Canvas
        orthographic
        linear
        flat
        camera={{position: [0, 0, 100], zoom: 1.5}}
      >
        {/* <ZoomCamera zoom={zoom} /> */}
        {/* <OrbitControls /> */}
        {/* <MapControls
          up={[0, 0, 1]}
          screenSpacePanning={true}
          enableRotate={false}
        /> */}
        {/* <ambientLight intensity={1} position={[0, 0, 10]} /> */}
        <World
          plotId={plotId}
          onSelectPlot={(id) => {
            viewPlot.plotId = id;
            viewPlot.showDetails = true;
          }}
        />
        {/* <color attach="background" args={["#91D5E4"]} /> */}
        <color attach="background" args={["#000000"]} />
      </Canvas>
      <Overlay />
    </div>
  );
}
