import "./index.scss";
import { useEffect, useRef, useState } from "react";
import {
	getMintedList,
	getStakingList,
	stakeNFT,
	unStakeNFT,
} from "../web3/web3";
import { ToastErrMsg, ToastSuccessMsg } from "../Toast";

const Stake = ({ tronLinkStatus, address }) => {
	const [stakedData, setStakedData] = useState([]);
	const [mintedData, setMintedData] = useState([]);
	const [isMintedDataLoading, setIsMintedDataLoading] = useState(false);
	const [isStakedDataLoading, setIsStakedDataLoading] = useState(false);
	const [isStaking, setIsStaking] = useState(false);
	const [isUnStaking, setIsUnStaking] = useState({});
	const stakedDataRef = useRef(stakedData);
	const mintedDataRef = useRef(mintedData);

	useEffect(() => {
		if (tronLinkStatus.installed && tronLinkStatus.unlocked) {
			const setAllData = async () => {
				await setMintedNFTData(address);
				await setStakedNFTData(address);
			};
			setAllData();
		}
	}, [stakedDataRef, mintedDataRef, tronLinkStatus]);

	const setStakedNFTData = async (address) => {
		setIsStakedDataLoading(true);
		const resData = await getStakingList(address);
		if (resData.isSuccess) {
			setIsStakedDataLoading(false);
			setStakedData(resData.stakingList);
		} else {
			setIsStakedDataLoading(false);
		}
	};

	const setMintedNFTData = async (address) => {
		setIsMintedDataLoading(true);
		const resData = await getMintedList(address);
		if (resData.isSuccess) {
			setIsMintedDataLoading(false);
			setMintedData(resData.mintedList);
		} else {
			setIsMintedDataLoading(false);
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
							Total Available: {mintedData?.length}
						</h2>
						<h2 className="title-remain">Total Staked: {stakedData?.length}</h2>
					</div>
				</div>
				<div className="stake-main-content d-flex flex-column">
					{isMintedDataLoading ? (
						<div className="text-center p-5">
							<div
								className="spinner-border text-white nftdata-spinner"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<>
							{mintedData?.map((item, index) => (
								<div className="d-flex stake-nft" key={index}>
									<div className="d-flex flex-column justify-content-center align-items-center">
										<picture>
											<source type="image/webp" srcSet={item.nftImage} />
											<source type="image/jpeg" srcSet={item.nftImage} />
											<img
												src={item.nftImage}
												srcSet={item.nftImage}
												className="img-nft"
												alt="Minted NFT Img"
												referrerPolicy="no-referrer"
											/>
										</picture>
										<p className="nft-value">NFT ID # {item.tokenId}</p>
										<p className="nft-value">Rarity Rank: {item.rarityData}</p>
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
												<div
													className="spinner-border text-white"
													role="status"
												>
													<span className="visually-hidden">Loading...</span>
												</div>
											</button>
										)}
									</div>
								</div>
							))}
						</>
					)}
					<hr className="divide-line" />
					{isStakedDataLoading ? (
						<div className="text-center p-5">
							<div
								className="spinner-border text-white nftdata-spinner"
								role="status"
							>
								<span className="visually-hidden">Loading...</span>
							</div>
						</div>
					) : (
						<>
							{stakedData?.map((item, index) => (
								<div
									className="d-flex staked-nft justify-content-between"
									key={index}
								>
									<div className="d-flex flex-column justify-content-center align-items-start">
										<div className="d-flex gap-4 align-items-center staked-responsive">
											<picture>
												<source type="image/webp" srcSet={item.nftImage} />
												<source type="image/jpeg" srcSet={item.nftImage} />
												<img
													src={item.nftImage}
													srcSet={item.nftImage}
													className="img-nft"
													alt="Minted NFT Img"
													referrerPolicy="no-referrer"
												/>
											</picture>
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
													<div
														className="spinner-border text-white"
														role="status"
													>
														<span className="visually-hidden">Loading...</span>
													</div>
												</button>
											)}
										</div>
									</div>
								</div>
							))}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Stake;
