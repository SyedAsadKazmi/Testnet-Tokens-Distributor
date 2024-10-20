import React, { useContext, useState, useEffect } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { WalletContext } from "./walletContext";
import { ethers } from "ethers";
import { abi } from "../config/abi.jsx";
import { config } from "../config/config.jsx";

export const FileUploadComponent = () => {
  const [fileData, setFileData] = useState([]);
  const [walletAddresses, setWalletAddresses] = useState([]);
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [etherSentTxHash, setEtherSentTxHash] = useState("");

  const { isNetworkSupported, account, chainId } = useContext(WalletContext);

  // Initialize sendError based on isNetworkSupported context variable
  const [sendError, setSendError] = useState(() => {
    return !account
      ? "No account is connected."
      : !isNetworkSupported
      ? "Unsupported network."
      : "";
  });

  // Update sendError when isNetworkSupported changes
  useEffect(() => {
    if (!account) {
      setSendError("No account is connected.");
    } else if (!isNetworkSupported) {
      setSendError("Unsupported network.");
    } else {
      setSendError(""); // Clear error if network becomes supported
    }
  }, [account, isNetworkSupported]);

  const handleFileUpload = (event) => {
    // setSendError("");
    setEtherSentTxHash("");
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();

      if (fileExtension === "csv") {
        parseCSV(file);
      } else if (fileExtension === "xlsx") {
        parseXLSX(file);
      } else {
        setError("Invalid file format. Please upload a CSV or XLSX file.");
      }
    }
  };

  const parseCSV = (file) => {
    Papa.parse(file, {
      header: true,
      complete: (result) => {
        const firstRowKeys = Object.keys(result.data[0] || {});
        if (!hasWalletAddressColumn(firstRowKeys)) {
          setError("There is no column containing wallet addresses.");
          setFileData([]);
          setWalletAddresses([]);
        } else {
          setFileData(result.data);
          extractWalletAddresses(result.data);
          setError("");
        }
      },
      error: (err) => {
        setError("Error parsing CSV file.");
        console.error(err);
      },
    });
  };

  const parseXLSX = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const firstRowKeys = Object.keys(worksheet[0] || {});
      if (!hasWalletAddressColumn(firstRowKeys)) {
        setError("There is no column containing wallet addresses.");
        setFileData([]);
        setWalletAddresses([]);
      } else {
        setFileData(worksheet);
        extractWalletAddresses(worksheet);
        setError("");
      }
    };
    reader.onerror = () => setError("Error reading XLSX file.");
    reader.readAsArrayBuffer(file);
  };

  const hasWalletAddressColumn = (keys) => {
    return keys.some((key) => key.toLowerCase().includes("wallet address"));
  };

  const extractWalletAddresses = (data) => {
    const walletAddressesColumn = Object.keys(data[0]).find((key) =>
      key.toLowerCase().includes("wallet address")
    );

    const addresses = data.map((row) => row[walletAddressesColumn]);
    setWalletAddresses(addresses);
  };

  const handleSend = async () => {
    setSendError(""); // Reset the sendError state before starting
    setEtherSentTxHash("");

    if (walletAddresses.length === 0) {
      setSendError("No wallet addresses to send to.");
      return;
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      setSendError("Please enter a valid amount.");
      return;
    }

    try {
      setIsSending(true); // Start loading state

      // Ensure the user is connected to a wallet (e.g., MetaMask)
      const { ethereum } = window;
      if (!ethereum) {
        setSendError("Ethereum wallet is not detected.");
        return;
      }

      const provider = new ethers.BrowserProvider(ethereum);
      const signer = await provider.getSigner();

      // Assuming you already have the contract address
      const contractAddress = config[chainId].contractAddress; // Replace with your contract address
      const contract = new ethers.Contract(contractAddress, abi, signer);

      // Convert amount from Ether to Wei
      const amountInWei = ethers.parseEther(amount.toString());

      const walletBalance = await provider.getBalance(signer.address);

      if (walletBalance < amountInWei * BigInt(walletAddresses.length)) {
        setSendError("Insufficient balance");
      } else {
        // Send the batchTransferEther transaction
        const tx = await contract.batchTransferEther(
          walletAddresses,
          amountInWei,
          {
            value: ethers.parseEther(
              (amount * walletAddresses.length).toString()
            ), // Total Ether to send
          }
        );

        console.log("Transaction sent:", tx);

        // Wait for the transaction to be confirmed
        const receipt = await tx.wait();
        console.log("Transaction confirmed:", receipt);

        alert(`Successfully sent ${amount} Ether to all wallet addresses.`);
        setSendError(""); // Clear any errors after success
        setEtherSentTxHash(receipt.hash);
      }
    } catch (error) {
      console.error("Error sending Ether:", error);
      setSendError("An error occurred while sending Ether. Please try again.");
    } finally {
      setIsSending(false); // End loading state
    }
  };

  return (
    <>
      <style>
        {`
          .dot-container {
            display: inline-block;
            margin-left: 5px;
          }

          .dot {
            height: 8px;
            width: 8px;
            margin-right: 2px;
            display: inline-block;
            border-radius: 50%;
            background-color: white;
            animation: dot-flashing 1s infinite ease-in-out both;
          }

          .dot:nth-child(1) {
            animation-delay: 0s;
          }

          .dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          @keyframes dot-flashing {
            0% {
              opacity: 1;
            }
            50%, 100% {
              opacity: 0;
            }
          }
        `}
      </style>

      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
        <br></br>
        <br></br>
        <br></br>
        <div className="mb-4">
          <label className="block mb-2 text-lg font-medium text-gray-700 dark:text-gray-300">
            Upload a CSV or XLSX file
          </label>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
            There should be a column named as &apos;WALLET ADDRESS&apos;
            (irrespective of the lower/upper case).
          </p>
          <input
            type="file"
            accept=".csv, .xlsx"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 focus:outline-none"
          />
          {error && (
            <p className="mt-2 text-red-500 dark:text-red-400">{error}</p>
          )}
        </div>

        {fileData.length > 0 && (
          <div className="max-h-96 w-[600px] bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 mt-8 flex justify-center">
            {/* Wrapper for the table with fixed width and horizontal scrolling */}
            <div className="overflow-x-auto">
              <table className="table-auto w-[600px] text-left">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    {Object.keys(fileData[0]).map((key) => (
                      <th
                        key={key}
                        className="px-4 py-2 text-gray-700 dark:text-gray-200"
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fileData.map((row, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      {Object.values(row).map((value, i) => (
                        <td
                          key={i}
                          className="px-4 py-2 text-gray-900 dark:text-gray-100"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Amount Input and Send Button */}
        {walletAddresses.length > 0 && (
          <div className="mt-8 flex flex-col items-center space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 dark:text-gray-300">
                Enter amount to be sent to each address:
              </label>
              <input
                type="number"
                placeholder="Amount (in Ether)"
                value={amount}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  // Ensure the amount is positive and greater than 0
                  if (inputValue === "" || Number(inputValue) >= 0) {
                    setAmount(inputValue);
                  }
                }}
                className="p-2 text-gray-900 dark:text-gray-100 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
              />
              <button
                onClick={handleSend}
                className={`px-4 py-2 ${
                  isSending || !isNetworkSupported
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                } rounded-lg focus:outline-none`}
                disabled={isSending || !isNetworkSupported}
              >
                {isSending ? (
                  <span>
                    Sending
                    <span className="dot-container">
                      <span className="dot"></span>
                      <span className="dot"></span>
                      <span className="dot"></span>
                    </span>
                  </span>
                ) : (
                  "Send Ether"
                )}
              </button>
            </div>
            {/* Error and Transaction Hash aligned with input */}
            <div className="w-full flex flex-col items-start pl-[insert-padding]">
              {sendError && <p className="text-red-500">{sendError}</p>}
              {etherSentTxHash && (
                <p className="text-cyan-500">
                  Transaction sent:{" "}
                  <a
                    href={`${config[chainId].blockExplorerUrl}/tx/${etherSentTxHash}`}
                    target="blank"
                    className="underline"
                  >
                    {etherSentTxHash}
                  </a>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};
