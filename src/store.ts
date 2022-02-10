import {proxy} from "valtio";

interface ViewPlot {
  plotId: null | number;
  showDetails: boolean;
  cameraZ: number;
}
export const viewPlot = proxy<ViewPlot>({
  plotId: 0,
  showDetails: true,
  cameraZ: 25,
});
