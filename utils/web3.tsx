import Web3 from "web3";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { proxy, useSnapshot, ref } from "valtio";

const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
    },
  },
};

interface IWeb3Context {
  web3: Web3 | null;
  web3modal: Web3Modal | null;
  account: string | null;
  networkId: number | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => Promise<void>;
}

let web3Modal: Web3Modal | null = null;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true,
    providerOptions, // required
  });
}

export const web3state = proxy<IWeb3Context>({
  web3: null,
  web3modal: web3Modal ? ref(web3Modal) : null,
  account: null,
  networkId: null,
  isConnected: false,
  connect: setup,
  disconnect: () => Promise.resolve(),
});

export const useWeb3Modal = () => {
  const snap = useSnapshot(web3state);
  return snap.web3modal;
};

export const useWeb3 = () => {
  const snap = useSnapshot(web3state);
  return snap.web3;
};

async function setup() {
  const modal = web3state.web3modal;
  if (!modal) {
    return;
  }

  try {
    const provider = await modal.connect();
    const web3 = new Web3(provider);
    web3state.web3 = ref(web3);
    web3state.isConnected = true;

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts: string[]) => {
      web3state.account = accounts[0];
      if (accounts.length === 0) {
        web3state.isConnected = false;
      }
      console.log(accounts);
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId: number) => {
      web3state.networkId = chainId;
      console.log(chainId);
    });

    // Subscribe to provider connection
    provider.on("connect", (info: { chainId: number }) => {
      web3state.isConnected = true;
      console.log(info);
    });

    // Subscribe to provider disconnection
    provider.on("disconnect", (error: { code: number; message: string }) => {
      web3state.isConnected = false;
      console.log(error);
    });

    const chainId = await web3.eth.getChainId();
    const accounts = await web3.eth.getAccounts();
    web3state.account = accounts?.[0];
    web3state.networkId = chainId;
    web3state.disconnect = async () => {
      try {
        modal.clearCachedProvider();
        web3state.isConnected = false;
        web3state.account = null;
        web3state.networkId = null;
      } catch (e) {
        console.error(e);
      }
    };

    return web3;
  } catch (e) {
    console.error(e);
  }
}
