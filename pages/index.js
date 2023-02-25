import Head from "next/head";
import Web3Modal from "web3modal";
import { providers, Contract } from "ethers";
import { useEffect, useState, useRef } from "react";
// need to import the contract address and the abi
import { ConnectWallet } from "@/components/Buttons/ConnectWallet";
import { NavBar } from "@/components/Nav/NavBar";
import Image from "next/image";
import styles from "../styles/Button.module.css";
import { InfoHeader } from "@/components/Info/InfoHeader";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [file, setFile] = useState(null);
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
   * @description - connects the MetaMask wallet
   */
  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  /**
   * @description - upload the file to the client
   * @param {*} event
   */
  const uploadToClient = (event) => {
    if (event.target.files && event.target.files[0])
      setFile(event.target.files[0]);
  };

  /**
   * @description - uploads the file to the server
   * @param {*} event
   */
  const uploadToServer = async (event) => {
    try {
      const body = new FormData();
      console.log("File", file);
      body.append("file", file);
      setLoading(true);
      const response = await fetch(
        "https://fileshare-fikr.onrender.com/api/v2/upload",
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
        <div className="mainBox">
          <div className="mainBox2">
          <div id="container">
            <div>
            </div>
            <div className="mainContent">
              <div>
                <div className="mainFile">
                  <div className="paraFile"></div>
                  <label>
                    <input
                      className="inputFile"
                      type="file"
                      name="file"
                      id="file"
                      onChange={uploadToClient}
                    />
                  </label>
                </div>
                <div>
                  <button
                    style={{ "--clr": "skyblue", "margin-top": "2%" }}
                    className={styles.connectBtn}
                    onClick={uploadToServer}>
                    <span>Generate share link 🔗</span>
                    <i></i>
                  </button>
                  <div>
                {loading ? "Uploading..." : renderResponse(responseData)}
              </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mainContent2">
          <InfoHeader />
          <ConnectWallet className="connectWallet" />
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
          <meta name="description" content="secure-share-app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        
        {renderMainContent()}
       
        <footer>© Hackerspace {new Date().getFullYear()}</footer>
      </div>
    </>
  );
}
