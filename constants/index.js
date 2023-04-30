export const SECURE_SHARE_CONTRACT_ADDRESS =
	"0x61355F789B701340cd5c8849cb34943aDBAeeb43";
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
				name: "publicKey",
				type: "string",
			},
		],
		stateMutability: "view",
		type: "function",
	},
	{
		inputs: [],
		name: "getAesKey",
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
						name: "privateKey",
						type: "string",
					},
					{
						internalType: "string",
						name: "publicKey",
						type: "string",
					},
					{
						internalType: "string",
						name: "aesKey",
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
		name: "getPrivateKey",
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
				name: "_privateKey",
				type: "string",
			},
			{
				internalType: "string",
				name: "_publicKey",
				type: "string",
			},
			{
				internalType: "string",
				name: "_aesKey",
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
		name: "storedUserPublicKeys",
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
