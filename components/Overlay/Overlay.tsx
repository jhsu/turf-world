import {gql, useQuery} from "@apollo/client";
import {useSnapshot} from "valtio";
import * as Tabs from "@radix-ui/react-tabs";
import {HouseLine, UsersThree} from "phosphor-react";
import {styled} from "@stitches/react";
import {FormEvent, Suspense} from "react";

import {viewPlot} from "~/store";
import Associations from "~/components/Associations";
import Address from "../Address/Address";

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

const TabNavRoot = styled(Tabs.Root, {
  height: "100%",
  width: "100%",
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
  overflow: "hidden",
  padding: "$3",
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
  position: "absolute",
  padding: "$3",
  boxSizing: "border-box",
  bottom: 0,
  left: 0,
  width: "100%",
  maxWidth: 540,
});

const PlotActions = styled("div", {
  display: "flex",
  flexDirection: "row",
  gap: "$2",
  marginBottom: "$2",
});

const Overlay = () => {
  const {plotId, showDetails} = useSnapshot(viewPlot);

  const {
    data: tokenData,
    previousData,
    loading,
  } = useQuery(FETCH_OWNER_PLOTS, {
    variables: {tokenID: plotId?.toString()},
    skip: plotId === null,
  });

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    viewPlot.plotId =
      parseInt(form.get("plotId")?.toString() ?? "", 10) ?? plotId;
  };

  const data = tokenData ?? previousData;

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

        <TabContent value="owner" loading={loading}>
          {showDetails && data && (
            <div>
              <div>
                <h2>Plot {plotId}</h2>
                <PlotActions>
                  <a
                    href={`https://opensea.io/assets/0x55d89273143de3de00822c9271dbcbd9b44b44c6/${plotId}`}
                    target="_blank"
                    rel="noreferrer"
                    title="View plot on Opensea"
                  >
                    Opensea🔗
                  </a>
                  <a
                    href={data.token?.image}
                    target="_blank"
                    rel="noreferrer"
                    title="View higher definition image"
                  >
                    Image
                  </a>
                </PlotActions>
              </div>
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
      </TabNavRoot>
    </Container>
  );
};

export default Overlay;
