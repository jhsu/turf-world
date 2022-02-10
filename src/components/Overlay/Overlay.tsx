import {gql, useQuery} from "@apollo/client";
import {styled} from "@stitches/react";
import {FormEvent} from "react";
import {useSnapshot} from "valtio";
import {viewPlot} from "../../store";
import {PlotSlider} from "./PlotSlider";

const FETCH_OWNER_PLOTS = gql`
  query GetOwnerPlots($tokenID: String!) {
    token(id: $tokenID) {
      id
      owner {
        id
        tokens {
          id
          tokenID
          image
        }
      }
    }
  }
`;

const Loading = styled("div", {
  borderRadius: 6,
  height: 150,
  backgroundColor: "#efefef",
  marginBottom: 16,
  variants: {
    variant: {
      text: {
        display: "inline-block",
        height: "auto",
        color: "transparent",
      },
    },
  },
});

const Overlay = () => {
  const {plotId, showDetails} = useSnapshot(viewPlot);

  const {data: tokenData, loading} = useQuery(FETCH_OWNER_PLOTS, {
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
        maxWidth: 500,
        position: "absolute",
        background: "white",
        borderRadius: 6,
        padding: 40,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      {loading && (
        <>
          <Loading variant="text">
            <h2>loading plot</h2>
          </Loading>
          <Loading />
        </>
      )}
      {showDetails && tokenData && (
        <div>
          <div>
            <h2
              style={{display: "inline-block", marginTop: 0, marginRight: 20}}
            >
              Plot {plotId}
            </h2>

            <a
              href={`https://opensea.io/assets/0x55d89273143de3de00822c9271dbcbd9b44b44c6/${plotId}`}
              target="_blank"
              rel="noreferrer"
              title="View plot on Opensea"
            >
              Opensea 🔗
            </a>
          </div>
          <div>
            <small>Owned by {tokenData.token?.owner?.id}</small>
            <div>
              <PlotSlider
                plots={tokenData?.token?.owner?.tokens ?? []}
                onSelect={(id) => (viewPlot.plotId = parseInt(id, 10))}
              />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={onSubmit}>
        <input
          name="plotId"
          placeholder="Type plot token id and press 'enter'"
        />
        <button type="submit">jump to plot</button>
      </form>
      <div>
        <button
          onClick={() => {
            viewPlot.cameraZ = Math.min(viewPlot.cameraZ + 2, 30);
          }}
        >
          -
        </button>
        <button
          onClick={() => (viewPlot.cameraZ = Math.max(viewPlot.cameraZ - 2, 6))}
        >
          +
        </button>
      </div>
    </div>
  );
};
export default Overlay;
