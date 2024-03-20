import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { useState } from "react";

const Navbar = ({ address }) => {
	const [wallet, setWallet] = useState("");
	const [open, setOpen] = useState(false);
	const handleConnectWallet = async () => {
		try {
			const tronWeb = window.tronWeb;
			await tronWeb.request({
				method: "tron_requestAccounts",
			});
			setWallet(window.tronWeb.defaultAddress.base58); // The first account is usually the user's primary account.
		} catch (error) {
			console.error("Error accessing account:", error);
		}
	};
	return (
		<nav className="navbar navbar-dark navbar-expand-sm bg-dark p-3 align-items-center">
			<a className="navbar_name align-items-center" href="/">
				<img
					src="/Meme Chicks Logo-1.png"
					className="navbar-logo"
					alt="Meme Chicks Logo"
				/>
				<span className="navbar-title">Gold Nugget Mine</span>
			</a>
			<button
				className="navbar-toggler btn-responsive"
				type="button"
				data-toggle="collapse"
				data-target="#navbarText"
				aria-controls="navbarText"
				aria-expanded="false"
				aria-label="Toggle navigation"
				onClick={() => {
					setOpen(!open);
				}}
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div
				className={`collapse navbar-collapse navbar_responsive ${
					open ? "show" : ""
				}`}
				id="navbarText"
			>
				<div className="navbar-nav mx-3 gap-3 social-responsive">
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTelegram} />
					</a>
				</div>
				{address === "" ? (
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
