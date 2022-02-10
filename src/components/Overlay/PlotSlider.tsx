import * as ScrollArea from "@radix-ui/react-scroll-area";
import {styled} from "@stitches/react";
import React from "react";
import {useSnapshot} from "valtio";
import {viewPlot} from "../../store";
import {TokenButton} from "../Plots/TokenButton";

const View = styled("div", {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr 1fr",
  // maxHeight: 200,
  gap: 10,
  padding: 10,
  "& > *": {
    textAlign: "center",
  },
});

const Root = styled(ScrollArea.Root, {
  height: 160,
  overflowY: "scroll",
});

const PlotItem = styled("div", {
  cursor: "pointer",
  boxSizing: "border-box",
  variants: {
    selected: {
      true: {
        "& > *": {
          // border: "2px solid red",
          boxShadow: "2px 2px 5px #cccccc",
        },
      },
    },
  },
});

interface PlotSliderProps {
  onSelect(id: string): void;
  plots: {name: string; id: string; image: string}[];
}
export const PlotSlider = ({onSelect, plots}: PlotSliderProps) => {
  const {plotId} = useSnapshot(viewPlot);
  const strPlotId = plotId?.toString() ?? "";
  return (
    <Root>
      <ScrollArea.Viewport>
        <View>
          {plots.map((plot) => (
            <PlotItem
              key={plot.id}
              onClick={() => onSelect(plot.id)}
              selected={strPlotId === plot?.id}
            >
              <TokenButton tokenId={plot.id} />
              {/* <img
                src={plot.image}
                width="100px"
                title={`Plot ${plot.id}`}
                alt={`Image for token ${plot.id}`}
              /> */}
            </PlotItem>
          ))}
        </View>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </Root>
  );
};
