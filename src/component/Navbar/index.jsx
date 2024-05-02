import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";
import { ToastErrMsg } from "../Toast";

const Navbar = ({ tronLinkStatus, address }) => {
	const [wallet, setWallet] = useState("");

	const handleConnectWallet = async () => {
		if (tronLinkStatus.installed && tronLinkStatus.unlocked) {
			try {
				const tronWeb = window.tronWeb;
				await tronWeb.request({
					method: "tron_requestAccounts",
				});
				setWallet(window.tronWeb.defaultAddress.base58); // The first account is usually the user's primary account.
			} catch (error) {
				console.error("Error accessing account:", error);
			}
		} else {
			ToastErrMsg(
				"TronLink is not installed or locked now. Please install or unlock your TronLink to interact with the app."
			);
		}
	};
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
