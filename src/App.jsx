import { useEffect, useState } from "react";
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
	// Detect TronLink
	const detectTronLink = () => {
		const { tronWeb } = window;
		return tronWeb && tronWeb.ready;
	};

	// Request Account Access
	const getAccount = async () => {
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
	};

	useEffect(() => {
		const loadAccount = async () => {
			await getAccount();
			setAccount(window.tronWeb.defaultAddress.base58);
		};

		loadAccount();
	}, []);

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
