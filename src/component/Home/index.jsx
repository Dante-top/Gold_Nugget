import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import Stake from "../Stake";
import Claim from "../Claim";
import Faq from "../Faq";
import { ToastErrMsg } from "../Toast";
import Navbar from "../Navbar";

const Home = () => {
	const [account, setAccount] = useState("");
	const location = useLocation();
	const [utmSource, setUtmSource] = useState("");
	const TRONGRID_API_KEY = process.env.REACT_APP_TRONGRID_API_KEY;

	const [tronLinkStatus, setTronLinkStatus] = useState({
		installed: false,
		unlocked: false,
	});

	const [currentAccount, setCurrentAccount] = useState(null);

	useEffect(() => {
		const checkTronLink = () => {
			const { tronWeb } = window;

			if (tronWeb && tronWeb.ready) {
				tronWeb.setHeader({ "TRON-PRO-API-KEY": TRONGRID_API_KEY });
				const newAccount = tronWeb.defaultAddress.base58;

				if (newAccount !== currentAccount) {
					if (currentAccount !== null) {
						// If the account has changed and is not the initial setting, refresh the page
						window.location.reload();
					}
					setCurrentAccount(newAccount); // Update the current account
				}
			} else {
				console.log("Waiting for TronLink...");
			}
		};

		// Check for TronLink every second
		const interval = setInterval(checkTronLink, 3000);

		return () => clearInterval(interval); // Clean up the interval on component unmount
	}, [currentAccount]);

	// Function to wait for TronWeb to be injected
	const waitForTronWeb = (callback, timeout = 3000, interval = 100) => {
		const check = async () => {
			if (window.tronWeb && window.tronWeb.ready) {
				try {
					window.tronWeb.setHeader({ "TRON-PRO-API-KEY": TRONGRID_API_KEY });

					// await window.tronWeb.request({
					// 	method: "tron_requestAccounts",
					// });
					if (window.tronWeb.fullNode.host !== "https://api.trongrid.io") {
						ToastErrMsg(
							"You need to set your Tronlink wallet to Tron Mainnet! Please change the network and refresh."
						);
					}
					callback(true); // TronWeb is ready
				} catch (error) {
					console.log("Connection request failed: ", error);
				}
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
					"TronLink is not installed or locked now. Please install or unlock TronLink to interact with the app."
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
				"TronLink is locked now. Please unlock your TronLink to interact with the app."
			);
		}
	}, [tronLinkStatus]);

	useEffect(() => {
		try {
			const params = new URLSearchParams(location.search);
			const source = params.get("utm_source");
			setUtmSource(source);

			// If you need to do something specific with the utm_source
			if (source === "tronlink") {
				// Handle the case for tronlink
				console.log("TronLink source detected");
			} else {
				// Handle other sources or absence of source
				console.log("Other or no source detected");
			}
		} catch (error) {
			console.error("Error parsing query parameters:", error);
		}
	}, [location.search]);

	return (
		<div className="bg-black">
			<Navbar setAccount={setAccount} address={account} />
			<Claim tronLinkStatus={tronLinkStatus} address={account} />
			<Faq />
			<Stake tronLinkStatus={tronLinkStatus} address={account} />
		</div>
	);
};

export default Home;
