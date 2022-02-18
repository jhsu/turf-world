import {ethers} from "ethers";
import {useCallback, useEffect, useState} from "react";
import {ActionFunction, Form, json, useFetcher} from "remix";
import {supabase} from "~/supabase";
import {
  associationTokenIds,
  signMessage,
  useSigner,
  verifyAssociationMembership,
} from "~/utils/tokenholder";

export const action: ActionFunction = async ({request}) => {
  if (request.method !== "POST") {
    return json({message: "Method not allowed"}, 405);
  }

  // TODO: handle what they are voting on
  const payload = await request.formData();
  const message = payload.get("message") as string;
  const signature = payload.get("signature") as string;
  const actualAddress = ethers.utils.verifyMessage(message, signature);

  // get association plot ids
  const plotIds = await associationTokenIds({
    traitType: "Plot Type",
    value: "Train Station",
  });
  // check if the wallet is holding any of the association tokens
  const isMember = await verifyAssociationMembership(
    actualAddress,
    plotIds.map((id) => id.toString())
  );

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

export default function Sign() {
  const fetcher = useFetcher();
  const signer = useSigner();

  const onSubmit = async () => {
    if (!signer) return;
    const payload = await signMessage(signer);
    if (payload) {
      fetcher.submit(payload, {method: "post"});
    }
  };

  return (
    <fetcher.Form method="post" action="sign" onSubmit={onSubmit}>
      <input name="message" />
      <button type="submit">submit</button>
      {fetcher.data && fetcher.data.isMember
        ? "You are a member"
        : "You are not a member"}
    </fetcher.Form>
  );
}
