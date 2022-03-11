import { gql, useQuery } from "@apollo/client";
import { useSnapshot } from "valtio";
import * as Tabs from "@radix-ui/react-tabs";
import { HouseLine, UsersThree, Wallet } from "phosphor-react";
import { styled } from "@stitches/react";
import { FormEvent, Suspense, useState } from "react";

import { viewPlot } from "~/store";
import Associations from "~/components/Associations";
import Address from "../Address/Address";
import { web3state } from "~/utils/web3";
import { WalletPlots } from "../Plot";

const FETCH_OWNER_PLOTS = gql`
  query GetOwnerPlots($tokenID: String!) {
    token(id: $tokenID) {
      id
      image
      owner {
        id
        tokens {
          id
          image
        }
      }
    }
  }
`;

const ImagePlaceholder = styled("div", {
  backgroundColor: "$blue",
  aspectRatio: "1 / 1",
  width: "100%",
  overflow: "hidden",
});

const ImageContainer = styled("div", {
  cursor: "zoom-in",
  height: "100%",
  variants: {
    zoom: {
      true: {
        position: "absolute",
        top: 0,
        left: "50%",
        marginLeft: "-25%",
        height: "100vh",
        cursor: "zoom-out",
      },
      false: {},
    },
  },
});

const Image = styled("img", {
  backgroundColor: "$blue",
  aspectRatio: "1 / 1",
  height: "100%",
});

const TabNavRoot = styled(Tabs.Root, {
  gap: 16,
  color: "White",
  "& a": {
    color: "White",
  },
});
const TabList = styled(Tabs.List, {
  display: "flex",
  flexDirection: "row",
  gap: 16,
  padding: 16,
  boxSizing: "border-box",
  justifyContent: "space-evenly",
});
const TabTrigger = styled(Tabs.Trigger, {
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 8,
  fill: "gold",
  color: "$gold",
  ['&[aria-selected="true"]']: {
    backgroundColor: "$gold",
    color: "$orange",
    fill: "$orange",
  },
});
const TabContent = styled(Tabs.Content, {
  overflow: "hidden",
  boxSizing: "border-box",
  flex: 1,
  variants: {
    loading: {
      true: {},
      false: {},
    },
  },
});

const Container = styled("div", {
  padding: "$3",
  boxSizing: "border-box",
});

const PlotActions = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "$2",
  marginBottom: "$2",
});

const Overlay = () => {
  const { plotId, showDetails } = useSnapshot(viewPlot);
  const { connect, disconnect, isConnected, account } = useSnapshot(web3state);

  const {
    data: tokenData,
    previousData,
    loading,
  } = useQuery(FETCH_OWNER_PLOTS, {
    variables: { tokenID: plotId?.toString() },
    skip: plotId === null,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    viewPlot.plotId =
      parseInt(form.get("plotId")?.toString() ?? "", 10) ?? plotId;
  };

  const onSelect = (tokenId: number) => {
    viewPlot.plotId = tokenId;
  };

  const onConnect = () => {
    connect();
  };

  const onDisconnect = async () => {
    await disconnect();
  };

  const [zoom, setZoom] = useState(false);

  const data = tokenData ?? previousData;

  return (
    <Container>
      <TabNavRoot orientation="vertical" defaultValue="owner">
        <TabList aria-label="Plot Navigation">
          <TabTrigger value="owner">
            <HouseLine weight="duotone" size={32} />
          </TabTrigger>
          <TabTrigger value="associations">
            <UsersThree weight="duotone" size={32} />
          </TabTrigger>
          <TabTrigger value="wallet">
            <Wallet weight="duotone" size={32} />
          </TabTrigger>
        </TabList>

        <TabContent value="owner" loading={loading}>
          {showDetails && data && (
            <div>
              <div>
                <h2>Plot {data.token?.id}</h2>
                <PlotActions>
                  <a
                    href={`https://opensea.io/assets/0x55d89273143de3de00822c9271dbcbd9b44b44c6/${plotId}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View plot on Opensea"
                  >
                    Opensea🔗
                  </a>
                </PlotActions>
              </div>
              <ImagePlaceholder>
                {data.token?.image && (
                  <ImageContainer zoom={zoom}>
                    <Image
                      key={data.token.id}
                      src={data.token.image}
                      title={`plot ${data.token.id}`}
                      onClick={() => setZoom((prev) => !prev)}
                    />
                  </ImageContainer>
                )}
              </ImagePlaceholder>
              <div>
                <small>Owned by</small>
                <Address address={data.token?.owner?.id} />
              </div>
            </div>
          )}
        </TabContent>

        <TabContent value="associations">
          <Suspense fallback={null}>
            <Associations />
          </Suspense>
        </TabContent>

        <TabContent value="wallet">
          {!isConnected ? (
            <button onClick={onConnect}>connect</button>
          ) : (
            <button onClick={onDisconnect}>disconnect</button>
          )}
          <Suspense fallback={null}>
            {account && <WalletPlots address={account} onSelect={onSelect} />}
          </Suspense>
        </TabContent>
      </TabNavRoot>
    </Container>
  );
};

export default Overlay;
