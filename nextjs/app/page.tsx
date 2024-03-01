"use client";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import NavBar from "../components/NavBar";
import { useState, useEffect, useRef } from "react";
import { Web3AuthNoModal } from "@web3auth/no-modal";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import { chainConfig } from "@/constants/chainConfig";
import { abi } from "@/constants/abi";
import { SigningKey, ethers } from "ethers";
import * as dotenv from "dotenv";
dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";
const contractAddress = "0xd92ba8f4e2f0cf7803a542c978c5e59699c4477d";

const App = () => {
  const [web3Auth, setWeb3Auth] = useState<Web3AuthNoModal | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3Auth = new Web3AuthNoModal({
          clientId:
            "BMSWiiN4Ry7hC5s21HqQ307sBGwrHLxDkafeVDj9Ewl30MnvwAoxmL_F8nP8NFlK5gSgjZ6P8X5JM6Rix1aMQWY",
          web3AuthNetwork: "sapphire_devnet",
          privateKeyProvider,
        });

        const openloginAdapter = new OpenloginAdapter({
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

        web3Auth.configureAdapter(openloginAdapter);
        setWeb3Auth(web3Auth);
        await web3Auth.init();
        setProvider(web3Auth.provider);
      } catch (error) {
        console.error(error);
      }
    };

    init();
  }, []);

  const url =
    "https://eth-sepolia.g.alchemy.com/v2/cG-LieAS5JPSf-IOChsjQuxtqsWdqXbI";

  // const getprivateKey = async () => {
  //   const privateKey: any = await web3Auth?.provider?.request({
  //     method: "eth_private_key",
  //   });
  //   // console.log(privateKey)
  // }

  let ethersProvider = new ethers.JsonRpcProvider(url);
  let signer;
  try {
    signer = new ethers.Wallet(PRIVATE_KEY, ethersProvider);
  } catch (error) {
    console.error(error);
  }

  const contract = new ethers.Contract(
    contractAddress,
    JSON.parse(JSON.stringify(abi)),
    signer
  );

  const protocolFeeDestination = async () => {
    console.log(PRIVATE_KEY);
    const message = await contract.protocolFeeDestination();
    console.log(message);
  };
  return (
    <>
      <NavBar
        web3Auth={web3Auth}
        setWeb3Auth={setWeb3Auth}
        provider={provider}
        setProvider={setProvider}
      />
      <button className="btn" onClick={protocolFeeDestination}>
        Test
      </button>
      <button className="btn">Get First key</button>
    </>
  );
};

export default App;
