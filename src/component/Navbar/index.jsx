import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useEffect, useState } from "react";
import { ToastErrMsg } from "../Toast";

const Navbar = ({ setAccount, address }) => {
	const [wallet, setWallet] = useState("");

	const [tronLinkStatus, setTronLinkStatus] = useState({
		installed: false,
		unlocked: false,
	});

	// Function to wait for TronWeb to be injected
	const waitForTronWeb = (callback, timeout = 3000, interval = 100) => {
		const check = async () => {
			if (window.tronWeb && window.tronWeb.ready) {
				try {
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

	const handleConnectWallet = () => {
		waitForTronWeb((isReady) => {
			if (isReady) {
				setTronLinkStatus({
					installed: true,
					unlocked: window.tronWeb.ready,
				});
				const newWalletAddress = window.tronWeb.defaultAddress.base58;
				setAccount(newWalletAddress);
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
	};

	useEffect(() => {
		if (tronLinkStatus.installed && tronLinkStatus.unlocked) {
			setWallet(window.tronWeb.defaultAddress.base58);
		} else if (tronLinkStatus.installed && !tronLinkStatus.unlocked) {
			ToastErrMsg(
				"TronLink is locked now. Please unlock your TronLink to interact with the app."
			);
		}
	}, [tronLinkStatus]);

	return (
		<nav className="navbar navbar-dark navbar-expand-sm bg-dark p-3 align-items-center">
			<a
				className="navbar_name align-items-center"
				href="https://www.memechicks.com/"
				target="_blank"
				rel="noreferrer"
			>
				<img
					src="/Meme Chicks Logo-1.png"
					className="navbar-logo"
					alt="Meme Chicks Logo"
				/>
				<span className="navbar-title">Gold Nugget Mine</span>
			</a>
			<div className={`navbar-collapse navbar_responsive`} id="navbarText">
				<div className="navbar-nav mx-3 gap-3 social-responsive">
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTelegram} />
					</a>
				</div>
				{address === "" || !address ? (
					<>
						{wallet === "" ? (
							<button
								className="btn-connect"
								onClick={() => handleConnectWallet()}
							>
								Connect Wallet
							</button>
						) : (
							<button className="btn-connect">
								{wallet &&
									`${wallet.substring(0, 5)}...${wallet.substring(
										wallet.length - 5
									)}`}
							</button>
						)}
					</>
				) : (
					<button className="btn-connect">
						{address &&
							`${address.substring(0, 5)}...${address.substring(
								address.length - 5
							)}`}
					</button>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
