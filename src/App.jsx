import { useEffect, useState, useRef } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Navbar from "./component/Navbar";
import Stake from "./component/Stake";
import Claim from "./component/Claim";
import Faq from "./component/Faq";
import { ToastErrMsg } from "./component/Toast";

function App() {
	const [account, setAccount] = useState("");
	const accountRef = useRef(account);
	// Detect TronLink
	const detectTronLink = () => {
		// Use useCallback to memoize
		const { tronWeb } = window;
		return tronWeb && tronWeb.ready;
	}; // No dependencies, so it only creates the function once

	// Request Account Access
	const getAccount = async () => {
		// Use useCallback to memoize
		if (detectTronLink()) {
			try {
				const tronWeb = window.tronWeb;
				const accounts = await tronWeb.request({
					method: "tron_requestAccounts",
				});
				return accounts[0]; // The first account is usually the user's primary account.
			} catch (error) {
				console.error("Error accessing account:", error);
			}
		} else {
			ToastErrMsg(
				"TronLink is not installed. Please install TronLink to interact with the app."
			);
		}
	}; // Include detectTronLink as a dependency

	useEffect(() => {
		const loadAccount = async () => {
			await getAccount();
			setAccount(window.tronWeb.defaultAddress.base58);
		};

		loadAccount();
	}, [accountRef]);

	return (
		<div className="bg-black">
			<ToastContainer
				position="top-center"
				autoClose={3000}
				hideProgressBar
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
			<Navbar address={account} />
			<Claim address={account} />
			<Faq />
			<Stake address={account} />
		</div>
	);
}

export default App;
