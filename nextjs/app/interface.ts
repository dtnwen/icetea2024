import { Web3AuthNoModal } from "@web3auth/no-modal";
import { Dispatch, SetStateAction, FC } from "react";
import { IProvider } from "@web3auth/base";

export interface Web3Auth {
  web3Auth: Web3AuthNoModal | null;
  setWeb3Auth: Dispatch<SetStateAction<Web3AuthNoModal | null>>;
  provider: IProvider | null;
  setProvider: Dispatch<SetStateAction<IProvider | null>>;
}

export interface Web3AuthWithChildren {
  web3Auth: Web3AuthNoModal | null;
  setWeb3Auth: Dispatch<SetStateAction<Web3AuthNoModal | null>>;
  provider: IProvider | null;
  setProvider: Dispatch<SetStateAction<IProvider | null>>;
  children: React.ReactNode ;
}
