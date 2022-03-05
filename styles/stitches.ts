import { createStitches } from "@stitches/react";

export const { styled, css } = createStitches({
  theme: {
    space: {
      1: "4px",
      2: "8px",
      3: "16px",
      4: "32px",
      5: "64px",
    },
    fontSizes: {
      1: "14px",
      2: "16px",
      3: "18px",
    },
    fonts: {
      mono: "'Press Start 2P', 'Courier New', Courier, monospace",
    },
  },
});
