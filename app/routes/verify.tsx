import {useActionData} from "remix";

export async function action({request}) {
  return {
    message: "test",
  };
}

export default function Verify() {
  const data = useActionData();
  return <div>verified: {JSON.stringify(data)}</div>;
}
