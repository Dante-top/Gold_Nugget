import { useCallback, useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";
import Navbar from "./component/Navbar";
import Stake from "./component/Stake";
import Claim from "./component/Claim";
import Faq from "./component/Faq";

function App() {
	const [myDetails, setMyDetails] = useState({
		name: "",
		address: "",
		balance: 0,
		network: "",
		link: "false",
	});

	const getBalance = async () => {
		//if wallet installed and logged , getting TRX token balance
		if (window.tronWeb && window.tronWeb.ready) {
			let walletBalances = await window.tronWeb.trx.getAccount(
				window.tronWeb.defaultAddress.base58
			);
			return walletBalances;
		} else {
			return 0;
		}
	};

	const getWalletDetails = useCallback(async () => {
		if (window.tronWeb) {
			//checking if wallet injected
			if (window.tronWeb.ready) {
				let tempBalance = await getBalance();

				if (!tempBalance.balance) {
					tempBalance.balance = 0;
				}

				//we have wallet and we are logged in
				setMyDetails({
					name: window.tronWeb.defaultAddress.name,
					address: window.tronWeb.defaultAddress.base58,
					balance: tempBalance.balance / 1000000,
					network: window.tronWeb.fullNode.host,
					link: "true",
				});
			} else {
				//we have wallet but not logged in
				setMyDetails({
					name: "none",
					address: "none",
					balance: 0,
					network: "none",
					link: "false",
				});
			}
		} else {
			//wallet is not detected at all
		}
	}, []); // No dependencies, the function is created only once

	useEffect(() => {
		getWalletDetails();
		//wallet checking interval 2sec
	}, [getWalletDetails]);

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
			<Navbar address={myDetails.address} />
			<Claim address={myDetails.address} />
			<Faq />
			<Stake address={myDetails.address} />
		</div>
	);
}

export default App;
