import "./App.css";
import {MapControls, OrbitControls} from "@react-three/drei";
import {Canvas} from "@react-three/fiber";

import World from "./components/World";
import {FormEvent, useState, WheelEvent} from "react";

export default function App() {
  const [plotId, setPlotId] = useState<number | null>(null);
  const [showInfo, setShowInfo] = useState(false);
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPlotId(
      (prev) => parseInt(form.get("plotId")?.toString() ?? "", 10) ?? prev
    );
  };
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
            setPlotId(id);
            setShowInfo(true);
          }}
        />
        <color attach="background" args={["#91D5E4"]} />
        {/* <color attach="background" args={["#000000"]} /> */}
      </Canvas>
      <div
        style={{
          bottom: 10,
          width: "100%",
          maxWidth: 300,
          position: "absolute",
          background: "white",
          borderRadius: 6,
          padding: 40,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        {showInfo && (
          <div>
            <h2
              style={{display: "inline-block", marginTop: 0, marginRight: 20}}
            >
              Plot {plotId}{" "}
            </h2>
            <a
              href={`https://opensea.io/assets/0x55d89273143de3de00822c9271dbcbd9b44b44c6/${plotId}`}
              target="_blank"
              rel="noreferrer"
              title="View plot on Opensea"
            >
              Opensea 🔗
            </a>
            {/* <button onClick={() => setShowInfo(false)}>close</button> */}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <input
            name="plotId"
            placeholder="Type plot token id and press 'enter'"
          />
          <button type="submit">jump to plot</button>
        </form>
      </div>
    </div>
  );
}
