import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { config } from "../config/config.jsx";

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [networkName, setNetworkName] = useState("");
  const [chainId, setChainId] = useState(null);
  const [isNetworkSupported, setIsNetworkSupported] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);

        const signer = provider.getSigner();
        const userAccount = (await signer).address;
        setAccount(userAccount);

        // Get the current network name and chainId
        const network = await provider.getNetwork();

        setChainId(network.chainId);

        if (config.hasOwnProperty(network.chainId)) {
          setNetworkName(config[network.chainId].networkName);
          setIsNetworkSupported(true);
        } else {
          setNetworkName(network.name);
          setIsNetworkSupported(false);
        }
      } catch (error) {
        console.error(
          "User rejected account access or there was an error:",
          error
        );
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask.");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setNetworkName("");
    setChainId(null);
    setIsNetworkSupported(false);
  };

  useEffect(() => {
    if (window.ethereum) {
      // Handle account switching
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = provider.getSigner();
          const userAccount = (await signer).address;
          setAccount(userAccount);

          // Get the updated network name and chainId
          const network = await provider.getNetwork();
          setChainId(network.chainId);

          if (config.hasOwnProperty(network.chainId)) {
            setNetworkName(config[network.chainId].networkName);
            setIsNetworkSupported(true);
          } else {
            setNetworkName(network.name);
            setIsNetworkSupported(false);
          }
        } else {
          setAccount(null);
          setNetworkName("");
          setChainId(null);
          setIsNetworkSupported(false);
        }
      });

      // Handle network changes
      window.ethereum.on("chainChanged", async () => {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();

        setChainId(network.chainId);

        if (config.hasOwnProperty(network.chainId)) {
          setNetworkName(config[network.chainId].networkName);
          setIsNetworkSupported(true);
        } else {
          setNetworkName(network.name);
          setIsNetworkSupported(false);
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener("accountsChanged", () => {});
        window.ethereum.removeListener("chainChanged", () => {});
      }
    };
  }, []);

  return (
    <WalletContext.Provider
      value={{
        account,
        networkName,
        isNetworkSupported,
        chainId,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
