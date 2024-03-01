"use client";

import { WALLET_ADAPTERS } from "@web3auth/base";
import { useState, useEffect, FC } from "react";
import Link from "next/link";
import { Web3Auth } from "@/app/interface";

export const LogInButton: FC<Web3Auth> = ({
  web3Auth,
  setWeb3Auth,
  provider,
  setProvider,
}) => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (provider && web3Auth?.connected) {
      const getUserInfo = async () => {
        const userInfo = await web3Auth.getUserInfo();
        setUserInfo(userInfo.email);
      };
      getUserInfo();

      setLoggedIn(true);
    }
  }, [web3Auth, provider]);

  const login = async () => {
    setIsLoading(true);

    if (!web3Auth) {
      console.log("Can not login! Wallet is not connected");
      return;
    }
    try {
      const web3authProvider = await web3Auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "twitter",
        }
      );
      setProvider(web3authProvider);

      if (web3Auth.connected) {
        setLoggedIn(true);
        setIsLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    if (!web3Auth) {
      console.log("wallet not connected");
      return;
    }
    await web3Auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  return (
    <>
      {loggedIn ? (
        <details className="dropdown">
          <summary className="btn">{userInfo}</summary>
          <ul className="shadow menu dropdown-content w-52">
            <li>
              <Link href="/myprofile">My Profile</Link>
            </li>
            <li>
              <Link href="/" onClick={() => console.log(web3Auth)}>
                My Wallet
              </Link>
            </li>
            <li>
              <a onClick={logout}>Log out</a>
            </li>
          </ul>
        </details>
      ) : (
        <div>
          <button
            className={isLoading ? "btn loading loading-spinner" : "btn"}
            onClick={login}
          >
            Log in
          </button>
        </div>
      )}
    </>
  );
};
