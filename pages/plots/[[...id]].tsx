import Head from "next/head";
import {useRouter} from "next/router";
import {useEffect} from "react";
import Universe from "~/components/Universe";
import {viewPlot} from "~/store";
import {TOKENS} from "~/utils/turf";

export default function Plot() {
  const router = useRouter();
  const {id} = router.query;
  useEffect(() => {
    if (id === undefined) return;
    const plotId = parseInt(id[0], 10);
    if (plotId >= 0 && plotId < TOKENS) {
      viewPlot.plotId = plotId;
    } else {
      viewPlot.plotId = 0;
      router.push("/plots");
    }
  }, [router, id]);
  return (
    <>
      <Head>
        <title>Turf World</title>
      </Head>
      <Universe />
    </>
  );
}
