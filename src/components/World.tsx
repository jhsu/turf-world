import {Suspense, useLayoutEffect, useMemo, useRef} from "react";
import {extend} from "@react-three/fiber";

import LOCATIONS from "./positions";
import {
  BufferGeometry,
  InstancedBufferAttribute,
  Texture,
  Vector2,
} from "three";
import {
  Instance,
  Instances,
  shaderMaterial,
  useTexture,
} from "@react-three/drei";

const SIZE = 150;
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

const World = () => {
  // const {camera} = useThree();

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

  return (
    <Instances limit={TOKENS}>
      <planeBufferGeometry ref={ref} args={[SIZE, SIZE]} />
      <Suspense
        fallback={<meshPhongMaterial attach="material" color="#72c5db" />}
      >
        {/* <TileTexture /> */}
        <ProgressiveTile />
      </Suspense>
      {tokens.map((plot) => (
        <Instance
          key={plot.id}
          position={
            plot.position
              ? [SIZE * plot.position[0], SIZE * plot.position[1], 0]
              : [0, 0, 0]
          }
        />
      ))}
    </Instances>
  );
};

const TileTexture = () => {
  const [texture] = useTexture(["/turf-auto-lg-opt.png"]);

  return <plotSpriteMaterial attach="material" map={texture} />;
};

const ProgressiveTile = () => {
  const [texture] = useTexture(["/turf-auto-opt.png"]);
  return (
    <Suspense fallback={<plotSpriteMaterial attach="material" map={texture} />}>
      <TileTexture />
    </Suspense>
  );
};

export default World;
