import {Suspense, useCallback, useLayoutEffect, useMemo, useRef} from "react";
import {
  BufferGeometry,
  InstancedBufferAttribute,
  Object3D,
  Texture,
  Vector2,
  Vector3 as Vec3,
} from "three";
import {extend, useFrame, Vector3} from "@react-three/fiber";
import {
  Instance,
  Instances,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";

import {viewPlot} from "~/store";
import LOCATIONS from "./positions";

const SIZE = 5;
const TOKENS = 5041;

const PlotSpriteMaterial = shaderMaterial(
  {map: new Texture(), offset: new Vector2(0, 0)},
  `
attribute vec2 aOffset;
varying vec2 vUv;
varying vec2 vOffset;

void main()	{
  vUv = uv;
  vOffset = aOffset;
  vec4 mvPosition = vec4(position, 1.0);
  // Instance support
  #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
  #endif
  
  gl_Position = projectionMatrix * modelViewMatrix * mvPosition;
}
  `,
  `
varying vec2 vUv;
varying vec2 vOffset;
uniform sampler2D map;

void main(){
  vec2 uv = vUv;
  vec2 off = vec2(vOffset.x / 71.0, vOffset.y / 71.0);
  uv = fract(uv * (1.0 / 71.0) + off);
  vec4 color = texture2D(map, uv);

  vec4 blueScreen = vec4(0.568, 0.835, 0.933, 1);
  // vec3 diff = color.rgb - blueScreen.rgb;

  // if (diff.r < 0.0001 && diff.g < 0.0001 && diff.b < 0.0001) {
  //   discard;
  // }

  gl_FragColor = color;
}
  `
);
extend({PlotSpriteMaterial});
type PlotSpriteImpl = {
  map: Texture;
  aOffset?: Vector2;
} & JSX.IntrinsicElements["shaderMaterial"];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      plotSpriteMaterial: PlotSpriteImpl;
    }
  }
}

// TODO: use https://codesandbox.io/s/grass-shader-5xho4?file=/src/Grass.js
interface PlotInstanceProps extends Record<string, any> {
  selected?: boolean;
  position: [number, number, number];
  plotId: number;
  onSelect(plotId: number | null): void;
}
const PlotInstance = ({
  selected,
  plotId,
  onSelect,
  position,
  ...props
}: PlotInstanceProps) => {
  const newPosition: [number, number, number] = useMemo(
    () => (selected ? [position[0], position[1], position[2] + 10] : position),
    [selected, position]
  );
  const inst = useRef<Object3D>(null);
  const targetPos = useMemo(() => new Vec3(...newPosition), [newPosition]);
  const onClick = useCallback(() => {
    onSelect(selected ? null : plotId);
  }, [selected, plotId, onSelect]);

  useFrame(() => {
    if (inst.current) {
      targetPos.set(...newPosition);
      inst.current.position.lerp(targetPos, 0.1);
    }
  });
  return (
    <Instance
      {...props}
      position={position}
      ref={inst}
      // onClick={onClick}
    />
  );
};

let STEP = 0.1;
interface WorldProps {
  onSelectPlot(id: number): void;
  plotId: number | null;
}
const World = ({onSelectPlot, plotId}: WorldProps) => {
  const camPos = useMemo<[number, number] | null>(() => {
    if (plotId !== null) {
      // get position and go to it
      const [x, y] = LOCATIONS[plotId];
      return [x * SIZE, y * SIZE];
    }
    return null;
  }, [plotId]);

  const vCam = useMemo(() => new Vec3(...LOCATIONS[0], viewPlot.cameraZ), []);

  useFrame(({camera}) => {
    if (camPos) {
      vCam.set(...camPos, viewPlot.cameraZ);
    } else {
      vCam.setZ(viewPlot.cameraZ);
    }
    camera.position.lerp(vCam, STEP);
    camera.updateProjectionMatrix();
  });

  const tokens = useMemo(() => {
    let ids = [];
    for (let i = 0; i < TOKENS; i++) {
      ids.push({id: i, position: LOCATIONS[i]});
    }
    return ids;
  }, []);

  const ref = useRef<BufferGeometry>(null);
  const uvOffset = useMemo(() => {
    let offsets = [];
    for (let i = 0; i < TOKENS; i++) {
      const [x, y] = LOCATIONS[i];
      offsets.push(x + 35);
      offsets.push(y + 35);
    }
    return offsets;
  }, []);
  useLayoutEffect(() => {
    if (ref.current) {
      ref.current.setAttribute(
        "aOffset",
        new InstancedBufferAttribute(new Float32Array(uvOffset), 2)
      );
    }
  }, [uvOffset]);
  const positions: [number, number, number][] = useMemo(
    () =>
      tokens.map((plot) => [
        SIZE * plot.position[0],
        SIZE * plot.position[1],
        0,
      ]),
    [tokens]
  );

  return (
    <>
      <Instances limit={TOKENS} position={[0, 0, 0]}>
        <planeBufferGeometry ref={ref} args={[SIZE, SIZE]} />

        <Suspense
          fallback={<meshPhongMaterial attach="material" color="#72c5db" />}
        >
          {/* <meshBasicMaterial attach="material" color="green" /> */}
          <ProgressiveTile />
        </Suspense>
        {tokens.map((plot, idx) => (
          <PlotInstance
            key={plot.id}
            selected={plot.id === plotId}
            plotId={plot.id}
            onSelect={onSelectPlot}
            position={positions[idx]}
          />
        ))}
      </Instances>
    </>
  );
};

const TileTexture = () => {
  const [texture] = useTexture(["/images/turf-auto-lg-opt.png"]);

  return <plotSpriteMaterial attach="material" map={texture} />;
};

const ProgressiveTile = () => {
  const [texture] = useTexture(["/images/turf-auto-opt.png"]);
  return (
    <Suspense fallback={<plotSpriteMaterial attach="material" map={texture} />}>
      <TileTexture />
    </Suspense>
  );
};

export default World;
