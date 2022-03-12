import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    media: {
      bp1: "(min-width 568px)",
      bp2: "(min-width 1024px)",
    },
    colors: {
      grey: "#cccccc",
      white: "#ffffff",
      blue: "#A9EBF4",
      gold: "#F8D748",
      brown: "#825E38",
      orange: "#EE9536",
      green20: "#5D885D",
      green50: "#5D885D",
    },
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
      5: "64px",
    },
    fontSizes: {
      1: "8px",
      2: "16px",
      3: "18px",
      4: "24px",
    },
    fonts: {
      mono: "'Press Start 2P', 'Courier New', Courier, monospace",
    },
  },
});
