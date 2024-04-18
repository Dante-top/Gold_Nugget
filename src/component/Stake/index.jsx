import "./index.scss";
import Img_Minted from "../../assets/images/nft.jpg";
import { useEffect, useRef, useState } from "react";
import {
	getMintedList,
	getStakingList,
	stakeNFT,
	unStakeNFT,
} from "../web3/web3";
import { ToastErrMsg, ToastSuccessMsg } from "../Toast";

const Stake = () => {
	const [stakedData, setStakedData] = useState([]);
	const [mintedData, setMintedData] = useState([]);
	const [isStaking, setIsStaking] = useState(false);
	const [isUnStaking, setIsUnStaking] = useState({});
	const stakedDataRef = useRef(stakedData);

	useEffect(() => {
		setStakedNFTData();
		setMintedNFTData();
	}, [stakedDataRef]);

	const setStakedNFTData = async () => {
		const resData = await getStakingList();
		if (resData) {
			setStakedData(resData.stakingList);
		}
	};

	const setMintedNFTData = async () => {
		const resData = await getMintedList();
		if (resData) {
			setMintedData(resData.mintedList);
		}
	};

	const handleStake = async (tokenId) => {
		setIsStaking((prev) => ({ ...prev, [tokenId]: true }));
		const resStakeData = await stakeNFT(tokenId);
		if (resStakeData.isSuccess) {
			setIsStaking((prev) => ({ ...prev, [tokenId]: false }));
			ToastSuccessMsg("Stake Success!");
		} else {
			setIsStaking((prev) => ({ ...prev, [tokenId]: false }));
			ToastErrMsg("Error happened while processing, please try again later");
		}
	};

	const handleUnStake = async (tokenId) => {
		setIsUnStaking((prev) => ({ ...prev, [tokenId]: true }));
		const resUnStakeData = await unStakeNFT(tokenId);
		if (resUnStakeData.isSuccess) {
			ToastSuccessMsg("Unstake Success!");
		} else {
			setIsUnStaking((prev) => ({ ...prev, [tokenId]: false }));
			ToastErrMsg("Error happened while processing, please try again later");
		}
	};

	return (
		<div className="p-3">
			<div className="stake-content d-flex flex-column">
				<div className="d-flex justify-content-between align-items-center text-white p-2 stake-title">
					<h1 className="stake-title">Available NFT's</h1>
					<div className="d-flex flex-column justify-content-center align-items-end">
						<h2 className="title-remain">
							Total Available: {mintedData.length}
						</h2>
						<h2 className="title-remain">Total Staked: {stakedData.length}</h2>
					</div>
				</div>
				<div className="stake-main-content d-flex flex-column">
					{mintedData.map((item, index) => (
						<div className="d-flex stake-nft" key={index}>
							<div className="d-flex flex-column justify-content-center align-items-center">
								<img
									src={Img_Minted}
									className="img-nft"
									alt="Minted NFT Img"
								/>
								<p className="nft-value">NFT ID # {item.tokenId}</p>
								<p className="nft-value">Rarity Rank: 432</p>
							</div>
							<div className="stake-collection d-flex flex-column justify-content-center align-items-center">
								<p>You haven't staked this collection yet.</p>
								{!isStaking[item.tokenId] ? (
									<button
										className="btn-stake"
										onClick={() => handleStake(item.tokenId)}
									>
										STAKE
									</button>
								) : (
									<button className="btn-stake">
										<div className="spinner-border text-white" role="status">
											<span className="visually-hidden">Loading...</span>
										</div>
									</button>
								)}
							</div>
						</div>
					))}
					<hr className="divide-line" />
					{stakedData.map((item, index) => (
						<div
							className="d-flex staked-nft justify-content-between"
							key={index}
						>
							<div className="d-flex flex-column justify-content-center align-items-start">
								<div className="d-flex gap-4 align-items-center staked-responsive">
									<img
										src={Img_Minted}
										className="img-nft"
										alt="Minted NFT Img"
									/>
									<div className="d-flex flex-column">
										<p>Staking since</p>
										<p className="text-date">{item.date}</p>
										<p className="text-date">{item.time}</p>
									</div>
								</div>
								<div className="text-center">
									<p className="nft-value">NFT ID # {item.stakedId}</p>
									<p className="nft-value">Rarity Rank: 75</p>
								</div>
							</div>
							<div className="staked-collection d-flex gap-3">
								<div>
									Available Gold Nugget:{" "}
									<span className="available-value">0</span>
								</div>
								<div className="d-flex flex-column justify-content-center align-items-start gap-3">
									{!isUnStaking[item.stakedId] ? (
										<button
											className="btn-stake"
											onClick={() => handleUnStake(item.stakedId)}
										>
											UNSTAKE
										</button>
									) : (
										<button className="btn-stake">
											<div className="spinner-border text-white" role="status">
												<span className="visually-hidden">Loading...</span>
											</div>
										</button>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Stake;
