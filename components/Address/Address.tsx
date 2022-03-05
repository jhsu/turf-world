import {useMemo} from "react";
import {styled} from "~/styles/stitches";

const TruncateText = styled("span", {
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
});

const Container = styled("div", {
  display: "flex",
  flexDirection: "row",
});

export default function Address({address}: {address: string}) {
  const ending = useMemo(() => address.substring(38), [address]);
  const start = useMemo(() => address.substring(0, 38), [address]);
  return (
    <Container>
      <TruncateText>{start}</TruncateText>
      <span>{ending}</span>
    </Container>
  );
}
