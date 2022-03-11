import { Suspense, useCallback, useEffect, useMemo, useRef } from "react";
import {
  InstancedMesh,
  Object3D,
  Texture,
  Vector2,
  Vector3 as Vec3,
} from "three";
import { extend, ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";

import { viewPlot } from "~/store";
import LOCATIONS from "./positions";
import { useKeyPress } from "~/utils/useKey";

const SIZE = 5;
const TOKENS = 5041;
const STEP = 0.1;

const PlotSpriteMaterial = shaderMaterial(
  { map: new Texture(), cFactor: 1 },
  `
attribute vec2 aOffset;
attribute float cFactor;
varying vec2 vUv;
varying vec2 vOffset;
varying float vFactor;

void main()	{
  vUv = uv;
  vOffset = aOffset;
  vFactor = cFactor;
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
varying float vFactor;
uniform sampler2D map;

void main(){
  vec2 uv = vUv;
  vec2 off = vec2(vOffset.x / 71.0, vOffset.y / 71.0);
  uv = fract(uv * (1.0 / 71.0) + off);
  vec4 color = texture2D(map, uv);

  // vec4 blueScreen = vec4(0.568, 0.835, 0.933, 1);
  // vec3 diff = color.rgb - blueScreen.rgb;

  // if (diff.r < 0.0001 && diff.g < 0.0001 && diff.b < 0.0001) {
  //   discard;
  // }

  color.r = color.r * vFactor;
  color.g = color.g * vFactor;
  color.b = color.b * vFactor;
  gl_FragColor = color;
}
  `
);
extend({ PlotSpriteMaterial });
type PlotSpriteImpl = {
  map: Texture;
  aOffset?: Vector2;
  cFactor?: number;
} & JSX.IntrinsicElements["shaderMaterial"];

declare global {
  namespace JSX {
    interface IntrinsicElements {
      plotSpriteMaterial: PlotSpriteImpl;
    }
  }
}

function findNeighbors(plotId: number): (number | null)[] {
  const [x, y] = LOCATIONS[plotId];
  const neighbors: (number | null)[] = [];
  const entries = Object.entries(LOCATIONS);
  for (let i = 1; i >= -1; i--) {
    for (let j = -1; j <= 1; j++) {
      const found = entries.find(
        ([, [x2, y2]]) => x2 === x + j && y2 === y + i
      );
      if (found) {
        neighbors.push(parseInt(found[0], 10));
      } else {
        neighbors.push(null);
      }
    }
  }
  return neighbors;
}
// TODO: convert LOCATIONS to coordiate system for lookup

function moveUp() {
  if (viewPlot.plotId === null) return;
  const neighbors = findNeighbors(viewPlot.plotId);
  viewPlot.plotId = neighbors[1] ?? viewPlot.plotId;
}
function moveDown() {
  if (viewPlot.plotId === null) return;
  const neighbors = findNeighbors(viewPlot.plotId);
  viewPlot.plotId = neighbors[7] ?? viewPlot.plotId;
}
function moveLeft() {
  if (viewPlot.plotId === null) return;
  const neighbors = findNeighbors(viewPlot.plotId);
  viewPlot.plotId = neighbors[3] ?? viewPlot.plotId;
}
function moveRight() {
  if (viewPlot.plotId === null) return;
  const neighbors = findNeighbors(viewPlot.plotId);
  viewPlot.plotId = neighbors[5] ?? viewPlot.plotId;
}

interface WorldProps {
  onSelectPlot(id: number): void;
  plotId: number | null;
}
const World = ({ onSelectPlot, plotId }: WorldProps) => {
  const { viewport } = useThree();
  useEffect(() => {
    viewPlot.viewport = viewport;
  }, [viewport]);

  const neighbors = useMemo(
    () => (plotId !== null ? findNeighbors(plotId) : []),
    [plotId]
  );

  useKeyPress("w", moveUp);
  useKeyPress("s", moveDown);
  useKeyPress("a", moveLeft);
  useKeyPress("d", moveRight);

  const vCam = useMemo(() => new Vec3(...LOCATIONS[0], viewPlot.cameraZ), []);
  useFrame(({ camera }) => {
    const camPos = viewPlot.cameraLocation;
    if (camPos) {
      vCam.set(...camPos);
    }
    camera.position.lerp(vCam, STEP);
    camera.updateProjectionMatrix();
  });

  const tokens = useMemo(() => {
    let ids = [];
    for (let i = 0; i < TOKENS; i++) {
      ids.push({ id: i, position: LOCATIONS[i] });
    }
    return ids;
  }, []);

  const presentNeighbors = useMemo(
    () => neighbors.filter((i) => i !== null) as number[],
    [neighbors]
  );

  return (
    <>
      <InstancedMeshTiles
        tokens={tokens}
        plotId={plotId}
        neighbors={presentNeighbors}
        onSelect={onSelectPlot}
      />
    </>
  );
};

interface InstancedMeshTilesProps {
  plotId: number | null;
  onSelect: (id: number) => void;
  tokens: { position: [number, number]; id: number }[];
  neighbors?: number[];
}
const InstancedMeshTiles = ({
  tokens,
  plotId,
  onSelect,
  neighbors = [],
}: InstancedMeshTilesProps) => {
  const meshRef = useRef<InstancedMesh>();

  const dimFactors = useMemo(() => {
    const cFactors = [];
    for (let i = 0; i < TOKENS; i++) {
      if (plotId === null) {
        cFactors.push(1);
      } else {
        if (i === plotId) {
          cFactors.push(1);
        } else if (neighbors.includes(i)) {
          cFactors.push(0.75);
        } else {
          cFactors.push(0.35);
        }
      }
    }
    return cFactors;
  }, [plotId, neighbors]);

  const positions: number[] = useMemo(
    () =>
      tokens.reduce((list, plot) => {
        list.push(SIZE * plot.position[0], SIZE * plot.position[1], 0);
        return list;
      }, [] as number[]),
    [tokens]
  );

  const uvOffset = useMemo(() => {
    let offsets = [];
    for (let i = 0; i < TOKENS; i++) {
      const [x, y] = LOCATIONS[i];
      offsets.push(x + 35);
      offsets.push(y + 35);
    }
    return offsets;
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < TOKENS; i++) {
      const start = i * 3;
      const dum = new Object3D();
      dum.position.copy(new Vec3(...positions.slice(start, start + 2)));
      dum.updateMatrix();
      meshRef.current.setMatrixAt(i, dum.matrix);
    }
  }, [positions]);

  const onClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (e.instanceId !== undefined) {
        onSelect(e.instanceId);
      }
    },
    [onSelect]
  );

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, TOKENS]}
      onClick={onClick}
    >
      <planeGeometry args={[SIZE, SIZE]}>
        <instancedBufferAttribute
          attachObject={["attributes", "aOffset"]}
          args={[new Float32Array(uvOffset), 2]}
        />
        <instancedBufferAttribute
          attachObject={["attributes", "cFactor"]}
          args={[new Float32Array(dimFactors), 1]}
        />
      </planeGeometry>

      <Suspense
        fallback={<meshPhongMaterial attach="material" color="#72c5db" />}
      >
        {/* <meshBasicMaterial attach="material" color="green" /> */}
        <ProgressiveTile />
      </Suspense>
    </instancedMesh>
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
