import { gql, useQuery } from "@apollo/client";
import { styled } from "~/styles/stitches";
const queryAddressTokens = gql`
  query walletAddressTokens($address: String!) {
    user(id: $address) {
      id
      tokens {
        id
        image
      }
    }
  }
`;

const PlotButtons = styled("div", {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(50px, 1fr))",
  gap: "$1",
});

interface WalletPlotsProps {
  address: string;
  onSelect: (plotId: number) => void;
}
export const WalletPlots = ({ address, onSelect }: WalletPlotsProps) => {
  const { data } = useQuery<{
    user: { id: string; tokens: { id: string; image: string }[] };
  }>(queryAddressTokens, {
    variables: {
      address: address.toLowerCase(),
    },
  });

  return (
    <PlotButtons>
      {data?.user?.tokens?.map((token) => (
        <button key={token.id} onClick={() => onSelect(parseInt(token.id, 10))}>
          {token.id}
        </button>
      ))}
    </PlotButtons>
  );
};
