import {gql, useQuery} from "@apollo/client";
import {OrthographicCamera, useCamera, useTexture} from "@react-three/drei";
import {createPortal, useFrame, useThree} from "@react-three/fiber";
import {forwardRef, Suspense, useCallback, useMemo, useRef} from "react";
import {Camera, Material, Mesh, Scene} from "three";

const PLOT_QUERY = gql`
  query PlotOverlayDetails($tokenID: String!) {
    token(id: $tokenID) {
      id
      image
    }
  }
`;

export const PlotDetails = ({plotId}: {plotId: number}) => {
  const {data} = useQuery(PLOT_QUERY, {
    variables: {tokenID: plotId?.toString()},
  });
  const {camera, size} = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef<Camera>(camera);
  useFrame(({scene, camera, gl}) => {
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    if (virtualCam.current) {
      gl.render(virtualScene, virtualCam.current);
    }
  }, 1);

  const onHover = useCallback((e) => {
    const mat = e.object.material;
    if (mat) {
      mat.opacity = 0.3;
    }
  }, []);
  const onLeave = useCallback((e) => {
    const mat = e.object.material;
    if (mat) {
      mat.opacity = 1;
    }
  }, []);
  const inUseCamera = useCamera(virtualCam);

  const planeSize = 400;
  return createPortal(
    <>
      <OrthographicCamera
        ref={virtualCam}
        makeDefault={false}
        position={[0, 0, 1]}
      />
      {data && (
        <mesh
          position={[
            size.width / 2 - planeSize / 2,
            -size.height / 2 + planeSize / 2,
            0,
          ]}
          onPointerOver={onHover}
          onPointerLeave={onLeave}
          raycast={inUseCamera}
        >
          {data.token?.image && (
            <Suspense fallback={null}>
              <FullResTexture key={data.token.id} url={data.token.image} />
            </Suspense>
          )}
          <planeBufferGeometry
            attach="geometry"
            args={[planeSize, planeSize]}
          />
        </mesh>
      )}
      <ambientLight intensity={1} />
    </>,
    virtualScene
  ) as any;
};

const FullResTexture = forwardRef<Material, {url: string}>(({url}, ref) => {
  const [img] = useTexture([url]);

  return (
    <meshStandardMaterial ref={ref} transparent attach="material" map={img} />
  );
});
FullResTexture.displayName = "FullResTexture";
