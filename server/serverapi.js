/**
 * @description sends request to the server to create
 *              RSA key pairs for the give wallet address
 *
 * @param address string user wallet address
 */
export const genKeyPairs = async (address) => {
	const response = await fetch(
		`http://localhost:3000/api/v1/crypt/create?publicAddress=${address}`
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	throw new Error("GEN_KEY_PAIRS_ERROR");
};

/**
 * @description updates the user registered status to true.
 * @param {string} address user wallet address
 * @param {boolean} success true if user registered successfully
 */
export const updateUserRegisteredStatus = async (address, success) => {
	const response = await fetch(
		`http://localhost:3000/api/v1/crypt/registered?success=${success}&publicAddress=${address}`
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	throw new Error("UPDATE_USER_REGISTERED_STATUS_ERROR");
}

/**
 * @description retrieves the encryption keys of the user
 * @param {string} address 
 * @returns 
 */
export const retriveUserKeys = async (address) => {
	const response = await fetch(
		`http://localhost:3000/api/v1/crypt/getKeys?publicAddress=${address}`
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	throw new Error("RETRIVE_USER_KEYS_ERROR");
}

/**
 * @description verifies if the user is owner of the file
 * @param {string} address
 * @returns {boolean} true if user is owner of the file
 */
export const verifyOwnership = async (fileId, address) => {
	const response = await fetch(
		`http://localhost:3000/api/v1/crypt/verifyFile/${fileId}?publicAddress=${address}`
	);
	if (response.ok) {
		const data = await response.json();
		return data;
	}
	throw new Error("VERIFY_OWNERSHIP_ERROR");
}