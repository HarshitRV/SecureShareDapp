/**
 * Next js modules
 */
import { useRouter } from "next/router";

/**
 * React js modules
 */
import { useCallback, useEffect, useState } from "react";

/**
 * Server function imports
 */
import { verifyOwnership } from "@/server/serverapi";

export default function Download() {
	const [walletAddress, setWalletAddress] = useState("");
	const [verified, setVerified] = useState(false);
	const [loading, setLoading] = useState(true);

	const router = useRouter();
	const fileId = router.query.id;

	if (!fileId) {
		return "Loading...";
	}

	console.log("fileId", fileId);

	const handleSubmit = async () => {
		console.log("working", walletAddress);
		if (walletAddress.trim().length === 0) {
			window.alert("Please enter your wallet address");
			return;
		}

		try {
			// linting error: await is required here
			const { verified } = await verifyOwnership(fileId, walletAddress);
			console.log("verifyOwnership", verified);
			setVerified(verified);
		} catch (error) {
			console.log(error);
		}
	};

	const renderDownloadLink = () => {
		return (
			<div className="container">
				<a
					href={`http://localhost:3000/api/v1/crypt/file/${fileId}?publicAddress=${walletAddress}`}>
					Download
				</a>
			</div>
		);
	};

	const renderWalletAddressInput = () => {
		return (
			<>
				<button
					onClick={handleSubmit}
					type="button">
					Verify
				</button>

				<input
					onChange={(e) => setWalletAddress(e.target.value)}
					type="text"
					placeholder="Enter Wallet Address"
				/>
			</>
		);
	};

	return <>{verified ? renderDownloadLink() : renderWalletAddressInput()}</>;
}
