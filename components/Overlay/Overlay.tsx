import { gql, useQuery } from "@apollo/client";
import { useSnapshot } from "valtio";
import * as Tabs from "@radix-ui/react-tabs";
import { HouseLine, UsersThree } from "phosphor-react";
import { styled } from "@stitches/react";
import { FormEvent, Suspense } from "react";

import { viewPlot } from "~/store";
import Associations from "~/components/Associations";

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
  // width: 100,
  height: 220,
  display: "flex",
  flexDirection: "column",
  gap: 16,
  padding: 16,
  boxSizing: "border-box",
  // justifyContent: "space-evenly",
});
const TabTrigger = styled(Tabs.Trigger, {
  // flex: "1",
  background: "none",
  border: "none",
  cursor: "pointer",
  padding: 8,
  ['&[aria-selected="true"]']: {
    background: "red",
    borderRadius: "20%",
    backgroundColor: "rgba(150,150,150,0.8)",
  },
});
const TabContent = styled(Tabs.Content, {
  backgroundColor: "rgba(10,10,10,0.8)",
  width: 480,
  overflow: "hidden",
  padding: 16,
  boxSizing: "border-box",
});

const Container = styled("div", {
  position: "absolute",
  left: 16,
  bottom: 16,
});

const Overlay = () => {
  const { plotId, showDetails } = useSnapshot(viewPlot);

  const { data: tokenData, loading } = useQuery(FETCH_OWNER_PLOTS, {
    variables: { tokenID: plotId?.toString() },
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
          <TabTrigger value="owner">
            <HouseLine weight="duotone" color="#ffffff" size={32} />
          </TabTrigger>
          <TabTrigger value="associations">
            <UsersThree weight="duotone" color="#ffffff" size={32} />
          </TabTrigger>
        </TabList>

        <TabContent value="owner">
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
                  {/* <PlotSlider
                    plots={tokenData?.token?.owner?.tokens ?? []}
                    onSelect={(id) => (viewPlot.plotId = parseInt(id, 10))}
                  /> */}
                </div>
              </div>
            </div>
          )}
        </TabContent>

        <TabContent value="associations">
          <Suspense fallback={null}>
            <Associations />
          </Suspense>
        </TabContent>
      </TabNavRoot>
    </Container>
  );
};

export default Overlay;
