export const abi = [
	{
		"inputs": [],
		"name": "BatchTransfer__ERC20TransferFailed",
		"type": "error"
	},
	{
		"inputs": [],
		"name": "BatchTransfer__EtherTransferFailed",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "required",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "sent",
				"type": "uint256"
			}
		],
		"name": "BatchTransfer__IncorrectEtherSent",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "tokenAddress",
				"type": "address"
			},
			{
				"internalType": "address[]",
				"name": "recipients",
				"type": "address[]"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "batchTransferERC20",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amountSentToEachRecipient",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "totalRecipients",
				"type": "uint256"
			}
		],
		"name": "BatchTransferERC20Complete",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address[]",
				"name": "recipients",
				"type": "address[]"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "batchTransferEther",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "amountSentToEachRecipient",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "totalRecipients",
				"type": "uint256"
			}
		],
		"name": "BatchTransferEtherComplete",
		"type": "event"
	}
]