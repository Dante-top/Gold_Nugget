import React, { useState } from "react";
import { unStakeNFT } from "../web3/web3";
import { ToastErrMsg, ToastSuccessMsg } from "../Toast";

const StakedCard = ({ stakedData }) => {
	const [isUnStaking, setIsUnStaking] = useState({});

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
		<>
			{stakedData?.map((item, index) => (
				<div className="d-flex staked-nft justify-content-between" key={index}>
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
							<p className="nft-value">Rarity Rank: {item.rarityData}</p>
						</div>
					</div>
					<div className="staked-collection d-flex gap-3">
						<div>
							Available Gold Nugget: <span className="available-value">0</span>
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
		</>
	);
};

export default StakedCard;
