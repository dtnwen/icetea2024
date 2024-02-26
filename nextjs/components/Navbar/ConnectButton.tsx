"use client";

import { WALLET_ADAPTERS, IProvider } from "@web3auth/base";
import { useState, useEffect } from "react";
import { web3auth, openloginAdapter } from "../../constants/web3Auth";
import Link from "next/link";

web3auth.configureAdapter(openloginAdapter);

export const LogInButton = () => {
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userInfo, setUserInfo] = useState<string | undefined>(undefined);

  useEffect(() => {
    // setIsLoading(true);
    const init = async () => {
      try {
        await web3auth.init();
        setProvider(web3auth.provider);

        if (web3auth.connected) {
          setLoggedIn(true);
        }
      } catch (error) {
        console.error(error);
      }
      //   setIsLoading(false);
    };

    init();
  }, []);

  // useEffect(() => {

  //   getUserInfo();
  // }, [userInfo])

  const login = async () => {
    setIsLoading(true);
    try {
      const web3authProvider = await web3auth.connectTo(
        WALLET_ADAPTERS.OPENLOGIN,
        {
          loginProvider: "twitter",
        }
      );
      setProvider(web3authProvider);
      console.log(web3auth);
      if (web3auth.connected) {
        setLoggedIn(true);
        setIsLoading(false);
        await getUserInfo();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const logout = async () => {
    await web3auth.logout();
    setProvider(null);
    setLoggedIn(false);
  };

  const getUserInfo = async () => {
    const userInfo = await web3auth.getUserInfo();
    setUserInfo(userInfo.email);
    console.log(userInfo.email);
  };

  return (
    <>
      {loggedIn ? (
        <details className="dropdown">
          <summary className="btn">
            {/* Signed in */}
            {userInfo}
          </summary>
          <ul className="shadow menu dropdown-content w-52">
            <li>
              <Link href="/">My Profile</Link>
            </li>
            <li>
              <Link href="/" onClick={() => console.log(userInfo)}>
                My Wallet
              </Link>
            </li>
            <li>
              <a onClick={() => getUserInfo()}>set info</a>
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
