/**
 * Next js modules
 */
import Head from "next/head";

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
import { genKeyPairs } from "@/server/serverapi";

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
	const [responseData, setResponseData] = useState({
		message: "",
		longurl: "",
		shortUrl: "",
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
    if (chainId !== 5) {
      window.alert("change the netwrok to goerli network");
      throw new Error("Change network to goerli network");
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }
    return web3Provider;
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

				// check if the user exists on chain
				const userExists = await secureShareContract.storedUserPublicKeys(
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
				}
			} catch (err) {
				window.alert("aborting transaction for registering user");
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

			// then create the RSA keys for the user
			const response = await genKeyPairs(address);

			console.log("server response data");
			console.table(response);

			if (!response.userExists) {
				storeUserKey(response.keys);
			}

			setWalletConnected(true);
		} catch (e) {
			window.alert("could not connect to wallet");
			// if error occurs while generating the keys then send delete request to the server
			// !BUG
			// await fetch(`http://localhost:3000/api/v1/crypt/deleteUser?publicAddress=${address}`, {
			// 	method: "DELETE",
			// });
			console.error(e);
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

			const [senderAesKey, receiverPublicKey] = await Promise.all([
				secureShareContract.getAesKey(),
				secureShareContract.getPublicKey(),
			]);

			body.append("file", fileData.file);
			body.append("senderAesKey", senderAesKey);
			body.append("receiverPublicKey", receiverPublicKey);

			const { file, receiverAddress } = fileData;

			console.table(fileData);
			console.log("senderAesKey: ", senderAesKey);
			console.log("receiverPublicKey: ", receiverPublicKey);

			// check if senderAesKey and receiverPublicKey are not empty
			if(!senderAesKey || !receiverPublicKey) {
				window.alert("Missing keys");
				return;
			}

			if (!file || !receiverAddress) {
				window.alert("Please select a file and receiver address");
				return;
			}

			setLoading(true);
			const response = await fetch(
				// while testing use localhost
				`http://localhost:3000/api/v1/crypt/upload?publicAddress=${walletAddress}&receiverAddress=${receiverAddress}`,
				{
					method: "post",
					body,
				}
			);
			const data = await response.json();
			console.log(data);
			setResponseData({
				message: data.message,
				longurl: data.longurl,
				shortUrl: data.shortUrl,
			});
			setLoading(false);
		} catch (e) {
			console.error(e);
			setResponseData("Internal server error");
			setLoading(false);
		}
	};
  
  /**
	 * @description - Sets the response data
	 * @param {*} responseData
	 * @returns jsx
	 */
	const renderResponse = (responseData) => {
		return (
			<div>
				<p>{responseData.message}</p>
				<p>{responseData.longurl}</p>
				<p>{responseData.shortUrl}</p>
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
                    onClick={uploadToServer}
                  >
                    <span>Generate link 🔗</span>
                    <i></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="containerBoxTwo">
            <InfoHeader />
            <div>{loading ? "Uploading..." : renderResponse(responseData)}</div>
          </div>
          </div>
          <div className="txtbox">
            <input className="textaria" type="text-area" placeholder="Recevicer's Wallet Address" id="receiverAddress" onChange={setReceiverAddressHandler}></input>
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
          <meta name="description" content="secure-share-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        {renderMainContent()}
        {/* <footer id="footer">© Hackerspace {new Date().getFullYear()}</footer> */}
      </div>
    </>
  );
}