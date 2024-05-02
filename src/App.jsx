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

	const [tronLinkStatus, setTronLinkStatus] = useState({
		installed: false,
		unlocked: false,
	});

	// Function to wait for TronWeb to be injected
	const waitForTronWeb = (callback, timeout = 3000, interval = 100) => {
		const check = async () => {
			if (window.tronWeb && window.tronWeb.ready) {
				await window.tronWeb.request({
					method: "tron_requestAccounts",
				});
				if (window.tronWeb.fullNode.host !== "https://api.trongrid.io") {
					ToastErrMsg(
						"You need to set your Tronlink wallet to Tron Mainnet! Please change the network and refresh."
					);
				}
				callback(true); // TronWeb is ready
			} else if (timeout <= 0) {
				callback(false); // Timeout reached
			} else {
				setTimeout(check, interval);
				timeout -= interval; // Decrement the timeout
			}
		};
		check();
	};

	useEffect(() => {
		waitForTronWeb((isReady) => {
			if (isReady) {
				setTronLinkStatus({
					installed: true,
					unlocked: window.tronWeb.ready,
				});
			} else {
				ToastErrMsg(
					"TronLink is not installed now. Please install TronLink to interact with the app."
				);
				setTronLinkStatus({
					installed: false,
					unlocked: false,
				});
			}
		});
	}, [account]);

	useEffect(() => {
		if (tronLinkStatus.installed && tronLinkStatus.unlocked) {
			setAccount(window.tronWeb.defaultAddress.base58);
		} else if (tronLinkStatus.installed && !tronLinkStatus.unlocked) {
			ToastErrMsg(
				"TronLink is not locked now. Please unlock your TronLink to interact with the app."
			);
		}
	}, [tronLinkStatus]);

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
			<Navbar tronLinkStatus={tronLinkStatus} address={account} />
			<Claim tronLinkStatus={tronLinkStatus} address={account} />
			<Faq />
			<Stake address={account} />
		</div>
	);
}

export default App;
