import { CHAIN_NAMESPACES, ChainNamespaceType } from "@web3auth/base";

export type Web3AuthConfig = {
  chainNamespace: ChainNamespaceType;
  chainId: string;
  rpcTarget: string;
  displayName: string;
  blockExplorer: string;
  ticker: string;
  tickerName: string;
};

export const chainConfig: Web3AuthConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xaa36a7",
  rpcTarget:
    "https://eth-sepolia.g.alchemy.com/v2/cG-LieAS5JPSf-IOChsjQuxtqsWdqXbI",
  displayName: "Ethereum Testnet",
  blockExplorer: "https://sepolia.etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
} as const;
