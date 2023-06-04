/**
 * Node js modules
 */
import crypto from "crypto";

/**
 * Next js modules
 */
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

/**
 * Ether js modules
 */
import Web3Modal from "web3modal";

import { providers, Contract } from "ethers";

/**
 * React js modules
 */
import { useEffect, useState, useRef, useCallback } from "react";

/**
 * Contract info import
 */
import { SECURE_SHARE_CONTRACT_ADDRESS, abi } from "@/constants";

/**
 * Custom components
 */
import { ConnectWallet } from "@/components/Buttons/ConnectWallet";
import { InfoHeader } from "@/components/Info/InfoHeader";

/**
 * Styles
 */
import styles from "../styles/Button.module.css";

/**
 * Server function imports
 */
import {
	genKeyPairs,
	updateUserRegisteredStatus,
	retriveUserKeys,
} from "@/server/serverapi";

// Home function
export default function Home() {
	const [walletConnected, setWalletConnected] = useState(false);
	const [walletAddress, setWalletAddress] = useState("");
	const [fileData, setFile] = useState({
		file: null,
		receiverAddress: "",
	});
	const [formValid, setFormValid] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fileUploadStatus, setFileUploadStatus] = useState(false);
	const [responseData, setResponseData] = useState({
		message: null,
		longurl: null,
		shortUrl: null,
	});
	const web3ModalRef = useRef();

	/**
	 * @description -  Returns a Provider or Signer object representing the Ethereum RPC
	 *                 with or without the signing capabilities of metamask attached
	 *
	 *		           A `Provider` is needed to interact with the blockchain - reading transactions,
	 *                 reading balances, reading state, etc.
	 *
	 *    			   A `Signer` is a special type of Provider used in case a `write` transaction
	 * 				   needs to be made to the blockchain, which involves the connected account
	 * 				   needing to make a digital signature to authorize the transaction being sent.
	 *
	 * 			       Metamask exposes a Signer API to allow your website to
	 * 		    	   request signatures from the user using Signer functions.
	 *
	 * @param {*} needSigner
	 * @returns web3Provider or signer
	 */
	const getProviderOrSigner = async (needSigner = false) => {
		const provider = await web3ModalRef.current.connect();
		const web3Provider = new providers.Web3Provider(provider);

		const { chainId } = await web3Provider.getNetwork();
		console.log("Chain id", chainId);

		if (chainId !== 11155111) {
			window.alert("change the netwrok to sepolia network");
			throw new Error("Change network to sepolia network");
		}

		if (needSigner) {
			const signer = web3Provider.getSigner();
			return signer;
		}
		return web3Provider;
	};

	/**
	 * @description copies the link to the clipboard
	 */
	const copyLinkHandler = async () => {
		if (window.location.protocol != "https:")
			return alert("HTTPS is required to copy to clipboard");
		await navigator.clipboard.writeText(
			responseData.shortUrl || responseData.longurl
		);
		console.log(navigator.clipboard);
		alert("Copied to clipboard");
	};

	/**
	 * @description shares the link to the other apps
	 */
	const shareLinkHandler = async () => {
		const shareData = {
			title: "Share",
			text: "Share the file link",
			url: responseData.shortUrl || responseData.longurl,
		};

		if (navigator.canShare) {
			try {
				await navigator.share(shareData);
			} catch (err) {
				console.log(err);
			}
		} else {
			alert("Your browser does not support the Share API");
		}
	};

	/**
	 * @description store user keys on chain
	 */
	const storeUserKey = useCallback(
		async ({ privateKey, publicKey, aesKey }) => {
			try {
				const signer = await getProviderOrSigner(true);
				// creating new instance of the contract with signer
				const secureShareContract = new Contract(
					SECURE_SHARE_CONTRACT_ADDRESS,
					abi,
					signer
				);

				const address = await signer.getAddress();
				// check if the user exists on chain
				const userExists = await secureShareContract.storedUserPublicKey(
					signer.getAddress()
				);

				if (!userExists && confirm("Registering as new user?")) {
					// console.log(privateKey, publicKey, aesKey);
					// console.log(typeof privateKey, typeof publicKey, typeof aesKey);

					// call store storeUserKeys
					const tx = await secureShareContract.storeUserKeys(
						privateKey,
						publicKey,
						aesKey
					);
					setLoading(true);
					await tx.wait();
					setLoading(false);
					console.log("registered user to the chain");

					//! Need a api call to the server regarding the user registration
					const response = await updateUserRegisteredStatus(address, true);
					console.log(response);
				} else {
					window.alert("Welcome back!");
				}
			} catch (err) {
				window.alert("something went wrong, registering new user");
				console.error(err);
			}
		},
		[]
	);

	/**
	 * @description connects the MetaMask wallet
	 */
	const connectWallet = useCallback(async () => {
		try {
			const signer = await getProviderOrSigner(true);
			// need the wallet public address.
			const address = await signer.getAddress();
			console.log("user address: ", address);

			setWalletAddress(address);
			setWalletConnected(true);

			// then create the RSA keys for the user
			const response = await genKeyPairs(address);

			console.log("server response data");
			console.table(response);

			if (!response.userExists) {
				console.log("registering new user", response.keys);
				storeUserKey(response.keys);
				return;
			}

			if (response.userExists) {
				const secureShareContract = new Contract(
					SECURE_SHARE_CONTRACT_ADDRESS,
					abi,
					signer
				);

				const privateKey = await secureShareContract.getPrivateKeyHash();
				console.log("privateKey: ", privateKey);
			}
		} catch (e) {
			console.error("error: ", e.message);
			if (e.message === "GEN_KEY_PAIRS_ERROR")
				window.alert("GEN_KEY_PAIRS_ERROR, server down");
			if (e.message === "User Rejected")
				window.alert("User Rejected the wallet connection");
			// if error occurs while generating the keys then send delete request to the server
			// !BUG
			// await fetch(`http://localhost:3000/api/v1/crypt/deleteUser?publicAddress=${address}`, {
			// 	method: "DELETE",
			// });
		}
	}, [storeUserKey]);

	useEffect(() => {
		if (!walletConnected) {
			web3ModalRef.current = new Web3Modal({
				network: "goerli",
				providerOptions: {},
				disableInjectedProvider: false,
			});
			connectWallet();
		}
	}, [walletConnected, connectWallet]);

	/**
	 * @description upload the file to the client
	 * @param {*} event
	 */
	const setFileHandler = (event) => {
		if (event.target.files && event.target.files[0])
			setFile((priveState) => {
				return {
					...priveState,
					file: event.target.files[0],
				};
			});
	};

	/**
	 * @description set receiver address
	 * @param {*} event
	 */
	const setReceiverAddressHandler = (event) => {
		if (event.target.value)
			setFile((prevState) => {
				return {
					...prevState,
					receiverAddress: event.target.value,
				};
			});
	};

	/**
	 * @description - uploads the file to the server
	 * @param {*} event
	 */
	const uploadToServer = async () => {
		try {
			const body = new FormData();

			// need to read the aes key of the sender from the chain
			// need to read the public key of the receiver from the chain
			// and send it to the server
			const signer = await getProviderOrSigner(true);
			const secureShareContract = new Contract(
				SECURE_SHARE_CONTRACT_ADDRESS,
				abi,
				signer
			);
			const address = await signer.getAddress();

			const [senderAesKey, receiverPublicKey] = await Promise.all([
				secureShareContract.getAesKeyHash(),
				secureShareContract.getPublicKey(address),
			]);

			body.append("file", fileData.file);
			body.append("senderAesKey", senderAesKey);
			body.append("receiverPublicKey", receiverPublicKey);

			const { file, receiverAddress } = fileData;

			console.table(fileData);
			console.log("senderAesKey: ", senderAesKey);
			console.log("receiverPublicKey: ", receiverPublicKey);

			// check if senderAesKey and receiverPublicKey are not empty
			if (!senderAesKey || !receiverPublicKey) {
				window.alert(
					"Missing keys, make sure receiver is registered on the platform"
				);
				return;
			}

			if (!file || !receiverAddress) {
				window.alert("Please select a file and receiver address");
				return;
			}

			setLoading(true);

			const response = await fetch(
				// while testing use localhost
				`http://localhost:3000/api/v1/crypt/upload?publicAddress=${address}&receiverAddress=${receiverAddress}`,
				{
					method: "post",
					body,
				}
			);

			let data;
			if (response.ok) {
				data = await response.json();
				console.log("file upload response: ", data);
				setResponseData({
					message: data.message,
					longurl: data.longurl,
					shortUrl: data.shortUrl,
				});
				setLoading(false);
				setFileUploadStatus(true);
			} else {
				throw new Error("Failed to upload to server");
			}
		} catch (e) {
			console.error(e);
			setResponseData({
				...responseData,
				message: "Failed to upload file",
			});
			setLoading(false);
			alert("Failed to upload file");
		}
	};

	/**
	 * @description - Sets the response data
	 * @param {*} responseData
	 * @returns jsx
	 */
	const renderResponse = (responseData) => {
		console.log("render response", renderResponse.longurl);
		return (
			<div>
				<p>{responseData.message}</p>
				<a href={responseData.longurl}>File Link</a>
				<Link href="/download?id=6469e5026061508ef4b23a95">Download</Link>
				{responseData.shortUrl && <a href={responseData.shortUrl}>Short URL</a>}
			</div>
		);
	};

	/**
	 * @description - Renders the main body of the page.
	 * @returns jsx
	 */
	const renderMainContent = () => {
		return (
			<>
				<div className="container">
					<div className="container2">
						<div className="containerBoxOne">
							<div>
								<ConnectWallet
									walletConnected={walletConnected}
									className="connectWallet"
									connectWallet={connectWallet}
								/>
							</div>
							<div className="mainContent">
								<div>
									<div className="mainFile">
										<label htmlFor="file"></label>
										<input
											className="inputFile"
											type="file"
											name="file"
											id="file"
											onChange={setFileHandler}
										/>
									</div>
									<div>
										<button
											style={{ "--clr": "skyblue", marginTop: "2%" }}
											className={styles.connectBtn}
											onClick={uploadToServer}>
											<span>Generate link 🔗</span>
											<i></i>
										</button>
									</div>
								</div>
							</div>
						</div>
						<div className="containerBoxTwo">
							<InfoHeader />
						</div>
					</div>
					<div className="txtbox">
						<input
							className="textaria"
							type="text-area"
							placeholder="Recevicer's Wallet Address"
							id="receiverAddress"
							onChange={setReceiverAddressHandler}></input>
					</div>
				</div>
			</>
		);
	};

	const renderFileUploaded = () => {
		const fileId = responseData.longurl?.split("/").pop();
		console.log("renderFileUploaded called", fileId);
		const downloadURL = `http://localhost:3001/download?id=${fileId}`;

		return (
			<>
				<div className="container">
					<div className="containerBoxOne">
						<div>
							<h1 className="share">Your File Is Ready To Share !</h1>
							<div className="copyBox">
								<input
									className="buttonBtn"
									value={downloadURL}
									readOnly
								/>
								<a
									onClick={copyLinkHandler}
									id="clipBoard"
									className="rainbow-button">
									<Image
										className="imgIcon"
										src="/icons8-copy-64.png"
										alt="icon btn"
										width={20}
										height={20}
									/>
									Copy Link
								</a>
							</div>
							<a
								onClick={shareLinkHandler}
								href="#"
								className="button">
								🔗SHARE
							</a>
						</div>
					</div>
				</div>
			</>
		);
	};

	return (
		<>
			<div>
				<Head>
					<title>Secure Share Dapp</title>
					<meta
						name="description"
						content="secure-share-app"
					/>
					<link
						rel="icon"
						href="/favicon.ico"
					/>
				</Head>
				{fileUploadStatus ? renderFileUploaded() : renderMainContent()}
			</div>
		</>
	);
}
