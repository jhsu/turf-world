import {ethers} from "ethers";
import {useEffect, useState} from "react";
import {supabase} from "~/supabase";

// Query for token ids held by the adddress
const OWNER_QUERY = `
query OwnedTokenss($address: String!, $tokenIds: [String!]) {
  user(id: $address) {
    id
    tokens(where: { id_in: $tokenIds}) {
      id
    }
  }
}
`;

// query the subgraph to check if an address is holding any of the tokens
async function verifyHolder(
  address: string,
  tokenIds: string[]
): Promise<boolean> {
  const result = await fetch(
    "https://api.thegraph.com/subgraphs/name/cosmoburn/turf-nft",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: OWNER_QUERY,
        variables: {
          address,
          tokenIds,
        },
      }),
    }
  );
  const body = await result.json();
  return (body.data.user?.tokens.length ?? 0) > 0;
}

export async function associationTokenIds({
  traitType,
  value: traitValue,
}: {
  traitType: string;
  value: string;
}) {
  // get token ids for an association
  const {data, error} = await supabase
    .from("metadata")
    .select("id")
    .contains(
      "attributes",
      JSON.stringify([{value: traitValue, trait_type: traitType}])
    );

  if (error) {
    throw new Error(error.message);
  }
  return data?.map((row) => row.id) ?? [];
}

export async function verifyAssociationMembership(
  address: string,
  tokenIds: string[]
) {
  return verifyHolder(address, tokenIds);
}

export const signMessage = async (signer: ethers.Signer) => {
  if (!signer) return null;
  const address = await signer.getAddress();
  if (address) {
    const message = `address ${address}`;
    const signature = await signer.signMessage(message);
    const payload = {
      message,
      signature,
    };
    return payload;
  }
  return null;
};

export const useSigner = () => {
  const [signer, setSigner] = useState<ethers.Signer | null>(null);

  useEffect(() => {
    // @ts-ignore
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    (async () => {
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      setSigner(signer);
    })();
  }, []);

  return signer;
};
