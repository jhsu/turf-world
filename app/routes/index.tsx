import {Canvas} from "@react-three/fiber";
// import styles from "~/global.css";

// export function links() {
//   return [{rel: "stylesheet", href: styles}];
// }

export default function Index() {
  return (
    <div style={{width: "100%", height: "100%"}}>
      <Canvas linear camera={{position: [0, 0, 25]}}>
        <ambientLight intensity={1} position={[0, 0, 10]} />
        <color attach="background" args={["#91D5E4"]} />
      </Canvas>
    </div>
  );
}
