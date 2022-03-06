interface PlotButtonProps {
  tokenId: number;
  onClick(): void;
}
export const PlotButton = ({onClick, tokenId}: PlotButtonProps) => {
  return <button onClick={onClick}>{tokenId}</button>;
};
