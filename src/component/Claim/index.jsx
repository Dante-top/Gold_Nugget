import { useCallback, useEffect, useState, useRef } from "react";
import "./index.scss";
import { claimNFT, getAvailableToken, getOwnersAddress } from "../web3/web3";
import Countdown from "react-countdown";
import { ToastErrMsg, ToastSuccessMsg } from "../Toast";
const ownerAddress = process.env.REACT_APP_OWNER_ADDRESS || "";

const Claim = ({ address }) => {
	const [ownersList, setOwnersList] = useState([]);
	const [available, setAvailable] = useState(0);
	const [isOwner, setIsOwner] = useState(false);
	const [isClaiming, setIsClaiming] = useState(false);
	const addressRef = useRef(address);
	const ownersListRef = useRef(ownersList);

	const handleClaim = useCallback(async () => {
		if (isOwner) {
			setIsClaiming(true);
			const resClaimData = await claimNFT();
			if (resClaimData.isSuccess) {
				setIsClaiming(false);
				ToastSuccessMsg("Claim Success!");
			} else {
				setIsClaiming(false);
				if (resClaimData.error) {
					ToastErrMsg(resClaimData.error);
				} else {
					ToastErrMsg(
						"Error happened while processing, please try again later"
					);
				}
			}
		} else {
			return;
		}
	}, [isOwner]);

	useEffect(() => {
		setMinedAddress();
		setAvailableToken();
		// availableStakes();
		console.log(address);
		if (address === ownerAddress) {
			setIsOwner(true);
		} else {
			setIsOwner(false);
		}
	}, [addressRef, ownersListRef]);

	useEffect(() => {
		const interval = setInterval(async () => {
			if (!isClaiming) {
				// Check if not already claiming to avoid overlapping calls
				await handleClaim();
			}
		}, 60000); // 1 minutes

		return () => clearInterval(interval); // Cleanup interval on component unmount
	}, [isClaiming, handleClaim]); // Depend on isClaiming to ensure the latest state is useds

	const setMinedAddress = async () => {
		const resData = await getOwnersAddress();
		if (resData.isSuccess) {
			setOwnersList(resData.ownersList);
		} else {
			console.log("error: ", resData.error);
		}
	};

	const setAvailableToken = async () => {
		const resData = await getAvailableToken();
		if (resData.isSuccess) {
			setAvailable(resData.balance);
		} else {
			setAvailable(0);
		}
	};

	const calculateNextSixHours = () => {
		const now = new Date();
		const hours = now.getHours();
		const nextSixHourMark = new Date(
			now.setHours(hours + (6 - (hours % 6)), 0, 0, 0)
		);
		return nextSixHourMark.getTime();
	};

	return (
		<div className="p-3 bg-color">
			<div className="d-flex row claim-content">
				<div className="col-lg-3 px-3">
					<div className="row-content d-flex flex-column p-2 row-height">
						<h5 className="row-title">Recent Gold Nuggets Mined</h5>
						<div className="address-content d-flex flex-column pr-3">
							<div className="d-flex justify-content-between">
								<span className="text-address text-underlined">#</span>
								<span className="text-address text-underlined px-4">
									Address
								</span>
							</div>
							{ownersList.map((item, index) => (
								<div className="d-flex justify-content-between" key={index}>
									<div className="d-flex justify-content-between">
										<span className="text-address">{item.rewardTime}</span>
									</div>
									<span className="text-address">
										{item.owner &&
											`${item.owner.substring(0, 5)}...${item.owner.substring(
												item.owner.length - 5
											)}`}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
				<div className="col-lg-6 px-3">
					<div className="row-content d-flex flex-column p-2 justify-content-start align-items-center">
						<h5 className="row-title">Next Gold Nugget Mined in:</h5>
						<Countdown
							date={calculateNextSixHours()}
							renderer={(props) => (
								<h3 className="text-black mb-2">{`${props.hours}:${props.minutes}`}</h3>
							)}
						/>
						<h5 className="row-title">Available Gold Nugget</h5>
						<h3 className="text-black mb-2">{available}</h3>
						<>
							{!isClaiming ? (
								<button
									className={`btn-claim ${!isOwner ? "d-none" : ""}`}
									onClick={() => {
										handleClaim();
									}}
								>
									Claim
								</button>
							) : (
								<button className="btn-claim">
									<div className="spinner-border text-white" role="status">
										<span className="visually-hidden">Loading...</span>
									</div>
								</button>
							)}
						</>
					</div>
				</div>
				<div className="col-lg-3 px-3">
					<div className="row-content d-flex flex-column p-2 row-height">
						<h5 className="row-title">Top Gold Nugget Miners</h5>
						<div className="address-content d-flex flex-column pr-0">
							<div className="d-flex justify-content-between">
								<span className="text-address text-underlined">Place</span>
								<span className="text-address text-underlined">Address</span>
								<span className="text-address text-underlined"># Mined</span>
							</div>
							{ownersList.map((item, index) => (
								<div
									className={`d-flex justify-content-between align-items-center ${
										item.owner === address ? "bg-pin" : ""
									}`}
									key={index}
								>
									<span className="text-address">{index + 1}</span>
									<span className="text-address">
										{item.owner &&
											`${item.owner.substring(0, 5)}...${item.owner.substring(
												item.owner.length - 5
											)}`}
									</span>
									<span className="text-address">
										{item.tokenAmount.toString()}
									</span>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Claim;
