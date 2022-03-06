import {supabase} from "~/store/supabase";
import {ethers} from "ethers";

import {
  associationTokenIds,
  signMessage,
  useSigner,
  verifyAssociationMembership,
} from "~/utils/tokenHolders";
import {NextApiHandler, NextApiRequest} from "next";

interface Vote {
  yes: boolean;
}
interface Proposal {
  id: number;
  title: string;
  description: string;
  votes: Vote[];
}

export const handler: NextApiHandler = async (req, res) => {
  if (req.method === "POST") {
    return res.json({message: "hi"});
  }
  return res.json({message: "hi"});
};
/*
import invariant from "tiny-invariant";

interface Vote {
  yes: boolean;
}
interface Proposal {
  id: number;
  title: string;
  description: string;
  votes: Vote[];
}

export const action: ActionFunction = async ({request, params}) => {
  invariant(params.proposalId, "Expected params.proposalId");
  if (request.method !== "POST") {
    return json({message: "Method not allowed"}, 405);
  }

  // TODO: handle what they are voting on
  const payload = await request.formData();
  const message = payload.get("message") as string;
  const signature = payload.get("signature") as string;
  const yes = payload.get("yes") === "true";
  const actualAddress = ethers.utils.verifyMessage(message, signature);

  // get association plot ids
  // TODO: get proposal trait type and value
  const plotIds = await associationTokenIds({
    traitType: "Plot Type",
    value: "Train Station",
  });
  // check if the wallet is holding any of the association tokens
  const isMember = await verifyAssociationMembership(
    actualAddress,
    plotIds.map((id) => id.toString())
  );

  if (isMember) {
    // create vote
    await supabase
      .from("votes")
      .insert({proposal_id: params.proposalId, address: actualAddress, yes});
  }

  return new Response(
    JSON.stringify({
      address: actualAddress,
      isMember,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export const loader: LoaderFunction = async ({params}) => {
  invariant(params.proposalId, "Expected params.proposalId");
  const {data, error} = await supabase
    .from<Proposal>("proposals")
    .select(`id, title, description, votes ( yes ) as yes`)
    .filter("id", "eq", params.proposalId)
    .limit(1)
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export default function Propsal() {
  const data = useLoaderData<Proposal>();
  const fetcher = useFetcher();

  const signer = useSigner();

  const onSubmit = async (yes: boolean) => {
    if (!signer) return;
    const payload = await signMessage(signer);
    if (payload) {
      fetcher.submit({...payload, yes: yes.toString()}, {method: "post"});
    }
  };

  const voteYes = () => {
    onSubmit(true);
  };
  const voteNo = () => {
    onSubmit(false);
  };

  return (
    <div>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <div>
        yes: {data.votes.filter((v) => v.yes).length} / {data.votes.length}
      </div>
      <button onClick={voteYes}>Yes</button>
      <button onClick={voteNo}>No</button>
    </div>
  );
}

*/
