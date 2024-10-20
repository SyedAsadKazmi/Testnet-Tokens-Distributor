# Testnet Tokens Distributor

This app is designed to simplify the process for developers conducting Web3 workshops, especially when encouraging participants to code along. Participants often face issues receiving testnet funds from online faucets.

To address this, workshop developers can create a Google Spreadsheet with a column labeled "WALLET ADDRESS" (case-insensitive) and ask participants to enter their wallet addresses.

Developers can then download the spreadsheet in either `.xlsx` or `.csv` format, upload it to the app, and easily distribute testnet funds to all the wallet addresses with just one click.

## Supported Networks

The `BatchTransfer` contract is currently deployed and available on the following test networks:

- Avalanche Fuji: [0x533309989F93CBCeB69052a259A4B9CCea66A9c7](https://testnet.snowtrace.io/address/0x533309989F93CBCeB69052a259A4B9CCea66A9c7#code)

- Ethereum Sepolia: [0x7760d16A16BaFE65318AfDEEC30E375CC3E1C5f2](https://sepolia.etherscan.io/address/0x7760d16A16BaFE65318AfDEEC30E375CC3E1C5f2#code)

- Polygon Amoy: [0x2ad3E0f6B71FCCABB4f9A20533016063dCC03e17](https://amoy.polygonscan.com/address/0x2ad3E0f6B71FCCABB4f9A20533016063dCC03e17#code)

- Base Sepolia: [0xAE9362750d1D928525573b25Cb4B2031D5F5983b](https://sepolia.basescan.org/address/0xAE9362750d1D928525573b25Cb4B2031D5F5983b#code)

- Arbitrum Sepolia: [0xbD00678470471aCA0C39fed5B63ec48d8B203B54](https://sepolia.arbiscan.io/address/0xbD00678470471aCA0C39fed5B63ec48d8B203B54#code)

- Optimism Sepolia: [0x26E52c99238fea58A4AafDc1Ee3775D19BCc39fb](https://sepolia-optimism.etherscan.io/address/0x26E52c99238fea58A4AafDc1Ee3775D19BCc39fb#code)

- BNB Smart Chain Testnet: [0xE7b6f8274EdF25E38e48F243A9c88796834B4619](https://testnet.bscscan.com/address/0xE7b6f8274EdF25E38e48F243A9c88796834B4619#code)

## Running Locally

If you want to run this app locally, then you can follow these steps:

1. Clone the Repository:

```bash
git clone https://github.com/SyedAsadKazmi/Testnet-Tokens-Distributor
cd Testnet-Tokens-Distributor
```

2. Install Dependencies:

```bash
npm install
```

3. Start the app in the development mode:

```bash
npm run dev
```

The app will start and be available at http://localhost:3000.
