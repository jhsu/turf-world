import {gql, useQuery} from "@apollo/client";
import {FormEvent} from "react";
import {useSnapshot} from "valtio";
import {viewPlot} from "../../store";

const FETCH_OWNER_PLOTS = gql`
  query GetOwnerPlots($tokenID: String!) {
    token(id: $tokenID) {
      id
      owner {
        id
        tokens {
          id
          tokenID
        }
      }
    }
  }
`;

const Overlay = () => {
  const {plotId, showDetails} = useSnapshot(viewPlot);

  const {data: tokenData} = useQuery(FETCH_OWNER_PLOTS, {
    variables: {tokenID: plotId?.toString()},
    skip: plotId === null,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    viewPlot.plotId =
      parseInt(form.get("plotId")?.toString() ?? "", 10) ?? plotId;
  };

  return (
    <div
      style={{
        bottom: 10,
        width: "100%",
        maxWidth: 300,
        position: "absolute",
        background: "white",
        borderRadius: 6,
        padding: 40,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {showDetails && tokenData && (
        <div>
          <h2 style={{display: "inline-block", marginTop: 0, marginRight: 20}}>
            Plot {plotId}
          </h2>
          <div>
            <small>Owned by {tokenData.token?.owner?.id}</small>
            <div>
              {tokenData?.token?.owner?.tokens?.map((token: {id: string}) => (
                <button
                  key={token.id}
                  onClick={() => {
                    console.log("view ", token.id);
                    viewPlot.plotId = parseInt(token.id, 10);
                  }}
                >
                  Plot {token.id}
                </button>
              ))}
            </div>
          </div>
          <a
            href={`https://opensea.io/assets/0x55d89273143de3de00822c9271dbcbd9b44b44c6/${plotId}`}
            target="_blank"
            rel="noreferrer"
            title="View plot on Opensea"
          >
            Opensea 🔗
          </a>
          {/* <button onClick={() => setShowInfo(false)}>close</button> */}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <input
          name="plotId"
          placeholder="Type plot token id and press 'enter'"
        />
        <button type="submit">jump to plot</button>
      </form>
    </div>
  );
};
export default Overlay;
