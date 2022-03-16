import { OrthographicCamera } from "@react-three/drei";
import { createPortal, useFrame, useThree } from "@react-three/fiber";
import { forwardRef, Suspense, useMemo, useRef } from "react";
import { Camera, Scene, OrthographicCamera as OrthoCam } from "three";
import Sprite from "../Sprite/Sprite";

const Viewer = forwardRef((_props, ref) => {
  const { size } = useThree();
  // TODO: do this on window resize only
  useFrame(({ camera: cam, size: { width, height } }) => {
    const camera = cam as OrthoCam;
    camera.left = -width / 2;
    camera.right = width / 2;
    camera.top = height / 2;
    camera.bottom = -height / 2;
    camera.updateProjectionMatrix();
  });

  return (
    <OrthographicCamera
      ref={ref}
      args={[
        -size.width / 2,
        size.width / 2,
        size.height / 2,
        -size.height / 2,
        1,
        10,
      ]}
      // args={[
      //   -viewport.width / 2,
      //   viewport.width / 2,
      //   viewport.height / 2,
      //   -viewport.height / 2,
      //   1,
      //   10,
      // ]}
      position={[0, 0, 10]}
    />
  );
});

const PlotAvatars = () => {
  const { camera } = useThree();
  const virtualScene = useMemo(() => new Scene(), []);
  const virtualCam = useRef<Camera>(camera);

  useFrame(({ scene, camera, gl }) => {
    gl.autoClear = true;
    gl.render(scene, camera);
    gl.autoClear = false;
    gl.clearDepth();
    if (virtualCam.current) {
      gl.render(virtualScene, virtualCam.current);
    }
  }, 1);

  // render a portal with a cube mesh in it
  return createPortal(
    <>
      <Viewer ref={virtualCam} />

      <Suspense fallback={null}>
        <Sprite
          // texture="https://www.forgottenrunes.com/api/art/wizards/4212/spritesheet.png"
          texture="/images/spritesheet.png"
          tiles={[4, 4]}
        />
      </Suspense>
    </>,
    virtualScene
  ) as any;
};

export default PlotAvatars;
