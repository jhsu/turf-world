import {ethers} from "ethers";
import {useCallback, useEffect, useState} from "react";
import {ActionFunction, Form, json, useFetcher} from "remix";

const OWNER_QUERY = `
query OwnedTokenss($address: String!) {
  user(id: $address) {
    id
    tokens {
      id
    }
  }
}
`;

// query the subgraph to check
async function verifyHolder(address: string): Promise<boolean> {
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
        },
      }),
    }
  );
  const body = await result.json();
  return (body.data.user?.tokens.length ?? 0) > 0;
}

export const action: ActionFunction = async ({request}) => {
  // TODO: handle what they are voting on
  if (request.method !== "POST") {
    return json({message: "Method not allowed"}, 405);
  }
  const payload = await request.formData();
  const message = payload.get("message") as string;
  const signature = payload.get("signature") as string;
  const actualAddress = ethers.utils.verifyMessage(message, signature);
  // use this address to verify they are a holder
  const isHolder = await verifyHolder(actualAddress);

  return new Response(
    JSON.stringify({
      landowner: isHolder,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
};

export default function Sign() {
  const fetcher = useFetcher();
  const [provider, setProvider] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    (async () => {
      const addresses = await provider.send("eth_requestAccounts", []);
      setProvider(provider);
      setAddress(addresses[0]);
    })();
  }, []);

  const signMessage = useCallback(async () => {
    if (address) {
      console.log("address ", address);
      const message = "test message";
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [address, message],
      });

      const actualAddress = ethers.utils.verifyMessage(message, signature);
      console.log("actualAddress ", actualAddress);
      const payload = {
        message,
        signature,
      };
      return payload;
      // await fetch({
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify(payload),
      // });
      // this is what we want to send
    }
    return {};
  }, [address]);

  const onSubmit = async () => {
    const payload = await signMessage();
    fetcher.submit(payload, {method: "post"});
  };

  return (
    <fetcher.Form method="post" action="sign" onSubmit={onSubmit}>
      <input name="message" />
      <button type="submit">submit</button>
      {fetcher.data && JSON.stringify(fetcher.data)}
    </fetcher.Form>
  );
}
