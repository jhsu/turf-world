import "./App.css";
import {MapControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

import World from "./components/World";

export default function App() {
  return (
    <div style={{width: "100%", height: "100%"}}>
      <Canvas orthographic camera={{position: [0, 0, 100], zoom: 1}}>
        {/* <MapControls
          up={[0, 0, 1]}
          screenSpacePanning={true}
          enableRotate={false}
        /> */}
        <ambientLight intensity={1} position={[0, 0, 10]} />
        <World />
        <color attach="background" args={["#91D5E4"]} />
      </Canvas>
    </div>
  );
}
