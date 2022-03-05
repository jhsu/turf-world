import {proxyWithComputed} from "valtio/utils";

interface ViewPlot {
  plotId: null | number;
  showDetails: boolean;
  cameraZ: number;
}
export const viewPlot = proxyWithComputed<ViewPlot, any>(
  {
    plotId: null,
    showDetails: true,
    cameraZ: 25,
  },
  {
    z: {
      get: (snap) => snap.cameraZ,
      set: (state, newValue: number) => {
        state.cameraZ = Math.max(Math.min(30, newValue), 12);
      },
    },
  }
);
