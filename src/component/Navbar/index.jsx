import "./index.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faTwitter } from "@fortawesome/free-brands-svg-icons";

const Navbar = ({ address }) => {
	const handleConnectWallet = async () => {
		if (window.tronWeb && window.tronWeb.ready) {
			let walletBalances = await window.tronWeb.trx.getAccount(
				window.tronWeb.defaultAddress.base58
			);
			address = walletBalances;
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
				<span>Gold Nugget Mine</span>
			</a>
			<button
				className="navbar-toggler btn-responsive"
				type="button"
				data-toggle="collapse"
				data-target="#navbarText"
				aria-controls="navbarText"
				aria-expanded="false"
				aria-label="Toggle navigation"
			>
				<span className="navbar-toggler-icon"></span>
			</button>
			<div
				className="collapse navbar-collapse align-items-center justify-content-end"
				id="navbarText"
			>
				<div className="navbar-nav mx-3 gap-3">
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTwitter} />
					</a>
					<a href="/" className="btn-social">
						<FontAwesomeIcon icon={faTelegram} />
					</a>
				</div>
				{address === "" ? (
					<button className="btn-connect" onClick={() => handleConnectWallet()}>
						Connect Wallet
					</button>
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
