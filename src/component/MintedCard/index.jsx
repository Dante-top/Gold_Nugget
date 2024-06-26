import React, { useState } from "react";
import { stakeNFT } from "../web3/web3";
import { ToastErrMsg, ToastSuccessMsg } from "../Toast";

const MintedCard = ({ mintedData }) => {
	const [isStaking, setIsStaking] = useState(false);

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

	return (
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
								<div className="spinner-border text-white" role="status">
									<span className="visually-hidden">Loading...</span>
								</div>
							</button>
						)}
					</div>
				</div>
			))}
		</>
	);
};

export default MintedCard;
