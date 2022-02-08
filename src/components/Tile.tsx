import {Html, Text} from "@react-three/drei";
import {useFrame, useThree} from "@react-three/fiber";
import {Ref, Suspense, useEffect, useRef, useState} from "react";
import {Group, Mesh, Object3D, Vector2, Vector3} from "three";
import Plot from "./Plot";

const Tile = ({
  size = 50,
  tokenId,
  meshRef,
  position,
}: {
  size?: number;
  tokenId: number;
  meshRef?: Ref<any>;
  position: [number, number];
}) => {
  const ref = useRef<Object3D>(null);
  const [inView, setInView] = useState(false);
  const visible = useRef(false);
  const [target] = useState<Vector3>(() => new Vector3());
  useFrame(({camera}) => {
    // check if the distance is less than 5 tile units
    if (ref.current) {
      const pos = new Vector2(camera.position.x, camera.position.y);
      const {x, y} = ref.current.getWorldPosition(target);
      const dist = pos.distanceTo(new Vector2(x, y));
      if (dist <= size * 5) {
        visible.current = true;
        setInView(true);
      } else if (visible.current) {
        visible.current = false;
        setInView(false);
      }
    }
  });
  return (
    <group position={[position[0], position[1], 0]}>
      <Suspense fallback={null}>
        <Plot size={size} meshRef={ref} tokenId={tokenId} visible={inView} />
      </Suspense>
    </group>
  );
};

export default Tile;
