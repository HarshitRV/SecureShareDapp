import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

export default function Download() {
	const [fileProtected, setFileProtected] = useState(false);
    const [password, setPassword] = useState("");

	const router = useRouter();
	const [fileId] = useState(router.query.id);
	console.log("id", fileId);
	console.log(router);

	// sent a fetch request to the server to see if the file is password protected
	// if it is, then render the password input field as well
	const getFileInfo = useCallback(async () => {
		try {
			const response = await fetch(
				`http://localhost:3000/api/v2/file?id=${
					fileId || document.URL.split("id=")[1]
				}`
			);
			if (response.ok) {
				const {
					fileDetails: { protected: hasPassword },
				} = await response.json();
                console.log("hasPassword", hasPassword);
				setFileProtected(hasPassword);
			} else {
				console.error("Failed to fetch file");
			}
		} catch (error) {
			console.error(error);
		}
	}, [fileId]);

	useEffect(() => {
		getFileInfo();
	}, [getFileInfo]);

	const handleSubmit = () => {
		console.log("working", password);
        if (password.trim().length === 0) {
            window.alert("Please enter a password");
            return;
        }

        // send a fetch request to the server to download the file
        // if the password is correct
        
	};

	const renderPasswordInput = () => {
		return (
			<>
				<input
					type="password"
					placeholder="Enter password"
                    onChange={(e) => setPassword(e.target.value)}
				/>
				<button onClick={handleSubmit}>Submit</button>
			</>
		);
	};

	return (
		<>
			{!fileProtected && (
				<a href="http://localhost:3000/api/v2/file/64679d8803a7ba2c3c158002">
					Donwload
				</a>
			)}
			{fileProtected && renderPasswordInput()}
		</>
	);
}
