import {gql, useQuery} from "@apollo/client";
import * as Tabs from "@radix-ui/react-tabs";
import {styled} from "@stitches/react";
import {ArrowFatLeft, HouseLine, UsersThree} from "phosphor-react";
import {FormEvent, Suspense, useState} from "react";
import {useSnapshot} from "valtio";
import {viewPlot} from "../../store";
import {Associations} from "../Associations/Associations";
import {PlotSlider} from "./PlotSlider";

const FETCH_OWNER_PLOTS = gql`
  query GetOwnerPlots($tokenID: String!) {
    token(id: $tokenID) {
      id
      image
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

const Tab = styled(Tabs.Trigger, {
  background: "none",
  border: "none",
});

const TabNavRoot = styled(Tabs.Root, {
  height: "100%",
  display: "flex",
  flexDirection: "row",
  gap: 16,
  color: "White",
  "& a": {
    color: "White",
  },
});
const TabList = styled(Tabs.List, {
  backgroundColor: "rgba(10,10,10,0.8)",
  width: 100,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  height: "100%",
  padding: 16,
  boxSizing: "border-box",
});
const TabTrigger = styled(Tabs.Trigger, {
  flex: "1",
  background: "none",
  border: "none",
  cursor: "pointer",
  // "&[data-state=active]::after": {
  //   width: 16,
  //   height: 1,
  //   borderBottom: "1px solid white",
  //   content: "",
  // },
});
const TabContent = styled(Tabs.Content, {
  backgroundColor: "rgba(10,10,10,0.8)",
  width: 480,
  overflow: "hidden",
  // padding: 16,
  boxSizing: "border-box",
  variants: {
    collapsed: {
      true: {
        width: "auto",
      },
    },
  },
});

const TabContentActions = styled("div", {
  height: "100%",
  width: 64,
  padding: 16,
  boxSizing: "border-box",
  backgroundColor: "rgba(10,10,10,0.8)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "flex-end",
});

const Container = styled("div", {
  position: "absolute",
  left: 16,
  bottom: 16,
  height: 220,
});

const CollapseArrow = styled(ArrowFatLeft, {
  cursor: "pointer",
  variants: {
    collapsed: {
      true: {
        transform: "rotate(180deg)",
      },
    },
  },
});

const RotatedPlot = styled("div", {
  whiteSpace: "nowrap",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-end",
  marginBottom: 64,
  flex: 1,
  "& > span": {
    display: "inline-block",
    transformOrigin: "center",
    transform: "rotate(-90deg)",
    fontSize: 24,
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
    <Container>
      <TabNavRoot orientation="vertical" defaultValue="owner">
        <TabList aria-label="Plot Navigation">
          <TabTrigger value="associations">
            <UsersThree weight="duotone" color="#ffffff" size={32} />
          </TabTrigger>
          <TabTrigger value="owner">
            <HouseLine weight="duotone" color="#ffffff" size={32} />
          </TabTrigger>
        </TabList>

        <TabContent value="owner" collapsed={!showDetails}>
          {/* {loading && (
            <>
              <Loading variant="text">
                <h2>loading plot</h2>
              </Loading>
              <Loading />
            </>
          )} */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              height: "100%",
            }}
          >
            {showDetails && tokenData && (
              <div style={{flex: 1, padding: 16}}>
                <div>
                  <h2
                    style={{
                      display: "inline-block",
                      marginTop: 0,
                      marginRight: 20,
                    }}
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

                  <a
                    href={tokenData.token?.image}
                    target="_blank"
                    rel="noreferrer"
                    title="View higher definition image"
                  >
                    Image
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
            <TabContentActions>
              {!showDetails && (
                <RotatedPlot>
                  <span>Plot #{plotId}</span>
                </RotatedPlot>
              )}
              <CollapseArrow
                weight="duotone"
                color="#ffffff"
                size={32}
                collapsed={!showDetails}
                onClick={() => (viewPlot.showDetails = !showDetails)}
              />
            </TabContentActions>
          </div>
        </TabContent>

        <TabContent value="associations">
          <Suspense fallback={null}>
            <Associations />
          </Suspense>
        </TabContent>
      </TabNavRoot>
    </Container>
  );

  return (
    <div
      style={{
        bottom: 10,
        width: "100%",
        maxWidth: 500,
        position: "absolute",
        background: "white",
        borderRadius: 6,
        padding: 16,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
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
      <Tabs.Root defaultValue="owner">
        <Tabs.List aria-label="Plot Navigation">
          <Tabs.Trigger value="owner">Plot Owner</Tabs.Trigger>
          <Tabs.Trigger value="associations">Associations</Tabs.Trigger>
          <Tabs.Trigger value="hide">Hide</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="owner">
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
                  style={{
                    display: "inline-block",
                    marginTop: 0,
                    marginRight: 20,
                  }}
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

                <a
                  href={tokenData.token?.image}
                  target="_blank"
                  rel="noreferrer"
                  title="View higher definition image"
                >
                  Image
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
        </Tabs.Content>
        <Tabs.Content value="associations">
          <Suspense fallback={null}>
            <Associations />
          </Suspense>
        </Tabs.Content>
      </Tabs.Root>

      <TokenJumpForm onSubmit={onSubmit}>
        <input
          name="plotId"
          placeholder="Type plot token id and press 'enter'"
        />
        <button type="submit">jump to plot</button>
      </TokenJumpForm>
    </div>
  );
};
export default Overlay;

const TokenJumpForm = styled("form", {
  padding: 16,
});
