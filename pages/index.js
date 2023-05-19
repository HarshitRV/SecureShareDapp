/**
 * Next js modules
 */
import Head from "next/head";

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

// Home function
export default function Home() {
	const [fileData, setFile] = useState({
		file: null,
		receiverAddress: "",
	});
	const [fileUploadStatus, setFileUploadStatus] = useState(false);
	const [loading, setLoading] = useState(false);
	const [responseData, setResponseData] = useState({
		message: "",
		longurl: "",
		shortUrl: "",
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

	/**
	 * @description - uploads the file to the server
	 * @param {*} event
	 */
	const uploadToServer = async () => {
		try {
			const body = new FormData();

			body.append("file", fileData.file);

			const { file } = fileData;

			console.table(fileData);

			if (!file) {
				window.alert("Please select a file");
				return;
			}

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
				data = await response.json();
				setResponseData({
					message: "Failed to upload file",
					longurl: "",
					shortUrl: "",
				});
				throw new Error(data.message);
			}
			console.log(data);
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
		console.log(renderResponse);
		return (
			<div>
				<p>{responseData.message}</p>
				<a href={responseData.longurl}>File Link</a>
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
					<div className="container2">
						<div className="containerBoxOne">
							<div className="mainContent">
								<div>
									<div>
										{loading ? "Uploading..." : renderResponse(responseData)}
									</div>
								</div>
							</div>
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
