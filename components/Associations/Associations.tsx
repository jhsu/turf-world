import {styled} from "@stitches/react";
import {useState} from "react";
import {useQuery} from "react-query";
import {viewPlot} from "~/store";
import {supabase} from "~/store/supabase";
import {PlotButton} from "~/components/Plot";

interface PlotRow {
  id: number;
  image: string;
  name: string;
  attributes: {trait_type: string; value: string}[];
}
const fetchPlots = async (trait: string, traitValue: string) => {
  return await supabase
    .from<PlotRow>("metadata")
    .select("id, name, image")
    .contains(
      "attributes",
      JSON.stringify([{value: traitValue, trait_type: trait}])
    );
};

interface AssocationDescriptor {
  name: string;
  trait_type: string;
  value: string;
}
const ASSOCIATIONS: AssocationDescriptor[] = [
  {
    name: "Turf Transportation Authority",
    trait_type: "Plot Type",
    value: "Train Station",
  },
  {
    name: "Association of Shrines",
    trait_type: "Plot Type",
    value: "Shrine",
  },
];

const AssociationInfo = ({
  name,
  traitType,
  traitValue,
}: {
  name: string;
  traitType: string;
  traitValue: string;
}) => {
  const {data, error} = useQuery(["association", traitType, traitValue], () =>
    fetchPlots(traitType, traitValue)
  );

  return (
    <div style={{flex: 1, display: "flex", flexDirection: "column"}}>
      <h2>{name}</h2>
      <div
        style={{
          overflow: "auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          rowGap: 10,
          columnGap: 8,
          flex: 1,
        }}
      >
        {data?.data?.map((plot) => (
          <PlotButton
            key={plot.id}
            tokenId={plot.id}
            onClick={() => (viewPlot.plotId = plot.id)}
          />
        ))}
      </div>
    </div>
  );
};

const AssociationList = styled("div", {
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

const AssociationButton = styled("div", {
  padding: "6px 4px",
  cursor: "pointer",
  "&:hover": {
    // backgroundColor: "#efefef",
  },
});

const Associations = () => {
  const [assoc, setAssoc] = useState<AssocationDescriptor | null>(null);
  return (
    <div>
      {assoc ? (
        <div style={{display: "flex", flexDirection: "column"}}>
          <button onClick={() => setAssoc(null)}>&larr; back</button>
          <AssociationInfo
            name={assoc.name}
            traitType={assoc.trait_type}
            traitValue={assoc.value}
          />
        </div>
      ) : (
        <AssociationList>
          {ASSOCIATIONS.map((assoc) => (
            <AssociationButton key={assoc.name} onClick={() => setAssoc(assoc)}>
              {assoc.name}
            </AssociationButton>
          ))}
        </AssociationList>
      )}
    </div>
  );
};
export default Associations;
