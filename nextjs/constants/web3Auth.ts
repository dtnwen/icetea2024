import { CHAIN_NAMESPACES, ChainNamespaceType } from "@web3auth/base";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";

export type Web3AuthConfig = {
  chainNamespace: ChainNamespaceType;
  chainId: string;
  rpcTarget: string;
  displayName: string;
  blockExplorer: string;
  ticker: string;
  tickerName: string;
};

const chainConfig: Web3AuthConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x1",
  rpcTarget:
    "https://eth-mainnet.g.alchemy.com/v2/3DyVefzOH_LJMjfzSVTEJUBsXpIIBRnj",
  displayName: "Ethereum Mainnet",
  blockExplorer: "https://etherscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
} as const;

export const web3auth = new Web3AuthNoModal({
  clientId:
    "BMSWiiN4Ry7hC5s21HqQ307sBGwrHLxDkafeVDj9Ewl30MnvwAoxmL_F8nP8NFlK5gSgjZ6P8X5JM6Rix1aMQWY",
  web3AuthNetwork: "sapphire_devnet",
  chainConfig,
});

const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
});

export const openloginAdapter = new OpenloginAdapter({
  privateKeyProvider,
  adapterSettings: {
    uxMode: "redirect",
    loginConfig: {
      jwt: {
        verifier: "ClipChat demo", // Pass the Verifier name here
        typeOfLogin: "jwt", // Pass on the login provider of the verifier you've created
        clientId: "B1fOtqxX7bpXSaZQ8LCOkBEoOWrNkWuQ", // Pass on the Auth0 `Client ID` here
      },
    },
  },
});
