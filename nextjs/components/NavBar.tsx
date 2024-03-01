import { LogInButton } from "./Navbar/ConnectButton";
import { FC } from "react";
import { Web3Auth } from "@/app/interface";

const NavBar: FC<Web3Auth>  = ({
  web3Auth,
  setWeb3Auth,
  provider,
  setProvider,
}) => {
  return (
    <div className="navbar">
      <a className="navbar-start" href="/">ClipChat</a>
      <div className="navbar-center"></div>
      <div className="navbar-end">
        <LogInButton
          web3Auth={web3Auth}
          setWeb3Auth={setWeb3Auth}
          provider={provider}
          setProvider={setProvider}
        ></LogInButton>
      </div>
    </div>
  );
};

export default NavBar;
