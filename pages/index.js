/**
 * Next js modules
 */
import Head from "next/head";
import Image from "next/image";

/**
 * React js modules
 */
import { useState } from "react";

/**
 * Custom components
 */
import { InfoHeader } from "@/components/Info/InfoHeader";

/**
 * Styles
 */
import styles from "../styles/Button.module.css";
import Link from "next/link";

// Home function
export default function Home() {
	const [fileData, setFile] = useState({
		file: null,
		password: "",
	});
	const [fileUploadStatus, setFileUploadStatus] = useState(false);
	const [loading, setLoading] = useState(false);
	const [responseData, setResponseData] = useState({
		message: null,
		longurl: null,
		shortUrl: null,
	});

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

	const setPasswordHandler = (event) => {
		setFile((prevState) => {
			return {
				...prevState,
				password: event.target.value,
			};
		});
	};

	const copyLinkHandler = async () => {
		if (window.location.protocol != "https:")
			return alert("HTTPS is required to copy to clipboard");
		await navigator.clipboard.writeText(
			responseData.shortUrl || responseData.longurl
		);
		console.log(navigator.clipboard);
		alert("Copied to clipboard");
	};

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
	 * @description - uploads the file to the server
	 * @param {*} event
	 */
	const uploadToServer = async () => {
		try {
			const { file, password } = fileData;

			if (!file) {
				window.alert("Please select a file");
				return;
			}

			const body = new FormData();
			body.append("file", fileData.file);

			if (password.trim().length > 0) {
				body.append("password", password.trim());
			}

			console.table(fileData);

			setLoading(true);
			const response = await fetch(
				// while testing use localhost
				`http://localhost:3000/api/v2/upload`,
				{
					method: "post",
					body,
				}
			);

			let data;
			if (response.ok) {
				data = await response.json();
				setResponseData({
					message: data.message,
					longurl: data.longurl,
					shortUrl: data.shortUrl,
				});
				setLoading(false);
				setFileUploadStatus(true);
			} else {
				setResponseData({
					message: "Failed to upload file",
					longurl: "",
					shortUrl: "",
				});
				alert("Failed to upload file");
				throw new Error(data.message);
			}
			console.log(data);
		} catch (e) {
			console.error(e);
			setLoading(false);
		}
	};

	/**
	 * @description - Sets the response data
	 * @param {*} responseData
	 * @returns jsx
	 */
	const renderResponse = (responseData) => {
		console.log(renderResponse.longurl);
		const longUrl =
			"http://localhost:3000/api/v2/file/64679d8803a7ba2c3c158002";

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
									<div className="pass glowOnHover">
										<input
											type="password"
											placeholder="Password(Optional)"
											className="password"
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
				</div>
			</>
		);
	};

	// Render returned file links after upload
	const renderFileUploaded = () => {
		return (
			<>
				<div className="container">
					<div className="containerBoxOne">
						<div>
							<h1 className="share">Your File Is Ready To Share !</h1>
							<p className="paraText">Copy the link to share your file</p>
							<div className="copyBox">
								<button className="buttonBtn">
									{responseData.shortUrl
										? responseData.shortUrl
										: responseData.longurl}
								</button>
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
				{/* <footer id="footer">© Hackerspace {new Date().getFullYear()}</footer> */}
			</div>
		</>
	);
}
