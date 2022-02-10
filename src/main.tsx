import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import {ApolloClient, InMemoryCache, ApolloProvider} from "@apollo/client";
import {QueryClient, QueryClientProvider, useQuery} from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
    },
  },
});

const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/cosmoburn/turf-nft",
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
