import {proxy} from "valtio";

export const viewPlot = proxy<{plotId: null | number; showDetails: boolean}>({
  plotId: 0,
  showDetails: true,
});
