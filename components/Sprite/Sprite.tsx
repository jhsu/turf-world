import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import { Vector2, Vector3 } from "three";
import { SpriteMixer } from "~/utils/three/sprite-mixer";

const spriteMixer = SpriteMixer();

const walkSpeed = 0.1;
const actionNames = ["idle", "walkRight", "walkLeft"];

interface SpriteProps {
  texture: string;
  tiles: [number, number];
}
const Sprite = ({
  texture: textureSource,
  tiles: [tileX, tileY],
}: SpriteProps) => {
  const { size } = useThree();
  const texture = useTexture(textureSource);
  const actionSprite = useMemo(() => {
    const sprite = spriteMixer.ActionSprite(texture.clone(), tileX, tileY);
    sprite.center = new Vector2(0.5, 0);
    return sprite;
  }, [texture, spriteMixer]);

  const actions = useMemo(
    () => ({
      walkDown: spriteMixer.Action(actionSprite, 0, 3, 120),
      walkLeft: spriteMixer.Action(actionSprite, 4, 7, 120),
      walkUp: spriteMixer.Action(actionSprite, 8, 11, 120),
      walkRight: spriteMixer.Action(actionSprite, 12, 15, 120),
      idle: spriteMixer.Action(actionSprite, 0, 0, 10000),
    }),
    [actionSprite, spriteMixer]
  );
  // let action = useRef([actions.walkDown, actions.walkLeft, actions.walkUp, actions.walkRight])
  const moveTo = useMemo(() => new Vector3(0, -size.height / 2, 0), []);
  const act = useRef<"idle" | "walkLeft" | "walkRight" | "walkUp" | "walkDown">(
    "idle"
  );

  useEffect(() => {
    // const n = Math.random();
    const { width, height } = size;
    // moveTo.x = (width / 2 - -width / 2) * n + -width / 2;
    // moveTo.x = 0;
    // moveTo.y = -height / 2;
    // console.log(moveTo);
    // actionSprite.position.x = moveTo.x;

    //   const randomMove = () => {
    //     act.current = shuffleArray(actionNames)[0];
    //     actions[act.current].playLoop();
    //   };
    //   randomMove();
    //   const moveInt = setInterval(randomMove, 3000);
    //   return () => {
    //     clearInterval(moveInt);
    //   };
    console.log(actionSprite.position);
  }, [moveTo, actions, actionSprite, size]);

  const oldTime = useRef<number>();
  useFrame(({ clock }) => {
    // TODO: skip if paused
    if (oldTime.current) {
      const delta = clock.getElapsedTime() - oldTime.current;
      spriteMixer.update(delta);
    }
    oldTime.current = clock.getElapsedTime();
    // actionSprite.position.set(0, 0, 0);
    // moveTo.set(0, 0, moveTo.z);
    // actionSprite.position.lerp(moveTo, 0.1);
  });

  return (
    <>
      <primitive object={actionSprite} position={moveTo} />

      <mesh position={[0, 0, 0]}>
        <boxBufferGeometry attach="geometry" args={[10, 10, 10]} />
        <meshBasicMaterial attach="material" color="green" />
      </mesh>
    </>
  );
};
export default Sprite;
