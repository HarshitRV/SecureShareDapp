export const SECURE_SHARE_CONTRACT_ADDRESS =
	"0xD5B3338972Ae155fF1ADdeD6d0B1Ae1f87ddF3bE";
export const abi = [
	{
		inputs: [
			{
				internalType: "address",
				name: "_user",
				type: "address",
			},
		],
		name: "checkUserExists",
		outputs: [
			{
				internalType: "string",
				name: "publicKeyHash",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getAesKeyHash",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getAllKeys",
		outputs: [
			{
				components: [
					{
						internalType: "string",
						name: "privateKeyHash",
						type: "string",
					},
					{
						internalType: "string",
						name: "publicKey",
						type: "string",
					},
					{
						internalType: "string",
						name: "aesKeyHash",
						type: "string",
					},
				],
				internalType: "struct SecureShare.Keys",
				name: "",
				type: "tuple",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getPrivateKeyHash",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "_user",
				type: "address",
			},
		],
		name: "getPublicKey",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "string",
				name: "_privateKeyHash",
				type: "string",
			},
			{
				internalType: "string",
				name: "_publicKey",
				type: "string",
			},
			{
				internalType: "string",
				name: "_aesKeyHash",
				type: "string",
			},
		],
		name: "storeUserKeys",
		outputs: [],
		stateMutability: "nonpayable",
		type: "function",
	},
	{
		inputs: [
			{
				internalType: "address",
				name: "",
				type: "address",
			},
		],
		name: "storedUserPublicKey",
		outputs: [
			{
				internalType: "string",
				name: "",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
];
