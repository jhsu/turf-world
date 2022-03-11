import {gql, useQuery} from "@apollo/client";
import {useMemo} from "react";
import {styled} from "~/styles/stitches";
import Address from "../Address/Address";

const query = gql`
  query tokenTransfersQuery($id: ID!) {
    token(id: $id) {
      id
      transfers(orderBy: createdAt, orderDirections: desc) {
        createdAt
        from {
          id
        }
        to {
          id
        }
      }
    }
  }
`;

const Stack = styled("div", {
  display: "flex",
  flexDirection: "column",
  rowGap: "$4",
});

const Faded = styled("div", {
  color: "$grey",
});

const DateDisplay = styled("span", {
  fontSize: "$1",
});

interface TokenTransferResponse {
  token: {
    id: string;
    transfers: {createdAt: string; from: {id: string}; to: {id: string}}[];
  };
}
const PlotTransfers = ({tokenId}: {tokenId: number}) => {
  const {data, loading} = useQuery<TokenTransferResponse, {id: string}>(query, {
    variables: {
      id: tokenId.toString(),
    },
  });
  const sortedTransfers = useMemo(() => {
    return (
      data?.token?.transfers
        ?.map((transfer) => ({
          ...transfer,
          createdAt: new Date(parseInt(transfer.createdAt, 10) * 1000),
        }))
        .sort((a, b) => {
          return a.createdAt > b.createdAt ? -1 : 1;
        }) ?? []
    );
  }, [data]);

  return (
    <Stack>
      {loading && "loading..."}
      {sortedTransfers.map(({from, to, createdAt}, idx) => (
        <div key={idx}>
          <Faded>
            <small>from</small>
            <Address address={from?.id} />
          </Faded>
          <div>
            <small>to</small>
            <Address address={to?.id} />
          </div>
          <DateDisplay>{createdAt.toLocaleString()}</DateDisplay>
        </div>
      ))}
    </Stack>
  );
};

export default PlotTransfers;
