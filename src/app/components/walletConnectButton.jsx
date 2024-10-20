import React, { useContext } from "react";
import { WalletContext } from "./walletContext";

export const WalletConnectButton = () => {
  const { account, networkName, connectWallet, disconnectWallet } =
    useContext(WalletContext);

  return (
    <div className="flex gap-4 items-center flex-col absolute top-8 right-8">
      {account && (
        <>
          <div className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Connected: {account.substring(0, 6)}...
            {account.substring(account.length - 4)}
          </div>
          <div className="text-sm sm:text-base">
            Network:{" "}
            {networkName.charAt(0).toUpperCase() + networkName.slice(1)}
          </div>
        </>
      )}

      <button
        className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        onClick={account ? disconnectWallet : connectWallet}
      >
        {account ? "Disconnect Wallet" : "Connect Wallet"}
      </button>
    </div>
  );
};
