import {LoaderFunction, useLoaderData} from "remix";
import {supabase} from "~/supabase";
import {ProposalRow} from "~/types/supabase";

export const loader: LoaderFunction = async ({params}) => {
  const {data, error} = await supabase
    .from<ProposalRow>("proposals")
    .select("id, title, description");
  return data;
};

export default function Proposals() {
  const proposals = useLoaderData<ProposalRow[]>();

  return (
    <div>
      {proposals.map((p) => (
        <div key={p.id}>
          <h2>{p.title}</h2>
          <p>{p.description}</p>
        </div>
      ))}
    </div>
  );
}
