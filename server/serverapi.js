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
	const data = await response.json();
	return data;
};
