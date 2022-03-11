import { Canvas } from "@react-three/fiber";
import { useSnapshot } from "valtio";
import World from "~/components/World/World";
import { viewPlot } from "~/store";
import Overlay from "~/components/Overlay";
import { useGesture } from "@use-gesture/react";
import { Perf } from "r3f-perf";
import { useCallback, useRef } from "react";
import { ApolloProvider, useApolloClient } from "@apollo/client";
import { QueryClientProvider, useQueryClient } from "react-query";
import { useRouter } from "next/router";
import { styled } from "~/styles/stitches";
import Link from "next/link";

const Title = styled("h1", {
  color: "$gold",
  fontSize: "$4",
  textAlign: "center",
  "& a": {
    color: "$gold",
    "&:hover": {
      color: "$white",
    },
  },
});

const Container = styled("div", {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "row",
});

const Sidebar = styled("div", {
  width: 300,
  backgroundColor: "$brown",
  display: "flex",
  flexDirection: "column",
  height: "100%",
});

const Universe = () => {
  const { plotId } = useSnapshot(viewPlot);
  const isDragging = useRef(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const bind = useGesture(
    {
      onDrag: ({ down, offset, movement }) => {
        isDragging.current = down;
        if (down) {
          viewPlot.plotId = null;
          viewPlot.cameraLocation = [-offset[0], -offset[1], 0];
        }
        if (dragRef.current) {
          dragRef.current.style.cursor = down ? "grabbing" : "default";
        }
      },
      onWheel: ({ direction: [, y] }) => {
        viewPlot.z += y === -1 ? -2 : 2;
      },
      onPinch: ({ offset: [scale] }) => {
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
            const { factor } = viewPlot.viewport;
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
    <Container>
      <div
        ref={dragRef}
        {...bind()}
        style={{ flex: 1, touchAction: "none", minWidth: 0 }}
      >
        <Canvas linear flat camera={{ position: [0, 0, 25] }}>
          {/* <OrbitControls /> */}
          <ApolloProvider client={client}>
            <QueryClientProvider client={queryClient}>
              {/* <Perf /> */}
              <World router={router} plotId={plotId} onSelectPlot={onSelect} />

              <color attach="background" args={["#508958"]} />
            </QueryClientProvider>
          </ApolloProvider>
        </Canvas>
      </div>
      <Sidebar>
        <Title>
          <Link href="/plots/0">Turf World</Link>
        </Title>
        <div style={{ flex: 1, overflow: "auto", paddingBottom: "$3" }}>
          <Overlay />
        </div>
      </Sidebar>
    </Container>
  );
};
export default Universe;
