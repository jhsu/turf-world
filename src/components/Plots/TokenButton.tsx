import {styled} from "@stitches/react";

const Button = styled("button", {
  cursor: "pointer",
});
export const TokenButton = ({
  tokenId,
  onClick,
}: {
  tokenId: number | string;
  onClick?(): void;
}) => {
  return <Button onClick={onClick}>{tokenId}</Button>;
};
export const PlotButton = ({
  tokenId,
  name,
  onClick,
}: {
  tokenId: number | string;
  name: string;
  onClick?(): void;
}) => {
  return (
    <Button onClick={onClick}>
      {name}{" "}
      <small>
        <strong>{tokenId}</strong>
      </small>
    </Button>
  );
};
