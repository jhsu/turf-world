import { Viewport } from "@react-three/fiber";
import { proxyWithComputed } from "valtio/utils";

import LOCATIONS from "../components/World/positions";

const SIZE = 5;

interface ViewPlot {
  selectedPlotId: null | number;
  showDetails: boolean;
  cameraZ: number;
  cameraPosition: [number, number];
  viewport: Viewport | null;
}
interface ViewPlotSetters {
  plotId: null | number;
  cameraLocation: [number, number, number];
  z: number;
}
export const viewPlot = proxyWithComputed<ViewPlot, ViewPlotSetters>(
  {
    selectedPlotId: 0,
    showDetails: true,
    cameraZ: 25,
    cameraPosition: [0, 0],
    viewport: null,
  },
  {
    plotId: {
      get: (state) => state.selectedPlotId,
      set: (state, value) => {
        state.selectedPlotId = value ?? null;
        const plotId = state.selectedPlotId;
        if (plotId !== null && LOCATIONS[plotId]) {
          const [x, y] = LOCATIONS[plotId];
          state.cameraPosition = [x * SIZE, y * SIZE];
        }
      },
    },
    cameraLocation: {
      get: (state) => {
        if (state.selectedPlotId !== null) {
          const [x, y] = LOCATIONS[state.selectedPlotId];
          return [x * SIZE, y * SIZE, state.cameraZ];
        }
        return [...state.cameraPosition, state.cameraZ];
      },
      set: (state, [x, y]: [number, number, any]) => {
        state.cameraPosition = [x, y];
      },
    },
    z: {
      get: (snap) => snap.cameraZ,
      set: (state, newValue: number) => {
        state.cameraZ = Math.max(Math.min(120, newValue), 12);
      },
    },
  }
);
