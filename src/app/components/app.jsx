import React from "react";
import { WalletProvider } from "./walletContext";
import { WalletConnectButton } from "./walletConnectButton";
import { FileUploadComponent } from "./fileUploadComponent";

export function App() {
  return (
    <WalletProvider>
      <div className="App">
        <header className="absolute top-8 left-8">
          <h1 className="text-3xl font-bold">Testnet Tokens Distributor</h1>
          <p className="text-sm text-gray-400">
            Easily distribute testnet tokens to multiple accounts during
            workshops.
          </p>
        </header>
      </div>
      <WalletConnectButton />
      <FileUploadComponent />
    </WalletProvider>
  );
}
