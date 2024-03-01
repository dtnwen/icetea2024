"use client";
import { FC } from "react";
import NavBar from "@/components/NavBar";

import { Web3Auth } from "../interface";
import { createWalletClient, custom } from "viem";
import { hardhat } from "viem/chains";

const Firstuser: FC<Web3Auth> = ({
  web3Auth,
  setWeb3Auth,
  provider,
  setProvider,
}) => {
  let client;
  if (provider && web3Auth) {
    client = createWalletClient({
      chain: hardhat,
      transport: custom(provider),
    });
  }
  return (
    <div>
      <NavBar
        web3Auth={web3Auth}
        setWeb3Auth={setWeb3Auth}
        provider={provider}
        setProvider={setProvider}
      />
      Get your first key here
      {/* <button onClick={() }>get user</button> */}
    </div>
  );
};

export default Firstuser;
