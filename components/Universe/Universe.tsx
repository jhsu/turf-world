import {Canvas} from "@react-three/fiber";
import {useSnapshot} from "valtio";
import World from "~/components/World/World";
import {viewPlot} from "~/store";
import Overlay from "~/components/Overlay";
import {useGesture, useWheel} from "@use-gesture/react";
import {Perf} from "r3f-perf";
import {useCallback, useRef} from "react";
import {ApolloProvider, useApolloClient} from "@apollo/client";
import {QueryClientProvider, useQueryClient} from "react-query";
import {useRouter} from "next/router";

const Universe = () => {
  const {plotId} = useSnapshot(viewPlot);
  const isDragging = useRef(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const bind = useGesture(
    {
      onDrag: ({down, offset, movement}) => {
        isDragging.current = down;
        if (down) {
          viewPlot.plotId = null;
          viewPlot.cameraLocation = [-offset[0], -offset[1], 0];
        }
        if (dragRef.current) {
          dragRef.current.style.cursor = down ? "grabbing" : "default";
        }
      },
      onWheel: ({direction: [, y]}) => {
        viewPlot.z += y === -1 ? -2 : 2;
      },
      onPinch: ({offset: [scale]}) => {
        viewPlot.z *= scale;
      },
    },
    {
      drag: {
        filterTaps: true,
        threshold: 20,
        rubberband: true,
        bounds: {
          left: -175,
          right: 175,
          top: -175,
          bottom: 175,
        },
        transform: ([x, y]) => {
          if (viewPlot.viewport) {
            const {factor} = viewPlot.viewport;
            return [x / factor, -y / factor];
          }
          return [x, -y];
        },
        from: () => {
          return [-viewPlot.cameraPosition[0], -viewPlot.cameraPosition[1]];
        },
      },
    }
  );
  const router = useRouter();

  const onSelect = useCallback(
    (id: number) => {
      if (isDragging.current) return;
      viewPlot.plotId = id;
      router.push(`/plots/${id}`);
    },
    [router]
  );

  const client = useApolloClient();
  const queryClient = useQueryClient();

  return (
    <div
      ref={dragRef}
      style={{width: "100%", height: "100%", touchAction: "none"}}
      {...bind()}
    >
      <Canvas linear flat camera={{position: [0, 0, 25]}}>
        {/* <OrbitControls /> */}
        <ApolloProvider client={client}>
          <QueryClientProvider client={queryClient}>
            {/* <Perf /> */}
            <World plotId={plotId} onSelectPlot={onSelect} />

            <color attach="background" args={["#508958"]} />
          </QueryClientProvider>
        </ApolloProvider>
      </Canvas>
      <Overlay />
    </div>
  );
};
export default Universe;